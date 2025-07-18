-- Create workshops/events table for Phase 4

-- 1. Create workshops table
CREATE TABLE IF NOT EXISTS public.workshops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  workshop_type VARCHAR(100) NOT NULL, -- 'webinar', 'in-person', 'hybrid'
  category VARCHAR(100) NOT NULL, -- 'estate-planning', 'bitcoin-basics', 'advanced-custody', etc.
  instructor_name VARCHAR(255),
  instructor_bio TEXT,
  start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  duration_minutes INTEGER GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (end_datetime - start_datetime))/60
  ) STORED,
  max_attendees INTEGER DEFAULT 100,
  current_attendees INTEGER DEFAULT 0,
  location TEXT, -- Physical location or "Online"
  meeting_url TEXT, -- Zoom/Teams/etc link for online workshops
  meeting_password VARCHAR(50),
  price DECIMAL(10,2) DEFAULT 0.00,
  cle_credits DECIMAL(3,1) DEFAULT 0.0,
  materials_url TEXT, -- Link to workshop materials
  recording_url TEXT, -- Link to recording (added after workshop)
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  cancellation_deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Create workshop registrations table
CREATE TABLE IF NOT EXISTS public.workshop_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workshop_id UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  registration_status VARCHAR(50) DEFAULT 'registered', -- 'registered', 'attended', 'no-show', 'cancelled'
  payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'refunded', 'free'
  payment_amount DECIMAL(10,2) DEFAULT 0.00,
  payment_date TIMESTAMP WITH TIME ZONE,
  attendance_confirmed BOOLEAN DEFAULT false,
  attendance_duration_minutes INTEGER,
  cle_credits_earned DECIMAL(3,1) DEFAULT 0.0,
  notes TEXT,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  
  -- Prevent duplicate registrations
  UNIQUE(workshop_id, user_id)
);

-- 3. Create workshop reminders table
CREATE TABLE IF NOT EXISTS public.workshop_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workshop_id UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_type VARCHAR(50) NOT NULL, -- 'email', 'notification'
  days_before INTEGER NOT NULL, -- How many days before workshop to send reminder
  sent_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(workshop_id, user_id, days_before)
);

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS idx_workshops_start_datetime ON public.workshops(start_datetime);
CREATE INDEX IF NOT EXISTS idx_workshops_category ON public.workshops(category);
CREATE INDEX IF NOT EXISTS idx_workshops_active ON public.workshops(is_active);
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_user ON public.workshop_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_workshop ON public.workshop_registrations(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_status ON public.workshop_registrations(registration_status);

-- 5. Enable RLS
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_reminders ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for workshops
-- Anyone can view active workshops
CREATE POLICY "Anyone can view active workshops" 
ON public.workshops 
FOR SELECT 
USING (is_active = true);

-- Authenticated users can manage workshops (for admin)
CREATE POLICY "Authenticated users can manage workshops" 
ON public.workshops 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- 7. Create RLS policies for registrations
-- Users can view their own registrations
CREATE POLICY "Users can view their own registrations" 
ON public.workshop_registrations 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Users can create their own registrations
CREATE POLICY "Users can register for workshops" 
ON public.workshop_registrations 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own registrations (cancel)
CREATE POLICY "Users can update their own registrations" 
ON public.workshop_registrations 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 8. Create RLS policies for reminders
-- Users can manage their own reminders
CREATE POLICY "Users can manage their own reminders" 
ON public.workshop_reminders 
FOR ALL 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 9. Create function to update workshop attendee count
CREATE OR REPLACE FUNCTION update_workshop_attendee_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.workshops 
    SET current_attendees = current_attendees + 1
    WHERE id = NEW.workshop_id;
  ELSIF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND NEW.registration_status = 'cancelled' AND OLD.registration_status != 'cancelled') THEN
    UPDATE public.workshops 
    SET current_attendees = GREATEST(current_attendees - 1, 0)
    WHERE id = COALESCE(NEW.workshop_id, OLD.workshop_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Create trigger for attendee count
CREATE TRIGGER update_workshop_attendees
AFTER INSERT OR UPDATE OR DELETE ON public.workshop_registrations
FOR EACH ROW
EXECUTE FUNCTION update_workshop_attendee_count();

-- 11. Insert sample workshops
INSERT INTO public.workshops (
  title, description, workshop_type, category, instructor_name,
  start_datetime, end_datetime, location, meeting_url,
  max_attendees, price, cle_credits, is_featured
) VALUES
(
  'Bitcoin Estate Planning Fundamentals',
  'Learn the basics of incorporating Bitcoin into estate planning documents. This workshop covers key concepts, legal considerations, and best practices.',
  'webinar',
  'estate-planning',
  'Sarah Johnson, JD',
  TIMEZONE('America/New_York', NOW() + INTERVAL '7 days')::timestamptz,
  TIMEZONE('America/New_York', NOW() + INTERVAL '7 days' + INTERVAL '90 minutes')::timestamptz,
  'Online',
  'https://zoom.us/j/123456789',
  50,
  149.00,
  1.5,
  true
),
(
  'Multi-Signature Wallet Setup Workshop',
  'Hands-on workshop for setting up secure multi-signature Bitcoin wallets for inheritance planning. Bring your laptop!',
  'hybrid',
  'advanced-custody',
  'Michael Chen, Bitcoin Security Expert',
  TIMEZONE('America/New_York', NOW() + INTERVAL '14 days')::timestamptz,
  TIMEZONE('America/New_York', NOW() + INTERVAL '14 days' + INTERVAL '120 minutes')::timestamptz,
  'New York, NY - Financial District',
  'https://zoom.us/j/987654321',
  30,
  299.00,
  2.0,
  true
),
(
  'KEEP Protocol Implementation Bootcamp',
  'Intensive 3-hour workshop on implementing the complete KEEP Protocol in your practice. Includes templates and checklists.',
  'webinar',
  'estate-planning',
  'KEEP Protocol Team',
  TIMEZONE('America/New_York', NOW() + INTERVAL '21 days')::timestamptz,
  TIMEZONE('America/New_York', NOW() + INTERVAL '21 days' + INTERVAL '180 minutes')::timestamptz,
  'Online',
  'https://teams.microsoft.com/meet/keep-bootcamp',
  100,
  399.00,
  3.0,
  false
),
(
  'Bitcoin Probate Case Studies',
  'Review real-world Bitcoin probate cases and learn from practical examples. Interactive Q&A session included.',
  'webinar',
  'estate-planning',
  'Jennifer Martinez, Estate Attorney',
  TIMEZONE('America/New_York', NOW() + INTERVAL '30 days')::timestamptz,
  TIMEZONE('America/New_York', NOW() + INTERVAL '30 days' + INTERVAL '60 minutes')::timestamptz,
  'Online',
  'https://zoom.us/j/555666777',
  75,
  99.00,
  1.0,
  false
);

-- 12. Create view for upcoming workshops
CREATE OR REPLACE VIEW public.upcoming_workshops AS
SELECT 
  w.*,
  (w.max_attendees - w.current_attendees) as available_seats,
  CASE 
    WHEN w.current_attendees >= w.max_attendees THEN 'full'
    WHEN w.current_attendees >= (w.max_attendees * 0.8) THEN 'filling'
    ELSE 'available'
  END as availability_status
FROM public.workshops w
WHERE w.is_active = true
  AND w.start_datetime > NOW()
ORDER BY w.start_datetime ASC;

-- 13. Grant permissions
GRANT SELECT ON public.upcoming_workshops TO authenticated;

-- 14. Verify setup
SELECT 
  'Workshops created' as status,
  COUNT(*) as count 
FROM public.workshops;