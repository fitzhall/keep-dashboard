-- First, check if the table already exists
SELECT EXISTS (
  SELECT 1 
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'training_videos'
) as table_exists;

-- Create training_videos table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.training_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  video_type TEXT CHECK (video_type IN ('youtube', 'vimeo', 'loom', 'other')),
  duration_minutes INTEGER,
  category TEXT NOT NULL CHECK (category IN ('cle', 'keep')),
  module_id TEXT,
  course_id INTEGER,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes only if they don't exist
CREATE INDEX IF NOT EXISTS idx_training_videos_category ON public.training_videos(category);
CREATE INDEX IF NOT EXISTS idx_training_videos_module ON public.training_videos(module_id);
CREATE INDEX IF NOT EXISTS idx_training_videos_course ON public.training_videos(course_id);
CREATE INDEX IF NOT EXISTS idx_training_videos_active ON public.training_videos(is_active);

-- Enable RLS (safe operation, won't error if already enabled)
ALTER TABLE public.training_videos ENABLE ROW LEVEL SECURITY;

-- Create policies only if table was just created
DO $$
BEGIN
  -- Check if any policies exist for this table
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'training_videos'
  ) THEN
    -- Create new policies
    CREATE POLICY "training_videos_select" ON public.training_videos
      FOR SELECT TO authenticated
      USING (is_active = true);

    CREATE POLICY "training_videos_admin_all" ON public.training_videos
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.user_profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END;
$$;

-- Create or replace the update function (safe operation)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_training_videos_updated_at') THEN
    CREATE TRIGGER update_training_videos_updated_at 
    BEFORE UPDATE ON public.training_videos
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END;
$$;

-- Grant permissions (safe operation)
GRANT ALL ON public.training_videos TO authenticated;
GRANT ALL ON public.training_videos TO service_role;

-- Final check
SELECT 
  'Table created successfully' as status,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'training_videos';