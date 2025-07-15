-- Add only the NEW compliance-related tables
-- This script checks if tables exist before creating them

-- Compliance categories tracking
CREATE TABLE IF NOT EXISTS public.compliance_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL,
  category_name TEXT NOT NULL,
  score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  items_completed INTEGER DEFAULT 0,
  items_total INTEGER DEFAULT 0,
  trend TEXT CHECK (trend IN ('up', 'down', 'stable')),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category_id)
);

-- Ethics checklist items
CREATE TABLE IF NOT EXISTS public.ethics_checklist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

-- Onboarding tasks tracking
CREATE TABLE IF NOT EXISTS public.onboarding_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 5),
  task_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  time_estimate TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

-- Compliance reports
CREATE TABLE IF NOT EXISTS public.compliance_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('monthly', 'quarterly', 'annual', 'custom')),
  report_format TEXT NOT NULL CHECK (report_format IN ('pdf', 'excel', 'word')),
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  file_name TEXT NOT NULL,
  file_size TEXT,
  sections JSONB,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training videos table
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
CREATE INDEX IF NOT EXISTS idx_compliance_categories_user_id ON public.compliance_categories(user_id);
CREATE INDEX IF NOT EXISTS idx_ethics_checklist_user_id ON public.ethics_checklist(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_tasks_user_id ON public.onboarding_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_tasks_day ON public.onboarding_tasks(day_number);
CREATE INDEX IF NOT EXISTS idx_compliance_reports_user_id ON public.compliance_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_compliance_reports_generated_at ON public.compliance_reports(generated_at DESC);
CREATE INDEX IF NOT EXISTS idx_training_videos_category ON public.training_videos(category);
CREATE INDEX IF NOT EXISTS idx_training_videos_module ON public.training_videos(module_id);
CREATE INDEX IF NOT EXISTS idx_training_videos_course ON public.training_videos(course_id);

-- Enable RLS
ALTER TABLE public.compliance_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ethics_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_videos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "Users can view own compliance categories" ON public.compliance_categories;
DROP POLICY IF EXISTS "Users can view own ethics checklist" ON public.ethics_checklist;
DROP POLICY IF EXISTS "Users can view own onboarding tasks" ON public.onboarding_tasks;
DROP POLICY IF EXISTS "Users can view own compliance reports" ON public.compliance_reports;
DROP POLICY IF EXISTS "training_videos_select" ON public.training_videos;
DROP POLICY IF EXISTS "training_videos_admin_all" ON public.training_videos;

-- Create permissive policies for development
CREATE POLICY "Users can view own compliance categories" ON public.compliance_categories
  FOR ALL USING (true);

CREATE POLICY "Users can view own ethics checklist" ON public.ethics_checklist
  FOR ALL USING (true);

CREATE POLICY "Users can view own onboarding tasks" ON public.onboarding_tasks
  FOR ALL USING (true);

CREATE POLICY "Users can view own compliance reports" ON public.compliance_reports
  FOR ALL USING (true);

CREATE POLICY "training_videos_select" ON public.training_videos
  FOR SELECT USING (is_active = true);

CREATE POLICY "training_videos_admin_all" ON public.training_videos
  FOR ALL USING (true);

-- Create or replace the update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers only if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_compliance_categories_updated_at') THEN
    CREATE TRIGGER update_compliance_categories_updated_at 
    BEFORE UPDATE ON public.compliance_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_ethics_checklist_updated_at') THEN
    CREATE TRIGGER update_ethics_checklist_updated_at 
    BEFORE UPDATE ON public.ethics_checklist
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_onboarding_tasks_updated_at') THEN
    CREATE TRIGGER update_onboarding_tasks_updated_at 
    BEFORE UPDATE ON public.onboarding_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_training_videos_updated_at') THEN
    CREATE TRIGGER update_training_videos_updated_at 
    BEFORE UPDATE ON public.training_videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;