const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jicdgyirlvwewqsacyyo.supabase.co'
const supabaseKey = 'sb_publishable_4c0RtkonQWTgVsetiLPZhA_2Nfgdk3C'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDataAccess() {
  console.log('🔍 Testing data access for compliance components...\n')
  
  const mockUserId = '559f27f3-d174-47f7-aea4-101d1c6aeb2e' // The user ID we created
  
  console.log('1. Testing ComplianceScorecard data...')
  const { data: categories, error: catError } = await supabase
    .from('compliance_categories')
    .select('*')
    .eq('user_id', mockUserId)
  
  if (catError) {
    console.error('❌ Compliance categories error:', catError)
  } else {
    console.log('✅ Compliance categories:', categories.length, 'found')
  }
  
  console.log('\n2. Testing OnboardingChecklist data...')
  const { data: tasks, error: taskError } = await supabase
    .from('onboarding_tasks')
    .select('*')
    .eq('user_id', mockUserId)
  
  if (taskError) {
    console.error('❌ Onboarding tasks error:', taskError)
  } else {
    console.log('✅ Onboarding tasks:', tasks.length, 'found')
  }
  
  console.log('\n3. Testing Ethics Checklist data...')
  const { data: ethics, error: ethicsError } = await supabase
    .from('ethics_checklist')
    .select('*')
    .eq('user_id', mockUserId)
  
  if (ethicsError) {
    console.error('❌ Ethics checklist error:', ethicsError)
  } else {
    console.log('✅ Ethics checklist:', ethics.length, 'found')
  }
  
  console.log('\n4. Testing User Profile...')
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('auth0_id', 'auth0|mock-user-id')
    .single()
  
  if (profileError) {
    console.error('❌ User profile error:', profileError)
  } else {
    console.log('✅ User profile found:', profile.id)
  }
}

testDataAccess()