-- First, let's check the current constraints
SELECT 
  tc.constraint_name, 
  tc.constraint_type,
  tc.table_name
FROM information_schema.table_constraints tc
WHERE tc.table_name = 'training_progress';

-- Drop the foreign key constraint on user_id if needed
ALTER TABLE public.training_progress 
DROP CONSTRAINT IF EXISTS training_progress_user_id_fkey;

-- Now user_id can be any UUID without needing to exist in user_profiles
-- This allows using Supabase auth user IDs directly

-- Verify the change
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'training_progress'
ORDER BY ordinal_position;