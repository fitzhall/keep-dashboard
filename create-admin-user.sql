-- CREATE ADMIN USER IN SUPABASE
-- Run this entire script in Supabase SQL Editor

-- Step 1: Create your admin profile
INSERT INTO public.user_profiles (
  id,
  auth0_id, 
  email,
  name,
  role,
  firm,
  created_at,
  updated_at
)
VALUES (
  '11d899dc-e4e3-4ff1-a915-934a4fcb56ee'::uuid,
  '11d899dc-e4e3-4ff1-a915-934a4fcb56ee',
  'fitzhall.fhc@gmail.com',
  'Fitzhall',
  'admin',
  'KEEP Protocol Admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  firm = 'KEEP Protocol Admin',
  updated_at = NOW();

-- Step 2: Verify it worked
SELECT * FROM public.user_profiles WHERE id = '11d899dc-e4e3-4ff1-a915-934a4fcb56ee'::uuid;

-- Step 3: Check the video_id column type
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'training_progress' 
  AND column_name = 'video_id';

-- Step 4: Get an actual video ID from your training_videos table
SELECT id, title FROM public.training_videos LIMIT 1;

-- Step 5: If you have videos, test with a real video ID
-- (Run this only after checking step 4 results)
/*
INSERT INTO public.training_progress (
  user_id,
  video_id,
  module_id,
  completed,
  completed_at,
  last_watched_at
)
VALUES (
  '11d899dc-e4e3-4ff1-a915-934a4fcb56ee'::uuid,
  'REPLACE_WITH_ACTUAL_VIDEO_ID'::uuid,  -- Use a real video ID from step 4
  'test-module',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (user_id, video_id) 
DO UPDATE SET 
  completed = true,
  completed_at = NOW();
*/

-- Step 6: Show your final profile
SELECT 
  'Your admin profile is ready!' as message,
  id,
  email,
  role,
  firm
FROM public.user_profiles 
WHERE id = '11d899dc-e4e3-4ff1-a915-934a4fcb56ee'::uuid;