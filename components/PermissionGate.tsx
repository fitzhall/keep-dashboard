'use client'

import { usePermissions } from '@/hooks/use-permissions'
import { ReactNode } from 'react'

interface PermissionGateProps {
  children: ReactNode
  resource: string
  action: 'read' | 'write' | 'delete' | 'admin'
  fallback?: ReactNode
}

export function PermissionGate({ children, resource, action, fallback = null }: PermissionGateProps) {
  const { hasPermission } = usePermissions()

  if (!hasPermission(resource, action)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

interface RoleGateProps {
  children: ReactNode
  allowedRoles: ('admin' | 'attorney' | 'paralegal')[]
  fallback?: ReactNode
}

export function RoleGate({ children, allowedRoles, fallback = null }: RoleGateProps) {
  const { user } = usePermissions()

  if (!allowedRoles.includes(user.role)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}