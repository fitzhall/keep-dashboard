'use client'

// import { Auth0Provider } from '@auth0/nextjs-auth0' // TODO: Fix Auth0 import
import { UserProgressProvider } from '@/contexts/UserProgressContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <Auth0Provider>
      <UserProgressProvider>
        {children}
      </UserProgressProvider>
    // </Auth0Provider>
  )
}