-- Check current RLS policies for training tables

-- 1. Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('training_videos', 'training_progress');

-- 2. Check existing policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('training_videos', 'training_progress');

-- 3. Test if you can insert progress as authenticated user
-- This will help verify if RLS is working
SELECT 
  'Can insert progress?' as test,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'training_progress' 
      AND (cmd = 'INSERT' OR cmd = 'ALL')
    ) THEN 'Yes - Policy exists'
    ELSE 'No - No insert policy'
  END as result;