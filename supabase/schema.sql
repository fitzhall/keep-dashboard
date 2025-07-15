-- KEEP License Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table (extends Auth0 users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth0_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  firm TEXT,
  role TEXT DEFAULT 'attorney' CHECK (role IN ('admin', 'attorney', 'paralegal')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course progress tracking
CREATE TABLE IF NOT EXISTS public.course_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL,
  status TEXT DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'completed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed_date TIMESTAMPTZ,
  last_accessed TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- SOP phase progress tracking
CREATE TABLE IF NOT EXISTS public.sop_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  phase INTEGER NOT NULL CHECK (phase >= 1 AND phase <= 7),
  status TEXT DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'completed')),
  completed_date TIMESTAMPTZ,
  last_accessed TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, phase)
);

-- Template downloads tracking
CREATE TABLE IF NOT EXISTS public.template_downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL,
  template_name TEXT NOT NULL,
  downloaded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, template_id)
);

-- Activity log for all user actions
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('training', 'template', 'support', 'compliance', 'sop')),
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support tickets for hotline
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  ticket_number TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('technical', 'legal', 'process', 'compliance', 'client')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'answered', 'closed')),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  response TEXT,
  responded_by TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance tracking
CREATE TABLE IF NOT EXISTS public.compliance_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE UNIQUE,
  score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications system
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('template', 'training', 'system', 'support', 'compliance')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User invitations
CREATE TABLE IF NOT EXISTS public.user_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  role TEXT DEFAULT 'attorney' CHECK (role IN ('admin', 'attorney', 'paralegal')),
  invited_by UUID REFERENCES public.user_profiles(id),
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  accepted BOOLEAN DEFAULT FALSE,
  accepted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_course_progress_user_id ON public.course_progress(user_id);
CREATE INDEX idx_sop_progress_user_id ON public.sop_progress(user_id);
CREATE INDEX idx_template_downloads_user_id ON public.template_downloads(user_id);
CREATE INDEX idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX idx_activity_log_created_at ON public.activity_log(created_at DESC);
CREATE INDEX idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_user_invitations_email ON public.user_invitations(email);
CREATE INDEX idx_user_invitations_token ON public.user_invitations(token);

-- Row Level Security (RLS) Policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sop_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR ALL USING (auth.uid()::text = auth0_id);

CREATE POLICY "Users can view own course progress" ON public.course_progress
  FOR ALL USING (user_id IN (SELECT id FROM public.user_profiles WHERE auth0_id = auth.uid()::text));

CREATE POLICY "Users can view own sop progress" ON public.sop_progress
  FOR ALL USING (user_id IN (SELECT id FROM public.user_profiles WHERE auth0_id = auth.uid()::text));

CREATE POLICY "Users can view own downloads" ON public.template_downloads
  FOR ALL USING (user_id IN (SELECT id FROM public.user_profiles WHERE auth0_id = auth.uid()::text));

CREATE POLICY "Users can view own activity" ON public.activity_log
  FOR ALL USING (user_id IN (SELECT id FROM public.user_profiles WHERE auth0_id = auth.uid()::text));

CREATE POLICY "Users can view own tickets" ON public.support_tickets
  FOR ALL USING (user_id IN (SELECT id FROM public.user_profiles WHERE auth0_id = auth.uid()::text));

CREATE POLICY "Users can view own compliance" ON public.compliance_scores
  FOR ALL USING (user_id IN (SELECT id FROM public.user_profiles WHERE auth0_id = auth.uid()::text));

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR ALL USING (user_id IN (SELECT id FROM public.user_profiles WHERE auth0_id = auth.uid()::text));

CREATE POLICY "Admins can create invitations" ON public.user_invitations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE auth0_id = auth.uid()::text 
      AND role = 'admin'
    )
  );

CREATE POLICY "Anyone can view invitations by token" ON public.user_invitations
  FOR SELECT USING (true);

-- Function to generate ticket numbers
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
  ticket_num TEXT;
BEGIN
  SELECT 'HLP-' || LPAD(COALESCE(MAX(SUBSTRING(ticket_number FROM 5)::INTEGER), 0) + 1::TEXT, 4, '0')
  INTO ticket_num
  FROM public.support_tickets;
  RETURN ticket_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate ticket numbers
CREATE OR REPLACE FUNCTION set_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_number IS NULL THEN
    NEW.ticket_number := generate_ticket_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_ticket_number_trigger
  BEFORE INSERT ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION set_ticket_number();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_progress_updated_at BEFORE UPDATE ON public.course_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sop_progress_updated_at BEFORE UPDATE ON public.sop_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Training videos table
CREATE TABLE IF NOT EXISTS public.training_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  video_type TEXT CHECK (video_type IN ('youtube', 'vimeo', 'loom', 'other')),
  duration_minutes INTEGER,
  category TEXT NOT NULL CHECK (category IN ('cle', 'keep')),
  module_id TEXT, -- For KEEP modules (keep-101, sop-mastery, etc.)
  course_id INTEGER, -- For CLE courses (1-4)
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_training_videos_category ON public.training_videos(category);
CREATE INDEX idx_training_videos_module ON public.training_videos(module_id);
CREATE INDEX idx_training_videos_course ON public.training_videos(course_id);

-- RLS Policies for training videos
ALTER TABLE public.training_videos ENABLE ROW LEVEL SECURITY;

-- Everyone can view active videos
CREATE POLICY "training_videos_select" ON public.training_videos
  FOR SELECT USING (is_active = true);

-- Only admins can insert/update/delete videos
CREATE POLICY "training_videos_admin_all" ON public.training_videos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid()::uuid
      AND role = 'admin'
    )
  );

-- Trigger for training videos
CREATE TRIGGER update_training_videos_updated_at BEFORE UPDATE ON public.training_videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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

-- Create indexes
CREATE INDEX idx_compliance_categories_user_id ON public.compliance_categories(user_id);
CREATE INDEX idx_ethics_checklist_user_id ON public.ethics_checklist(user_id);
CREATE INDEX idx_onboarding_tasks_user_id ON public.onboarding_tasks(user_id);
CREATE INDEX idx_onboarding_tasks_day ON public.onboarding_tasks(day_number);
CREATE INDEX idx_compliance_reports_user_id ON public.compliance_reports(user_id);
CREATE INDEX idx_compliance_reports_generated_at ON public.compliance_reports(generated_at DESC);

-- RLS Policies
ALTER TABLE public.compliance_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ethics_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_reports ENABLE ROW LEVEL SECURITY;

-- Users can only access their own compliance data
-- For development with mock auth, we're using more permissive policies
CREATE POLICY "Users can view own compliance categories" ON public.compliance_categories
  FOR ALL USING (true);

CREATE POLICY "Users can view own ethics checklist" ON public.ethics_checklist
  FOR ALL USING (true);

CREATE POLICY "Users can view own onboarding tasks" ON public.onboarding_tasks
  FOR ALL USING (true);

CREATE POLICY "Users can view own compliance reports" ON public.compliance_reports
  FOR ALL USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_compliance_categories_updated_at BEFORE UPDATE ON public.compliance_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ethics_checklist_updated_at BEFORE UPDATE ON public.ethics_checklist
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_onboarding_tasks_updated_at BEFORE UPDATE ON public.onboarding_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();