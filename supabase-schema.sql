-- =========================================================================
-- DR. VAIDIK CHAUHAN, MS (ENT) - SUPABASE POSTGRESQL DATABASE SCHEMA
-- Copy and paste this whole script into your Supabase SQL Editor and click RUN
-- =========================================================================

-- 1. Create Appointments Table (Integer Primary Key)
CREATE TABLE IF NOT EXISTS public.appointments (
  id BIGSERIAL PRIMARY KEY,
  name CHARACTER VARYING NOT NULL,
  phone CHARACTER VARYING NOT NULL,
  location CHARACTER VARYING,
  reason CHARACTER VARYING,
  date CHARACTER VARYING,
  status CHARACTER VARYING,
  notes CHARACTER VARYING,
  created_at TIMESTAMPTZ
);

-- 2. Create Visitors Tracking Table (Integer Primary Key)
CREATE TABLE IF NOT EXISTS public.visitors (
  id INTEGER PRIMARY KEY,
  total INTEGER,
  today_count INTEGER,
  last_date DATE,
  updated_at TIMESTAMPTZ
);

-- 2.1 Create Visitor Logs Table (Integer Primary Key, No Default Values)
CREATE TABLE IF NOT EXISTS public.visitor_logs (
  id BIGSERIAL PRIMARY KEY,
  ip CHARACTER VARYING NOT NULL,
  user_agent CHARACTER VARYING,
  path CHARACTER VARYING,
  visited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
);

-- 3. Create Preferred Hospital Centers Master Table (Integer Primary Key)
CREATE TABLE IF NOT EXISTS public.hospital_centers (
  id BIGSERIAL PRIMARY KEY,
  name CHARACTER VARYING NOT NULL,
  area CHARACTER VARYING NOT NULL,
  timings CHARACTER VARYING,
  tag CHARACTER VARYING,
  is_active BOOLEAN,
  is_default BOOLEAN,
  created_at TIMESTAMPTZ
);

-- 4. Create ENT Concerns / Clinical Conditions Master Table (Integer Primary Key)
CREATE TABLE IF NOT EXISTS public.ent_concerns (
  id BIGSERIAL PRIMARY KEY,
  title CHARACTER VARYING NOT NULL,
  category CHARACTER VARYING NOT NULL,
  description CHARACTER VARYING,
  common_symptoms CHARACTER VARYING,
  is_active BOOLEAN,
  is_default BOOLEAN,
  sort_order INTEGER,
  created_at TIMESTAMPTZ
);

-- 4.1 Create Admin Users Master Table (Integer Primary Key)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id BIGSERIAL PRIMARY KEY,
  username CHARACTER VARYING NOT NULL UNIQUE,
  password CHARACTER VARYING NOT NULL,
  name CHARACTER VARYING,
  role CHARACTER VARYING,
  updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
);

-- 5. Insert Initial Seed Records (if not exists)
INSERT INTO public.visitors (id, total, today_count, last_date)
VALUES (1, 0, 0, CURRENT_DATE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.admin_users (id, username, password, name, role, created_at, updated_at)
VALUES 
  (1, 'admin', 'drvaidik2026', 'Dr. Vaidik Chauhan', 'super_admin', NOW(), NOW()),
  (2, 'staff', 'staff123', 'Clinic Reception Staff', 'staff', NOW(), NOW())
ON CONFLICT (username) DO NOTHING;

INSERT INTO public.hospital_centers (id, name, area, timings, tag, is_active, is_default)
VALUES 
  (1, 'Atulya Superspeciality Hospital (Bhuyangdev)', '2nd Floor, Elite Magnum, Bhuyangdev Cross Road, Sola Road, Ghatlodiya, Ahmedabad', 'Mon - Sat: 10:00 AM - 01:00 PM & 05:00 PM - 08:00 PM', 'Primary Center (Director & Head)', true, true),
  (2, 'KD Hospital (SG Highway)', 'Vaishnodevi Circle, SG Highway, Ahmedabad', 'Visiting Consultant / By Appointment', 'Visiting Consultant', true, false),
  (3, 'Prathana Hospital', 'Near Helmet Cross Roads, Memnagar, Ahmedabad', 'Visiting Consultant / By Appointment', 'Visiting Consultant', true, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.ent_concerns (id, title, category, description, common_symptoms, is_active, is_default, sort_order)
VALUES
  (1, 'Sinusitis, Nasal Polyps & Blockage (FESS / Septoplasty)', 'Nose & Sinus (Rhinology)', 'Deviated Nasal Septum (DNS), Functional Endoscopic Sinus Surgery (FESS), Turbinate Reduction, Polyp Clearance.', 'Nasal Blockage, Facial Heaviness, Headache, Post-Nasal Drip, Loss of Smell', true, true, 1),
  (2, 'Ear Discharge, Hearing Loss & Eardrum Perforation (Tympanoplasty)', 'Ear & Hearing (Otology)', 'CSOM, Cholesteatoma, Mastoidectomy, Stapedotomy, Micro-ear surgery, Eardrum Repair.', 'Ear Discharge, Ear Ache, Decreased Hearing, Eardrum Hole, Tinnitus (Ringing Ear)', true, false, 2),
  (3, 'Vertigo, Dizziness & Balance Disorders', 'Vertigo & Balance', 'BPPV, Vestibular Neuritis, Meniere''s Disease, Canalith Repositioning Maneuvers.', 'Spinning Sensation, Imbalance while walking, Nausea, Sudden Vertigo Attacks', true, false, 3),
  (4, 'Throat, Tonsils, Adenoids & Voice Issues (Microlaryngeal Surgery)', 'Throat & Voice (Laryngology)', 'Recurrent Tonsillitis, Adenoid Hypertrophy, Vocal Cord Polyps, Hoarseness, Coblation Tonsillectomy.', 'Frequent Sore Throat, Difficulty Swallowing, Hoarse Voice, Snoring in Children', true, false, 4),
  (5, 'Pediatric ENT Checkup & Airway Obstruction', 'Pediatric ENT', 'Childhood snoring, mouth breathing, recurrent ear infections, foreign body removal, tongue tie release.', 'Mouth Breathing during sleep, Night Snoring, Restless Sleep, Ear Infections', true, false, 5),
  (6, 'Head & Neck Swellings, Thyroid & Skull Base Consultation', 'Head & Neck / Skull Base', 'Salivary Gland (Parotid/Submandibular) tumors, Thyroid nodules, CSF Rhinorrhea leak repair, Skull base lesions.', 'Neck Lumps, Salivary Gland Swelling, Clear fluid drainage from nose, Neck Pain', true, false, 6),
  (7, 'Snoring & Obstructive Sleep Apnea (OSA)', 'Sleep & Airway', 'Sleep endoscopy, palate & pharyngeal airway surgery, surgical management of obstructive sleep apnea.', 'Loud Snoring, Choking at night, Excessive daytime sleepiness, Morning headaches', true, false, 7),
  (8, 'Second Surgical Opinion / General ENT Consultation', 'General ENT & Second Opinion', 'Comprehensive ENT evaluation, review of previous CT/MRI scans, unbiased surgical opinion & guidance.', 'Previous diagnosis review, non-resolving ENT symptoms, pre-surgery evaluation', true, false, 8)
ON CONFLICT (id) DO NOTHING;

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ent_concerns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 7. Create Public Policies (Allow read/write from website API)
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

CREATE POLICY "Allow public all on visitor_logs"
  ON public.visitor_logs FOR ALL
  USING (true);

CREATE POLICY "Allow public all on hospital_centers"
  ON public.hospital_centers FOR ALL
  USING (true);

CREATE POLICY "Allow public all on ent_concerns"
  ON public.ent_concerns FOR ALL
  USING (true);

CREATE POLICY "Allow public all on admin_users"
  ON public.admin_users FOR ALL
  USING (true);

