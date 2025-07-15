const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jicdgyirlvwewqsacyyo.supabase.co'
// Use service role key to bypass RLS
const supabaseServiceKey = 'sb_secret_IqZChzcOt2P0ad9K6QVskw_YXnZLcMD'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createMockUser() {
  console.log('🔧 Creating mock user with service role...\n')
  
  const mockUserId = 'auth0|mock-user-id'
  
  // Check if user already exists
  const { data: existing } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('auth0_id', mockUserId)
    .single()
  
  if (existing) {
    console.log('✅ User already exists:', existing)
    return existing
  }
  
  // Create user profile with service role
  const { data: newProfile, error } = await supabase
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
  
  if (error) {
    console.error('❌ Error creating user:', error)
    return null
  }
  
  console.log('✅ Created user profile:', newProfile)
  
  // Initialize compliance data
  console.log('\n🔧 Initializing compliance data...')
  
  const defaultCategories = [
    { id: 'ethics', name: 'Ethics & Professional Responsibility', total: 20 },
    { id: 'documentation', name: 'Client Documentation', total: 25 },
    { id: 'training', name: 'Required Training', total: 9 },
    { id: 'client-management', name: 'Client Management', total: 25 },
    { id: 'business-practices', name: 'Business Practices', total: 20 },
    { id: 'certifications', name: 'Certifications & Licenses', total: 20 }
  ]
  
  // Create compliance categories
  for (const cat of defaultCategories) {
    const { error: catError } = await supabase
      .from('compliance_categories')
      .upsert({
        user_id: newProfile.id,
        category_id: cat.id,
        category_name: cat.name,
        score: Math.floor(Math.random() * 30) + 70,
        items_completed: Math.floor(Math.random() * cat.total),
        items_total: cat.total,
        trend: 'stable'
      })
    
    if (catError) {
      console.error('❌ Error creating category:', catError)
    }
  }
  
  // Create ethics checklist
  const ethicsItems = [
    { item_id: 1, title: 'Competence (ABA Rule 1.1)', description: 'Completed required Bitcoin estate planning training and certification' },
    { item_id: 2, title: 'Confidentiality (ABA Rule 1.6)', description: 'Established secure procedures for handling client Bitcoin information' },
    { item_id: 3, title: 'Conflict of Interest (ABA Rule 1.7)', description: 'Completed conflict check for cryptocurrency-related matters' },
    { item_id: 4, title: 'Client Communication (ABA Rule 1.4)', description: 'Provided clear written explanation of Bitcoin estate planning process' }
  ]
  
  for (const item of ethicsItems) {
    const { error: ethicsError } = await supabase
      .from('ethics_checklist')
      .upsert({
        user_id: newProfile.id,
        item_id: item.item_id,
        title: item.title,
        description: item.description,
        completed: Math.random() > 0.5
      })
    
    if (ethicsError) {
      console.error('❌ Error creating ethics item:', ethicsError)
    }
  }
  
  console.log('✅ Compliance data initialized!')
  return newProfile
}

createMockUser()