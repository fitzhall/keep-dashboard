'use client'

import React, { createContext, useContext, useReducer, useState } from 'react'

// Minimal types
export interface UserProgress {
  courses: any[]
  sopPhases: any[]
  templatesDownloaded: string[]
  complianceScore: number
  activity: any[]
  lastUpdated: string
}

// Initial state
const initialProgress: UserProgress = {
  courses: [],
  sopPhases: [],
  templatesDownloaded: [],
  complianceScore: 0,
  activity: [],
  lastUpdated: new Date().toISOString()
}

// Simple reducer
function progressReducer(state: UserProgress, action: any): UserProgress {
  return state
}

// Context
const UserProgressContext = createContext<{
  progress: UserProgress
  dispatch: React.Dispatch<any>
  isLoading: boolean
  userProfile: any
} | undefined>(undefined)

// Provider
export function UserProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress] = useReducer(progressReducer, initialProgress)
  const [isLoading] = useState(false)
  const [userProfile] = useState({
    id: '559f27f3-d174-47f7-aea4-101d1c6aeb2e',
    email: 'user@example.com',
    name: 'Test User',
    role: 'attorney',
    firm: 'Johnson Estate Planning'
  })

  return (
    <UserProgressContext.Provider value={{ progress, dispatch: () => {}, isLoading, userProfile }}>
      {children}
    </UserProgressContext.Provider>
  )
}

// Hook
export function useUserProgress() {
  const context = useContext(UserProgressContext)
  if (context === undefined) {
    throw new Error('useUserProgress must be used within a UserProgressProvider')
  }
  return context
}