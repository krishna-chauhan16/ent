import fs from 'fs'
import path from 'path'
import { supabaseAdmin, isSupabaseConfigured } from './supabase'
import { getPostgresPool, ensurePostgresTables } from './postgres'

export interface Appointment {
  id: string
  name: string
  phone: string
  location: string
  reason: string
  date: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes?: string
  createdAt: string
}

export interface DbSchema {
  visitors: {
    total: number
    todayCount: number
    lastDate: string
  }
  appointments: Appointment[]
}

const dataDir = path.join(process.cwd(), 'data')
const dbFile = path.join(dataDir, 'db.json')

const initialData: DbSchema = {
  visitors: {
    total: 1240,
    todayCount: 18,
    lastDate: new Date().toISOString().split('T')[0],
  },
  appointments: [
    {
      id: 'apt-demo-1',
      name: 'Ramesh Patel',
      phone: '+91 9876543210',
      location: 'Atulya Superspeciality Hospital (Bhuyangdev)',
      reason: 'Sinusitis / Polyp / Nasal Blockage (FESS / Septoplasty)',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      status: 'confirmed',
      notes: 'Complaining of chronic nasal blockage for 2 years.',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'apt-demo-2',
      name: 'Pooja Shah',
      phone: '+91 9825012345',
      location: 'KD Hospital (SG Highway)',
      reason: 'Ear Discharge / Hearing Loss / Eardrum Perforation (Tympanoplasty)',
      date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      status: 'pending',
      notes: 'Requesting evening consultation slot.',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'apt-demo-3',
      name: 'Jignesh Trivedi',
      phone: '+91 9426098765',
      location: 'Prathana Hospital',
      reason: 'Vertigo, Dizziness & Balance Disorders',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: 'Acute dizziness episodes since 3 days.',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
  ],
}

// ----------------------------------------------------
// LOCAL FILE DB HELPERS (FALLBACK)
// ----------------------------------------------------
function ensureLocalDb(): DbSchema {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    if (!fs.existsSync(dbFile)) {
      fs.writeFileSync(dbFile, JSON.stringify(initialData, null, 2), 'utf-8')
      return initialData
    }
    const content = fs.readFileSync(dbFile, 'utf-8')
    return JSON.parse(content) as DbSchema
  } catch (error) {
    console.error('Error accessing local database file, falling back to memory', error)
    return initialData
  }
}

function saveLocalDb(data: DbSchema) {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing to local database file', error)
  }
}

// ----------------------------------------------------
// HYBRID DATABASE OPERATIONS (POSTGRES / SUPABASE / LOCAL)
// ----------------------------------------------------

export async function recordVisitor(): Promise<{ total: number; todayCount: number }> {
  const today = new Date().toISOString().split('T')[0]
  const pool = getPostgresPool()

  // 1. Direct PostgreSQL (pgAdmin / localhost)
  if (pool) {
    try {
      await ensurePostgresTables(pool)
      const res = await pool.query('SELECT * FROM public.visitors WHERE id = 1 LIMIT 1')
      let total = 1241
      let todayCount = 1

      if (res.rows.length > 0) {
        const row = res.rows[0]
        todayCount = (row.today_count || 0) + 1
        if (row.last_date && new Date(row.last_date).toISOString().split('T')[0] !== today) {
          todayCount = 1
        }
        total = (row.total || 0) + 1

        await pool.query(
          'UPDATE public.visitors SET total = $1, today_count = $2, last_date = $3, updated_at = NOW() WHERE id = 1',
          [total, todayCount, today],
        )
      } else {
        await pool.query(
          'INSERT INTO public.visitors (id, total, today_count, last_date) VALUES (1, $1, $2, $3)',
          [total, todayCount, today],
        )
      }

      return { total, todayCount }
    } catch (err) {
      console.error('PostgreSQL visitor record error', err)
    }
  }

  // 2. Supabase SDK
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('visitors')
        .select('*')
        .eq('id', 1)
        .single()

      if (!error && data) {
        let newToday = (data.today_count || 0) + 1
        if (data.last_date !== today) {
          newToday = 1
        }
        const newTotal = (data.total || 0) + 1

        await supabaseAdmin
          .from('visitors')
          .update({
            total: newTotal,
            today_count: newToday,
            last_date: today,
            updated_at: new Date().toISOString(),
          })
          .eq('id', 1)

        return { total: newTotal, todayCount: newToday }
      }
    } catch (err) {
      console.error('Supabase visitor record error', err)
    }
  }

  // 3. Fallback Local File DB
  const db = ensureLocalDb()
  if (db.visitors.lastDate !== today) {
    db.visitors.todayCount = 1
    db.visitors.lastDate = today
  } else {
    db.visitors.todayCount += 1
  }
  db.visitors.total += 1
  saveLocalDb(db)

  return {
    total: db.visitors.total,
    todayCount: db.visitors.todayCount,
  }
}

export async function getStats() {
  const today = new Date().toISOString().split('T')[0]
  const pool = getPostgresPool()

  // 1. Direct PostgreSQL (pgAdmin / localhost)
  if (pool) {
    try {
      await ensurePostgresTables(pool)
      const [visitorRes, aptsRes] = await Promise.all([
        pool.query('SELECT * FROM public.visitors WHERE id = 1 LIMIT 1'),
        pool.query('SELECT * FROM public.appointments'),
      ])

      const visitorRow = visitorRes.rows[0]
      const apts = aptsRes.rows

      const visitorsTotal = visitorRow?.total || 1240
      const visitorLastDate = visitorRow?.last_date
        ? new Date(visitorRow.last_date).toISOString().split('T')[0]
        : ''
      const visitorsToday = visitorLastDate === today ? visitorRow?.today_count || 0 : 0

      const totalAppointments = apts.length
      const pendingAppointments = apts.filter((a) => a.status === 'pending').length
      const confirmedAppointments = apts.filter((a) => a.status === 'confirmed').length
      const todayAppointments = apts.filter((a) => {
        const aptDate = a.date || ''
        const createdDate = a.created_at ? new Date(a.created_at).toISOString().split('T')[0] : ''
        return aptDate === today || createdDate === today
      }).length

      return {
        visitorsTotal,
        visitorsToday,
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        todayAppointments,
        databaseSource: 'PostgreSQL (pgAdmin)',
      }
    } catch (err) {
      console.error('PostgreSQL getStats error', err)
    }
  }

  // 2. Supabase SDK
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const [visitorsRes, aptsRes] = await Promise.all([
        supabaseAdmin.from('visitors').select('*').eq('id', 1).single(),
        supabaseAdmin.from('appointments').select('*'),
      ])

      const visitorData = visitorsRes.data
      const apts = (aptsRes.data || []) as any[]

      const visitorsTotal = visitorData?.total || 1240
      const visitorsToday =
        visitorData?.last_date === today ? visitorData?.today_count || 0 : 0

      const totalAppointments = apts.length
      const pendingAppointments = apts.filter((a) => a.status === 'pending').length
      const confirmedAppointments = apts.filter((a) => a.status === 'confirmed').length
      const todayAppointments = apts.filter(
        (a) => a.date === today || (a.created_at && a.created_at.startsWith(today)),
      ).length

      return {
        visitorsTotal,
        visitorsToday,
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        todayAppointments,
        databaseSource: 'Supabase Cloud PostgreSQL',
      }
    } catch (err) {
      console.error('Supabase getStats error', err)
    }
  }

  // 3. Fallback Local File DB
  const db = ensureLocalDb()
  if (db.visitors.lastDate !== today) {
    db.visitors.todayCount = 0
    db.visitors.lastDate = today
    saveLocalDb(db)
  }

  const totalAppointments = db.appointments.length
  const pendingAppointments = db.appointments.filter((a) => a.status === 'pending').length
  const confirmedAppointments = db.appointments.filter((a) => a.status === 'confirmed').length
  const todayAppointments = db.appointments.filter(
    (a) => a.date === today || a.createdAt.startsWith(today),
  ).length

  return {
    visitorsTotal: db.visitors.total,
    visitorsToday: db.visitors.todayCount,
    totalAppointments,
    pendingAppointments,
    confirmedAppointments,
    todayAppointments,
    databaseSource: 'Local Storage',
  }
}

export async function getAllAppointments(): Promise<Appointment[]> {
  const pool = getPostgresPool()

  // 1. Direct PostgreSQL (pgAdmin / localhost)
  if (pool) {
    try {
      await ensurePostgresTables(pool)
      const res = await pool.query(
        'SELECT * FROM public.appointments ORDER BY created_at DESC',
      )
      return res.rows.map((row) => ({
        id: row.id,
        name: row.name,
        phone: row.phone,
        location: row.location,
        reason: row.reason || '',
        date: row.date || '',
        status: row.status || 'pending',
        notes: row.notes || '',
        createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      }))
    } catch (err) {
      console.error('PostgreSQL getAllAppointments error', err)
    }
  }

  // 2. Supabase SDK
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        return data.map((item: any) => ({
          id: item.id,
          name: item.name,
          phone: item.phone,
          location: item.location,
          reason: item.reason || '',
          date: item.date || '',
          status: item.status || 'pending',
          notes: item.notes || '',
          createdAt: item.created_at,
        }))
      }
    } catch (err) {
      console.error('Supabase getAllAppointments error', err)
    }
  }

  // 3. Fallback Local File DB
  const db = ensureLocalDb()
  return db.appointments.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export async function addAppointment(data: {
  name: string
  phone: string
  location: string
  reason: string
  date: string
  notes?: string
}): Promise<Appointment> {
  const newAppointment: Appointment = {
    id: `apt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name: data.name.trim(),
    phone: data.phone.trim(),
    location: data.location || 'Atulya Superspeciality Hospital (Bhuyangdev)',
    reason: data.reason || 'General ENT Consultation',
    date: data.date || new Date().toISOString().split('T')[0],
    status: 'pending',
    notes: data.notes || '',
    createdAt: new Date().toISOString(),
  }

  const pool = getPostgresPool()

  // 1. Direct PostgreSQL (pgAdmin / localhost)
  if (pool) {
    try {
      await ensurePostgresTables(pool)
      await pool.query(
        `INSERT INTO public.appointments (id, name, phone, location, reason, date, status, notes, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          newAppointment.id,
          newAppointment.name,
          newAppointment.phone,
          newAppointment.location,
          newAppointment.reason,
          newAppointment.date,
          newAppointment.status,
          newAppointment.notes,
          newAppointment.createdAt,
        ],
      )
      return newAppointment
    } catch (err) {
      console.error('PostgreSQL insert appointment error', err)
    }
  }

  // 2. Supabase SDK
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin.from('appointments').insert([
        {
          id: newAppointment.id,
          name: newAppointment.name,
          phone: newAppointment.phone,
          location: newAppointment.location,
          reason: newAppointment.reason,
          date: newAppointment.date,
          status: newAppointment.status,
          notes: newAppointment.notes,
          created_at: newAppointment.createdAt,
        },
      ])

      if (!error) {
        return newAppointment
      }
      console.error('Supabase insert error', error)
    } catch (err) {
      console.error('Supabase addAppointment error', err)
    }
  }

  // 3. Fallback Local File DB
  const db = ensureLocalDb()
  db.appointments.unshift(newAppointment)
  saveLocalDb(db)
  return newAppointment
}

export async function updateAppointment(
  id: string,
  updates: Partial<Pick<Appointment, 'status' | 'notes' | 'date' | 'location'>>,
): Promise<Appointment | null> {
  const pool = getPostgresPool()

  // 1. Direct PostgreSQL (pgAdmin / localhost)
  if (pool) {
    try {
      await ensurePostgresTables(pool)
      const fields: string[] = []
      const values: any[] = []
      let idx = 1

      if (updates.status) {
        fields.push(`status = $${idx++}`)
        values.push(updates.status)
      }
      if (updates.notes !== undefined) {
        fields.push(`notes = $${idx++}`)
        values.push(updates.notes)
      }
      if (updates.date) {
        fields.push(`date = $${idx++}`)
        values.push(updates.date)
      }
      if (updates.location) {
        fields.push(`location = $${idx++}`)
        values.push(updates.location)
      }

      if (fields.length > 0) {
        values.push(id)
        const res = await pool.query(
          `UPDATE public.appointments SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
          values,
        )
        if (res.rows.length > 0) {
          const row = res.rows[0]
          return {
            id: row.id,
            name: row.name,
            phone: row.phone,
            location: row.location,
            reason: row.reason,
            date: row.date,
            status: row.status,
            notes: row.notes,
            createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
          }
        }
      }
    } catch (err) {
      console.error('PostgreSQL updateAppointment error', err)
    }
  }

  // 2. Supabase SDK
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('appointments')
        .update({
          ...(updates.status ? { status: updates.status } : {}),
          ...(updates.notes !== undefined ? { notes: updates.notes } : {}),
          ...(updates.date ? { date: updates.date } : {}),
          ...(updates.location ? { location: updates.location } : {}),
        })
        .eq('id', id)
        .select()
        .single()

      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          phone: data.phone,
          location: data.location,
          reason: data.reason,
          date: data.date,
          status: data.status,
          notes: data.notes,
          createdAt: data.created_at,
        }
      }
    } catch (err) {
      console.error('Supabase updateAppointment error', err)
    }
  }

  // 3. Fallback Local File DB
  const db = ensureLocalDb()
  const index = db.appointments.findIndex((a) => a.id === id)
  if (index === -1) return null

  db.appointments[index] = {
    ...db.appointments[index],
    ...updates,
  }
  saveLocalDb(db)
  return db.appointments[index]
}

export async function deleteAppointment(id: string): Promise<boolean> {
  const pool = getPostgresPool()

  // 1. Direct PostgreSQL (pgAdmin / localhost)
  if (pool) {
    try {
      await ensurePostgresTables(pool)
      const res = await pool.query('DELETE FROM public.appointments WHERE id = $1', [id])
      if ((res.rowCount || 0) > 0) return true
    } catch (err) {
      console.error('PostgreSQL deleteAppointment error', err)
    }
  }

  // 2. Supabase SDK
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin.from('appointments').delete().eq('id', id)
      if (!error) return true
    } catch (err) {
      console.error('Supabase deleteAppointment error', err)
    }
  }

  // 3. Fallback Local File DB
  const db = ensureLocalDb()
  const beforeLength = db.appointments.length
  db.appointments = db.appointments.filter((a) => a.id !== id)
  if (db.appointments.length !== beforeLength) {
    saveLocalDb(db)
    return true
  }
  return false
}
