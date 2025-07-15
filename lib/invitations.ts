import { supabase } from '@/lib/supabase/client'

interface InviteUserParams {
  email: string
  role: 'attorney' | 'paralegal' | 'admin'
  invitedBy: string
}

export async function inviteUser({ email, role, invitedBy }: InviteUserParams) {
  try {
    const { data, error } = await supabase
      .from('user_invitations')
      .insert({
        email,
        role,
        invited_by: invitedBy
      })
      .select()
      .single()

    if (error) throw error

    // In a real implementation, you would:
    // 1. Send an email with the invitation link
    // 2. The link would include the token: /signup?token=${data.token}
    // 3. The signup page would verify the token and pre-fill the email
    
    return { 
      success: true, 
      invitation: data,
      inviteLink: `${window.location.origin}/signup?token=${data.token}`
    }
  } catch (error) {
    console.error('Error creating invitation:', error)
    return { success: false, error }
  }
}

export async function getInvitationByToken(token: string) {
  try {
    const { data, error } = await supabase
      .from('user_invitations')
      .select('*')
      .eq('token', token)
      .eq('accepted', false)
      .gte('expires_at', new Date().toISOString())
      .single()

    if (error) throw error

    return { success: true, invitation: data }
  } catch (error) {
    console.error('Error fetching invitation:', error)
    return { success: false, error }
  }
}

export async function acceptInvitation(token: string) {
  try {
    const { error } = await supabase
      .from('user_invitations')
      .update({ 
        accepted: true, 
        accepted_at: new Date().toISOString() 
      })
      .eq('token', token)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Error accepting invitation:', error)
    return { success: false, error }
  }
}