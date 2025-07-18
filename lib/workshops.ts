import { supabase } from './supabase/client'

export interface Workshop {
  id: string
  title: string
  description: string | null
  workshop_type: 'webinar' | 'in-person' | 'hybrid'
  category: string
  instructor_name: string | null
  instructor_bio: string | null
  start_datetime: string
  end_datetime: string
  timezone: string
  duration_minutes: number
  max_attendees: number
  current_attendees: number
  location: string | null
  meeting_url: string | null
  meeting_password: string | null
  price: number
  cle_credits: number
  materials_url: string | null
  recording_url: string | null
  is_active: boolean
  is_featured: boolean
  registration_deadline: string | null
  cancellation_deadline: string | null
  created_at: string
  updated_at: string
  available_seats?: number
  availability_status?: 'available' | 'filling' | 'full'
}

export interface WorkshopRegistration {
  id: string
  workshop_id: string
  user_id: string
  registration_status: 'registered' | 'attended' | 'no-show' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'refunded' | 'free'
  payment_amount: number
  payment_date: string | null
  attendance_confirmed: boolean
  attendance_duration_minutes: number | null
  cle_credits_earned: number
  notes: string | null
  registered_at: string
  cancelled_at: string | null
  workshop?: Workshop
}

// Get all upcoming workshops
export async function getUpcomingWorkshops(category?: string) {
  try {
    let query = supabase
      .from('upcoming_workshops')
      .select('*')
      .order('start_datetime', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) throw error
    return data as Workshop[]
  } catch (error) {
    console.error('Error fetching workshops:', error)
    return []
  }
}

// Get workshop by ID
export async function getWorkshopById(id: string): Promise<Workshop | null> {
  try {
    const { data, error } = await supabase
      .from('workshops')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching workshop:', error)
    return null
  }
}

// Get user's workshop registrations
export async function getUserRegistrations(): Promise<WorkshopRegistration[]> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return []

    const { data, error } = await supabase
      .from('workshop_registrations')
      .select(`
        *,
        workshop:workshops(*)
      `)
      .eq('user_id', user.id)
      .order('registered_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching user registrations:', error)
    return []
  }
}

// Register for a workshop
export async function registerForWorkshop(workshopId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Check if workshop is available
    const workshop = await getWorkshopById(workshopId)
    if (!workshop) {
      return { success: false, error: 'Workshop not found' }
    }

    if (workshop.current_attendees >= workshop.max_attendees) {
      return { success: false, error: 'Workshop is full' }
    }

    // Register the user
    const { error } = await supabase
      .from('workshop_registrations')
      .insert({
        workshop_id: workshopId,
        user_id: user.id,
        payment_status: workshop.price === 0 ? 'free' : 'pending',
        payment_amount: workshop.price
      })

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: 'Already registered for this workshop' }
      }
      throw error
    }

    // Create a notification
    await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        type: 'training',
        title: 'Workshop Registration Confirmed',
        message: `You have successfully registered for "${workshop.title}"`,
        action_url: '/training'
      })

    return { success: true }
  } catch (error) {
    console.error('Error registering for workshop:', error)
    return { success: false, error: 'Failed to register' }
  }
}

// Cancel workshop registration
export async function cancelRegistration(registrationId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { error } = await supabase
      .from('workshop_registrations')
      .update({
        registration_status: 'cancelled',
        cancelled_at: new Date().toISOString()
      })
      .eq('id', registrationId)
      .eq('user_id', user.id)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error cancelling registration:', error)
    return { success: false, error: 'Failed to cancel registration' }
  }
}

// Get workshop categories
export async function getWorkshopCategories(): Promise<{ id: string; name: string; count: number }[]> {
  try {
    const { data, error } = await supabase
      .from('workshops')
      .select('category')
      .eq('is_active', true)
      .gte('start_datetime', new Date().toISOString())

    if (error) throw error

    // Count workshops per category
    const categoryCounts = (data || []).reduce((acc: Record<string, number>, item: { category: string }) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {})

    // Convert to array format
    return Object.entries(categoryCounts).map(([category, count]) => ({
      id: category,
      name: formatCategoryName(category),
      count: count as number
    }))
  } catch (error) {
    console.error('Error fetching workshop categories:', error)
    return []
  }
}

// Format category names
function formatCategoryName(category: string): string {
  const names: Record<string, string> = {
    'estate-planning': 'Estate Planning',
    'bitcoin-basics': 'Bitcoin Basics',
    'advanced-custody': 'Advanced Custody',
    'legal-compliance': 'Legal Compliance',
    'practice-management': 'Practice Management'
  }
  return names[category] || category
}

// Set workshop reminder
export async function setWorkshopReminder(workshopId: string, daysBefore: number): Promise<boolean> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return false

    const { error } = await supabase
      .from('workshop_reminders')
      .insert({
        workshop_id: workshopId,
        user_id: user.id,
        reminder_type: 'notification',
        days_before: daysBefore
      })

    if (error && error.code !== '23505') { // Ignore duplicate errors
      throw error
    }

    return true
  } catch (error) {
    console.error('Error setting reminder:', error)
    return false
  }
}