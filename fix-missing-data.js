const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jicdgyirlvwewqsacyyo.supabase.co'
const supabaseServiceKey = 'sb_secret_IqZChzcOt2P0ad9K6QVskw_YXnZLcMD'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixMissingData() {
  console.log('🔧 Fixing missing onboarding tasks...\n')
  
  const userId = '559f27f3-d174-47f7-aea4-101d1c6aeb2e'
  
  // Default onboarding tasks
  const defaultOnboardingTasks = [
    // Day 1
    {
      day: 1,
      tasks: [
        { task_id: '1-1', title: 'Complete account setup and profile', description: 'Add your firm information, upload photo, and verify credentials', time_estimate: '15 min' },
        { task_id: '1-2', title: 'Watch platform overview video', description: 'Learn about KEEP Protocol and dashboard navigation', time_estimate: '20 min' },
        { task_id: '1-3', title: 'Download and review KEEP Protocol handbook', description: 'Essential reading for understanding the system', time_estimate: '45 min' },
        { task_id: '1-4', title: 'Join the KEEP Protocol community', description: 'Access to private forum and expert support', time_estimate: '10 min' }
      ]
    },
    // Day 2
    {
      day: 2,
      tasks: [
        { task_id: '2-1', title: 'Complete 10-Phase SOP training module', description: 'Master the core KEEP Protocol process', time_estimate: '90 min' },
        { task_id: '2-2', title: 'Download all SOP templates', description: 'Get the complete template library for your practice', time_estimate: '15 min' },
        { task_id: '2-3', title: 'Review ethics compliance checklist', description: 'Understand ABA ethics rules for Bitcoin estate planning', time_estimate: '30 min' },
        { task_id: '2-4', title: 'Complete SOP quiz', description: 'Test your understanding of the process', time_estimate: '20 min' }
      ]
    },
    // Day 3
    {
      day: 3,
      tasks: [
        { task_id: '3-1', title: 'Review all template documents', description: 'Familiarize yourself with each template in the library', time_estimate: '60 min' },
        { task_id: '3-2', title: 'Customize templates for your jurisdiction', description: 'Add your firm details and local requirements', time_estimate: '45 min' },
        { task_id: '3-3', title: 'Set up document management system', description: 'Organize templates for efficient client work', time_estimate: '30 min' },
        { task_id: '3-4', title: 'Create your first client intake form', description: 'Practice using the templates', time_estimate: '20 min' }
      ]
    },
    // Day 4
    {
      day: 4,
      tasks: [
        { task_id: '4-1', title: 'Review mock client scenario', description: 'Study the provided client case details', time_estimate: '30 min' },
        { task_id: '4-2', title: 'Complete full SOP process for mock client', description: "Apply everything you've learned", time_estimate: '120 min' },
        { task_id: '4-3', title: 'Submit mock client documents for review', description: 'Get expert feedback on your work', time_estimate: '15 min' },
        { task_id: '4-4', title: 'Review feedback and make corrections', description: 'Learn from expert guidance', time_estimate: '45 min' }
      ]
    },
    // Day 5
    {
      day: 5,
      tasks: [
        { task_id: '5-1', title: 'Complete final certification exam', description: 'Demonstrate your mastery of KEEP Protocol', time_estimate: '60 min' },
        { task_id: '5-2', title: 'Schedule 1-on-1 with KEEP expert', description: 'Get personalized guidance for your practice', time_estimate: '30 min' },
        { task_id: '5-3', title: 'Receive KEEP Protocol certification', description: 'Official certification for your practice', time_estimate: '5 min' },
        { task_id: '5-4', title: 'Launch your Bitcoin estate planning practice', description: "You're ready to serve clients!", time_estimate: '∞' }
      ]
    }
  ]
  
  // Insert onboarding tasks
  const allTasks = defaultOnboardingTasks.flatMap(day =>
    day.tasks.map(task => ({
      user_id: userId,
      day_number: day.day,
      task_id: task.task_id,
      title: task.title,
      description: task.description,
      time_estimate: task.time_estimate,
      completed: day.day < 3 ? true : day.day === 3 ? Math.random() > 0.5 : false
    }))
  )
  
  console.log('Inserting', allTasks.length, 'onboarding tasks...')
  
  const { data: insertedTasks, error: taskError } = await supabase
    .from('onboarding_tasks')
    .insert(allTasks)
  
  if (taskError) {
    console.error('❌ Error inserting tasks:', taskError)
  } else {
    console.log('✅ Onboarding tasks created successfully!')
  }
  
  // Test access with publishable key
  console.log('\n🔍 Testing access with publishable key...')
  const publicSupabase = createClient(supabaseUrl, 'sb_publishable_4c0RtkonQWTgVsetiLPZhA_2Nfgdk3C')
  
  const { data: publicTasks, error: publicError } = await publicSupabase
    .from('onboarding_tasks')
    .select('*')
    .eq('user_id', userId)
    .limit(5)
  
  if (publicError) {
    console.error('❌ Public access error:', publicError)
  } else {
    console.log('✅ Public access works:', publicTasks.length, 'tasks found')
  }
}

fixMissingData()