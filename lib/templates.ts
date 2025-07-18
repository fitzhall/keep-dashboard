import { supabase } from './supabase/client'

export interface Template {
  id: string
  title: string
  description: string | null
  category: string
  file_name: string
  file_url: string
  file_size: number | null
  file_type: string | null
  preview_image_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface TemplateDownload {
  id: string
  template_id: string
  user_id: string
  downloaded_at: string
  ip_address: string | null
  user_agent: string | null
}

export interface TemplateCategory {
  id: string
  name: string
  count: number
}

// Get all active templates
export async function getTemplates(category?: string) {
  try {
    let query = supabase
      .from('templates')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) throw error
    return data as Template[]
  } catch (error) {
    console.error('Error fetching templates:', error)
    return []
  }
}

// Get template categories with counts
export async function getTemplateCategories(): Promise<TemplateCategory[]> {
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('category')
      .eq('is_active', true)

    if (error) throw error

    // Count templates per category
    const categoryCounts = (data || []).reduce((acc: Record<string, number>, item: { category: string }) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Convert to array format
    const categories: TemplateCategory[] = Object.entries(categoryCounts).map(([category, count]) => ({
      id: category,
      name: formatCategoryName(category),
      count
    }))

    return categories
  } catch (error) {
    console.error('Error fetching template categories:', error)
    return []
  }
}

// Format category names for display
function formatCategoryName(category: string): string {
  const names: Record<string, string> = {
    'estate-planning': 'Estate Planning',
    'bitcoin-custody': 'Bitcoin Custody',
    'legal-forms': 'Legal Forms'
  }
  return names[category] || category
}

// Track template download
export async function trackTemplateDownload(templateId: string): Promise<boolean> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('No authenticated user')
      return false
    }

    const { error } = await supabase
      .from('template_downloads')
      .insert({
        template_id: templateId,
        user_id: user.id,
        user_agent: navigator.userAgent
      })

    if (error) {
      // Ignore unique constraint violations (user downloading same template multiple times)
      if (error.code !== '23505') {
        console.error('Error tracking download:', error)
        return false
      }
    }

    return true
  } catch (error) {
    console.error('Error tracking download:', error)
    return false
  }
}

// Get user's download history
export async function getUserDownloads(): Promise<TemplateDownload[]> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return []

    const { data, error } = await supabase
      .from('template_downloads')
      .select(`
        *,
        template:templates(*)
      `)
      .eq('user_id', user.id)
      .order('downloaded_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching user downloads:', error)
    return []
  }
}

// Download template file
export async function downloadTemplate(template: Template): Promise<boolean> {
  try {
    // Track the download
    await trackTemplateDownload(template.id)

    // For now, we'll use placeholder URLs
    // In production, this would download from Supabase Storage
    const link = document.createElement('a')
    link.href = template.file_url
    link.download = template.file_name
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return true
  } catch (error) {
    console.error('Error downloading template:', error)
    return false
  }
}

// Get download statistics (admin only)
export async function getDownloadStats() {
  try {
    const { data, error } = await supabase
      .from('template_stats')
      .select('*')
      .order('total_downloads', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching download stats:', error)
    return []
  }
}