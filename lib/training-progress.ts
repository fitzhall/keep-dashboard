import { supabase } from './supabase/client'

export interface TrainingProgress {
  id: string
  user_id: string
  video_id: string
  module_id: string | null
  completed: boolean
  completed_at: string | null
  last_watched_at: string
  created_at: string
  updated_at: string
}

export interface ModuleProgress {
  user_id: string
  module_id: string
  videos_completed: number
  total_videos: number
  progress_percentage: number
}

// Mark a video as completed
export async function markVideoComplete(videoId: string, moduleId?: string): Promise<boolean> {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('No authenticated user')
      return false
    }

    // First, try to get the user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('auth0_id', user.id)
      .single()

    const userId = profile?.id || user.id

    // Upsert progress record
    const { error } = await supabase
      .from('training_progress')
      .upsert({
        user_id: userId,
        video_id: videoId,
        module_id: moduleId,
        completed: true,
        completed_at: new Date().toISOString(),
        last_watched_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,video_id'
      })

    if (error) {
      console.error('Error marking video complete:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error marking video complete:', error)
    return false
  }
}

// Get user's progress for all videos
export async function getUserVideoProgress(): Promise<TrainingProgress[]> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('No authenticated user')
      return []
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('auth0_id', user.id)
      .single()

    const userId = profile?.id || user.id

    const { data, error } = await supabase
      .from('training_progress')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching video progress:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error fetching video progress:', error)
    return []
  }
}

// Get progress for a specific module
export async function getModuleProgress(moduleId: string): Promise<ModuleProgress | null> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('No authenticated user')
      return null
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('auth0_id', user.id)
      .single()

    const userId = profile?.id || user.id

    const { data, error } = await supabase
      .from('module_progress_summary')
      .select('*')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .single()

    if (error) {
      console.error('Error fetching module progress:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Unexpected error fetching module progress:', error)
    return null
  }
}

// Check if a video is completed
export async function isVideoCompleted(videoId: string): Promise<boolean> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return false

    // Get user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('auth0_id', user.id)
      .single()

    const userId = profile?.id || user.id

    const { data } = await supabase
      .from('training_progress')
      .select('completed')
      .eq('user_id', userId)
      .eq('video_id', videoId)
      .eq('completed', true)
      .single()

    return !!data?.completed
  } catch (error) {
    return false
  }
}