-- ============================================
-- Zhiyy Portfolio — Supabase Schema
-- Jalankan di Supabase SQL Editor
-- ============================================

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  long_description TEXT,
  tech_stack    TEXT[] DEFAULT '{}',
  image_url     TEXT,
  live_url      TEXT,
  github_url    TEXT,
  featured      BOOLEAN DEFAULT false,
  order_index   INTEGER DEFAULT 0,
  category      TEXT DEFAULT 'Web'
);

-- Skills table
CREATE TABLE IF NOT EXISTS public.skills (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,
  level       INTEGER DEFAULT 80 CHECK (level >= 0 AND level <= 100),
  icon        TEXT,
  order_index INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Public read access (semua orang bisa baca)
CREATE POLICY "Public read projects"
  ON public.projects FOR SELECT
  USING (true);

CREATE POLICY "Public read skills"
  ON public.skills FOR SELECT
  USING (true);

-- ============================================
-- Seed data contoh (opsional)
-- ============================================

INSERT INTO public.skills (name, category, level, order_index) VALUES
  ('Next.js',     'Frontend', 90, 1),
  ('React',       'Frontend', 90, 2),
  ('TypeScript',  'Frontend', 85, 3),
  ('Tailwind CSS','Frontend', 90, 4),
  ('Node.js',     'Backend',  80, 5),
  ('Supabase',    'Backend',  85, 6),
  ('PostgreSQL',  'Backend',  75, 7),
  ('REST API',    'Backend',  85, 8),
  ('Git',         'Tools',    85, 9),
  ('Vercel',      'Tools',    90, 10),
  ('Figma',       'Tools',    70, 11),
  ('Docker',      'Tools',    60, 12);

INSERT INTO public.projects (title, description, long_description, tech_stack, featured, order_index, category) VALUES
  (
    'Zhiyy Portfolio',
    'Website portfolio personal dengan dark modern theme, Next.js App Router, dan Supabase sebagai CMS.',
    'Portfolio ini dibangun dengan Next.js 15, TypeScript, Tailwind CSS, dan Supabase. Menampilkan daftar project, skills, dan form kontak.',
    ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    true,
    1,
    'Web'
  );
