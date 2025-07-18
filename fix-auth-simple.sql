-- SIMPLE AUTH FIX - Run each query separately

-- 1. First, let's check your current auth user
SELECT auth.uid();

-- 2. Check data types
SELECT 
  auth.uid() as auth_uid,
  auth.uid()::text as auth_uid_as_text;

-- 3. Check if you have a profile
SELECT * FROM public.user_profiles WHERE id = auth.uid();

-- 4. Create or update your profile with proper type casting
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
  auth.uid(),
  auth.uid()::text,  -- This is the key fix - cast UUID to text
  (SELECT email FROM auth.users WHERE id = auth.uid()),
  (SELECT COALESCE(raw_user_meta_data->>'name', email) FROM auth.users WHERE id = auth.uid()),
  'admin',
  'KEEP Protocol Admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  auth0_id = auth.uid()::text,  -- Ensure auth0_id matches current auth uid as text
  firm = 'KEEP Protocol Admin',
  updated_at = NOW();

-- 5. Verify it worked
SELECT id, auth0_id, email, role FROM public.user_profiles WHERE id = auth.uid();