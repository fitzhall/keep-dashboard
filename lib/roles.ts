export type UserRole = 'admin' | 'attorney' | 'paralegal'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  firm?: string
  avatar?: string
}

export interface Permission {
  resource: string
  action: 'read' | 'write' | 'delete' | 'admin'
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { resource: 'users', action: 'admin' },
    { resource: 'attorneys', action: 'admin' },
    { resource: 'templates', action: 'admin' },
    { resource: 'compliance', action: 'admin' },
    { resource: 'analytics', action: 'admin' },
    { resource: 'tickets', action: 'admin' },
    { resource: 'sop', action: 'admin' },
    { resource: 'cle', action: 'admin' },
  ],
  attorney: [
    { resource: 'templates', action: 'read' },
    { resource: 'compliance', action: 'write' },
    { resource: 'tickets', action: 'write' },
    { resource: 'sop', action: 'read' },
    { resource: 'cle', action: 'write' },
    { resource: 'firm', action: 'read' },
  ],
  paralegal: [
    { resource: 'templates', action: 'read' },
    { resource: 'compliance', action: 'read' },
    { resource: 'tickets', action: 'read' },
    { resource: 'sop', action: 'read' },
    { resource: 'cle', action: 'read' },
  ],
}

export function hasPermission(
  userRole: UserRole,
  resource: string,
  action: 'read' | 'write' | 'delete' | 'admin'
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole]
  
  return permissions.some(permission => {
    if (permission.resource !== resource) return false
    
    // Admin action requires exact match
    if (action === 'admin') return permission.action === 'admin'
    
    // For other actions, check hierarchy: admin > delete > write > read
    const actionHierarchy = ['read', 'write', 'delete', 'admin']
    const userActionLevel = actionHierarchy.indexOf(permission.action)
    const requiredActionLevel = actionHierarchy.indexOf(action)
    
    return userActionLevel >= requiredActionLevel
  })
}

export function canAccessRoute(userRole: UserRole, route: string): boolean {
  const routePermissions: Record<string, { resource: string; action: 'read' | 'write' | 'admin' }> = {
    '/admin': { resource: 'users', action: 'admin' },
    '/dashboard': { resource: 'firm', action: 'read' },
    '/templates': { resource: 'templates', action: 'read' },
    '/compliance': { resource: 'compliance', action: 'read' },
    '/sop': { resource: 'sop', action: 'read' },
    '/settings': { resource: 'firm', action: 'read' },
  }

  const routePermission = routePermissions[route]
  if (!routePermission) return true // Allow access to unspecified routes

  return hasPermission(userRole, routePermission.resource, routePermission.action)
}

// Mock user data - in production this would come from your database
export function getMockUser(email: string): User {
  const mockUsers: Record<string, User> = {
    'admin@keep.law': {
      id: '1',
      email: 'admin@keep.law',
      name: 'KEEP Admin',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    },
    'sarah@johnsonlaw.com': {
      id: '2',
      email: 'sarah@johnsonlaw.com',
      name: 'Sarah Johnson',
      role: 'attorney',
      firm: 'Johnson Estate Planning',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
    },
    'paralegal@johnsonlaw.com': {
      id: '3',
      email: 'paralegal@johnsonlaw.com',
      name: 'Lisa Wong',
      role: 'paralegal',
      firm: 'Johnson Estate Planning',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
    }
  }

  return mockUsers[email] || {
    id: 'default',
    email,
    name: email.split('@')[0],
    role: 'attorney',
    firm: 'Demo Firm'
  }
}