-- Create only the MISSING compliance tables

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

-- Compliance reports (optional - only if you want audit report functionality)
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
CREATE INDEX IF NOT EXISTS idx_compliance_categories_user_id ON public.compliance_categories(user_id);
CREATE INDEX IF NOT EXISTS idx_ethics_checklist_user_id ON public.ethics_checklist(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_tasks_user_id ON public.onboarding_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_tasks_day ON public.onboarding_tasks(day_number);
CREATE INDEX IF NOT EXISTS idx_compliance_reports_user_id ON public.compliance_reports(user_id);

-- Enable RLS
ALTER TABLE public.compliance_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ethics_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_reports ENABLE ROW LEVEL SECURITY;

-- Create simple policies (allow all for now)
CREATE POLICY "compliance_categories_all" ON public.compliance_categories FOR ALL USING (true);
CREATE POLICY "ethics_checklist_all" ON public.ethics_checklist FOR ALL USING (true);
CREATE POLICY "onboarding_tasks_all" ON public.onboarding_tasks FOR ALL USING (true);
CREATE POLICY "compliance_reports_all" ON public.compliance_reports FOR ALL USING (true);

-- Create update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ethics_checklist_updated_at 
BEFORE UPDATE ON public.ethics_checklist
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_onboarding_tasks_updated_at 
BEFORE UPDATE ON public.onboarding_tasks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'All missing compliance tables created successfully!' as message;