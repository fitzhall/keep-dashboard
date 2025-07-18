import { supabase } from './supabase/client'

export interface TrainingVideo {
  id: string
  title: string
  description: string | null
  video_url: string
  video_type: 'youtube' | 'vimeo' | 'loom' | 'other' | null
  duration_minutes: number | null
  category: 'cle' | 'keep'
  module_id: string | null
  course_id: number | null
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function getTrainingVideosByModule(moduleId: string): Promise<TrainingVideo[]> {
  try {
    const { data, error } = await supabase
      .from('training_videos')
      .select('*')
      .eq('module_id', moduleId)
      .eq('is_active', true)
      .order('order_index')
      .order('created_at')

    if (error) {
      console.error('Error fetching training videos:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error fetching training videos:', error)
    return []
  }
}

export async function getTrainingVideosByCourse(courseId: number): Promise<TrainingVideo[]> {
  try {
    const { data, error } = await supabase
      .from('training_videos')
      .select('*')
      .eq('course_id', courseId)
      .eq('is_active', true)
      .order('order_index')
      .order('created_at')

    if (error) {
      console.error('Error fetching training videos:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error fetching training videos:', error)
    return []
  }
}

export async function getAllKeepVideos(): Promise<TrainingVideo[]> {
  try {
    const { data, error } = await supabase
      .from('training_videos')
      .select('*')
      .eq('category', 'keep')
      .eq('is_active', true)
      .order('module_id')
      .order('order_index')
      .order('created_at')

    if (error) {
      console.error('Error fetching KEEP videos:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error fetching KEEP videos:', error)
    return []
  }
}