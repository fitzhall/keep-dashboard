-- SAFE VERSION - Run each section and check results

-- SECTION 1: Check your current user
SELECT 
  auth.uid() as your_auth_id,
  (SELECT email FROM auth.users WHERE id = auth.uid()) as your_email;

-- SECTION 2: Check if you have a user profile
SELECT * FROM public.user_profiles 
WHERE id = auth.uid() 
   OR auth0_id = auth.uid() 
   OR email = (SELECT email FROM auth.users WHERE id = auth.uid());

-- SECTION 3: Create or update your user profile (SAFE - uses ON CONFLICT)
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
  auth.uid() as auth0_id,
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
  updated_at = NOW();

-- SECTION 4: Verify your profile now has admin role
SELECT id, email, role FROM public.user_profiles WHERE id = auth.uid();

-- SECTION 5: Check current policies (just to see what exists)
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('training_videos', 'training_progress');

-- SECTION 6: Only if you're comfortable, run the policy updates
-- This part has the DROP statements but immediately creates new ones
/*
-- Drop and recreate training_videos policies
DROP POLICY IF EXISTS "training_videos_select" ON public.training_videos;
DROP POLICY IF EXISTS "training_videos_admin_all" ON public.training_videos;

CREATE POLICY "Anyone can view active training videos" 
ON public.training_videos FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can manage training videos" 
ON public.training_videos FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Drop and recreate training_progress policies  
DROP POLICY IF EXISTS "training_progress_select" ON public.training_progress;
DROP POLICY IF EXISTS "training_progress_insert" ON public.training_progress;
DROP POLICY IF EXISTS "training_progress_update" ON public.training_progress;

CREATE POLICY "Users can manage their own progress" 
ON public.training_progress FOR ALL 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
*/