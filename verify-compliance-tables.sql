-- Check if all compliance tables were created
SELECT 
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN 'EXISTS ✓'
        ELSE 'MISSING ✗'
    END as status
FROM (
    VALUES 
        ('compliance_categories'),
        ('ethics_checklist'),
        ('onboarding_tasks'),
        ('compliance_reports')
) AS required_tables(name)
LEFT JOIN information_schema.tables 
    ON table_name = name 
    AND table_schema = 'public'
ORDER BY name;

-- Check row counts
SELECT 'compliance_categories' as table_name, COUNT(*) as row_count FROM compliance_categories
UNION ALL
SELECT 'ethics_checklist', COUNT(*) FROM ethics_checklist
UNION ALL
SELECT 'onboarding_tasks', COUNT(*) FROM onboarding_tasks;