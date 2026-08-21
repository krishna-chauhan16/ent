-- =========================================================================
-- DR. VAIDIK CHAUHAN, MS (ENT) - SUPABASE POSTGRESQL DATABASE SCHEMA
-- Copy and paste this whole script into your Supabase SQL Editor and click RUN
-- =========================================================================

-- 1. Create Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Atulya Superspeciality Hospital (Bhuyangdev)',
  reason TEXT DEFAULT 'General ENT Consultation',
  date TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Visitors Tracking Table
CREATE TABLE IF NOT EXISTS public.visitors (
  id INTEGER PRIMARY KEY DEFAULT 1,
  total INTEGER DEFAULT 1240,
  today_count INTEGER DEFAULT 18,
  last_date DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Insert Initial Visitor Seed Record (if not exists)
INSERT INTO public.visitors (id, total, today_count, last_date)
VALUES (1, 1240, 18, CURRENT_DATE)
ON CONFLICT (id) DO NOTHING;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- 5. Create Public Policies (Allow read/write from website API)
CREATE POLICY "Allow public insert to appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public select on appointments"
  ON public.appointments FOR SELECT
  USING (true);

CREATE POLICY "Allow public update on appointments"
  ON public.appointments FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete on appointments"
  ON public.appointments FOR DELETE
  USING (true);

CREATE POLICY "Allow public all on visitors"
  ON public.visitors FOR ALL
  USING (true);
