-- Get a user ID to work with (replace with your actual user ID if you know it)
-- First, let's see what users we have
SELECT id, email, name FROM user_profiles LIMIT 5;

-- Insert test data for the FIRST user found
-- Replace 'YOUR_USER_ID' with an actual UUID from the query above
WITH first_user AS (
  SELECT id FROM user_profiles LIMIT 1
)
-- Initialize compliance categories
INSERT INTO compliance_categories (user_id, category_id, category_name, score, items_completed, items_total, trend)
SELECT 
  id,
  category_id,
  category_name,
  score,
  items_completed,
  items_total,
  trend
FROM first_user, (VALUES
  ('ethics', 'Ethics & Professional Responsibility', 85, 17, 20, 'up'),
  ('documentation', 'Client Documentation', 92, 23, 25, 'stable'),
  ('training', 'Required Training', 78, 7, 9, 'up'),
  ('client-management', 'Client Management', 88, 22, 25, 'up'),
  ('business-practices', 'Business Practices', 95, 19, 20, 'stable'),
  ('certifications', 'Certifications & Licenses', 65, 13, 20, 'down')
) AS categories(category_id, category_name, score, items_completed, items_total, trend)
ON CONFLICT (user_id, category_id) DO NOTHING;

-- Initialize ethics checklist
WITH first_user AS (
  SELECT id FROM user_profiles LIMIT 1
)
INSERT INTO ethics_checklist (user_id, item_id, title, description, completed)
SELECT 
  id,
  item_id,
  title,
  description,
  completed
FROM first_user, (VALUES
  (1, 'Competence (ABA Rule 1.1)', 'Completed required Bitcoin estate planning training and certification', false),
  (2, 'Confidentiality (ABA Rule 1.6)', 'Established secure procedures for handling client Bitcoin information', true),
  (3, 'Conflict of Interest (ABA Rule 1.7)', 'Completed conflict check for cryptocurrency-related matters', true),
  (4, 'Client Communication (ABA Rule 1.4)', 'Provided clear written explanation of Bitcoin estate planning process', false)
) AS items(item_id, title, description, completed)
ON CONFLICT (user_id, item_id) DO NOTHING;

-- Initialize onboarding tasks (Days 1-2 complete, Day 3 partial)
WITH first_user AS (
  SELECT id FROM user_profiles LIMIT 1
)
INSERT INTO onboarding_tasks (user_id, day_number, task_id, title, description, time_estimate, completed)
SELECT 
  id,
  day_number,
  task_id,
  title,
  description,
  time_estimate,
  completed
FROM first_user, (VALUES
  -- Day 1 (all complete)
  (1, '1-1', 'Complete account setup and profile', 'Add your firm information, upload photo, and verify credentials', '15 min', true),
  (1, '1-2', 'Watch platform overview video', 'Learn about KEEP Protocol and dashboard navigation', '20 min', true),
  (1, '1-3', 'Download and review KEEP Protocol handbook', 'Essential reading for understanding the system', '45 min', true),
  (1, '1-4', 'Join the KEEP Protocol community', 'Access to private forum and expert support', '10 min', true),
  -- Day 2 (all complete)
  (2, '2-1', 'Complete 10-Phase SOP training module', 'Master the core KEEP Protocol process', '90 min', true),
  (2, '2-2', 'Download all SOP templates', 'Get the complete template library for your practice', '15 min', true),
  (2, '2-3', 'Review ethics compliance checklist', 'Understand ABA ethics rules for Bitcoin estate planning', '30 min', true),
  (2, '2-4', 'Complete SOP quiz', 'Test your understanding of the process', '20 min', true),
  -- Day 3 (partial)
  (3, '3-1', 'Review all template documents', 'Familiarize yourself with each template in the library', '60 min', true),
  (3, '3-2', 'Customize templates for your jurisdiction', 'Add your firm details and local requirements', '45 min', true),
  (3, '3-3', 'Set up document management system', 'Organize templates for efficient client work', '30 min', false),
  (3, '3-4', 'Create your first client intake form', 'Practice using the templates', '20 min', false),
  -- Day 4 (not started)
  (4, '4-1', 'Review mock client scenario', 'Study the provided client case details', '30 min', false),
  (4, '4-2', 'Complete full SOP process for mock client', 'Apply everything you''ve learned', '120 min', false),
  (4, '4-3', 'Submit mock client documents for review', 'Get expert feedback on your work', '15 min', false),
  (4, '4-4', 'Review feedback and make corrections', 'Learn from expert guidance', '45 min', false),
  -- Day 5 (not started)
  (5, '5-1', 'Complete final certification exam', 'Demonstrate your mastery of KEEP Protocol', '60 min', false),
  (5, '5-2', 'Schedule 1-on-1 with KEEP expert', 'Get personalized guidance for your practice', '30 min', false),
  (5, '5-3', 'Receive KEEP Protocol certification', 'Official certification for your practice', '5 min', false),
  (5, '5-4', 'Launch your Bitcoin estate planning practice', 'You''re ready to serve clients!', '∞', false)
) AS tasks(day_number, task_id, title, description, time_estimate, completed)
ON CONFLICT (user_id, task_id) DO NOTHING;

-- Verify the data was inserted
SELECT 'Data initialization complete!' as status;
SELECT 'compliance_categories' as table_name, COUNT(*) as rows FROM compliance_categories
UNION ALL
SELECT 'ethics_checklist', COUNT(*) FROM ethics_checklist
UNION ALL
SELECT 'onboarding_tasks', COUNT(*) FROM onboarding_tasks;