-- Complete fix for compliance data initialization
-- This script will create a test user if none exists and populate all compliance tables

-- Step 1: Check if we have any users
DO $$
DECLARE
    user_count integer;
    test_user_id uuid;
BEGIN
    -- Check if we have any users
    SELECT COUNT(*) INTO user_count FROM user_profiles;
    
    -- If no users exist, create a test user
    IF user_count = 0 THEN
        INSERT INTO user_profiles (auth0_id, email, name, firm, role, created_at, updated_at)
        VALUES (
            'auth0|test123',
            'test@example.com',
            'Test User',
            'Test Firm',
            'attorney',
            NOW(),
            NOW()
        ) RETURNING id INTO test_user_id;
        
        RAISE NOTICE 'Created test user with ID: %', test_user_id;
    END IF;
    
    -- Get a user ID to work with (either existing or newly created)
    SELECT id INTO test_user_id FROM user_profiles LIMIT 1;
    
    -- Step 2: Initialize compliance categories
    INSERT INTO compliance_categories (user_id, category_id, category_name, score, items_completed, items_total, trend)
    VALUES
        (test_user_id, 'ethics', 'Ethics & Professional Responsibility', 85, 17, 20, 'up'),
        (test_user_id, 'documentation', 'Client Documentation', 92, 23, 25, 'stable'),
        (test_user_id, 'training', 'Required Training', 78, 7, 9, 'up'),
        (test_user_id, 'client-management', 'Client Management', 88, 22, 25, 'up'),
        (test_user_id, 'business-practices', 'Business Practices', 95, 19, 20, 'stable'),
        (test_user_id, 'certifications', 'Certifications & Licenses', 65, 13, 20, 'down')
    ON CONFLICT (user_id, category_id) DO NOTHING;
    
    -- Step 3: Initialize ethics checklist
    INSERT INTO ethics_checklist (user_id, item_id, title, description, completed)
    VALUES
        (test_user_id, 1, 'Competence (ABA Rule 1.1)', 'Completed required Bitcoin estate planning training and certification', false),
        (test_user_id, 2, 'Confidentiality (ABA Rule 1.6)', 'Established secure procedures for handling client Bitcoin information', true),
        (test_user_id, 3, 'Conflict of Interest (ABA Rule 1.7)', 'Completed conflict check for cryptocurrency-related matters', true),
        (test_user_id, 4, 'Client Communication (ABA Rule 1.4)', 'Provided clear written explanation of Bitcoin estate planning process', false)
    ON CONFLICT (user_id, item_id) DO NOTHING;
    
    -- Step 4: Initialize onboarding tasks
    INSERT INTO onboarding_tasks (user_id, day_number, task_id, title, description, time_estimate, completed)
    VALUES
        -- Day 1 (all complete)
        (test_user_id, 1, '1-1', 'Complete account setup and profile', 'Add your firm information, upload photo, and verify credentials', '15 min', true),
        (test_user_id, 1, '1-2', 'Watch platform overview video', 'Learn about KEEP Protocol and dashboard navigation', '20 min', true),
        (test_user_id, 1, '1-3', 'Download and review KEEP Protocol handbook', 'Essential reading for understanding the system', '45 min', true),
        (test_user_id, 1, '1-4', 'Join the KEEP Protocol community', 'Access to private forum and expert support', '10 min', true),
        -- Day 2 (all complete)
        (test_user_id, 2, '2-1', 'Complete 10-Phase SOP training module', 'Master the core KEEP Protocol process', '90 min', true),
        (test_user_id, 2, '2-2', 'Download all SOP templates', 'Get the complete template library for your practice', '15 min', true),
        (test_user_id, 2, '2-3', 'Review ethics compliance checklist', 'Understand ABA ethics rules for Bitcoin estate planning', '30 min', true),
        (test_user_id, 2, '2-4', 'Complete SOP quiz', 'Test your understanding of the process', '20 min', true),
        -- Day 3 (partial)
        (test_user_id, 3, '3-1', 'Review all template documents', 'Familiarize yourself with each template in the library', '60 min', true),
        (test_user_id, 3, '3-2', 'Customize templates for your jurisdiction', 'Add your firm details and local requirements', '45 min', true),
        (test_user_id, 3, '3-3', 'Set up document management system', 'Organize templates for efficient client work', '30 min', false),
        (test_user_id, 3, '3-4', 'Create your first client intake form', 'Practice using the templates', '20 min', false),
        -- Day 4 (not started)
        (test_user_id, 4, '4-1', 'Review mock client scenario', 'Study the provided client case details', '30 min', false),
        (test_user_id, 4, '4-2', 'Complete full SOP process for mock client', 'Apply everything you''ve learned', '120 min', false),
        (test_user_id, 4, '4-3', 'Submit mock client documents for review', 'Get expert feedback on your work', '15 min', false),
        (test_user_id, 4, '4-4', 'Review feedback and make corrections', 'Learn from expert guidance', '45 min', false),
        -- Day 5 (not started)
        (test_user_id, 5, '5-1', 'Complete final certification exam', 'Demonstrate your mastery of KEEP Protocol', '60 min', false),
        (test_user_id, 5, '5-2', 'Schedule 1-on-1 with KEEP expert', 'Get personalized guidance for your practice', '30 min', false),
        (test_user_id, 5, '5-3', 'Receive KEEP Protocol certification', 'Official certification for your practice', '5 min', false),
        (test_user_id, 5, '5-4', 'Launch your Bitcoin estate planning practice', 'You''re ready to serve clients!', '∞', false)
    ON CONFLICT (user_id, task_id) DO NOTHING;
    
    RAISE NOTICE 'Data initialization complete for user ID: %', test_user_id;
END $$;

-- Verify the results
SELECT 'FINAL VERIFICATION' as status;
SELECT 'user_profiles' as table_name, COUNT(*) as rows FROM user_profiles
UNION ALL
SELECT 'compliance_categories', COUNT(*) FROM compliance_categories
UNION ALL
SELECT 'ethics_checklist', COUNT(*) FROM ethics_checklist
UNION ALL
SELECT 'onboarding_tasks', COUNT(*) FROM onboarding_tasks;