-- STEP-BY-STEP FIX FOR AUTH TYPE MISMATCH
-- Run each section separately and check results

-- STEP 1: Check current user and data types
SELECT 
  auth.uid() as auth_uid,
  auth.uid()::text as auth_uid_as_text,
  pg_typeof(auth.uid()) as auth_uid_type,
  pg_typeof(auth.uid()::text) as auth_uid_text_type;

-- STEP 2: Check if you already have a profile
SELECT 
  id,
  auth0_id,
  email,
  role,
  pg_typeof(auth0_id) as auth0_id_type
FROM public.user_profiles 
WHERE id = auth.uid() 
   OR auth0_id = auth.uid()::text;  -- Cast to text for comparison

-- STEP 3: Create or update your profile (SAFE - no destructive operations)
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
SELECT 
  auth.uid() as id,
  auth.uid()::text as auth0_id,  -- Cast UUID to text
  auth.email() as email,
  COALESCE(raw_user_meta_data->>'name', auth.email()) as name,
  'admin' as role,
  'KEEP Protocol Admin' as firm,
  NOW() as created_at,
  NOW() as updated_at
FROM auth.users
WHERE id = auth.uid()
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  auth0_id = auth.uid()::text,  -- Ensure auth0_id is properly cast
  firm = 'KEEP Protocol Admin',
  updated_at = NOW();

-- STEP 4: Verify the profile was created/updated
SELECT 
  id,
  auth0_id,
  email,
  role,
  firm
FROM public.user_profiles 
WHERE id = auth.uid();

-- STEP 5: Test training_progress insert (this should work now)
INSERT INTO public.training_progress (
  user_id,
  video_id,
  module_id,
  completed,
  completed_at,
  last_watched_at
)
VALUES (
  auth.uid(),  -- Use auth.uid() directly as user_id
  'test-video-' || gen_random_uuid()::text,
  'test-module',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (user_id, video_id) 
DO UPDATE SET 
  completed = true,
  completed_at = NOW(),
  last_watched_at = NOW();

-- STEP 6: Verify the test insert worked
SELECT COUNT(*) as test_records 
FROM public.training_progress 
WHERE user_id = auth.uid() 
  AND video_id LIKE 'test-video-%';

-- STEP 7: Clean up test data (optional)
DELETE FROM public.training_progress 
WHERE user_id = auth.uid() 
  AND video_id LIKE 'test-video-%';