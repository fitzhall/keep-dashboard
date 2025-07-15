-- Check if we have any users
SELECT COUNT(*) as user_count FROM user_profiles;

-- If no users, let's create a test user
INSERT INTO user_profiles (auth0_id, email, name, firm, role)
VALUES (
  'auth0|test123', 
  'test@example.com', 
  'Test User', 
  'Test Firm', 
  'attorney'
)
ON CONFLICT (auth0_id) DO NOTHING
RETURNING id, email, name;

-- Now let's use this user's ID to populate compliance data
WITH test_user AS (
  SELECT id FROM user_profiles WHERE email = 'test@example.com' LIMIT 1
)
INSERT INTO compliance_categories (user_id, category_id, category_name, score, items_completed, items_total, trend)
SELECT 
  id,
  category_id,
  category_name,
  score,
  items_completed,
  items_total,
  trend
FROM test_user, (VALUES
  ('ethics', 'Ethics & Professional Responsibility', 85, 17, 20, 'up'),
  ('documentation', 'Client Documentation', 92, 23, 25, 'stable'),
  ('training', 'Required Training', 78, 7, 9, 'up'),
  ('client-management', 'Client Management', 88, 22, 25, 'up'),
  ('business-practices', 'Business Practices', 95, 19, 20, 'stable'),
  ('certifications', 'Certifications & Licenses', 65, 13, 20, 'down')
) AS categories(category_id, category_name, score, items_completed, items_total, trend);

-- Check results
SELECT 'Users:' as check_type, COUNT(*) as count FROM user_profiles
UNION ALL
SELECT 'Compliance Categories:', COUNT(*) FROM compliance_categories;