-- SECTION 1: Check your current user
SELECT 
  auth.uid() as your_auth_id,
  (SELECT email FROM auth.users WHERE id = auth.uid()) as your_email;

-- SECTION 2: Check if you have a user profile (with proper type casting)
SELECT * FROM public.user_profiles 
WHERE id = auth.uid() 
   OR auth0_id = auth.uid()::text
   OR email = (SELECT email FROM auth.users WHERE id = auth.uid());

-- SECTION 3: Create or update your user profile
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
  auth.uid()::text as auth0_id,  -- Cast to text
  email,
  COALESCE(raw_user_meta_data->>'name', email) as name,
  'admin' as role,
  'KEEP Protocol Admin' as firm,
  NOW() as created_at,
  NOW() as updated_at
FROM auth.users
WHERE id = auth.uid()
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  auth0_id = auth.uid()::text,  -- Update auth0_id to match
  updated_at = NOW();

-- SECTION 4: Verify your profile now has admin role
SELECT id, email, role, auth0_id FROM public.user_profiles WHERE id = auth.uid();

-- SECTION 5: Enable RLS and create simple policies for training_progress
-- First, let's just make training_progress work without complex policies
ALTER TABLE public.training_progress ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows authenticated users to manage their own progress
CREATE POLICY "Users can manage their own progress" 
ON public.training_progress 
FOR ALL 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- If the above policy already exists, drop and recreate it
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'training_progress' 
    AND policyname = 'Users can manage their own progress'
  ) THEN
    DROP POLICY "Users can manage their own progress" ON public.training_progress;
  END IF;
END $$;

CREATE POLICY "Users can manage their own progress" 
ON public.training_progress 
FOR ALL 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- SECTION 6: Test if everything works
SELECT 
  'Your Auth ID' as info,
  auth.uid()::text as value
UNION ALL
SELECT 
  'Your Profile ID' as info,
  id::text as value
FROM public.user_profiles 
WHERE id = auth.uid()
UNION ALL
SELECT 
  'Your Role' as info,
  role as value
FROM public.user_profiles 
WHERE id = auth.uid();