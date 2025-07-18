-- Create templates table for Phase 3

-- 1. Create templates table
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL, -- e.g., 'estate-planning', 'bitcoin-custody', 'legal-forms'
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL, -- URL to the template file in Supabase Storage
  file_size INTEGER, -- Size in bytes
  file_type VARCHAR(50), -- e.g., 'pdf', 'docx', 'xlsx'
  preview_image_url TEXT, -- Optional preview image
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Create template downloads tracking table
CREATE TABLE IF NOT EXISTS public.template_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  ip_address INET,
  user_agent TEXT,
  
  -- Add unique constraint to track unique downloads per user
  UNIQUE(template_id, user_id, downloaded_at)
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_active ON public.templates(is_active);
CREATE INDEX IF NOT EXISTS idx_template_downloads_user ON public.template_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_template_downloads_template ON public.template_downloads(template_id);

-- 4. Enable RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_downloads ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for templates
-- Anyone can view active templates
CREATE POLICY "Anyone can view active templates" 
ON public.templates 
FOR SELECT 
USING (is_active = true);

-- Authenticated users can manage templates (for admin)
CREATE POLICY "Authenticated users can manage templates" 
ON public.templates 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- 6. Create RLS policies for downloads
-- Users can view their own downloads
CREATE POLICY "Users can view their own downloads" 
ON public.template_downloads 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Users can create download records
CREATE POLICY "Users can track their downloads" 
ON public.template_downloads 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 7. Insert sample templates for KEEP Protocol
INSERT INTO public.templates (title, description, category, file_name, file_url, file_type, sort_order) VALUES
('Bitcoin Inheritance Letter Template', 'Template for creating a comprehensive Bitcoin inheritance letter with wallet information and recovery instructions', 'bitcoin-custody', 'bitcoin-inheritance-letter.docx', 'https://placeholder.com/bitcoin-inheritance-letter.docx', 'docx', 1),
('Estate Planning Checklist', 'Complete checklist for estate planning with Bitcoin and digital assets', 'estate-planning', 'estate-planning-checklist.pdf', 'https://placeholder.com/estate-planning-checklist.pdf', 'pdf', 2),
('Multi-Signature Setup Guide', 'Step-by-step guide for setting up multi-signature Bitcoin wallets for inheritance', 'bitcoin-custody', 'multisig-setup-guide.pdf', 'https://placeholder.com/multisig-setup-guide.pdf', 'pdf', 3),
('Digital Asset Inventory Template', 'Spreadsheet template for documenting all digital assets and access information', 'estate-planning', 'digital-asset-inventory.xlsx', 'https://placeholder.com/digital-asset-inventory.xlsx', 'xlsx', 4),
('Power of Attorney for Digital Assets', 'Legal template for granting power of attorney specifically for digital assets', 'legal-forms', 'digital-poa.docx', 'https://placeholder.com/digital-poa.docx', 'docx', 5),
('Beneficiary Designation Form', 'Form for designating beneficiaries for Bitcoin and cryptocurrency holdings', 'legal-forms', 'beneficiary-designation.pdf', 'https://placeholder.com/beneficiary-designation.pdf', 'pdf', 6);

-- 8. Create a view for download statistics
CREATE OR REPLACE VIEW public.template_download_stats AS
SELECT 
  t.id,
  t.title,
  t.category,
  COUNT(DISTINCT td.user_id) as unique_downloads,
  COUNT(td.id) as total_downloads,
  MAX(td.downloaded_at) as last_downloaded
FROM public.templates t
LEFT JOIN public.template_downloads td ON t.id = td.template_id
GROUP BY t.id, t.title, t.category;

-- 9. Grant permissions on the view
GRANT SELECT ON public.template_download_stats TO authenticated;