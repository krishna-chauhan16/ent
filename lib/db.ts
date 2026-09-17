import crypto from 'crypto'
import { supabaseAdmin, isSupabaseConfigured } from './supabase'
import { getPostgresPool, ensurePostgresTables } from './postgres'
import type { HospitalCenter, ENTConcern, Appointment, VisitorLog, DbSchema, AdminUser } from './types'

export * from './types'

const initialCenters: HospitalCenter[] = [
  {
    id: '1',
    name: 'Atulya Superspeciality Hospital (Bhuyangdev)',
    area: '2nd Floor, Elite Magnum, Bhuyangdev Cross Road, Sola Road, Ghatlodiya, Ahmedabad',
    timings: 'Mon - Sat: 10:00 AM - 01:00 PM & 05:00 PM - 08:00 PM',
    tag: 'Primary Center (Director & Head)',
    isActive: true,
    isDefault: true,
  },
  {
    id: '2',
    name: 'KD Hospital (SG Highway)',
    area: 'Vaishnodevi Circle, SG Highway, Ahmedabad',
    timings: 'Visiting Consultant / By Appointment',
    tag: 'Visiting Consultant',
    isActive: true,
    isDefault: false,
  },
  {
    id: '3',
    name: 'Prathana Hospital',
    area: 'Near Helmet Cross Roads, Memnagar, Ahmedabad',
    timings: 'Visiting Consultant / By Appointment',
    tag: 'Visiting Consultant',
    isActive: true,
    isDefault: false,
  },
]

const initialConcerns: ENTConcern[] = [
  {
    id: '1',
    title: 'Sinusitis, Nasal Polyps & Blockage (FESS / Septoplasty)',
    category: 'Nose & Sinus (Rhinology)',
    description: 'Deviated Nasal Septum (DNS), Functional Endoscopic Sinus Surgery (FESS), Turbinate Reduction, Polyp Clearance.',
    commonSymptoms: 'Nasal Blockage, Facial Heaviness, Headache, Post-Nasal Drip, Loss of Smell',
    isActive: true,
    isDefault: true,
    sortOrder: 1,
  },
  {
    id: '2',
    title: 'Ear Discharge, Hearing Loss & Eardrum Perforation (Tympanoplasty)',
    category: 'Ear & Hearing (Otology)',
    description: 'CSOM, Cholesteatoma, Mastoidectomy, Stapedotomy, Micro-ear surgery, Eardrum Repair.',
    commonSymptoms: 'Ear Discharge, Ear Ache, Decreased Hearing, Eardrum Hole, Tinnitus (Ringing Ear)',
    isActive: true,
    isDefault: false,
    sortOrder: 2,
  },
  {
    id: '3',
    title: 'Vertigo, Dizziness & Balance Disorders',
    category: 'Vertigo & Balance',
    description: 'BPPV, Vestibular Neuritis, Meniere\'s Disease, Canalith Repositioning Maneuvers.',
    commonSymptoms: 'Spinning Sensation, Imbalance while walking, Nausea, Sudden Vertigo Attacks',
    isActive: true,
    isDefault: false,
    sortOrder: 3,
  },
  {
    id: '4',
    title: 'Throat, Tonsils, Adenoids & Voice Issues (Microlaryngeal Surgery)',
    category: 'Throat & Voice (Laryngology)',
    description: 'Recurrent Tonsillitis, Adenoid Hypertrophy, Vocal Cord Polyps, Hoarseness, Coblation Tonsillectomy.',
    commonSymptoms: 'Frequent Sore Throat, Difficulty Swallowing, Hoarse Voice, Snoring in Children',
    isActive: true,
    isDefault: false,
    sortOrder: 4,
  },
  {
    id: '5',
    title: 'Pediatric ENT Checkup & Airway Obstruction',
    category: 'Pediatric ENT',
    description: 'Childhood snoring, mouth breathing, recurrent ear infections, foreign body removal, tongue tie release.',
    commonSymptoms: 'Mouth Breathing during sleep, Night Snoring, Restless Sleep, Ear Infections',
    isActive: true,
    isDefault: false,
    sortOrder: 5,
  },
  {
    id: '6',
    title: 'Head & Neck Swellings, Thyroid & Skull Base Consultation',
    category: 'Head & Neck / Skull Base',
    description: 'Salivary Gland (Parotid/Submandibular) tumors, Thyroid nodules, CSF Rhinorrhea leak repair, Skull base lesions.',
    commonSymptoms: 'Neck Lumps, Salivary Gland Swelling, Clear fluid drainage from nose, Neck Pain',
    isActive: true,
    isDefault: false,
    sortOrder: 6,
  },
  {
    id: '7',
    title: 'Snoring & Obstructive Sleep Apnea (OSA)',
    category: 'Sleep & Airway',
    description: 'Sleep endoscopy, palate & pharyngeal airway surgery, surgical management of obstructive sleep apnea.',
    commonSymptoms: 'Loud Snoring, Choking at night, Excessive daytime sleepiness, Morning headaches',
    isActive: true,
    isDefault: false,
    sortOrder: 7,
  },
  {
    id: '8',
    title: 'Second Surgical Opinion / General ENT Consultation',
    category: 'General ENT & Second Opinion',
    description: 'Comprehensive ENT evaluation, review of previous CT/MRI scans, unbiased surgical opinion & guidance.',
    commonSymptoms: 'Previous diagnosis review, non-resolving ENT symptoms, pre-surgery evaluation',
    isActive: true,
    isDefault: false,
    sortOrder: 8,
  },
]

// ----------------------------------------------------
// HOSPITAL CENTERS MASTER OPERATIONS (DIRECT DATABASE)
// ----------------------------------------------------

export async function getAllCenters(onlyActive = false): Promise<HospitalCenter[]> {
  const pool = getPostgresPool()

  // 1. Direct PostgreSQL (pgAdmin / localhost)
  if (pool) {
    try {
      await ensurePostgresTables(pool)
      const query = onlyActive
        ? 'SELECT * FROM public.hospital_centers WHERE is_active = TRUE ORDER BY is_default DESC, created_at ASC'
        : 'SELECT * FROM public.hospital_centers ORDER BY is_default DESC, created_at ASC'
      const res = await pool.query(query)
      if (res.rows.length > 0) {
        return res.rows.map((r) => ({
          id: String(r.id),
          name: r.name,
          area: r.area,
          timings: r.timings || '',
          tag: r.tag || '',
          isActive: Boolean(r.is_active),
          isDefault: Boolean(r.is_default),
          createdAt: r.created_at ? new Date(r.created_at).toISOString() : undefined,
        }))
      }
    } catch (err) {
      console.error('PostgreSQL getAllCenters error:', err)
    }
  }

  // 2. Supabase SDK
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      let query = supabaseAdmin.from('hospital_centers').select('*').order('is_default', { ascending: false })
      if (onlyActive) {
        query = query.eq('is_active', true)
      }
      const { data, error } = await query
      if (!error && data && data.length > 0) {
        return data.map((r: any) => ({
          id: String(r.id),
          name: r.name,
          area: r.area,
          timings: r.timings || '',
          tag: r.tag || '',
          isActive: Boolean(r.is_active),
          isDefault: Boolean(r.is_default),
          createdAt: r.created_at,
        }))
      }
    } catch (err) {
      console.error('Supabase getAllCenters error:', err)
    }
  }

  return onlyActive ? initialCenters.filter((c) => c.isActive) : initialCenters
}

export async function addCenter(data: {
  name: string
  area: string
  timings?: string
  tag?: string
  isDefault?: boolean
}): Promise<HospitalCenter> {
  const newCenter: HospitalCenter = {
    id: `center-${Date.now()}`,
    name: data.name.trim(),
    area: data.area.trim(),
    timings: data.timings?.trim() || '',
    tag: data.tag?.trim() || 'Visiting Center',
    isActive: true,
    isDefault: Boolean(data.isDefault),
    createdAt: new Date().toISOString(),
  }

  const pool = getPostgresPool()

  // 1. Direct PostgreSQL
  if (pool) {
    try {
      await ensurePostgresTables(pool)
      const res = await pool.query(
        `INSERT INTO public.hospital_centers (name, area, timings, tag, is_active, is_default, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, created_at`,
        [
          newCenter.name,
          newCenter.area,
          newCenter.timings,
          newCenter.tag,
          newCenter.isActive,
          newCenter.isDefault,
          newCenter.createdAt,
        ],
      )
      if (res.rows.length > 0 && res.rows[0].id) {
        newCenter.id = String(res.rows[0].id)
      }
      return newCenter
    } catch (err) {
      console.error('PostgreSQL addCenter error:', err)
      throw new Error('Failed to insert hospital center into PostgreSQL database.')
    }
  }

  // 2. Supabase SDK
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data: inserted, error } = await supabaseAdmin.from('hospital_centers').insert([
        {
          name: newCenter.name,
          area: newCenter.area,
          timings: newCenter.timings,
          tag: newCenter.tag,
          is_active: newCenter.isActive,
          is_default: newCenter.isDefault,
          created_at: newCenter.createdAt,
        },
      ]).select().single()

      if (!error && inserted?.id) {
        newCenter.id = String(inserted.id)
        return newCenter
      }
      throw error
    } catch (err) {
      console.error('Supabase addCenter error:', err)
      throw new Error('Failed to insert hospital center into Supabase database.')
    }
  }

  throw new Error('Database is not connected. Please verify PostgreSQL connection in .env.local.')
}

export async function updateCenter(
  id: string,
  updates: Partial<Omit<HospitalCenter, 'id' | 'createdAt'>>,
): Promise<HospitalCenter | null> {
  const pool = getPostgresPool()

  // 1. Direct PostgreSQL
  if (pool) {
    try {
      await ensurePostgresTables(pool)
      const fields: string[] = []
      const values: any[] = []
      let idx = 1

      if (updates.name !== undefined) {
        fields.push(`name = $${idx++}`)
        values.push(updates.name)
      }
      if (updates.area !== undefined) {
        fields.push(`area = $${idx++}`)
        values.push(updates.area)
      }
      if (updates.timings !== undefined) {
        fields.push(`timings = $${idx++}`)
        values.push(updates.timings)
      }
      if (updates.tag !== undefined) {
        fields.push(`tag = $${idx++}`)
        values.push(updates.tag)
      }
      if (updates.isActive !== undefined) {
        fields.push(`is_active = $${idx++}`)
        values.push(updates.isActive)
      }
      if (updates.isDefault !== undefined) {
        fields.push(`is_default = $${idx++}`)
        values.push(updates.isDefault)
      }

      if (fields.length > 0) {
        values.push(!isNaN(Number(id)) ? Number(id) : id)
        const res = await pool.query(
          `UPDATE public.hospital_centers SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
          values,
        )
        if (res.rows.length > 0) {
          const r = res.rows[0]
          return {
            id: String(r.id),
            name: r.name,
            area: r.area,
            timings: r.timings || '',
            tag: r.tag || '',
            isActive: Boolean(r.is_active),
            isDefault: Boolean(r.is_default),
            createdAt: r.created_at ? new Date(r.created_at).toISOString() : undefined,
          }
        }
      }
    } catch (err) {
      console.error('PostgreSQL updateCenter error:', err)
      throw new Error('Failed to update hospital center in PostgreSQL database.')
    }
  }

  // 2. Supabase SDK
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const dbUpdates: any = {}
      if (updates.name !== undefined) dbUpdates.name = updates.name
      if (updates.area !== undefined) dbUpdates.area = updates.area
      if (updates.timings !== undefined) dbUpdates.timings = updates.timings
      if (updates.tag !== undefined) dbUpdates.tag = updates.tag
      if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive
      if (updates.isDefault !== undefined) dbUpdates.is_default = updates.isDefault

      const { data, error } = await supabaseAdmin
        .from('hospital_centers')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single()

      if (!error && data) {
        return {
          id: String(data.id),
          name: data.name,
          area: data.area,
          timings: data.timings || '',
          tag: data.tag || '',
          isActive: Boolean(data.is_active),
          isDefault: Boolean(data.is_default),
          createdAt: data.created_at,
        }
      }
    } catch (err) {
      console.error('Supabase updateCenter error:', err)
      throw new Error('Failed to update hospital center in Supabase database.')
    }
  }

  return null
}

export async function deleteCenter(id: string): Promise<boolean> {
  const pool = getPostgresPool()

  // 1. Direct PostgreSQL
  if (pool) {
    try {
      await ensurePostgresTables(pool)
      const targetId = !isNaN(Number(id)) ? Number(id) : id
      const res = await pool.query('DELETE FROM public.hospital_centers WHERE id = $1', [targetId])
      if ((res.rowCount || 0) > 0) return true
    } catch (err) {
      console.error('PostgreSQL deleteCenter error:', err)
      throw new Error('Failed to delete hospital center in PostgreSQL database.')
    }
  }

  // 2. Supabase SDK
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin.from('hospital_centers').delete().eq('id', id)
      if (!error) return true
    } catch (err) {
      console.error('Supabase deleteCenter error:', err)
      throw new Error('Failed to delete hospital center in Supabase database.')
    }
  }

  return false
}

// ----------------------------------------------------
// ENT CONCERNS MASTER OPERATIONS (DIRECT DATABASE)
// ----------------------------------------------------

export async function getAllConcerns(onlyActive = false): Promise<ENTConcern[]> {
  const pool = getPostgresPool()

  // 1. Direct PostgreSQL (pgAdmin / localhost)
  if (pool) {
    try {
      await ensurePostgresTables(pool)
      const query = onlyActive
        ? 'SELECT * FROM public.ent_concerns WHERE is_active = TRUE ORDER BY is_default DESC, sort_order ASC, created_at ASC'
        : 'SELECT * FROM public.ent_concerns ORDER BY is_default DESC, sort_order ASC, created_at ASC'
      const res = await pool.query(query)
      if (res.rows.length > 0) {
        return res.rows.map((r) => ({
          id: String(r.id),
          title: r.title,
          category: r.category,
          description: r.description || '',
          commonSymptoms: r.common_symptoms || '',
          isActive: Boolean(r.is_active),
          isDefault: Boolean(r.is_default),
          sortOrder: r.sort_order || 0,
          createdAt: r.created_at ? new Date(r.created_at).toISOString() : undefined,
        }))
      }
    } catch (err) {
      console.error('PostgreSQL getAllConcerns error:', err)
    }
  }

  // 2. Supabase SDK
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      let query = supabaseAdmin
        .from('ent_concerns')
        .select('*')
        .order('is_default', { ascending: false })
        .order('sort_order', { ascending: true })
      if (onlyActive) {
        query = query.eq('is_active', true)
      }
      const { data, error } = await query
      if (!error && data && data.length > 0) {
        return data.map((r: any) => ({
          id: String(r.id),
          title: r.title,
          category: r.category,
          description: r.description || '',
          commonSymptoms: r.common_symptoms || '',
          isActive: Boolean(r.is_active),
          isDefault: Boolean(r.is_default),
          sortOrder: r.sort_order || 0,
          createdAt: r.created_at,
        }))
      }
    } catch (err) {
      console.error('Supabase getAllConcerns error:', err)
    }
  }

  return onlyActive ? initialConcerns.filter((c) => c.isActive) : initialConcerns
}

export async function addConcern(data: {
  title: string
  category: string
  description?: string
  commonSymptoms?: string
  isDefault?: boolean
  isActive?: boolean
  sortOrder?: number
}): Promise<ENTConcern> {
  const newConcern: ENTConcern = {
    id: `concern-${Date.now()}`,
    title: data.title.trim(),
    category: data.category.trim(),
    description: data.description?.trim() || '',
    commonSymptoms: data.commonSymptoms?.trim() || '',
    isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    isDefault: Boolean(data.isDefault),
    sortOrder: Number(data.sortOrder) || 0,
    createdAt: new Date().toISOString(),
  }

  const pool = getPostgresPool()

  // 1. Direct PostgreSQL
  if (pool) {
    try {
      await ensurePostgresTables(pool)
      const res = await pool.query(
        `INSERT INTO public.ent_concerns (title, category, description, common_symptoms, is_active, is_default, sort_order, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, created_at`,
        [
          newConcern.title,
          newConcern.category,
          newConcern.description,
          newConcern.commonSymptoms,
          newConcern.isActive,
          newConcern.isDefault,
          newConcern.sortOrder,
          newConcern.createdAt,
        ],
      )
      if (res.rows.length > 0 && res.rows[0].id) {
        newConcern.id = String(res.rows[0].id)
      }
      return newConcern
    } catch (err) {
      console.error('PostgreSQL addConcern error:', err)
      throw new Error('Failed to insert ENT concern into PostgreSQL database.')
    }
  }

  // 2. Supabase SDK
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data: inserted, error } = await supabaseAdmin.from('ent_concerns').insert([
        {
          title: newConcern.title,
          category: newConcern.category,
          description: newConcern.description,
          common_symptoms: newConcern.commonSymptoms,
          is_active: newConcern.isActive,
          is_default: newConcern.isDefault,
          sort_order: newConcern.sortOrder,
          created_at: newConcern.createdAt,
        },
      ]).select().single()

      if (!error && inserted?.id) {
        newConcern.id = String(inserted.id)
        return newConcern
      }
      throw error
    } catch (err) {
      console.error('Supabase addConcern error:', err)
      throw new Error('Failed to insert ENT concern into Supabase database.')
    }
  }

  throw new Error('Database is not connected. Please verify PostgreSQL connection in .env.local.')
}

export async function updateConcern(
  id: string,
  updates: Partial<Omit<ENTConcern, 'id' | 'createdAt'>>,
): Promise<ENTConcern | null> {
  const pool = getPostgresPool()

  // 1. Direct PostgreSQL
  if (pool) {
    try {
      await ensurePostgresTables(pool)
      const fields: string[] = []
      const values: any[] = []
      let idx = 1

      if (updates.title !== undefined) {
        fields.push(`title = $${idx++}`)
        values.push(updates.title)
      }
      if (updates.category !== undefined) {
        fields.push(`category = $${idx++}`)
        values.push(updates.category)
      }
      if (updates.description !== undefined) {
        fields.push(`description = $${idx++}`)
        values.push(updates.description)
      }
      if (updates.commonSymptoms !== undefined) {
        fields.push(`common_symptoms = $${idx++}`)
        values.push(updates.commonSymptoms)
      }
      if (updates.isActive !== undefined) {
        fields.push(`is_active = $${idx++}`)
        values.push(updates.isActive)
      }
      if (updates.isDefault !== undefined) {
        fields.push(`is_default = $${idx++}`)
        values.push(updates.isDefault)
      }
      if (updates.sortOrder !== undefined) {
        fields.push(`sort_order = $${idx++}`)
        values.push(updates.sortOrder)
      }

      if (fields.length > 0) {
        values.push(!isNaN(Number(id)) ? Number(id) : id)
        const res = await pool.query(
          `UPDATE public.ent_concerns SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
          values,
        )
        if (res.rows.length > 0) {
          const r = res.rows[0]
          return {
            id: String(r.id),
            title: r.title,
            category: r.category,
            description: r.description || '',
            commonSymptoms: r.common_symptoms || '',
            isActive: Boolean(r.is_active),
            isDefault: Boolean(r.is_default),
            sortOrder: r.sort_order || 0,
            createdAt: r.created_at ? new Date(r.created_at).toISOString() : undefined,
          }
        }
      }
    } catch (err) {
      console.error('PostgreSQL updateConcern error:', err)
      throw new Error('Failed to update ENT concern in PostgreSQL database.')
    }
  }

  // 2. Supabase SDK
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const dbUpdates: any = {}
      if (updates.title !== undefined) dbUpdates.title = updates.title
      if (updates.category !== undefined) dbUpdates.category = updates.category
      if (updates.description !== undefined) dbUpdates.description = updates.description
      if (updates.commonSymptoms !== undefined) dbUpdates.common_symptoms = updates.commonSymptoms
      if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive
      if (updates.isDefault !== undefined) dbUpdates.is_default = updates.isDefault
      if (updates.sortOrder !== undefined) dbUpdates.sort_order = updates.sortOrder

      const { data, error } = await supabaseAdmin
        .from('ent_concerns')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single()

      if (!error && data) {
        return {
          id: String(data.id),
          title: data.title,
          category: data.category,
          description: data.description || '',
          commonSymptoms: data.common_symptoms || '',
          isActive: Boolean(data.is_active),
          isDefault: Boolean(data.is_default),
          sortOrder: data.sort_order || 0,
          createdAt: data.created_at,
        }
      }
    } catch (err) {
      console.error('Supabase updateConcern error:', err)
      throw new Error('Failed to update ENT concern in Supabase database.')
    }
  }

  return null
}

export async function deleteConcern(id: string): Promise<boolean> {
  const pool = getPostgresPool()

  // 1. Direct PostgreSQL
  if (pool) {
    try {
      await ensurePostgresTables(pool)
      const targetId = !isNaN(Number(id)) ? Number(id) : id
      const res = await pool.query('DELETE FROM public.ent_concerns WHERE id = $1', [targetId])
      if ((res.rowCount || 0) > 0) return true
    } catch (err) {
      console.error('PostgreSQL deleteConcern error:', err)
      throw new Error('Failed to delete ENT concern in PostgreSQL database.')
    }
  }

  // 2. Supabase SDK
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin.from('ent_concerns').delete().eq('id', id)
      if (!error) return true
    } catch (err) {
      console.error('Supabase deleteConcern error:', err)
      throw new Error('Failed to delete ENT concern in Supabase database.')
    }
  }

  return false
}

// ----------------------------------------------------
// VISITOR & STATS OPERATIONS (DIRECT DATABASE)
// ----------------------------------------------------

export async function recordVisitor(details?: {
  ip?: string
  userAgent?: string
  path?: string
}): Promise<{ total: number; todayCount: number; entry?: VisitorLog }> {
  const today = new Date().toISOString().split('T')[0]
  const nowIso = new Date().toISOString()
  const ip = details?.ip?.trim() || '127.0.0.1'
  const userAgent = details?.userAgent?.trim() || ''
  const pagePath = details?.path?.trim() || '/'

  const logEntry: VisitorLog = {
    id: 1,
    ip,
    userAgent,
    path: pagePath,
    visitedAt: nowIso,
    date: today,
  }

  const pool = getPostgresPool()

  // 1. Direct PostgreSQL (pgAdmin / localhost)
  if (pool) {
    try {
      await ensurePostgresTables(pool)

      // Insert visitor log entry
      try {
        const logRes = await pool.query(
          `INSERT INTO public.visitor_logs (ip, user_agent, path, visited_at, created_at)
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [logEntry.ip, logEntry.userAgent, logEntry.path, logEntry.visitedAt, logEntry.visitedAt],
        )

        if (logRes.rows.length > 0 && logRes.rows[0].id) {
          logEntry.id = Number(logRes.rows[0].id)
        }
      } catch (logErr) {
        console.error('PostgreSQL visitor_logs insert error:', logErr)
      }

      const res = await pool.query('SELECT * FROM public.visitors WHERE id = 1 LIMIT 1')
      let total = 1
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

      return { total, todayCount, entry: logEntry }
    } catch (err) {
      console.error('PostgreSQL visitor record error:', err)
    }
  }

  // 2. Supabase SDK
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data: insertedLog } = await supabaseAdmin
        .from('visitor_logs')
        .insert([
          {
            ip: logEntry.ip,
            user_agent: logEntry.userAgent,
            path: logEntry.path,
            visited_at: logEntry.visitedAt,
          },
        ])
        .select('id')
        .single()

      if (insertedLog?.id) {
        logEntry.id = Number(insertedLog.id)
      }

      const { data, error } = await supabaseAdmin
        .from('visitors')
        .select('*')
        .eq('id', 1)
        .single()

      let newToday = 1
      let newTotal = 1

      if (!error && data) {
        newToday = (data.today_count || 0) + 1
        if (data.last_date !== today) {
          newToday = 1
        }
        newTotal = (data.total || 0) + 1

        await supabaseAdmin
          .from('visitors')
          .update({
            total: newTotal,
            today_count: newToday,
            last_date: today,
            updated_at: new Date().toISOString(),
          })
          .eq('id', 1)
      } else {
        await supabaseAdmin.from('visitors').insert([
          {
            id: 1,
            total: 1,
            today_count: 1,
            last_date: today,
            updated_at: new Date().toISOString(),
          },
        ])
      }

      return { total: newTotal, todayCount: newToday, entry: logEntry }
    } catch (err) {
      console.error('Supabase visitor record error:', err)
    }
  }

  return { total: 0, todayCount: 0, entry: logEntry }
}

export async function getRecentVisitorLogs(limit = 50): Promise<VisitorLog[]> {
  const pool = getPostgresPool()
  if (pool) {
    try {
      await ensurePostgresTables(pool)
      const res = await pool.query('SELECT * FROM public.visitor_logs ORDER BY visited_at DESC LIMIT $1', [limit])
      return res.rows.map((r) => ({
        id: Number(r.id),
        ip: r.ip,
        userAgent: r.user_agent || '',
        path: r.path || '/',
        visitedAt: r.visited_at ? new Date(r.visited_at).toISOString() : new Date().toISOString(),
        date: r.visited_at ? new Date(r.visited_at).toISOString().split('T')[0] : '',
      }))
    } catch (err) {
      console.error('PostgreSQL getRecentVisitorLogs error:', err)
    }
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data } = await supabaseAdmin
        .from('visitor_logs')
        .select('*')
        .order('visited_at', { ascending: false })
        .limit(limit)

      if (data) {
        return data.map((r: any) => ({
          id: Number(r.id),
          ip: r.ip,
          userAgent: r.user_agent || '',
          path: r.path || '/',
          visitedAt: r.visited_at,
          date: r.visited_at?.split('T')[0] || '',
        }))
      }
    } catch (err) {
      console.error('Supabase getRecentVisitorLogs error:', err)
    }
  }

  return []
}

export async function getStats() {
  const today = new Date().toISOString().split('T')[0]
  const pool = getPostgresPool()

  // 1. Direct PostgreSQL (pgAdmin / localhost)
  if (pool) {
    try {
      await ensurePostgresTables(pool)
      const [visitorRes, aptsRes, centersRes] = await Promise.all([
        pool.query('SELECT * FROM public.visitors WHERE id = 1 LIMIT 1'),
        pool.query('SELECT * FROM public.appointments'),
        pool.query('SELECT COUNT(*) as count FROM public.hospital_centers WHERE is_active = TRUE'),
      ])

      const visitorRow = visitorRes.rows[0]
      const apts = aptsRes.rows

      const visitorsTotal = visitorRow?.total || 0
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
      const totalActiveCenters = parseInt(centersRes.rows[0]?.count || '3', 10)

      return {
        visitorsTotal,
        visitorsToday,
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        todayAppointments,
        totalActiveCenters,
        databaseSource: 'PostgreSQL (pgAdmin)',
      }
    } catch (err) {
      console.error('PostgreSQL getStats error:', err)
    }
  }

  // 2. Supabase SDK
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const [visitorsRes, aptsRes, centersRes] = await Promise.all([
        supabaseAdmin.from('visitors').select('*').eq('id', 1).single(),
        supabaseAdmin.from('appointments').select('*'),
        supabaseAdmin.from('hospital_centers').select('*'),
      ])

      const visitorData = visitorsRes.data
      const apts = (aptsRes.data || []) as any[]
      const centers = (centersRes.data || []) as any[]

      const visitorsTotal = visitorData?.total || 0
      const visitorsToday =
        visitorData?.last_date === today ? visitorData?.today_count || 0 : 0

      const totalAppointments = apts.length
      const pendingAppointments = apts.filter((a) => a.status === 'pending').length
      const confirmedAppointments = apts.filter((a) => a.status === 'confirmed').length
      const todayAppointments = apts.filter(
        (a) => a.date === today || (a.created_at && a.created_at.startsWith(today)),
      ).length
      const totalActiveCenters = centers.filter((c) => c.is_active).length || 3

      return {
        visitorsTotal,
        visitorsToday,
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        todayAppointments,
        totalActiveCenters,
        databaseSource: 'Supabase Cloud PostgreSQL',
      }
    } catch (err) {
      console.error('Supabase getStats error:', err)
    }
  }

  return {
    visitorsTotal: 0,
    visitorsToday: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    todayAppointments: 0,
    totalActiveCenters: 3,
    databaseSource: 'Database Not Connected',
  }
}

// ----------------------------------------------------
// APPOINTMENTS OPERATIONS (DIRECT DATABASE)
// ----------------------------------------------------

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
        id: String(row.id),
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
      console.error('PostgreSQL getAllAppointments error:', err)
      return []
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
          id: String(item.id),
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
      console.error('Supabase getAllAppointments error:', err)
    }
  }

  return []
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
    id: `apt-${Date.now()}`,
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
      const res = await pool.query(
        `INSERT INTO public.appointments (name, phone, location, reason, date, status, notes, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, created_at`,
        [
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
      if (res.rows.length > 0 && res.rows[0].id) {
        newAppointment.id = String(res.rows[0].id)
      }
      return newAppointment
    } catch (err) {
      console.error('PostgreSQL insert appointment error:', err)
      throw new Error('Failed to insert appointment into PostgreSQL database.')
    }
  }

  // 2. Supabase SDK
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data: inserted, error } = await supabaseAdmin.from('appointments').insert([
        {
          name: newAppointment.name,
          phone: newAppointment.phone,
          location: newAppointment.location,
          reason: newAppointment.reason,
          date: newAppointment.date,
          status: newAppointment.status,
          notes: newAppointment.notes,
          created_at: newAppointment.createdAt,
        },
      ]).select().single()

      if (!error && inserted?.id) {
        newAppointment.id = String(inserted.id)
        return newAppointment
      }
      console.error('Supabase insert error:', error)
      throw error
    } catch (err) {
      console.error('Supabase addAppointment error:', err)
      throw new Error('Failed to insert appointment into Supabase database.')
    }
  }

  throw new Error('Database is not connected. Please check PostgreSQL connection in .env.local.')
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
        values.push(!isNaN(Number(id)) ? Number(id) : id)
        const res = await pool.query(
          `UPDATE public.appointments SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
          values,
        )
        if (res.rows.length > 0) {
          const row = res.rows[0]
          return {
            id: String(row.id),
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
      console.error('PostgreSQL updateAppointment error:', err)
      throw new Error('Failed to update appointment in PostgreSQL database.')
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
          id: String(data.id),
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
      console.error('Supabase updateAppointment error:', err)
      throw new Error('Failed to update appointment in Supabase database.')
    }
  }

  return null
}

export async function deleteAppointment(id: string): Promise<boolean> {
  const pool = getPostgresPool()

  // 1. Direct PostgreSQL (pgAdmin / localhost)
  if (pool) {
    try {
      await ensurePostgresTables(pool)
      const targetId = !isNaN(Number(id)) ? Number(id) : id
      const res = await pool.query('DELETE FROM public.appointments WHERE id = $1', [targetId])
      if ((res.rowCount || 0) > 0) return true
    } catch (err) {
      console.error('PostgreSQL deleteAppointment error:', err)
      throw new Error('Failed to delete appointment in PostgreSQL database.')
    }
  }

  // 2. Supabase SDK
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin.from('appointments').delete().eq('id', id)
      if (!error) return true
    } catch (err) {
      console.error('Supabase deleteAppointment error:', err)
      throw new Error('Failed to delete appointment in Supabase database.')
    }
  }

  return false
}

// ----------------------------------------------------
// CRYPTOGRAPHIC PASSWORD HASHING & VERIFICATION (SCRYPT)
// ----------------------------------------------------

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const derivedKey = crypto.scryptSync(password.trim(), salt, 64)
  return `scrypt:${salt}:${derivedKey.toString('hex')}`
}

export function verifyPassword(candidatePassword: string, storedHashOrPlain: string): boolean {
  if (!storedHashOrPlain || !candidatePassword) return false
  const cleanPass = candidatePassword.trim()

  // 1. Scrypt Hash Check
  if (storedHashOrPlain.startsWith('scrypt:')) {
    const parts = storedHashOrPlain.split(':')
    if (parts.length !== 3) return false
    const salt = parts[1]
    const key = parts[2]
    try {
      const derivedKey = crypto.scryptSync(cleanPass, salt, 64)
      const keyBuffer = Buffer.from(key, 'hex')
      if (derivedKey.length !== keyBuffer.length) return false
      return crypto.timingSafeEqual(derivedKey, keyBuffer)
    } catch {
      return false
    }
  }

  // 2. Backward compatibility fallback for legacy plain text passwords
  return cleanPass === storedHashOrPlain.trim()
}

// ----------------------------------------------------
// ADMIN CREDENTIALS OPERATIONS (DIRECT DATABASE)
// ----------------------------------------------------

export async function validateAdminCredentials(username: string, password: string): Promise<AdminUser | null> {
  const pool = getPostgresPool()
  const cleanUser = username.trim().toLowerCase()
  const cleanPass = password.trim()

  // 1. Direct PostgreSQL (pgAdmin / localhost)
  if (pool) {
    try {
      await ensurePostgresTables(pool)
      const res = await pool.query(
        'SELECT * FROM public.admin_users WHERE LOWER(username) = $1 LIMIT 1',
        [cleanUser],
      )
      if (res.rows.length > 0) {
        const row = res.rows[0]
        if (verifyPassword(cleanPass, row.password)) {
          // Transparently upgrade legacy plain-text password to scrypt hash
          if (!row.password.startsWith('scrypt:')) {
            try {
              const newHash = hashPassword(cleanPass)
              await pool.query('UPDATE public.admin_users SET password = $1, updated_at = NOW() WHERE id = $2', [newHash, row.id])
            } catch (upgradeErr) {
              console.error('PostgreSQL auto-upgrade password hash error:', upgradeErr)
            }
          }

          const role = row.role === 'super_admin' || row.username === 'admin' ? 'super_admin' : 'staff'
          return {
            id: String(row.id),
            username: row.username,
            name: row.name || (role === 'super_admin' ? 'Dr. Vaidik Chauhan' : 'Clinic Reception Staff'),
            role,
          }
        }
      }
      return null
    } catch (err) {
      console.error('PostgreSQL validateAdminCredentials error:', err)
    }
  }

  // 2. Supabase SDK
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('admin_users')
        .select('*')
        .ilike('username', cleanUser)
        .single()

      if (!error && data) {
        if (verifyPassword(cleanPass, data.password)) {
          // Transparently upgrade legacy plain-text password to scrypt hash
          if (!data.password.startsWith('scrypt:')) {
            try {
              const newHash = hashPassword(cleanPass)
              await supabaseAdmin
                .from('admin_users')
                .update({ password: newHash, updated_at: new Date().toISOString() })
                .eq('id', data.id)
            } catch (upgradeErr) {
              console.error('Supabase auto-upgrade password hash error:', upgradeErr)
            }
          }

          const role = data.role === 'super_admin' || data.username === 'admin' ? 'super_admin' : 'staff'
          return {
            id: String(data.id),
            username: data.username,
            name: data.name || (role === 'super_admin' ? 'Dr. Vaidik Chauhan' : 'Clinic Reception Staff'),
            role,
          }
        }
      }
      return null
    } catch (err) {
      console.error('Supabase validateAdminCredentials error:', err)
    }
  }

  // Initial fallback if DB is still initializing
  if ((cleanUser === 'admin' || cleanUser === 'drvaidik') && cleanPass === 'drvaidik2026') {
    return {
      id: '1',
      username: 'admin',
      name: 'Dr. Vaidik Chauhan',
      role: 'super_admin',
    }
  }

  if ((cleanUser === 'staff' || cleanUser === 'reception') && cleanPass === 'staff123') {
    return {
      id: '2',
      username: 'staff',
      name: 'Clinic Reception Staff',
      role: 'staff',
    }
  }

  return null
}

export async function updateAdminCredentials(data: {
  currentUsername: string
  currentPassword: string
  newUsername?: string
  newPassword?: string
}): Promise<{ success: boolean; message: string; username: string }> {
  const cleanCurrentUsername = data.currentUsername.trim().toLowerCase()
  const cleanCurrentPassword = data.currentPassword.trim()
  const cleanNewUsername = (data.newUsername || data.currentUsername).trim()
  const cleanNewPassword = (data.newPassword || data.currentPassword).trim()

  const pool = getPostgresPool()

  // 1. Direct PostgreSQL (pgAdmin / localhost)
  if (pool) {
    try {
      await ensurePostgresTables(pool)
      const res = await pool.query(
        'SELECT * FROM public.admin_users WHERE LOWER(username) = $1 LIMIT 1',
        [cleanCurrentUsername],
      )

      if (res.rows.length === 0 || !verifyPassword(cleanCurrentPassword, res.rows[0].password)) {
        return { success: false, message: 'Current password does not match.', username: data.currentUsername }
      }

      const adminId = res.rows[0].id
      const finalPasswordHash = data.newPassword && data.newPassword.trim()
        ? hashPassword(cleanNewPassword)
        : (res.rows[0].password.startsWith('scrypt:') ? res.rows[0].password : hashPassword(cleanCurrentPassword))

      await pool.query(
        'UPDATE public.admin_users SET username = $1, password = $2, updated_at = NOW() WHERE id = $3',
        [cleanNewUsername, finalPasswordHash, adminId],
      )

      return {
        success: true,
        message: 'Admin credentials updated securely in database.',
        username: cleanNewUsername,
      }
    } catch (err) {
      console.error('PostgreSQL updateAdminCredentials error:', err)
      throw new Error('Failed to update credentials in database.')
    }
  }

  // 2. Supabase SDK
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data: user, error: findError } = await supabaseAdmin
        .from('admin_users')
        .select('*')
        .ilike('username', cleanCurrentUsername)
        .single()

      if (findError || !user || !verifyPassword(cleanCurrentPassword, user.password)) {
        return { success: false, message: 'Current password does not match.', username: data.currentUsername }
      }

      const finalPasswordHash = data.newPassword && data.newPassword.trim()
        ? hashPassword(cleanNewPassword)
        : (user.password.startsWith('scrypt:') ? user.password : hashPassword(cleanCurrentPassword))

      const { error: updateError } = await supabaseAdmin
        .from('admin_users')
        .update({
          username: cleanNewUsername,
          password: finalPasswordHash,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (updateError) {
        throw updateError
      }

      return {
        success: true,
        message: 'Admin credentials updated securely in Supabase database.',
        username: cleanNewUsername,
      }
    } catch (err) {
      console.error('Supabase updateAdminCredentials error:', err)
      throw new Error('Failed to update credentials in Supabase database.')
    }
  }

  throw new Error('Database is not connected. Please check .env.local.')
}

// ----------------------------------------------------
// SUPER ADMIN STAFF MANAGEMENT (DIRECT DATABASE)
// ----------------------------------------------------

export async function getAllAdminUsers(): Promise<AdminUser[]> {
  const pool = getPostgresPool()

  if (pool) {
    try {
      await ensurePostgresTables(pool)
      const res = await pool.query(
        'SELECT id, username, name, role, created_at, updated_at FROM public.admin_users ORDER BY id ASC',
      )
      return res.rows.map((row) => ({
        id: String(row.id),
        username: row.username,
        name: row.name || (row.role === 'super_admin' ? 'Dr. Vaidik Chauhan' : 'Clinic Reception Staff'),
        role: row.role || (row.username === 'admin' ? 'super_admin' : 'staff'),
        createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
        updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
      }))
    } catch (err) {
      console.error('PostgreSQL getAllAdminUsers error:', err)
    }
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('admin_users')
        .select('id, username, name, role, created_at, updated_at')
        .order('id', { ascending: true })

      if (!error && data) {
        return data.map((item: any) => ({
          id: String(item.id),
          username: item.username,
          name: item.name || (item.role === 'super_admin' ? 'Dr. Vaidik Chauhan' : 'Clinic Reception Staff'),
          role: item.role || (item.username === 'admin' ? 'super_admin' : 'staff'),
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }))
      }
    } catch (err) {
      console.error('Supabase getAllAdminUsers error:', err)
    }
  }

  return [
    {
      id: '1',
      username: 'admin',
      name: 'Dr. Vaidik Chauhan',
      role: 'super_admin',
    },
    {
      id: '2',
      username: 'staff',
      name: 'Clinic Reception Staff',
      role: 'staff',
    },
  ]
}

export async function createAdminUser(data: {
  name: string
  username: string
  password: string
  role?: string
}): Promise<AdminUser> {
  const cleanName = data.name.trim()
  const cleanUsername = data.username.trim().toLowerCase()
  const cleanPassword = data.password.trim()
  const cleanRole = data.role === 'super_admin' ? 'super_admin' : 'staff'
  const hashedPassword = hashPassword(cleanPassword)

  const pool = getPostgresPool()

  if (pool) {
    try {
      await ensurePostgresTables(pool)
      const checkRes = await pool.query(
        'SELECT id FROM public.admin_users WHERE LOWER(username) = $1 LIMIT 1',
        [cleanUsername],
      )
      if (checkRes.rows.length > 0) {
        throw new Error(`Username "${cleanUsername}" is already in use. Please choose another username.`)
      }

      const res = await pool.query(
        `INSERT INTO public.admin_users (name, username, password, role, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING id, username, name, role, created_at, updated_at`,
        [cleanName, cleanUsername, hashedPassword, cleanRole],
      )

      if (res.rows.length > 0) {
        const row = res.rows[0]
        return {
          id: String(row.id),
          username: row.username,
          name: row.name,
          role: row.role,
          createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
        }
      }
    } catch (err: any) {
      console.error('PostgreSQL createAdminUser error:', err)
      throw err
    }
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data: inserted, error } = await supabaseAdmin
        .from('admin_users')
        .insert([
          {
            name: cleanName,
            username: cleanUsername,
            password: hashedPassword,
            role: cleanRole,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) {
        if (error.code === '23505') {
          throw new Error(`Username "${cleanUsername}" is already taken.`)
        }
        throw error
      }

      if (inserted) {
        return {
          id: String(inserted.id),
          username: inserted.username,
          name: inserted.name,
          role: inserted.role,
          createdAt: inserted.created_at,
        }
      }
    } catch (err: any) {
      console.error('Supabase createAdminUser error:', err)
      throw err
    }
  }

  throw new Error('Database is not connected. Please check database connection.')
}

export async function updateAdminUser(
  id: string,
  updates: {
    name?: string
    username?: string
    password?: string
    role?: string
  },
): Promise<AdminUser> {
  const pool = getPostgresPool()

  if (pool) {
    try {
      await ensurePostgresTables(pool)
      const fields: string[] = []
      const values: any[] = []
      let idx = 1

      if (updates.name !== undefined) {
        fields.push(`name = $${idx++}`)
        values.push(updates.name.trim())
      }
      if (updates.username !== undefined) {
        fields.push(`username = $${idx++}`)
        values.push(updates.username.trim().toLowerCase())
      }
      if (updates.password !== undefined && updates.password.trim()) {
        fields.push(`password = $${idx++}`)
        values.push(hashPassword(updates.password.trim()))
      }
      if (updates.role !== undefined) {
        fields.push(`role = $${idx++}`)
        values.push(updates.role === 'super_admin' ? 'super_admin' : 'staff')
      }

      fields.push(`updated_at = NOW()`)
      values.push(!isNaN(Number(id)) ? Number(id) : id)

      const res = await pool.query(
        `UPDATE public.admin_users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, username, name, role, created_at, updated_at`,
        values,
      )

      if (res.rows.length > 0) {
        const row = res.rows[0]
        return {
          id: String(row.id),
          username: row.username,
          name: row.name,
          role: row.role,
          createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
          updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
        }
      }
      throw new Error('User not found.')
    } catch (err: any) {
      console.error('PostgreSQL updateAdminUser error:', err)
      throw err
    }
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const dbUpdates: any = { updated_at: new Date().toISOString() }
      if (updates.name !== undefined) dbUpdates.name = updates.name.trim()
      if (updates.username !== undefined) dbUpdates.username = updates.username.trim().toLowerCase()
      if (updates.password !== undefined && updates.password.trim()) dbUpdates.password = hashPassword(updates.password.trim())
      if (updates.role !== undefined) dbUpdates.role = updates.role === 'super_admin' ? 'super_admin' : 'staff'

      const { data, error } = await supabaseAdmin
        .from('admin_users')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      if (data) {
        return {
          id: String(data.id),
          username: data.username,
          name: data.name,
          role: data.role,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
      }
    } catch (err: any) {
      console.error('Supabase updateAdminUser error:', err)
      throw err
    }
  }

  throw new Error('Database is not connected.')
}

export async function deleteAdminUser(id: string): Promise<boolean> {
  const pool = getPostgresPool()

  if (pool) {
    try {
      await ensurePostgresTables(pool)
      const targetId = !isNaN(Number(id)) ? Number(id) : id

      const checkRes = await pool.query('SELECT username, role FROM public.admin_users WHERE id = $1', [targetId])
      if (checkRes.rows.length > 0) {
        const user = checkRes.rows[0]
        if (user.username === 'admin' || user.role === 'super_admin') {
          throw new Error('Main Director / Super Admin account cannot be deleted.')
        }
      }

      const res = await pool.query('DELETE FROM public.admin_users WHERE id = $1', [targetId])
      return (res.rowCount || 0) > 0
    } catch (err: any) {
      console.error('PostgreSQL deleteAdminUser error:', err)
      throw err
    }
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data: user } = await supabaseAdmin.from('admin_users').select('username, role').eq('id', id).single()
      if (user && (user.username === 'admin' || user.role === 'super_admin')) {
        throw new Error('Main Director / Super Admin account cannot be deleted.')
      }

      const { error } = await supabaseAdmin.from('admin_users').delete().eq('id', id)
      if (!error) return true
      throw error
    } catch (err: any) {
      console.error('Supabase deleteAdminUser error:', err)
      throw err
    }
  }

  throw new Error('Database is not connected.')
}

