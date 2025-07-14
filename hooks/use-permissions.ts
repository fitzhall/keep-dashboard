import { hasPermission, canAccessRoute, getMockUser, type UserRole, type User } from '@/lib/roles'

export function usePermissions() {
  // For now, use mock data since Auth0 client import is having issues in build
  // In production, this would be: const { user: auth0User } = useUser()
  const auth0User = null
  
  // Use mock data for now - in production this would integrate with Auth0
  const user: User = getMockUser('sarah@johnsonlaw.com')

  const checkPermission = (resource: string, action: 'read' | 'write' | 'delete' | 'admin') => {
    return hasPermission(user.role, resource, action)
  }

  const checkRouteAccess = (route: string) => {
    return canAccessRoute(user.role, route)
  }

  return {
    user,
    hasPermission: checkPermission,
    canAccessRoute: checkRouteAccess,
    isAdmin: user.role === 'admin',
    isAttorney: user.role === 'attorney',
    isParalegal: user.role === 'paralegal',
  }
}