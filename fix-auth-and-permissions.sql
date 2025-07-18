-- STEP 1: Check current auth user
SELECT 
  id as auth_user_id,
  email,
  created_at
FROM auth.users
WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
LIMIT 1;

-- STEP 2: Create or update user profile with admin role
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

-- STEP 3: Verify user profile was created
SELECT * FROM public.user_profiles WHERE id = auth.uid();

-- STEP 4: Fix RLS policies for training_videos table
ALTER TABLE public.training_videos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "training_videos_select" ON public.training_videos;
DROP POLICY IF EXISTS "training_videos_admin_all" ON public.training_videos;

-- Create new, simpler policies
CREATE POLICY "Anyone can view active training videos" 
ON public.training_videos FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can manage training videos" 
ON public.training_videos FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- STEP 5: Fix RLS policies for training_progress table
ALTER TABLE public.training_progress ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "training_progress_select" ON public.training_progress;
DROP POLICY IF EXISTS "training_progress_insert" ON public.training_progress;
DROP POLICY IF EXISTS "training_progress_update" ON public.training_progress;

-- Create new policies
CREATE POLICY "Users can view their own progress" 
ON public.training_progress FOR SELECT 
TO authenticated
USING (
  user_id = auth.uid() OR 
  user_id IN (SELECT id FROM public.user_profiles WHERE auth0_id = auth.uid())
);

CREATE POLICY "Users can insert their own progress" 
ON public.training_progress FOR INSERT 
TO authenticated
WITH CHECK (
  user_id = auth.uid() OR 
  user_id IN (SELECT id FROM public.user_profiles WHERE auth0_id = auth.uid())
);

CREATE POLICY "Users can update their own progress" 
ON public.training_progress FOR UPDATE 
TO authenticated
USING (
  user_id = auth.uid() OR 
  user_id IN (SELECT id FROM public.user_profiles WHERE auth0_id = auth.uid())
)
WITH CHECK (
  user_id = auth.uid() OR 
  user_id IN (SELECT id FROM public.user_profiles WHERE auth0_id = auth.uid())
);

-- STEP 6: Grant necessary permissions
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.training_videos TO authenticated;
GRANT ALL ON public.training_progress TO authenticated;

-- STEP 7: Create helper function to get current user profile
CREATE OR REPLACE FUNCTION get_user_profile_id()
RETURNS UUID AS $$
BEGIN
  -- First try direct auth.uid()
  IF EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid()) THEN
    RETURN auth.uid();
  END IF;
  
  -- Then try auth0_id match
  RETURN (SELECT id FROM public.user_profiles WHERE auth0_id = auth.uid() LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 8: Test the setup
SELECT 
  'Auth User ID' as info,
  auth.uid() as value
UNION ALL
SELECT 
  'User Profile ID' as info,
  get_user_profile_id()::text as value
UNION ALL
SELECT 
  'Has Admin Role' as info,
  (SELECT role FROM public.user_profiles WHERE id = get_user_profile_id())::text as value;

-- STEP 9: Clean up any orphaned progress records
DELETE FROM public.training_progress 
WHERE user_id NOT IN (SELECT id FROM public.user_profiles)
AND user_id != auth.uid();