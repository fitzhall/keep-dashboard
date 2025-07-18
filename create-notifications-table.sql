-- Create notifications table and fix the error

-- 1. Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type VARCHAR(50) DEFAULT 'info', -- template, training, system, support, compliance
  is_read BOOLEAN DEFAULT false,
  action_url VARCHAR(255), -- Optional link to navigate to (matches the code)
  metadata JSONB, -- Optional additional data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- 3. Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Only system/admin can insert notifications (for now)
-- In the future, you might want to create a service role for this
CREATE POLICY "Authenticated users can create notifications" 
ON public.notifications 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications" 
ON public.notifications 
FOR DELETE 
TO authenticated
USING (user_id = auth.uid());

-- 5. Insert sample notifications
INSERT INTO public.notifications (user_id, title, message, type, action_url) 
SELECT 
  '11d899dc-e4e3-4ff1-a915-934a4fcb56ee'::uuid,
  'Welcome to KEEP Protocol!',
  'Thank you for joining. Check out our training videos to get started.',
  'system',
  '/training'
WHERE EXISTS (
  SELECT 1 FROM public.user_profiles 
  WHERE id = '11d899dc-e4e3-4ff1-a915-934a4fcb56ee'::uuid
);

INSERT INTO public.notifications (user_id, title, message, type, action_url) 
SELECT 
  '11d899dc-e4e3-4ff1-a915-934a4fcb56ee'::uuid,
  'New Templates Available',
  'We''ve added new Bitcoin estate planning templates. Download them from the template library.',
  'template',
  '/templates'
WHERE EXISTS (
  SELECT 1 FROM public.user_profiles 
  WHERE id = '11d899dc-e4e3-4ff1-a915-934a4fcb56ee'::uuid
);

-- 6. Verify the table was created
SELECT 
  'Notifications table created' as status,
  COUNT(*) as notification_count
FROM public.notifications
WHERE user_id = '11d899dc-e4e3-4ff1-a915-934a4fcb56ee'::uuid;