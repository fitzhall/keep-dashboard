-- Setup RLS policies for training tables

-- 1. First check what we're working with
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('training_videos', 'training_progress');

-- 2. Enable RLS on both tables
ALTER TABLE public.training_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_progress ENABLE ROW LEVEL SECURITY;

-- 3. Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Anyone can view training videos" ON public.training_videos;
DROP POLICY IF EXISTS "Admins can manage training videos" ON public.training_videos;
DROP POLICY IF EXISTS "Users can manage their own progress" ON public.training_progress;
DROP POLICY IF EXISTS "Users can view their own progress" ON public.training_progress;

-- 4. Create policies for training_videos
-- Anyone can view active videos
CREATE POLICY "Anyone can view active training videos" 
ON public.training_videos 
FOR SELECT 
USING (is_active = true);

-- Authenticated users can manage videos (for admin panel)
CREATE POLICY "Authenticated users can manage training videos" 
ON public.training_videos 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. Create policies for training_progress
-- Users can view their own progress
CREATE POLICY "Users can view their own progress" 
ON public.training_progress 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Users can insert their own progress
CREATE POLICY "Users can insert their own progress" 
ON public.training_progress 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own progress
CREATE POLICY "Users can update their own progress" 
ON public.training_progress 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete their own progress
CREATE POLICY "Users can delete their own progress" 
ON public.training_progress 
FOR DELETE 
TO authenticated
USING (user_id = auth.uid());

-- 6. Verify policies were created
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('training_videos', 'training_progress')
ORDER BY tablename, policyname;

-- 7. Test: Try to insert a test progress record
INSERT INTO public.training_progress (
  user_id,
  video_id,
  module_id,
  completed,
  completed_at,
  last_watched_at
)
SELECT 
  '11d899dc-e4e3-4ff1-a915-934a4fcb56ee'::uuid,
  id,
  module_id,
  true,
  NOW(),
  NOW()
FROM public.training_videos
LIMIT 1
ON CONFLICT (user_id, video_id) 
DO UPDATE SET 
  completed = true,
  completed_at = NOW();

-- 8. Check if it worked
SELECT COUNT(*) as progress_records
FROM public.training_progress 
WHERE user_id = '11d899dc-e4e3-4ff1-a915-934a4fcb56ee'::uuid;