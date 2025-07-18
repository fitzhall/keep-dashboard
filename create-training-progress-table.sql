-- Create training_progress table for tracking video and module completion
CREATE TABLE IF NOT EXISTS public.training_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.training_videos(id) ON DELETE CASCADE,
  module_id TEXT,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  last_watched_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Ensure unique progress per user per video
  UNIQUE(user_id, video_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_training_progress_user_id ON public.training_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_training_progress_video_id ON public.training_progress(video_id);
CREATE INDEX IF NOT EXISTS idx_training_progress_module_id ON public.training_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_training_progress_completed ON public.training_progress(completed);

-- Disable RLS for now (we'll enable it later with proper policies)
ALTER TABLE public.training_progress DISABLE ROW LEVEL SECURITY;

-- Create update trigger
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_training_progress_updated_at') THEN
    CREATE TRIGGER update_training_progress_updated_at 
    BEFORE UPDATE ON public.training_progress
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END;
$$;

-- Grant permissions
GRANT ALL ON public.training_progress TO authenticated;
GRANT ALL ON public.training_progress TO service_role;

-- Create a view to get module progress summary
CREATE OR REPLACE VIEW public.module_progress_summary AS
SELECT 
  tp.user_id,
  tp.module_id,
  COUNT(DISTINCT tp.video_id) as videos_completed,
  COUNT(DISTINCT tv.id) as total_videos,
  CASE 
    WHEN COUNT(DISTINCT tv.id) > 0 
    THEN (COUNT(DISTINCT tp.video_id)::float / COUNT(DISTINCT tv.id)::float * 100)::int
    ELSE 0 
  END as progress_percentage
FROM public.training_videos tv
LEFT JOIN public.training_progress tp 
  ON tv.id = tp.video_id 
  AND tp.completed = true
WHERE tv.is_active = true
GROUP BY tp.user_id, tp.module_id, tv.module_id
HAVING tv.module_id IS NOT NULL;

-- Grant access to the view
GRANT SELECT ON public.module_progress_summary TO authenticated;

-- Verify tables were created
SELECT 
  'training_progress table created' as status,
  EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'training_progress'
  ) as table_exists;