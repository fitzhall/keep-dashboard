import { supabase } from '@/lib/supabase/client'

type NotificationType = 'template' | 'training' | 'system' | 'support' | 'compliance'

interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  message: string
  actionUrl?: string
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  actionUrl
}: CreateNotificationParams) {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        action_url: actionUrl,
        is_read: false
      })

    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Error creating notification:', error)
    return { success: false, error }
  }
}

// Helper functions for specific notification types

export async function notifyNewTemplate(userId: string, templateName: string) {
  return createNotification({
    userId,
    type: 'template',
    title: 'New Template Available',
    message: `A new template "${templateName}" has been added to your toolkit.`,
    actionUrl: '/templates'
  })
}

export async function notifyNewTraining(userId: string, courseName: string, credits: number) {
  return createNotification({
    userId,
    type: 'training',
    title: 'New Training Course Available',
    message: `"${courseName}" is now available. Earn ${credits} CLE credits upon completion.`,
    actionUrl: '/cle'
  })
}

export async function notifySupportResponse(userId: string, ticketNumber: string) {
  return createNotification({
    userId,
    type: 'support',
    title: 'Support Ticket Response',
    message: `Your support ticket ${ticketNumber} has received a response from our experts.`,
    actionUrl: '/hotline'
  })
}

export async function notifyComplianceReminder(userId: string, task: string) {
  return createNotification({
    userId,
    type: 'compliance',
    title: 'Compliance Task Due',
    message: `Reminder: ${task}`,
    actionUrl: '/compliance'
  })
}

export async function notifySystemUpdate(userId: string, update: string) {
  return createNotification({
    userId,
    type: 'system',
    title: 'System Update',
    message: update,
  })
}

// Broadcast notification to all users (admin function)
export async function broadcastNotification(
  type: NotificationType,
  title: string,
  message: string,
  actionUrl?: string
) {
  try {
    // Get all user IDs
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('id')

    if (usersError) throw usersError

    // Create notifications for all users
    const notifications = users.map((user: any) => ({
      user_id: user.id,
      type,
      title,
      message,
      action_url: actionUrl,
      is_read: false
    }))

    const { error } = await supabase
      .from('notifications')
      .insert(notifications)

    if (error) throw error

    return { success: true, count: notifications.length }
  } catch (error) {
    console.error('Error broadcasting notification:', error)
    return { success: false, error }
  }
}