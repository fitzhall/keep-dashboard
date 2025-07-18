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
    console.log('Marking video complete:', { videoId, moduleId })
    
    // First try localStorage for immediate feedback
    const storageKey = 'training_progress'
    const existingProgress = localStorage.getItem(storageKey)
    const progress = existingProgress ? JSON.parse(existingProgress) : {}
    progress[videoId] = {
      completed: true,
      completedAt: new Date().toISOString(),
      moduleId
    }
    localStorage.setItem(storageKey, JSON.stringify(progress))
    
    // Then try to save to database
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('No authenticated user, using localStorage only:', userError)
      return true // Still return true since we saved to localStorage
    }
    console.log('Current user:', user.id)

    // Use the auth user ID directly without checking user_profiles
    const userId = user.id
    console.log('Using userId:', userId)

    // Upsert progress record
    const { data, error } = await supabase
      .from('training_progress')
      .upsert({
        user_id: userId,
        video_id: videoId,
        module_id: moduleId,
        completed: true,
        completed_at: new Date().toISOString(),
        last_watched_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,video_id',
        ignoreDuplicates: false
      })
      .select()

    if (error) {
      console.error('Error saving to database:', error)
      console.error('Error details:', { 
        code: error.code, 
        message: error.message, 
        details: error.details,
        hint: error.hint
      })
      // Still return true since we have localStorage
      return true
    }

    console.log('Successfully saved to database:', data)
    return true
  } catch (error) {
    console.error('Unexpected error:', error)
    // Still return true if we at least saved to localStorage
    return true
  }
}

// Get user's progress for all videos
export async function getUserVideoProgress(): Promise<TrainingProgress[]> {
  try {
    // First get from localStorage
    const storageKey = 'training_progress'
    const localProgress = localStorage.getItem(storageKey)
    const localData = localProgress ? JSON.parse(localProgress) : {}
    
    // Convert localStorage format to TrainingProgress array
    const localProgressArray: TrainingProgress[] = Object.entries(localData).map(([videoId, data]: [string, any]) => ({
      id: `local-${videoId}`,
      user_id: 'local',
      video_id: videoId,
      module_id: data.moduleId || null,
      completed: data.completed || false,
      completed_at: data.completedAt || null,
      last_watched_at: data.completedAt || new Date().toISOString(),
      created_at: data.completedAt || new Date().toISOString(),
      updated_at: data.completedAt || new Date().toISOString()
    }))
    
    // Try to get from database too
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.log('No authenticated user, using localStorage only')
      return localProgressArray
    }

    const userId = user.id
    const { data, error } = await supabase
      .from('training_progress')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching from database, using localStorage:', error)
      return localProgressArray
    }

    // Merge database and local progress (database takes precedence)
    const dbVideoIds = new Set((data || []).map((p: TrainingProgress) => p.video_id))
    const mergedProgress = [
      ...(data || []),
      ...localProgressArray.filter((p: TrainingProgress) => !dbVideoIds.has(p.video_id))
    ]

    return mergedProgress
  } catch (error) {
    console.error('Unexpected error fetching video progress:', error)
    // Return localStorage data as fallback
    const storageKey = 'training_progress'
    const localProgress = localStorage.getItem(storageKey)
    const localData = localProgress ? JSON.parse(localProgress) : {}
    
    return Object.entries(localData).map(([videoId, data]: [string, any]) => ({
      id: `local-${videoId}`,
      user_id: 'local',
      video_id: videoId,
      module_id: data.moduleId || null,
      completed: data.completed || false,
      completed_at: data.completedAt || null,
      last_watched_at: data.completedAt || new Date().toISOString(),
      created_at: data.completedAt || new Date().toISOString(),
      updated_at: data.completedAt || new Date().toISOString()
    }))
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
    // Check localStorage first
    const storageKey = 'training_progress'
    const localProgress = localStorage.getItem(storageKey)
    if (localProgress) {
      const progress = JSON.parse(localProgress)
      if (progress[videoId]?.completed) {
        return true
      }
    }

    // Then check database
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return false

    const userId = user.id
    const { data } = await supabase
      .from('training_progress')
      .select('completed')
      .eq('user_id', userId)
      .eq('video_id', videoId)
      .eq('completed', true)
      .single()

    return !!data?.completed
  } catch (error) {
    // Check localStorage as fallback
    const storageKey = 'training_progress'
    const localProgress = localStorage.getItem(storageKey)
    if (localProgress) {
      const progress = JSON.parse(localProgress)
      return !!progress[videoId]?.completed
    }
    return false
  }
}