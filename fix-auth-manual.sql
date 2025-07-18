-- MANUAL AUTH FIX - For when auth.uid() returns null

-- 1. First, let's see all users in the auth.users table
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC
LIMIT 10;

-- 2. Check all existing user profiles
SELECT id, auth0_id, email, role, firm 
FROM public.user_profiles;

-- 3. If you see your email in auth.users but not in user_profiles, 
-- manually create your profile using your auth.users ID
-- Replace 'YOUR_AUTH_USER_ID' with the actual ID from step 1
-- Replace 'YOUR_EMAIL' with your actual email
/*
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
  'YOUR_AUTH_USER_ID'::uuid,  -- Replace with your actual auth user ID
  'YOUR_AUTH_USER_ID',         -- Same ID but as text for auth0_id
  'YOUR_EMAIL',                -- Replace with your email
  'Admin User',
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
*/

-- 4. Alternative: If you're logged into the dashboard, check browser console
-- Run this in your browser console while on the dashboard:
-- const { data: { user } } = await supabase.auth.getUser()
-- console.log('User ID:', user?.id)
-- console.log('Email:', user?.email)

-- 5. Once you have your user ID, you can manually fix RLS policies
-- This grants you access to training_progress
/*
INSERT INTO public.user_profiles (
  id,
  auth0_id, 
  email,
  name,
  role,
  firm
)
VALUES (
  'YOUR_USER_ID_HERE'::uuid,
  'YOUR_USER_ID_HERE',
  'your-email@example.com',
  'Admin User',
  'admin',
  'KEEP Protocol Admin'
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';
*/