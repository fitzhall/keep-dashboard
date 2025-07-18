import { supabase } from './supabase/client'

export async function ensureUserProfile() {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.log('No authenticated user')
      return null
    }

    // Check if user profile exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .or(`id.eq.${user.id},auth0_id.eq.${user.id},email.eq.${user.email}`)
      .single()

    if (existingProfile) {
      console.log('User profile exists:', existingProfile.id)
      return existingProfile
    }

    // Create user profile if it doesn't exist
    console.log('Creating user profile for:', user.email)
    
    const { data: newProfile, error: createError } = await supabase
      .from('user_profiles')
      .insert({
        id: user.id,
        auth0_id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        role: 'attorney', // Default role
        firm: user.user_metadata?.firm || null
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating user profile:', createError)
      return null
    }

    console.log('Created user profile:', newProfile.id)
    return newProfile
  } catch (error) {
    console.error('Error ensuring user profile:', error)
    return null
  }
}

export async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    // Always use the auth user ID
    return user.id
  } catch (error) {
    console.error('Error getting current user ID:', error)
    return null
  }
}