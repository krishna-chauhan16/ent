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

      INSERT INTO public.visitors (id, total, today_count, last_date)
      VALUES (1, 1240, 18, CURRENT_DATE)
      ON CONFLICT (id) DO NOTHING;
    `)
    tablesInitialized = true
  } catch (err) {
    console.error('Auto-migration: Error ensuring PostgreSQL tables', err)
  }
}
