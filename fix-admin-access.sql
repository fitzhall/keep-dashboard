-- First, check if you have a user profile
SELECT id, email, role FROM auth.users LIMIT 5;

-- Check your current user profiles
SELECT * FROM public.user_profiles;

-- Get your current user ID
SELECT auth.uid() as current_user_id;

-- Create or update your user profile to have admin role
-- Replace 'your-email@example.com' with your actual email
INSERT INTO public.user_profiles (id, auth0_id, email, name, role)
VALUES (
  auth.uid(), 
  auth.uid(), 
  (SELECT email FROM auth.users WHERE id = auth.uid()),
  'Admin User',
  'admin'
)
ON CONFLICT (id) 
DO UPDATE SET role = 'admin';

-- Verify the update
SELECT * FROM public.user_profiles WHERE id = auth.uid();

-- Alternative: Temporarily disable RLS for testing (NOT recommended for production)
-- ALTER TABLE public.training_videos DISABLE ROW LEVEL SECURITY;

-- Better alternative: Create a more permissive policy for testing
DROP POLICY IF EXISTS "training_videos_admin_all" ON public.training_videos;

CREATE POLICY "training_videos_admin_all" ON public.training_videos
  FOR ALL TO authenticated
  USING (true)  -- Allow all authenticated users for now
  WITH CHECK (true);

-- Check if policies are working
SELECT * FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'training_videos';