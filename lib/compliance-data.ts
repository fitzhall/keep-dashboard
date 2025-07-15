import { supabase, getServiceSupabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type ComplianceCategory = Database['public']['Tables']['compliance_categories']['Row']
type EthicsChecklistItem = Database['public']['Tables']['ethics_checklist']['Row']
type OnboardingTask = Database['public']['Tables']['onboarding_tasks']['Row']
type ComplianceReport = Database['public']['Tables']['compliance_reports']['Row']

// Default compliance categories
const defaultCategories = [
  { id: 'ethics', name: 'Ethics & Professional Responsibility', total: 20 },
  { id: 'documentation', name: 'Client Documentation', total: 25 },
  { id: 'training', name: 'Required Training', total: 9 },
  { id: 'client-management', name: 'Client Management', total: 25 },
  { id: 'business-practices', name: 'Business Practices', total: 20 },
  { id: 'certifications', name: 'Certifications & Licenses', total: 20 }
]

// Default ethics checklist items
const defaultEthicsItems = [
  {
    item_id: 1,
    title: 'Competence (ABA Rule 1.1)',
    description: 'Completed required Bitcoin estate planning training and certification'
  },
  {
    item_id: 2,
    title: 'Confidentiality (ABA Rule 1.6)',
    description: 'Established secure procedures for handling client Bitcoin information'
  },
  {
    item_id: 3,
    title: 'Conflict of Interest (ABA Rule 1.7)',
    description: 'Completed conflict check for cryptocurrency-related matters'
  },
  {
    item_id: 4,
    title: 'Client Communication (ABA Rule 1.4)',
    description: 'Provided clear written explanation of Bitcoin estate planning process'
  }
]

// Default onboarding tasks
const defaultOnboardingTasks = [
  // Day 1
  {
    day: 1,
    tasks: [
      {
        task_id: '1-1',
        title: 'Complete account setup and profile',
        description: 'Add your firm information, upload photo, and verify credentials',
        time_estimate: '15 min'
      },
      {
        task_id: '1-2',
        title: 'Watch platform overview video',
        description: 'Learn about KEEP Protocol and dashboard navigation',
        time_estimate: '20 min'
      },
      {
        task_id: '1-3',
        title: 'Download and review KEEP Protocol handbook',
        description: 'Essential reading for understanding the system',
        time_estimate: '45 min'
      },
      {
        task_id: '1-4',
        title: 'Join the KEEP Protocol community',
        description: 'Access to private forum and expert support',
        time_estimate: '10 min'
      }
    ]
  },
  // Day 2
  {
    day: 2,
    tasks: [
      {
        task_id: '2-1',
        title: 'Complete 10-Phase SOP training module',
        description: 'Master the core KEEP Protocol process',
        time_estimate: '90 min'
      },
      {
        task_id: '2-2',
        title: 'Download all SOP templates',
        description: 'Get the complete template library for your practice',
        time_estimate: '15 min'
      },
      {
        task_id: '2-3',
        title: 'Review ethics compliance checklist',
        description: 'Understand ABA ethics rules for Bitcoin estate planning',
        time_estimate: '30 min'
      },
      {
        task_id: '2-4',
        title: 'Complete SOP quiz',
        description: 'Test your understanding of the process',
        time_estimate: '20 min'
      }
    ]
  },
  // Day 3
  {
    day: 3,
    tasks: [
      {
        task_id: '3-1',
        title: 'Review all template documents',
        description: 'Familiarize yourself with each template in the library',
        time_estimate: '60 min'
      },
      {
        task_id: '3-2',
        title: 'Customize templates for your jurisdiction',
        description: 'Add your firm details and local requirements',
        time_estimate: '45 min'
      },
      {
        task_id: '3-3',
        title: 'Set up document management system',
        description: 'Organize templates for efficient client work',
        time_estimate: '30 min'
      },
      {
        task_id: '3-4',
        title: 'Create your first client intake form',
        description: 'Practice using the templates',
        time_estimate: '20 min'
      }
    ]
  },
  // Day 4
  {
    day: 4,
    tasks: [
      {
        task_id: '4-1',
        title: 'Review mock client scenario',
        description: 'Study the provided client case details',
        time_estimate: '30 min'
      },
      {
        task_id: '4-2',
        title: 'Complete full SOP process for mock client',
        description: "Apply everything you've learned",
        time_estimate: '120 min'
      },
      {
        task_id: '4-3',
        title: 'Submit mock client documents for review',
        description: 'Get expert feedback on your work',
        time_estimate: '15 min'
      },
      {
        task_id: '4-4',
        title: 'Review feedback and make corrections',
        description: 'Learn from expert guidance',
        time_estimate: '45 min'
      }
    ]
  },
  // Day 5
  {
    day: 5,
    tasks: [
      {
        task_id: '5-1',
        title: 'Complete final certification exam',
        description: 'Demonstrate your mastery of KEEP Protocol',
        time_estimate: '60 min'
      },
      {
        task_id: '5-2',
        title: 'Schedule 1-on-1 with KEEP expert',
        description: 'Get personalized guidance for your practice',
        time_estimate: '30 min'
      },
      {
        task_id: '5-3',
        title: 'Receive KEEP Protocol certification',
        description: 'Official certification for your practice',
        time_estimate: '5 min'
      },
      {
        task_id: '5-4',
        title: 'Launch your Bitcoin estate planning practice',
        description: "You're ready to serve clients!",
        time_estimate: '∞'
      }
    ]
  }
]

// Initialize compliance data for a new user
export async function initializeComplianceData(userId: string) {
  try {
    // Initialize compliance categories
    const categoryPromises = defaultCategories.map(cat =>
      supabase.from('compliance_categories').upsert({
        user_id: userId,
        category_id: cat.id,
        category_name: cat.name,
        score: 0,
        items_completed: 0,
        items_total: cat.total,
        trend: 'stable'
      }, {
        onConflict: 'user_id,category_id'
      })
    )

    // Initialize ethics checklist
    const ethicsPromises = defaultEthicsItems.map(item =>
      supabase.from('ethics_checklist').upsert({
        user_id: userId,
        item_id: item.item_id,
        title: item.title,
        description: item.description,
        completed: false
      }, {
        onConflict: 'user_id,item_id'
      })
    )

    // Initialize onboarding tasks
    const onboardingPromises = defaultOnboardingTasks.flatMap(day =>
      day.tasks.map(task =>
        supabase.from('onboarding_tasks').upsert({
          user_id: userId,
          day_number: day.day,
          task_id: task.task_id,
          title: task.title,
          description: task.description,
          time_estimate: task.time_estimate,
          completed: false
        }, {
          onConflict: 'user_id,task_id'
        })
      )
    )

    await Promise.all([...categoryPromises, ...ethicsPromises, ...onboardingPromises])
  } catch (error) {
    console.error('Error initializing compliance data:', error)
  }
}

// Get compliance categories for a user
export async function getComplianceCategories(userId: string): Promise<ComplianceCategory[]> {
  try {
    console.log('Fetching compliance categories for user:', userId)
    
    const { data, error } = await supabase
      .from('compliance_categories')
      .select('*')
      .eq('user_id', userId)
      .order('category_id')

    if (error) {
      console.error('Error fetching compliance categories:', error)
      throw error
    }

    if (!data || data.length === 0) {
      console.log('No compliance data found')
      return []
    }

    return data
  } catch (error) {
    console.error('Error in getComplianceCategories:', error)
    throw error
  }
}

// Update compliance category score
export async function updateComplianceCategory(
  userId: string,
  categoryId: string,
  updates: Partial<ComplianceCategory>
) {
  const { error } = await supabase
    .from('compliance_categories')
    .update({
      ...updates,
      last_updated: new Date().toISOString()
    })
    .eq('user_id', userId)
    .eq('category_id', categoryId)

  if (error) {
    console.error('Error updating compliance category:', error)
    throw error
  }
}

// Get ethics checklist items
export async function getEthicsChecklist(userId: string): Promise<EthicsChecklistItem[]> {
  try {
    const { data, error } = await supabase
      .from('ethics_checklist')
      .select('*')
      .eq('user_id', userId)
      .order('item_id')

    if (error) {
      console.error('Error fetching ethics checklist:', error)
      throw error
    }

    if (!data || data.length === 0) {
      console.log('No ethics data found')
      return []
    }

    return data
  } catch (error) {
    console.error('Error in getEthicsChecklist:', error)
    throw error
  }
}

// Toggle ethics checklist item
export async function toggleEthicsChecklistItem(userId: string, itemId: number) {
  try {
    const serviceSupabase = getServiceSupabase()
    
    // First get the current state
    const { data: current } = await serviceSupabase
      .from('ethics_checklist')
      .select('completed')
      .eq('user_id', userId)
      .eq('item_id', itemId)
      .single()

    if (!current) return

    const { error } = await serviceSupabase
      .from('ethics_checklist')
      .update({
        completed: !current.completed,
        completed_at: !current.completed ? new Date().toISOString() : null
      })
      .eq('user_id', userId)
      .eq('item_id', itemId)

    if (error) {
      console.error('Error toggling ethics checklist item:', error)
      throw error
    }

    // Update the ethics category score
    await updateEthicsCategoryScore(userId)
  } catch (error) {
    console.error('Error in toggleEthicsChecklistItem:', error)
    throw error
  }
}

// Update ethics category score based on checklist completion
async function updateEthicsCategoryScore(userId: string) {
  const checklist = await getEthicsChecklist(userId)
  const completed = checklist.filter(item => item.completed).length
  const total = checklist.length
  const score = Math.round((completed / total) * 100)

  await updateComplianceCategory(userId, 'ethics', {
    score,
    items_completed: completed,
    items_total: total
  })
}

// Get onboarding tasks
export async function getOnboardingTasks(userId: string): Promise<OnboardingTask[]> {
  try {
    const { data, error } = await supabase
      .from('onboarding_tasks')
      .select('*')
      .eq('user_id', userId)
      .order('day_number')
      .order('task_id')

    if (error) {
      console.error('Error fetching onboarding tasks:', error)
      throw error
    }

    if (!data || data.length === 0) {
      console.log('No onboarding data found')
      return []
    }

    return data
  } catch (error) {
    console.error('Error in getOnboardingTasks:', error)
    throw error
  }
}

// Toggle onboarding task
export async function toggleOnboardingTask(userId: string, taskId: string) {
  try {
    const serviceSupabase = getServiceSupabase()
    
    // First get the current state
    const { data: current } = await serviceSupabase
      .from('onboarding_tasks')
      .select('completed')
      .eq('user_id', userId)
      .eq('task_id', taskId)
      .single()

    if (!current) return

    const { error } = await serviceSupabase
      .from('onboarding_tasks')
      .update({
        completed: !current.completed,
        completed_at: !current.completed ? new Date().toISOString() : null
      })
      .eq('user_id', userId)
      .eq('task_id', taskId)

    if (error) {
      console.error('Error toggling onboarding task:', error)
      throw error
    }
  } catch (error) {
    console.error('Error in toggleOnboardingTask:', error)
    throw error
  }
}

// Get recent compliance reports
export async function getComplianceReports(userId: string, limit = 5): Promise<ComplianceReport[]> {
  const { data, error } = await supabase
    .from('compliance_reports')
    .select('*')
    .eq('user_id', userId)
    .order('generated_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching compliance reports:', error)
    return []
  }

  return data || []
}

// Generate compliance report
export async function generateComplianceReport(
  userId: string,
  reportType: ComplianceReport['report_type'],
  reportFormat: ComplianceReport['report_format'],
  dateFrom: string,
  dateTo: string,
  sections: string[]
) {
  const fileName = `Compliance_${reportType}_Report_${new Date().toISOString().split('T')[0]}.${reportFormat}`
  
  const { data, error } = await supabase
    .from('compliance_reports')
    .insert({
      user_id: userId,
      report_type: reportType,
      report_format: reportFormat,
      date_from: dateFrom,
      date_to: dateTo,
      file_name: fileName,
      file_size: '2.4 MB', // This would be calculated in a real implementation
      sections: sections
    })
    .select()
    .single()

  if (error) {
    console.error('Error generating compliance report:', error)
    throw error
  }

  return data
}

// Calculate overall compliance score
export function calculateOverallScore(categories: ComplianceCategory[]): number {
  if (categories.length === 0) return 0
  const totalScore = categories.reduce((sum, cat) => sum + cat.score, 0)
  return Math.round(totalScore / categories.length)
}