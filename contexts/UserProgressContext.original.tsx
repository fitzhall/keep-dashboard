'use client'

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

// Mock user hook until Auth0 is properly configured
const useUser = () => {
  return {
    user: {
      sub: 'auth0|mock-user-id',
      email: 'user@example.com',
      name: 'Test User',
      picture: undefined,
      nickname: 'testuser'
    }
  }
}

// Types
export interface CourseProgress {
  id: number
  status: 'not-started' | 'in-progress' | 'completed'
  progress: number
  completedDate?: string
  lastAccessed?: string
}

export interface SOPProgress {
  phase: number
  status: 'not-started' | 'in-progress' | 'completed'
  completedDate?: string
  lastAccessed?: string
}

export interface ActivityItem {
  id: string
  type: 'training' | 'template' | 'support' | 'compliance' | 'sop'
  title: string
  description: string
  timestamp: string
  metadata?: any
}

export interface UserProgress {
  courses: CourseProgress[]
  sopPhases: SOPProgress[]
  templatesDownloaded: string[]
  complianceScore: number
  activity: ActivityItem[]
  lastUpdated: string
}

// Initial state with default data
const initialProgress: UserProgress = {
  courses: [
    { id: 1, status: 'not-started', progress: 0 },
    { id: 2, status: 'not-started', progress: 0 },
    { id: 3, status: 'not-started', progress: 0 },
    { id: 4, status: 'not-started', progress: 0 },
  ],
  sopPhases: [
    { phase: 1, status: 'not-started' },
    { phase: 2, status: 'not-started' },
    { phase: 3, status: 'not-started' },
    { phase: 4, status: 'not-started' },
    { phase: 5, status: 'not-started' },
    { phase: 6, status: 'not-started' },
    { phase: 7, status: 'not-started' },
  ],
  templatesDownloaded: [],
  complianceScore: 85,
  activity: [
    {
      id: '1',
      type: 'training',
      title: 'Started Bitcoin Fundamentals',
      description: 'Begin your journey into Bitcoin estate planning',
      timestamp: new Date().toISOString()
    }
  ],
  lastUpdated: new Date().toISOString()
}

// Action types
type ProgressAction = 
  | { type: 'UPDATE_COURSE_PROGRESS'; courseId: number; progress: number; status?: CourseProgress['status'] }
  | { type: 'COMPLETE_COURSE'; courseId: number }
  | { type: 'START_COURSE'; courseId: number }
  | { type: 'ACCESS_SOP_PHASE'; phase: number }
  | { type: 'COMPLETE_SOP_PHASE'; phase: number }
  | { type: 'DOWNLOAD_TEMPLATE'; templateId: string; templateName: string }
  | { type: 'UPDATE_COMPLIANCE_SCORE'; score: number }
  | { type: 'ADD_ACTIVITY'; activity: Omit<ActivityItem, 'id' | 'timestamp'> }
  | { type: 'LOAD_PROGRESS'; progress: UserProgress }
  | { type: 'SYNC_FROM_DATABASE'; progress: Partial<UserProgress> }

// Reducer
function progressReducer(state: UserProgress, action: ProgressAction): UserProgress {
  switch (action.type) {
    case 'UPDATE_COURSE_PROGRESS':
      return {
        ...state,
        courses: state.courses.map(course =>
          course.id === action.courseId
            ? { 
                ...course, 
                progress: action.progress,
                status: action.status || (action.progress === 100 ? 'completed' : action.progress > 0 ? 'in-progress' : 'not-started'),
                lastAccessed: new Date().toISOString(),
                ...(action.progress === 100 && { completedDate: new Date().toISOString() })
              }
            : course
        ),
        lastUpdated: new Date().toISOString()
      }

    case 'COMPLETE_COURSE':
      return {
        ...state,
        courses: state.courses.map(course =>
          course.id === action.courseId
            ? { ...course, status: 'completed' as const, progress: 100, completedDate: new Date().toISOString() }
            : course
        ),
        lastUpdated: new Date().toISOString()
      }

    case 'LOAD_PROGRESS':
      return action.progress

    case 'SYNC_FROM_DATABASE':
      return {
        ...state,
        ...action.progress,
        lastUpdated: new Date().toISOString()
      }

    default:
      return state
  }
}

// Context
const UserProgressContext = createContext<{
  progress: UserProgress
  dispatch: React.Dispatch<ProgressAction>
  isLoading: boolean
  userProfile: any
} | undefined>(undefined)

// Provider
export function UserProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const [progress, dispatch] = useReducer(progressReducer, initialProgress)
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)

  // Initialize user profile
  useEffect(() => {
    async function initializeUser() {
      try {
        // For development, use the existing mock user we created
        const mockProfile = {
          id: '559f27f3-d174-47f7-aea4-101d1c6aeb2e',
          auth0_id: user.sub,
          email: user.email || 'user@example.com',
          name: user.name || user.nickname || 'Test User',
          avatar_url: user.picture || null,
          role: 'attorney',
          firm: 'Johnson Estate Planning',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        setUserProfile(mockProfile)
        console.log('User profile initialized')
      } catch (error) {
        console.error('Error initializing user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeUser()
  }, [user])

  // Try to load progress from database (with error handling)
  useEffect(() => {
    async function loadProgress() {
      if (!userProfile?.id) return

      try {
        console.log('Attempting to load user progress from database...')
        
        // Try to load data but don't crash if it fails
        const { data: categories } = await supabase
          .from('compliance_categories')
          .select('*')
          .eq('user_id', userProfile.id)
          .limit(1)

        if (categories && categories.length > 0) {
          console.log('Found user data in database')
          // If we have data, calculate compliance score
          const totalScore = categories.reduce((sum: number, cat: any) => sum + (cat.score || 0), 0)
          const avgScore = Math.round(totalScore / categories.length)
          
          dispatch({ 
            type: 'SYNC_FROM_DATABASE', 
            progress: { complianceScore: avgScore }
          })
        } else {
          console.log('No user data found, using defaults')
        }
      } catch (error) {
        console.warn('Could not load progress from database, using local defaults:', error)
        // Don't crash - just use the initial state
      }
    }

    loadProgress()
  }, [userProfile])

  return (
    <UserProgressContext.Provider value={{ progress, dispatch, isLoading, userProfile }}>
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