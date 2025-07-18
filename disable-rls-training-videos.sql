-- Temporarily disable RLS on training_videos table for testing
ALTER TABLE public.training_videos DISABLE ROW LEVEL SECURITY;

-- Verify it's disabled
SELECT 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'training_videos';

-- Now you should be able to add videos through the admin panel