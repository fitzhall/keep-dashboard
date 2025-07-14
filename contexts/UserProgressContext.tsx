'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'

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
    { id: 1, status: 'completed', progress: 100, completedDate: '2024-01-10' },
    { id: 2, status: 'in-progress', progress: 65, lastAccessed: '2024-01-14' },
    { id: 3, status: 'not-started', progress: 0 },
    { id: 4, status: 'not-started', progress: 0 },
  ],
  sopPhases: [
    { phase: 1, status: 'completed', completedDate: '2024-01-05' },
    { phase: 2, status: 'completed', completedDate: '2024-01-08' },
    { phase: 3, status: 'completed', completedDate: '2024-01-12' },
    { phase: 4, status: 'not-started' },
    { phase: 5, status: 'not-started' },
    { phase: 6, status: 'not-started' },
    { phase: 7, status: 'not-started' },
  ],
  templatesDownloaded: [
    'bitcoin-trust-template.md',
    'client-intake-questionnaire.md', 
    'compliance-checklist.md',
    'family-recovery-guide.md'
  ],
  complianceScore: 85,
  activity: [
    {
      id: '1',
      type: 'training',
      title: 'Completed Bitcoin Estate Planning Fundamentals',
      description: 'Earned 2.5 CLE credits',
      timestamp: '2024-01-10T10:30:00Z'
    },
    {
      id: '2', 
      type: 'template',
      title: 'Downloaded Bitcoin Trust Template',
      description: 'Added to your practice toolkit',
      timestamp: '2024-01-09T14:20:00Z'
    },
    {
      id: '3',
      type: 'support',
      title: 'Expert Hotline Response Received', 
      description: 'Multi-sig setup guidance provided',
      timestamp: '2024-01-07T09:15:00Z'
    },
    {
      id: '4',
      type: 'compliance',
      title: 'Compliance Checklist Updated',
      description: 'New California regulations added',
      timestamp: '2024-01-05T16:45:00Z'
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
      return action.progress

    default:
      return state
  }
}

// Context
const UserProgressContext = createContext<{
  progress: UserProgress
  dispatch: React.Dispatch<ProgressAction>
} | undefined>(undefined)

// Provider
export function UserProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, dispatch] = useReducer(progressReducer, initialProgress)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('keep-user-progress')
    if (saved) {
      try {
        const parsedProgress = JSON.parse(saved)
        dispatch({ type: 'LOAD_PROGRESS', progress: parsedProgress })
      } catch (error) {
        console.error('Failed to load progress from localStorage:', error)
      }
    }
  }, [])

  // Save to localStorage whenever progress changes
  useEffect(() => {
    localStorage.setItem('keep-user-progress', JSON.stringify(progress))
  }, [progress])

  return (
    <UserProgressContext.Provider value={{ progress, dispatch }}>
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