'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

// Simple types
export interface UserProgress {
  courses: any[]
  sopPhases: any[]
  templatesDownloaded: string[]
  complianceScore: number
  activity: any[]
  lastUpdated: string
}

// Default progress data
const defaultProgress: UserProgress = {
  courses: [
    { id: 1, status: 'not-started', progress: 0 },
    { id: 2, status: 'not-started', progress: 0 },
    { id: 3, status: 'not-started', progress: 0 },
    { id: 4, status: 'not-started', progress: 0 },
  ],
  sopPhases: Array(7).fill(null).map((_, i) => ({ phase: i + 1, status: 'not-started' })),
  templatesDownloaded: [],
  complianceScore: 85,
  activity: [],
  lastUpdated: new Date().toISOString()
}

// Mock user profile
const mockUserProfile = {
  id: '559f27f3-d174-47f7-aea4-101d1c6aeb2e',
  email: 'user@example.com',
  name: 'Test User',
  role: 'attorney',
  firm: 'Johnson Estate Planning'
}

// Context
const UserProgressContext = createContext<{
  progress: UserProgress
  dispatch: (action: any) => void
  isLoading: boolean
  userProfile: any
  updateProgress: (updates: Partial<UserProgress>) => void
} | undefined>(undefined)

// Lightweight Provider - No database calls, no complex state
export function UserProgressProvider({ children }: { children: React.ReactNode }) {
  // Try to load from localStorage first
  const [progress, setProgress] = useState<UserProgress>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('keep-progress-lite')
        if (saved) {
          return JSON.parse(saved)
        }
      } catch (e) {
        console.warn('Could not load saved progress')
      }
    }
    return defaultProgress
  })

  const [userProfile] = useState(mockUserProfile)
  const [isLoading] = useState(false)

  // Simple update function
  const updateProgress = useCallback((updates: Partial<UserProgress>) => {
    setProgress(prev => {
      const newProgress = { ...prev, ...updates, lastUpdated: new Date().toISOString() }
      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('keep-progress-lite', JSON.stringify(newProgress))
        } catch (e) {
          console.warn('Could not save progress')
        }
      }
      return newProgress
    })
  }, [])

  // Simple dispatch for compatibility
  const dispatch = useCallback((action: any) => {
    console.log('Dispatch called:', action.type)
    // Handle basic actions without complex logic
    switch (action.type) {
      case 'UPDATE_COMPLIANCE_SCORE':
        updateProgress({ complianceScore: action.score })
        break
      case 'DOWNLOAD_TEMPLATE':
        updateProgress({ 
          templatesDownloaded: [...progress.templatesDownloaded, action.templateId]
        })
        break
      default:
        console.log('Unhandled action:', action.type)
    }
  }, [progress.templatesDownloaded, updateProgress])

  return (
    <UserProgressContext.Provider value={{ 
      progress, 
      dispatch, 
      isLoading, 
      userProfile,
      updateProgress 
    }}>
      {children}
    </UserProgressContext.Provider>
  )
}

// Hook
export function useUserProgress() {
  const context = useContext(UserProgressContext)
  if (context === undefined) {
    // Return mock data instead of throwing error
    console.warn('useUserProgress used outside provider, returning defaults')
    return {
      progress: defaultProgress,
      dispatch: () => {},
      isLoading: false,
      userProfile: mockUserProfile,
      updateProgress: () => {}
    }
  }
  return context
}