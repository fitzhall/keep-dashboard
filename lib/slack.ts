// Slack webhook integration for support tickets
interface SlackMessage {
  text: string
  attachments?: Array<{
    color: string
    fields: Array<{
      title: string
      value: string
      short?: boolean
    }>
    footer?: string
    ts?: number
  }>
}

export async function sendSlackNotification(ticket: {
  ticket_number: string
  category: string
  priority: string
  subject: string
  description: string
  user_email?: string
}) {
  // TODO: Get webhook URL from environment variable
  const webhookUrl = process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL
  
  if (!webhookUrl) {
    console.warn('Slack webhook URL not configured')
    return
  }
  
  const priorityColors = {
    high: '#dc2626',    // red
    medium: '#f59e0b',  // yellow
    low: '#10b981'      // green
  }
  
  const message: SlackMessage = {
    text: `New support ticket: ${ticket.ticket_number}`,
    attachments: [{
      color: priorityColors[ticket.priority as keyof typeof priorityColors] || '#6b7280',
      fields: [
        {
          title: 'Subject',
          value: ticket.subject,
          short: false
        },
        {
          title: 'Category',
          value: ticket.category,
          short: true
        },
        {
          title: 'Priority',
          value: ticket.priority.toUpperCase(),
          short: true
        },
        {
          title: 'Description',
          value: ticket.description,
          short: false
        }
      ],
      footer: `Submitted by ${ticket.user_email || 'Unknown'}`,
      ts: Math.floor(Date.now() / 1000)
    }]
  }
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
    
    if (!response.ok) {
      throw new Error(`Slack webhook failed: ${response.statusText}`)
    }
    
    console.log('Slack notification sent successfully')
  } catch (error) {
    console.error('Error sending Slack notification:', error)
    // Don't throw - we don't want Slack errors to prevent ticket creation
  }
}