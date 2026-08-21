import { Pool } from 'pg'

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.PG_CONNECTION_STRING ||
  ''

export const isPostgresConfigured = Boolean(
  databaseUrl &&
    databaseUrl.startsWith('postgres') &&
    !databaseUrl.includes('placeholder') &&
    !databaseUrl.includes('your_password'),
)

let pool: Pool | null = null
let tablesInitialized = false

export function getPostgresPool(): Pool | null {
  if (!isPostgresConfigured) return null

  if (!pool) {
    const isLocalOrLan =
      databaseUrl.includes('localhost') ||
      databaseUrl.includes('127.0.0.1') ||
      databaseUrl.includes('192.168.') ||
      databaseUrl.includes('10.') ||
      databaseUrl.includes('172.')

    const requiresSsl =
      databaseUrl.includes('sslmode=require') ||
      databaseUrl.includes('supabase.co') ||
      databaseUrl.includes('neon.tech') ||
      databaseUrl.includes('render.com')

    const ssl = isLocalOrLan ? false : requiresSsl ? { rejectUnauthorized: false } : false

    pool = new Pool({
      connectionString: databaseUrl,
      ssl,
      connectionTimeoutMillis: 5000,
    })

    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err)
    })
  }

  return pool
}

export async function ensurePostgresTables(p: Pool): Promise<void> {
  if (tablesInitialized) return
  try {
    await p.query(`
      CREATE TABLE IF NOT EXISTS public.appointments (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        location TEXT NOT NULL DEFAULT 'Atulya Superspeciality Hospital (Bhuyangdev)',
        reason TEXT DEFAULT 'General ENT Consultation',
        date TEXT,
        status TEXT DEFAULT 'pending',
        notes TEXT DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.visitors (
        id INTEGER PRIMARY KEY DEFAULT 1,
        total INTEGER DEFAULT 1240,
        today_count INTEGER DEFAULT 18,
        last_date DATE DEFAULT CURRENT_DATE,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.hospital_centers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        area TEXT NOT NULL,
        timings TEXT DEFAULT '',
        tag TEXT DEFAULT '',
        is_active BOOLEAN DEFAULT TRUE,
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.ent_concerns (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT DEFAULT '',
        common_symptoms TEXT DEFAULT '',
        is_active BOOLEAN DEFAULT TRUE,
        is_default BOOLEAN DEFAULT FALSE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      INSERT INTO public.visitors (id, total, today_count, last_date)
      VALUES (1, 1240, 18, CURRENT_DATE)
      ON CONFLICT (id) DO NOTHING;

      INSERT INTO public.hospital_centers (id, name, area, timings, tag, is_active, is_default)
      VALUES 
        ('center-1', 'Atulya Superspeciality Hospital (Bhuyangdev)', '2nd Floor, Elite Magnum, Bhuyangdev Cross Road, Sola Road, Ghatlodiya, Ahmedabad', 'Mon - Sat: 10:00 AM - 01:00 PM & 05:00 PM - 08:00 PM', 'Primary Center (Director & Head)', true, true),
        ('center-2', 'KD Hospital (SG Highway)', 'Vaishnodevi Circle, SG Highway, Ahmedabad', 'Visiting Consultant / By Appointment', 'Visiting Consultant', true, false),
        ('center-3', 'Prathana Hospital', 'Near Helmet Cross Roads, Memnagar, Ahmedabad', 'Visiting Consultant / By Appointment', 'Visiting Consultant', true, false)
      ON CONFLICT (id) DO NOTHING;

      INSERT INTO public.ent_concerns (id, title, category, description, common_symptoms, is_active, is_default, sort_order)
      VALUES
        ('concern-1', 'Sinusitis, Nasal Polyps & Blockage (FESS / Septoplasty)', 'Nose & Sinus (Rhinology)', 'Deviated Nasal Septum (DNS), Functional Endoscopic Sinus Surgery (FESS), Turbinate Reduction, Polyp Clearance.', 'Nasal Blockage, Facial Heaviness, Headache, Post-Nasal Drip, Loss of Smell', true, true, 1),
        ('concern-2', 'Ear Discharge, Hearing Loss & Eardrum Perforation (Tympanoplasty)', 'Ear & Hearing (Otology)', 'CSOM, Cholesteatoma, Mastoidectomy, Stapedotomy, Micro-ear surgery, Eardrum Repair.', 'Ear Discharge, Ear Ache, Decreased Hearing, Eardrum Hole, Tinnitus (Ringing Ear)', true, false, 2),
        ('concern-3', 'Vertigo, Dizziness & Balance Disorders', 'Vertigo & Balance', 'BPPV, Vestibular Neuritis, Meniere''s Disease, Canalith Repositioning Maneuvers.', 'Spinning Sensation, Imbalance while walking, Nausea, Sudden Vertigo Attacks', true, false, 3),
        ('concern-4', 'Throat, Tonsils, Adenoids & Voice Issues (Microlaryngeal Surgery)', 'Throat & Voice (Laryngology)', 'Recurrent Tonsillitis, Adenoid Hypertrophy, Vocal Cord Polyps, Hoarseness, Coblation Tonsillectomy.', 'Frequent Sore Throat, Difficulty Swallowing, Hoarse Voice, Snoring in Children', true, false, 4),
        ('concern-5', 'Pediatric ENT Checkup & Airway Obstruction', 'Pediatric ENT', 'Childhood snoring, mouth breathing, recurrent ear infections, foreign body removal, tongue tie release.', 'Mouth Breathing during sleep, Night Snoring, Restless Sleep, Ear Infections', true, false, 5),
        ('concern-6', 'Head & Neck Swellings, Thyroid & Skull Base Consultation', 'Head & Neck / Skull Base', 'Salivary Gland (Parotid/Submandibular) tumors, Thyroid nodules, CSF Rhinorrhea leak repair, Skull base lesions.', 'Neck Lumps, Salivary Gland Swelling, Clear fluid drainage from nose, Neck Pain', true, false, 6),
        ('concern-7', 'Snoring & Obstructive Sleep Apnea (OSA)', 'Sleep & Airway', 'Sleep endoscopy, palate & pharyngeal airway surgery, surgical management of obstructive sleep apnea.', 'Loud Snoring, Choking at night, Excessive daytime sleepiness, Morning headaches', true, false, 7),
        ('concern-8', 'Second Surgical Opinion / General ENT Consultation', 'General ENT & Second Opinion', 'Comprehensive ENT evaluation, review of previous CT/MRI scans, unbiased surgical opinion & guidance.', 'Previous diagnosis review, non-resolving ENT symptoms, pre-surgery evaluation', true, false, 8)
      ON CONFLICT (id) DO NOTHING;
    `)
    tablesInitialized = true
  } catch (err) {
    console.error('Auto-migration: Error ensuring PostgreSQL tables', err)
  }
}
