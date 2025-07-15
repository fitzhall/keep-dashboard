import { supabase } from '@/lib/supabase/client'

export interface AdminStats {
  totalUsers: number
  activeLicenses: number
  documentsCreated: number
  systemHealth: number
  usersTrend: string
  licensesTrend: string
  documentsTrend: string
}

export interface LicensedAttorney {
  id: string
  attorney: string
  email: string
  firm: string
  licenseType: 'Trial' | 'Standard' | 'Premium' | 'Enterprise'
  status: 'Active' | 'Inactive' | 'Trial Period' | 'Payment Overdue'
  lastLogin: string | null
  licensedSince: string
  monthlyRevenue: number
  casesThisMonth: number
  complianceScore: number
  barNumber: string | null
}

export interface RecentActivity {
  id: string
  action: string
  user: string
  time: string
  type: 'user' | 'license' | 'system' | 'template' | 'support'
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    // Get total users
    const { count: totalUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })

    // Get active licenses (users who logged in within 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { data: activeUsers } = await supabase
      .from('activity_log')
      .select('user_id')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('user_id')
    
    const uniqueActiveUsers = new Set(activeUsers?.map((a: any) => a.user_id) || [])
    const activeLicenses = uniqueActiveUsers.size

    // Get documents created (template downloads)
    const { count: documentsCreated } = await supabase
      .from('template_downloads')
      .select('*', { count: 'exact', head: true })

    // Calculate trends (mock for now - would need historical data)
    const usersTrend = totalUsers && totalUsers > 0 ? '+12%' : '0%'
    const licensesTrend = activeLicenses > 0 ? '+2' : '0'
    const documentsTrend = documentsCreated && documentsCreated > 0 ? '+18%' : '0%'

    return {
      totalUsers: totalUsers || 0,
      activeLicenses,
      documentsCreated: documentsCreated || 0,
      systemHealth: 99.9, // This would come from monitoring
      usersTrend,
      licensesTrend,
      documentsTrend
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return {
      totalUsers: 0,
      activeLicenses: 0,
      documentsCreated: 0,
      systemHealth: 99.9,
      usersTrend: '0%',
      licensesTrend: '0',
      documentsTrend: '0%'
    }
  }
}

export async function getLicensedAttorneys(): Promise<LicensedAttorney[]> {
  try {
    const { data: users, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        activity_log (
          created_at
        ),
        template_downloads (
          id
        ),
        compliance_scores (
          score
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transform the data into the format we need
    const attorneys: LicensedAttorney[] = (users || []).map((user: any) => {
      // Get last login from activity log
      const lastActivity = user.activity_log?.[0]?.created_at
      const lastLogin = lastActivity ? new Date(lastActivity).toISOString().split('T')[0] : null

      // Determine status based on last login
      const daysSinceLogin = lastLogin 
        ? Math.floor((Date.now() - new Date(lastLogin).getTime()) / (1000 * 60 * 60 * 24))
        : Infinity

      let status: LicensedAttorney['status'] = 'Active'
      if (daysSinceLogin > 30) status = 'Inactive'
      else if (daysSinceLogin > 14) status = 'Payment Overdue'
      
      // Check if trial (created within 14 days)
      const daysSinceCreated = Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))
      if (daysSinceCreated <= 14) status = 'Trial Period'

      // Determine license type based on role
      let licenseType: LicensedAttorney['licenseType'] = 'Standard'
      if (user.role === 'admin') licenseType = 'Enterprise'
      else if (status === 'Trial Period') licenseType = 'Trial'

      // Calculate cases this month (template downloads)
      const casesThisMonth = user.template_downloads?.length || 0

      // Calculate monthly revenue (mock calculation)
      let monthlyRevenue = 0
      if (licenseType === 'Enterprise') monthlyRevenue = 5000
      else if (licenseType === 'Premium') monthlyRevenue = 2500
      else if (licenseType === 'Standard') monthlyRevenue = 1500
      else if (licenseType === 'Trial') monthlyRevenue = 0

      return {
        id: user.id,
        attorney: user.name || 'Unknown Attorney',
        email: user.email,
        firm: user.firm || 'Unknown Firm',
        licenseType,
        status,
        lastLogin,
        licensedSince: new Date(user.created_at).toISOString().split('T')[0],
        monthlyRevenue,
        casesThisMonth,
        complianceScore: user.compliance_scores?.[0]?.score || 75,
        barNumber: null // This field doesn't exist in our schema yet
      }
    })

    return attorneys
  } catch (error) {
    console.error('Error fetching licensed attorneys:', error)
    return []
  }
}

export async function getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
  try {
    const { data: activities, error } = await supabase
      .from('activity_log')
      .select(`
        *,
        user_profiles (
          email,
          name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return (activities || []).map((activity: any) => {
      const timeAgo = getTimeAgo(new Date(activity.created_at))
      
      let action = activity.title
      let type: RecentActivity['type'] = 'system'
      
      // Determine type based on activity type
      if (activity.type === 'training') type = 'system'
      else if (activity.type === 'template') type = 'template'
      else if (activity.type === 'support') type = 'support'

      return {
        id: activity.id,
        action,
        user: activity.user_profiles?.email || 'System',
        time: timeAgo,
        type
      }
    })
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return []
  }
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`
  
  return date.toLocaleDateString()
}

export async function getNewUsersCount(): Promise<{ count: number; trend: string }> {
  try {
    // Get users from last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { count: newUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString())

    // For trend, we'd need to compare with previous 30 days
    // Mock for now
    const trend = newUsers && newUsers > 0 ? `+${newUsers}` : '0'

    return { count: newUsers || 0, trend }
  } catch (error) {
    console.error('Error fetching new users count:', error)
    return { count: 0, trend: '0' }
  }
}