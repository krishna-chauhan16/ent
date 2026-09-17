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
    // 1. Appointments Table
    await p.query(`
      CREATE TABLE IF NOT EXISTS public.appointments (
        id SERIAL PRIMARY KEY,
        name CHARACTER VARYING NOT NULL,
        phone CHARACTER VARYING NOT NULL,
        location CHARACTER VARYING,
        reason CHARACTER VARYING,
        date CHARACTER VARYING,
        status CHARACTER VARYING,
        notes CHARACTER VARYING,
        created_at TIMESTAMPTZ
      );
      ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS location CHARACTER VARYING;
      ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS reason CHARACTER VARYING;
      ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS notes CHARACTER VARYING;
    `)

    // 2. Visitors Summary Table
    await p.query(`
      CREATE TABLE IF NOT EXISTS public.visitors (
        id INTEGER PRIMARY KEY,
        total INTEGER,
        today_count INTEGER,
        last_date DATE,
        updated_at TIMESTAMPTZ
      );
      INSERT INTO public.visitors (id, total, today_count, last_date)
      VALUES (1, 0, 0, CURRENT_DATE)
      ON CONFLICT (id) DO NOTHING;
    `)

    // 3. Visitor Logs Table
    await p.query(`
      CREATE TABLE IF NOT EXISTS public.visitor_logs (
        id SERIAL PRIMARY KEY,
        ip CHARACTER VARYING NOT NULL,
        user_agent CHARACTER VARYING,
        path CHARACTER VARYING,
        visited_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ
      );
    `)

    // 4. Hospital Centers Master Table
    await p.query(`
      CREATE TABLE IF NOT EXISTS public.hospital_centers (
        id SERIAL PRIMARY KEY,
        name CHARACTER VARYING NOT NULL,
        area CHARACTER VARYING NOT NULL,
        timings CHARACTER VARYING,
        tag CHARACTER VARYING,
        is_active BOOLEAN,
        is_default BOOLEAN,
        created_at TIMESTAMPTZ
      );
    `)

    // 5. ENT Concerns Master Table
    await p.query(`
      CREATE TABLE IF NOT EXISTS public.ent_concerns (
        id SERIAL PRIMARY KEY,
        title CHARACTER VARYING NOT NULL,
        category CHARACTER VARYING NOT NULL,
        description CHARACTER VARYING,
        common_symptoms CHARACTER VARYING,
        is_active BOOLEAN,
        is_default BOOLEAN,
        sort_order INTEGER,
        created_at TIMESTAMPTZ
      );
    `)

    // 6. Admin Users Master Table
    await p.query(`
      CREATE TABLE IF NOT EXISTS public.admin_users (
        id SERIAL PRIMARY KEY,
        username CHARACTER VARYING NOT NULL UNIQUE,
        password CHARACTER VARYING NOT NULL,
        name CHARACTER VARYING,
        role CHARACTER VARYING,
        updated_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ
      );
    `)

    tablesInitialized = true
  } catch (err) {
    console.error('Auto-migration: Error ensuring PostgreSQL tables', err)
  }
}
