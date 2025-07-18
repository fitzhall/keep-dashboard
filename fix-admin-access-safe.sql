-- Step 1: Check your current user ID
SELECT auth.uid() as your_user_id;

-- Step 2: Check if you have a profile
SELECT * FROM public.user_profiles WHERE id = auth.uid();

-- Step 3: Create or update your profile to have admin role
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

-- Step 4: Verify you now have admin role
SELECT id, email, role FROM public.user_profiles WHERE id = auth.uid();

-- That's it! Try adding a video now. If it still doesn't work, run this:
-- ALTER TABLE public.training_videos DISABLE ROW LEVEL SECURITY;