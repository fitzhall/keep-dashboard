import { useUser } from '@auth0/nextjs-auth0/client'
import { hasPermission, canAccessRoute, getMockUser, type UserRole, type User } from '@/lib/roles'

export function usePermissions() {
  const { user: auth0User } = useUser()
  
  // In development, use mock data. In production, get role from Auth0 user metadata
  const user: User = auth0User 
    ? {
        id: auth0User.sub || 'unknown',
        email: auth0User.email || '',
        name: auth0User.name || '',
        role: (auth0User['https://keep.law/role'] as UserRole) || 'attorney',
        firm: auth0User['https://keep.law/firm'],
        avatar: auth0User.picture
      }
    : getMockUser('sarah@johnsonlaw.com') // Default mock user for development

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