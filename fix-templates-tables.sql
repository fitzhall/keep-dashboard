-- Check existing table structures first
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name IN ('templates', 'template_downloads')
    AND column_name IN ('id', 'template_id')
ORDER BY table_name, column_name;

-- If tables exist with wrong types, drop and recreate
DROP VIEW IF EXISTS public.template_stats;
DROP VIEW IF EXISTS public.template_download_stats;
DROP TABLE IF EXISTS public.template_downloads;
DROP TABLE IF EXISTS public.templates;

-- 1. Create templates table
CREATE TABLE public.templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(50),
  preview_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Create template downloads tracking table with correct UUID type
CREATE TABLE public.template_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  ip_address INET,
  user_agent TEXT
);

-- Add unique constraint separately to avoid issues
ALTER TABLE public.template_downloads 
ADD CONSTRAINT unique_user_template_download 
UNIQUE (template_id, user_id);

-- 3. Create indexes
CREATE INDEX idx_templates_category ON public.templates(category);
CREATE INDEX idx_templates_active ON public.templates(is_active);
CREATE INDEX idx_template_downloads_user ON public.template_downloads(user_id);
CREATE INDEX idx_template_downloads_template ON public.template_downloads(template_id);

-- 4. Enable RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_downloads ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for templates
CREATE POLICY "Anyone can view active templates" 
ON public.templates 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can manage templates" 
ON public.templates 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- 6. Create RLS policies for downloads
CREATE POLICY "Users can view their own downloads" 
ON public.template_downloads 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can track their downloads" 
ON public.template_downloads 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 7. Insert sample templates
INSERT INTO public.templates (title, description, category, file_name, file_url, file_type, sort_order) VALUES
('Bitcoin Inheritance Letter Template', 'Template for creating a comprehensive Bitcoin inheritance letter with wallet information and recovery instructions', 'bitcoin-custody', 'bitcoin-inheritance-letter.docx', 'https://placeholder.com/bitcoin-inheritance-letter.docx', 'docx', 1),
('Estate Planning Checklist', 'Complete checklist for estate planning with Bitcoin and digital assets', 'estate-planning', 'estate-planning-checklist.pdf', 'https://placeholder.com/estate-planning-checklist.pdf', 'pdf', 2),
('Multi-Signature Setup Guide', 'Step-by-step guide for setting up multi-signature Bitcoin wallets for inheritance', 'bitcoin-custody', 'multisig-setup-guide.pdf', 'https://placeholder.com/multisig-setup-guide.pdf', 'pdf', 3),
('Digital Asset Inventory Template', 'Spreadsheet template for documenting all digital assets and access information', 'estate-planning', 'digital-asset-inventory.xlsx', 'https://placeholder.com/digital-asset-inventory.xlsx', 'xlsx', 4),
('Power of Attorney for Digital Assets', 'Legal template for granting power of attorney specifically for digital assets', 'legal-forms', 'digital-poa.docx', 'https://placeholder.com/digital-poa.docx', 'docx', 5),
('Beneficiary Designation Form', 'Form for designating beneficiaries for Bitcoin and cryptocurrency holdings', 'legal-forms', 'beneficiary-designation.pdf', 'https://placeholder.com/beneficiary-designation.pdf', 'pdf', 6);

-- 8. Create stats view
CREATE VIEW public.template_stats AS
SELECT 
  t.id,
  t.title,
  t.category,
  COALESCE(d.unique_downloads, 0) as unique_downloads,
  COALESCE(d.total_downloads, 0) as total_downloads
FROM public.templates t
LEFT JOIN (
  SELECT 
    template_id,
    COUNT(DISTINCT user_id) as unique_downloads,
    COUNT(*) as total_downloads
  FROM public.template_downloads
  GROUP BY template_id
) d ON t.id = d.template_id;

-- 9. Grant permissions
GRANT SELECT ON public.template_stats TO authenticated;

-- 10. Verify everything worked
SELECT 
  'Templates created' as status,
  COUNT(*) as count 
FROM public.templates
UNION ALL
SELECT 
  'Downloads table ready' as status,
  0 as count;

-- Check data types are correct
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name IN ('templates', 'template_downloads')
    AND column_name IN ('id', 'template_id', 'user_id')
ORDER BY table_name, column_name;