-- Quick setup script for compliance tables
-- Run this in your Supabase SQL editor

-- First, let's check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('compliance_categories', 'ethics_checklist', 'onboarding_tasks', 'training_videos');

-- If the above returns no rows, run the schema.sql file
-- The schema file is at: /keep/dashboard/supabase/schema.sql