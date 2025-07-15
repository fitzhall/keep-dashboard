const { createClient } = require('@supabase/supabase-js')

// Manually set the environment variables
const supabaseUrl = 'https://jicdgyirlvwewqsacyyo.supabase.co'
const supabaseKey = 'sb_publishable_4c0RtkonQWTgVsetiLPZhA_2Nfgdk3C'

console.log('Testing Supabase connection...')
console.log('URL:', supabaseUrl)
console.log('Key (first 20 chars):', supabaseKey?.substring(0, 20) + '...')

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('compliance_categories')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      return false
    }
    
    console.log('✅ Connection successful!')
    console.log('✅ compliance_categories table accessible')
    return true
  } catch (err) {
    console.error('❌ Unexpected error:', err.message)
    return false
  }
}

testConnection()