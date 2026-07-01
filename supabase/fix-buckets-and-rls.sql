-- ============================================================
-- Jalankan di Supabase SQL Editor untuk fix semua bucket + RLS
-- ============================================================

-- 1. Pastikan site_settings ada RLS untuk authenticated write
-- (jika belum ada dari sebelumnya)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'site_settings' AND policyname = 'Auth users can update site_settings'
  ) THEN
    CREATE POLICY "Auth users can update site_settings"
      ON public.site_settings FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- 2. Pastikan project_images ada RLS untuk authenticated write
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'project_images' AND policyname = 'Auth users can manage project_images'
  ) THEN
    CREATE POLICY "Auth users can manage project_images"
      ON public.project_images FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- 3. Pastikan project_categories ada RLS untuk authenticated write
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'project_categories' AND policyname = 'Auth users can manage project_categories'
  ) THEN
    CREATE POLICY "Auth users can manage project_categories"
      ON public.project_categories FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- STORAGE BUCKETS
-- Buat via Dashboard: Storage → New Bucket
-- Nama: logos    → Public: ON
-- Nama: hero     → Public: ON  (jika belum ada)
-- Nama: music    → Public: ON  (jika belum ada)
-- Nama: project-images → Public: ON (jika belum ada)
-- ============================================================

-- Storage policies untuk bucket "logos"
-- (jalankan SETELAH buat bucket manual di dashboard)
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Policies untuk logos bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Public read logos'
  ) THEN
    CREATE POLICY "Public read logos"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'logos');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Auth upload logos'
  ) THEN
    CREATE POLICY "Auth upload logos"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'logos');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Auth delete logos'
  ) THEN
    CREATE POLICY "Auth delete logos"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'logos');
  END IF;
END $$;

-- Policies untuk hero bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero', 'hero', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Public read hero'
  ) THEN
    CREATE POLICY "Public read hero"
      ON storage.objects FOR SELECT USING (bucket_id = 'hero');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Auth upload hero'
  ) THEN
    CREATE POLICY "Auth upload hero"
      ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'hero');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Auth delete hero'
  ) THEN
    CREATE POLICY "Auth delete hero"
      ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'hero');
  END IF;
END $$;

-- Policies untuk project-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Public read project-images'
  ) THEN
    CREATE POLICY "Public read project-images"
      ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Auth upload project-images'
  ) THEN
    CREATE POLICY "Auth upload project-images"
      ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-images');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Auth delete project-images'
  ) THEN
    CREATE POLICY "Auth delete project-images"
      ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-images');
  END IF;
END $$;
