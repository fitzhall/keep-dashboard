'use client'

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
// import { useUser } from '@auth0/nextjs-auth0/client' // TODO: Fix Auth0 client import

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

// Initial state
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
  complianceScore: 0,
  activity: [],
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
  | { type: 'SYNC_FROM_DATABASE'; progress: UserProgress }

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
      const completedCourse = state.courses.find(c => c.id === action.courseId)
      const newState = {
        ...state,
        courses: state.courses.map(course =>
          course.id === action.courseId
            ? { ...course, status: 'completed' as const, progress: 100, completedDate: new Date().toISOString() }
            : course
        ),
        lastUpdated: new Date().toISOString()
      }
      
      // Add activity for course completion
      if (completedCourse) {
        const courseNames = ['Bitcoin Estate Planning Fundamentals', 'Technical Custody Solutions', 'Ethics & Compliance in Crypto Law', 'Advanced Trust Structures']
        const courseCredits = [2.5, 3, 2, 4]
        newState.activity = [
          {
            id: Date.now().toString(),
            type: 'training',
            title: `Completed ${courseNames[action.courseId - 1]}`,
            description: `Earned ${courseCredits[action.courseId - 1]} CLE credits`,
            timestamp: new Date().toISOString()
          },
          ...state.activity
        ]
      }
      return newState

    case 'START_COURSE':
      return {
        ...state,
        courses: state.courses.map(course =>
          course.id === action.courseId
            ? { ...course, status: 'in-progress' as const, lastAccessed: new Date().toISOString() }
            : course
        ),
        lastUpdated: new Date().toISOString()
      }

    case 'ACCESS_SOP_PHASE':
      return {
        ...state,
        sopPhases: state.sopPhases.map(phase =>
          phase.phase === action.phase
            ? { ...phase, lastAccessed: new Date().toISOString() }
            : phase
        ),
        lastUpdated: new Date().toISOString()
      }

    case 'COMPLETE_SOP_PHASE':
      const newSOPState = {
        ...state,
        sopPhases: state.sopPhases.map(phase =>
          phase.phase === action.phase
            ? { ...phase, status: 'completed' as const, completedDate: new Date().toISOString() }
            : phase
        ),
        lastUpdated: new Date().toISOString()
      }
      
      // Add activity for SOP completion
      newSOPState.activity = [
        {
          id: Date.now().toString(),
          type: 'sop',
          title: `Completed SOP Phase ${action.phase}`,
          description: 'Advanced to next phase of methodology',
          timestamp: new Date().toISOString()
        },
        ...state.activity
      ]
      return newSOPState

    case 'DOWNLOAD_TEMPLATE':
      if (state.templatesDownloaded.includes(action.templateId)) {
        return state // Already downloaded
      }
      
      return {
        ...state,
        templatesDownloaded: [...state.templatesDownloaded, action.templateId],
        activity: [
          {
            id: Date.now().toString(),
            type: 'template',
            title: `Downloaded ${action.templateName}`,
            description: 'Added to your practice toolkit',
            timestamp: new Date().toISOString()
          },
          ...state.activity
        ],
        lastUpdated: new Date().toISOString()
      }

    case 'UPDATE_COMPLIANCE_SCORE':
      return {
        ...state,
        complianceScore: action.score,
        lastUpdated: new Date().toISOString()
      }

    case 'ADD_ACTIVITY':
      return {
        ...state,
        activity: [
          {
            ...action.activity,
            id: Date.now().toString(),
            timestamp: new Date().toISOString()
          },
          ...state.activity
        ],
        lastUpdated: new Date().toISOString()
      }

    case 'LOAD_PROGRESS':
    case 'SYNC_FROM_DATABASE':
      return action.progress

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
  const [dbUserId, setDbUserId] = useState<string | null>(null)

  // Initialize user profile in database
  useEffect(() => {
    async function initializeUser() {
      if (!user?.sub) {
        setIsLoading(false)
        return
      }

      try {
        // For development, use the existing mock user we created
        const mockProfile = {
          id: '559f27f3-d174-47f7-aea4-101d1c6aeb2e',
          auth0_id: user.sub,
          email: user.email || 'user@example.com',
          name: user.name || user.nickname || 'Test User',
          avatar_url: user.picture || null,
          role: 'attorney',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        setUserProfile(mockProfile)
        setDbUserId(mockProfile.id)
        
        console.log('Using mock user profile:', mockProfile)
      } catch (error) {
        console.error('Error initializing user:', error)
      }
    }

    initializeUser()
  }, [user])

  // Load progress from database
  useEffect(() => {
    async function loadProgress() {
      if (!dbUserId) {
        setIsLoading(false)
        return
      }

      try {
        // Load course progress
        const { data: courses } = await supabase
          .from('course_progress')
          .select('*')
          .eq('user_id', dbUserId)

        // Load SOP progress
        const { data: sopPhases } = await supabase
          .from('sop_progress')
          .select('*')
          .eq('user_id', dbUserId)

        // Load template downloads
        const { data: templates } = await supabase
          .from('template_downloads')
          .select('*')
          .eq('user_id', dbUserId)

        // Load activity log
        const { data: activities } = await supabase
          .from('activity_log')
          .select('*')
          .eq('user_id', dbUserId)
          .order('created_at', { ascending: false })
          .limit(20)

        // Load compliance score
        const { data: compliance } = await supabase
          .from('compliance_scores')
          .select('*')
          .eq('user_id', dbUserId)
          .single()

        // Merge with initial state
        const mergedProgress: UserProgress = {
          courses: initialProgress.courses.map(course => {
            const dbCourse = courses?.find((c: any) => c.course_id === course.id)
            return dbCourse ? {
              id: course.id,
              status: dbCourse.status,
              progress: dbCourse.progress,
              completedDate: dbCourse.completed_date,
              lastAccessed: dbCourse.last_accessed
            } : course
          }),
          sopPhases: initialProgress.sopPhases.map(phase => {
            const dbPhase = sopPhases?.find((p: any) => p.phase === phase.phase)
            return dbPhase ? {
              phase: phase.phase,
              status: dbPhase.status,
              completedDate: dbPhase.completed_date,
              lastAccessed: dbPhase.last_accessed
            } : phase
          }),
          templatesDownloaded: templates?.map((t: any) => t.template_id) || [],
          complianceScore: compliance?.score || 0,
          activity: activities?.map((a: any) => ({
            id: a.id,
            type: a.type,
            title: a.title,
            description: a.description,
            timestamp: a.created_at,
            metadata: a.metadata
          })) || [],
          lastUpdated: new Date().toISOString()
        }

        dispatch({ type: 'SYNC_FROM_DATABASE', progress: mergedProgress })
        
        // Also check localStorage for any unsynced data
        const localData = localStorage.getItem('keep-user-progress')
        if (localData) {
          try {
            const localProgress = JSON.parse(localData)
            await syncLocalToDatabase(localProgress, dbUserId)
            localStorage.removeItem('keep-user-progress') // Clean up after sync
          } catch (error) {
            console.error('Error syncing local data:', error)
          }
        }
      } catch (error) {
        console.error('Error loading progress:', error)
        // Don't crash, just set to default state
        dispatch({ type: 'LOAD_PROGRESS', progress: initialProgress })
      } finally {
        setIsLoading(false)
      }
    }

    loadProgress()
  }, [dbUserId])

  // Sync progress changes to database
  useEffect(() => {
    if (!dbUserId || isLoading) return

    const syncToDatabase = async () => {
      try {
        // Update course progress
        for (const course of progress.courses) {
          if (course.progress > 0 || course.status !== 'not-started') {
            await supabase
              .from('course_progress')
              .upsert({
                user_id: dbUserId,
                course_id: course.id,
                status: course.status,
                progress: course.progress,
                completed_date: course.completedDate,
                last_accessed: course.lastAccessed
              })
          }
        }

        // Update SOP progress
        for (const phase of progress.sopPhases) {
          if (phase.status !== 'not-started') {
            await supabase
              .from('sop_progress')
              .upsert({
                user_id: dbUserId,
                phase: phase.phase,
                status: phase.status,
                completed_date: phase.completedDate,
                last_accessed: phase.lastAccessed
              })
          }
        }

        // Update compliance score
        await supabase
          .from('compliance_scores')
          .upsert({
            user_id: dbUserId,
            score: progress.complianceScore
          })
      } catch (error) {
        console.error('Error syncing to database:', error)
      }
    }

    const debounceTimer = setTimeout(syncToDatabase, 1000)
    return () => clearTimeout(debounceTimer)
  }, [progress, dbUserId, isLoading])

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

// Helper functions
async function initializeUserProgress(userId: string) {
  // Initialize course progress
  for (let i = 1; i <= 4; i++) {
    await supabase.from('course_progress').upsert({
      user_id: userId,
      course_id: i,
      status: 'not-started',
      progress: 0
    })
  }

  // Initialize SOP progress
  for (let i = 1; i <= 7; i++) {
    await supabase.from('sop_progress').upsert({
      user_id: userId,
      phase: i,
      status: 'not-started'
    })
  }

  // Initialize compliance score
  await supabase.from('compliance_scores').upsert({
    user_id: userId,
    score: 0
  })
}

async function syncLocalToDatabase(localProgress: UserProgress, userId: string) {
  // Sync any progress from localStorage that might be more recent
  for (const course of localProgress.courses) {
    if (course.progress > 0) {
      await supabase.from('course_progress').upsert({
        user_id: userId,
        course_id: course.id,
        status: course.status,
        progress: course.progress,
        completed_date: course.completedDate,
        last_accessed: course.lastAccessed
      })
    }
  }

  for (const download of localProgress.templatesDownloaded) {
    await supabase.from('template_downloads').upsert({
      user_id: userId,
      template_id: download,
      template_name: download // We'll improve this later
    })
  }

  for (const activity of localProgress.activity.slice(0, 10)) {
    await supabase.from('activity_log').insert({
      user_id: userId,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      metadata: activity.metadata
    })
  }
}