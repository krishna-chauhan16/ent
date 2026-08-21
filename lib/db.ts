import fs from 'fs'
import path from 'path'
import { supabaseAdmin, isSupabaseConfigured } from './supabase'
import { getPostgresPool, ensurePostgresTables } from './postgres'

export interface HospitalCenter {
  id: string
  name: string
  area: string
  timings: string
  tag?: string
  isActive: boolean
  isDefault?: boolean
  createdAt?: string
}

export interface ENTConcern {
  id: string
  title: string
  category: string
  description?: string
  commonSymptoms?: string
  isActive: boolean
  isDefault?: boolean
  sortOrder?: number
  createdAt?: string
}

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
  centers: HospitalCenter[]
  concerns: ENTConcern[]
  appointments: Appointment[]
}

const dataDir = path.join(process.cwd(), 'data')
const dbFile = path.join(dataDir, 'db.json')

const initialCenters: HospitalCenter[] = [
  {
    id: 'center-1',
    name: 'Atulya Superspeciality Hospital (Bhuyangdev)',
    area: '2nd Floor, Elite Magnum, Bhuyangdev Cross Road, Sola Road, Ghatlodiya, Ahmedabad',
    timings: 'Mon - Sat: 10:00 AM - 01:00 PM & 05:00 PM - 08:00 PM',
    tag: 'Primary Hospital (Director & Head)',
    isActive: true,
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'center-2',
    name: 'KD Hospital (SG Highway)',
    area: 'Vaishnodevi Circle, SG Highway, Ahmedabad',
    timings: 'Visiting Consultant / By Appointment',
    tag: 'Visiting Consultant',
    isActive: true,
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'center-3',
    name: 'Prathana Hospital',
    area: 'Near Helmet Cross Roads, Memnagar, Ahmedabad',
    timings: 'Visiting Consultant / By Appointment',
    tag: 'Visiting Consultant',
    isActive: true,
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
]

const initialConcerns: ENTConcern[] = [
  {
    id: 'concern-1',
    title: 'Sinusitis, Nasal Polyps & Blockage (FESS / Septoplasty)',
    category: 'Nose & Sinus (Rhinology)',
    description: 'Deviated Nasal Septum (DNS), Functional Endoscopic Sinus Surgery (FESS), Turbinate Reduction, Polyp Clearance.',
    commonSymptoms: 'Nasal Blockage, Facial Heaviness, Headache, Post-Nasal Drip, Loss of Smell',
    isActive: true,
    isDefault: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'concern-2',
    title: 'Ear Discharge, Hearing Loss & Eardrum Perforation (Tympanoplasty)',
    category: 'Ear & Hearing (Otology)',
    description: 'CSOM, Cholesteatoma, Mastoidectomy, Stapedotomy, Micro-ear surgery, Eardrum Repair.',
    commonSymptoms: 'Ear Discharge, Ear Ache, Decreased Hearing, Eardrum Hole, Tinnitus (Ringing Ear)',
    isActive: true,
    isDefault: false,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'concern-3',
    title: 'Vertigo, Dizziness & Balance Disorders',
    category: 'Vertigo & Balance',
    description: 'BPPV, Vestibular Neuritis, Meniere\'s Disease, Canalith Repositioning Maneuvers.',
    commonSymptoms: 'Spinning Sensation, Imbalance while walking, Nausea, Sudden Vertigo Attacks',
    isActive: true,
    isDefault: false,
    sortOrder: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'concern-4',
    title: 'Throat, Tonsils, Adenoids & Voice Issues (Microlaryngeal Surgery)',
    category: 'Throat & Voice (Laryngology)',
    description: 'Recurrent Tonsillitis, Adenoid Hypertrophy, Vocal Cord Polyps, Hoarseness, Coblation Tonsillectomy.',
    commonSymptoms: 'Frequent Sore Throat, Difficulty Swallowing, Hoarse Voice, Snoring in Children',
    isActive: true,
    isDefault: false,
    sortOrder: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'concern-5',
    title: 'Pediatric ENT Checkup & Airway Obstruction',
    category: 'Pediatric ENT',
    description: 'Childhood snoring, mouth breathing, recurrent ear infections, foreign body removal, tongue tie release.',
    commonSymptoms: 'Mouth Breathing during sleep, Night Snoring, Restless Sleep, Ear Infections',
    isActive: true,
    isDefault: false,
    sortOrder: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'concern-6',
    title: 'Head & Neck Swellings, Thyroid & Skull Base Consultation',
    category: 'Head & Neck / Skull Base',
    description: 'Salivary Gland (Parotid/Submandibular) tumors, Thyroid nodules, CSF Rhinorrhea leak repair, Skull base lesions.',
    commonSymptoms: 'Neck Lumps, Salivary Gland Swelling, Clear fluid drainage from nose, Neck Pain',
    isActive: true,
    isDefault: false,
    sortOrder: 6,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'concern-7',
    title: 'Snoring & Obstructive Sleep Apnea (OSA)',
    category: 'Sleep & Airway',
    description: 'Sleep endoscopy, palate & pharyngeal airway surgery, surgical management of obstructive sleep apnea.',
    commonSymptoms: 'Loud Snoring, Choking at night, Excessive daytime sleepiness, Morning headaches',
    isActive: true,
    isDefault: false,
    sortOrder: 7,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'concern-8',
    title: 'Second Surgical Opinion / General ENT Consultation',
    category: 'General ENT & Second Opinion',
    description: 'Comprehensive ENT evaluation, review of previous CT/MRI scans, unbiased surgical opinion & guidance.',
    commonSymptoms: 'Previous diagnosis review, non-resolving ENT symptoms, pre-surgery evaluation',
    isActive: true,
    isDefault: false,
    sortOrder: 8,
    createdAt: new Date().toISOString(),
  },
]

const initialData: DbSchema = {
  visitors: {
    total: 1240,
    todayCount: 18,
    lastDate: new Date().toISOString().split('T')[0],
  },
  centers: initialCenters,
  concerns: initialConcerns,
  appointments: [
    {
      id: 'apt-demo-1',
      name: 'Ramesh Patel',
      phone: '+91 9876543210',
      location: 'Atulya Superspeciality Hospital (Bhuyangdev)',
      reason: 'Sinusitis, Nasal Polyps & Blockage (FESS / Septoplasty)',
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
      reason: 'Ear Discharge, Hearing Loss & Eardrum Perforation (Tympanoplasty)',
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
    const parsed = JSON.parse(content) as DbSchema
    let changed = false
    if (!parsed.centers) {
      parsed.centers = initialCenters
      changed = true
    }
    if (!parsed.concerns || parsed.concerns.length === 0) {
      parsed.concerns = initialConcerns
      changed = true
    }
    if (changed) {
      fs.writeFileSync(dbFile, JSON.stringify(parsed, null, 2), 'utf-8')
    }
    return parsed
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
// HOSPITAL CENTERS MASTER OPERATIONS
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
          id: r.id,
          name: r.name,
          area: r.area,
          timings: r.timings || '',
          tag: r.tag || '',
          isActive: r.is_active,
          isDefault: r.is_default,
          createdAt: r.created_at,
        }))
      }
    } catch (err) {
      console.error('PostgreSQL getAllCenters error, using fallback', err)
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
          id: r.id,
          name: r.name,
          area: r.area,
          timings: r.timings || '',
          tag: r.tag || '',
          isActive: r.is_active,
          isDefault: r.is_default,
          createdAt: r.created_at,
        }))
      }
    } catch (err) {
      console.error('Supabase getAllCenters error, using fallback', err)
    }
  }

  // 3. Fallback Local File DB
  const db = ensureLocalDb()
  const list = db.centers || initialCenters
  return onlyActive ? list.filter((c) => c.isActive) : list
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
      await pool.query(
        `INSERT INTO public.hospital_centers (id, name, area, timings, tag, is_active, is_default, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          newCenter.id,
          newCenter.name,
          newCenter.area,
          newCenter.timings,
          newCenter.tag,
          newCenter.isActive,
          newCenter.isDefault,
          newCenter.createdAt,
        ],
      )
      return newCenter
    } catch (err) {
      console.error('PostgreSQL addCenter error', err)
    }
  }

  // 2. Supabase SDK
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('hospital_centers').insert([
        {
          id: newCenter.id,
          name: newCenter.name,
          area: newCenter.area,
          timings: newCenter.timings,
          tag: newCenter.tag,
          is_active: newCenter.isActive,
          is_default: newCenter.isDefault,
          created_at: newCenter.createdAt,
        },
      ])
      return newCenter
    } catch (err) {
      console.error('Supabase addCenter error', err)
    }
  }

  // 3. Fallback Local File DB
  const db = ensureLocalDb()
  if (!db.centers) db.centers = initialCenters
  db.centers.push(newCenter)
  saveLocalDb(db)
  return newCenter
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
        values.push(id)
        const res = await pool.query(
          `UPDATE public.hospital_centers SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
          values,
        )
        if (res.rows.length > 0) {
          const r = res.rows[0]
          return {
            id: r.id,
            name: r.name,
            area: r.area,
            timings: r.timings || '',
            tag: r.tag || '',
            isActive: r.is_active,
            isDefault: r.is_default,
            createdAt: r.created_at,
          }
        }
      }
    } catch (err) {
      console.error('PostgreSQL updateCenter error', err)
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
          id: data.id,
          name: data.name,
          area: data.area,
          timings: data.timings || '',
          tag: data.tag || '',
          isActive: data.is_active,
          isDefault: data.is_default,
          createdAt: data.created_at,
        }
      }
    } catch (err) {
      console.error('Supabase updateCenter error', err)
    }
  }

  // 3. Fallback Local File DB
  const db = ensureLocalDb()
  if (!db.centers) db.centers = initialCenters
  const index = db.centers.findIndex((c) => c.id === id)
  if (index === -1) return null

  db.centers[index] = {
    ...db.centers[index],
    ...updates,
  }
  saveLocalDb(db)
  return db.centers[index]
}

export async function deleteCenter(id: string): Promise<boolean> {
  const pool = getPostgresPool()

  // 1. Direct PostgreSQL
  if (pool) {
    try {
      await ensurePostgresTables(pool)
      const res = await pool.query('DELETE FROM public.hospital_centers WHERE id = $1', [id])
      if ((res.rowCount || 0) > 0) return true
    } catch (err) {
      console.error('PostgreSQL deleteCenter error', err)
    }
  }

  // 2. Supabase SDK
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin.from('hospital_centers').delete().eq('id', id)
      if (!error) return true
    } catch (err) {
      console.error('Supabase deleteCenter error', err)
    }
  }

  // 3. Fallback Local File DB
  const db = ensureLocalDb()
  if (!db.centers) db.centers = initialCenters
  const beforeLength = db.centers.length
  db.centers = db.centers.filter((c) => c.id !== id)
  if (db.centers.length !== beforeLength) {
    saveLocalDb(db)
    return true
  }
  return false
}

// ----------------------------------------------------
// ENT CONCERNS MASTER OPERATIONS
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
          id: r.id,
          title: r.title,
          category: r.category,
          description: r.description || '',
          commonSymptoms: r.common_symptoms || '',
          isActive: r.is_active,
          isDefault: r.is_default,
          sortOrder: r.sort_order || 0,
          createdAt: r.created_at,
        }))
      }
    } catch (err) {
      console.error('PostgreSQL getAllConcerns error, using fallback', err)
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
          id: r.id,
          title: r.title,
          category: r.category,
          description: r.description || '',
          commonSymptoms: r.common_symptoms || '',
          isActive: r.is_active,
          isDefault: r.is_default,
          sortOrder: r.sort_order || 0,
          createdAt: r.created_at,
        }))
      }
    } catch (err) {
      console.error('Supabase getAllConcerns error, using fallback', err)
    }
  }

  // 3. Fallback Local File DB
  const db = ensureLocalDb()
  const list = db.concerns || initialConcerns
  return onlyActive ? list.filter((c) => c.isActive) : list
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
      await pool.query(
        `INSERT INTO public.ent_concerns (id, title, category, description, common_symptoms, is_active, is_default, sort_order, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          newConcern.id,
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
      return newConcern
    } catch (err) {
      console.error('PostgreSQL addConcern error', err)
    }
  }

  // 2. Supabase SDK
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('ent_concerns').insert([
        {
          id: newConcern.id,
          title: newConcern.title,
          category: newConcern.category,
          description: newConcern.description,
          common_symptoms: newConcern.commonSymptoms,
          is_active: newConcern.isActive,
          is_default: newConcern.isDefault,
          sort_order: newConcern.sortOrder,
          created_at: newConcern.createdAt,
        },
      ])
      return newConcern
    } catch (err) {
      console.error('Supabase addConcern error', err)
    }
  }

  // 3. Fallback Local File DB
  const db = ensureLocalDb()
  if (!db.concerns) db.concerns = initialConcerns
  db.concerns.push(newConcern)
  saveLocalDb(db)
  return newConcern
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
        values.push(id)
        const res = await pool.query(
          `UPDATE public.ent_concerns SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
          values,
        )
        if (res.rows.length > 0) {
          const r = res.rows[0]
          return {
            id: r.id,
            title: r.title,
            category: r.category,
            description: r.description || '',
            commonSymptoms: r.common_symptoms || '',
            isActive: r.is_active,
            isDefault: r.is_default,
            sortOrder: r.sort_order || 0,
            createdAt: r.created_at,
          }
        }
      }
    } catch (err) {
      console.error('PostgreSQL updateConcern error', err)
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
          id: data.id,
          title: data.title,
          category: data.category,
          description: data.description || '',
          commonSymptoms: data.common_symptoms || '',
          isActive: data.is_active,
          isDefault: data.is_default,
          sortOrder: data.sort_order || 0,
          createdAt: data.created_at,
        }
      }
    } catch (err) {
      console.error('Supabase updateConcern error', err)
    }
  }

  // 3. Fallback Local File DB
  const db = ensureLocalDb()
  if (!db.concerns) db.concerns = initialConcerns
  const index = db.concerns.findIndex((c) => c.id === id)
  if (index === -1) return null

  db.concerns[index] = {
    ...db.concerns[index],
    ...updates,
  }
  saveLocalDb(db)
  return db.concerns[index]
}

export async function deleteConcern(id: string): Promise<boolean> {
  const pool = getPostgresPool()

  // 1. Direct PostgreSQL
  if (pool) {
    try {
      await ensurePostgresTables(pool)
      const res = await pool.query('DELETE FROM public.ent_concerns WHERE id = $1', [id])
      if ((res.rowCount || 0) > 0) return true
    } catch (err) {
      console.error('PostgreSQL deleteConcern error', err)
    }
  }

  // 2. Supabase SDK
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin.from('ent_concerns').delete().eq('id', id)
      if (!error) return true
    } catch (err) {
      console.error('Supabase deleteConcern error', err)
    }
  }

  // 3. Fallback Local File DB
  const db = ensureLocalDb()
  if (!db.concerns) db.concerns = initialConcerns
  const beforeLength = db.concerns.length
  db.concerns = db.concerns.filter((c) => c.id !== id)
  if (db.concerns.length !== beforeLength) {
    saveLocalDb(db)
    return true
  }
  return false
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
      const [visitorRes, aptsRes, centersRes] = await Promise.all([
        pool.query('SELECT * FROM public.visitors WHERE id = 1 LIMIT 1'),
        pool.query('SELECT * FROM public.appointments'),
        pool.query('SELECT COUNT(*) as count FROM public.hospital_centers WHERE is_active = TRUE'),
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
      console.error('PostgreSQL getStats error', err)
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

      const visitorsTotal = visitorData?.total || 1240
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
  const totalActiveCenters = (db.centers || initialCenters).filter((c) => c.isActive).length

  return {
    visitorsTotal: db.visitors.total,
    visitorsToday: db.visitors.todayCount,
    totalAppointments,
    pendingAppointments,
    confirmedAppointments,
    todayAppointments,
    totalActiveCenters,
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
      console.error('Supabase addAppointment error, saving to local DB', err)
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
