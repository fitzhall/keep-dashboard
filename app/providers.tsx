'use client'

import { UserProgressProvider } from '@/contexts/UserProgressContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProgressProvider>
      {children}
    </UserProgressProvider>
  )
}