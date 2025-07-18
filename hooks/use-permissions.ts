import { hasPermission, canAccessRoute, getMockUser, type UserRole, type User } from '@/lib/roles'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export function usePermissions() {
  const [user, setUser] = useState<User>(getMockUser('sarah@johnsonlaw.com'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (authUser) {
          // Get user profile from database
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', authUser.id)
            .single()
          
          if (profile) {
            setUser({
              id: profile.id,
              name: profile.name || authUser.email || 'User',
              email: profile.email || authUser.email || '',
              role: profile.role as UserRole || 'attorney',
              firm: profile.firm || '',
              avatar: profile.avatar
            })
          }
        }
      } catch (error) {
        console.error('Error loading user permissions:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const checkPermission = (resource: string, action: 'read' | 'write' | 'delete' | 'admin') => {
    return hasPermission(user.role, resource, action)
  }

  const checkRouteAccess = (route: string) => {
    return canAccessRoute(user.role, route)
  }

  return {
    user,
    loading,
    hasPermission: checkPermission,
    canAccessRoute: checkRouteAccess,
    isAdmin: user.role === 'admin',
    isAttorney: user.role === 'attorney',
    isParalegal: user.role === 'paralegal',
  }
}