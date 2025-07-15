const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jicdgyirlvwewqsacyyo.supabase.co'
const supabaseKey = 'sb_publishable_4c0RtkonQWTgVsetiLPZhA_2Nfgdk3C'

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugUserFlow() {
  console.log('🔍 Debugging user flow...\n')
  
  // Check if user profile exists for mock user
  const mockUserId = 'auth0|mock-user-id'
  
  console.log('1. Checking for existing user profile...')
  const { data: existingProfile, error: fetchError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('auth0_id', mockUserId)
    .single()
  
  if (existingProfile) {
    console.log('✅ User profile found:', existingProfile)
    
    // Check compliance data for this user
    console.log('\n2. Checking compliance data...')
    const { data: compliance, error: complianceError } = await supabase
      .from('compliance_categories')
      .select('*')
      .eq('user_id', existingProfile.id)
    
    if (compliance && compliance.length > 0) {
      console.log('✅ Compliance data found:', compliance.length, 'categories')
    } else {
      console.log('❌ No compliance data found for user')
    }
  } else {
    console.log('❌ No user profile found for mock user')
    console.log('Creating mock user profile...')
    
    // Create user profile
    const { data: newProfile, error: createError } = await supabase
      .from('user_profiles')
      .insert({
        auth0_id: mockUserId,
        email: 'user@example.com',
        name: 'Test User',
        avatar_url: null,
        role: 'attorney'
      })
      .select()
      .single()
    
    if (createError) {
      console.error('❌ Error creating user profile:', createError)
    } else {
      console.log('✅ Created user profile:', newProfile)
    }
  }
}

debugUserFlow()