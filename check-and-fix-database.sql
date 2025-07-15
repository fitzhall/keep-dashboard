-- First, let's see what tables already exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check which compliance tables are missing
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'compliance_categories') 
        THEN 'compliance_categories EXISTS' 
        ELSE 'compliance_categories MISSING' 
    END as compliance_categories,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ethics_checklist') 
        THEN 'ethics_checklist EXISTS' 
        ELSE 'ethics_checklist MISSING' 
    END as ethics_checklist,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'onboarding_tasks') 
        THEN 'onboarding_tasks EXISTS' 
        ELSE 'onboarding_tasks MISSING' 
    END as onboarding_tasks,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'training_videos') 
        THEN 'training_videos EXISTS' 
        ELSE 'training_videos MISSING' 
    END as training_videos;