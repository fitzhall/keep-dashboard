const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jicdgyirlvwewqsacyyo.supabase.co'
const supabaseKey = 'sb_publishable_4c0RtkonQWTgVsetiLPZhA_2Nfgdk3C'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTables() {
  console.log('Checking compliance tables...\n')
  
  const tables = [
    'compliance_categories',
    'ethics_checklist', 
    'onboarding_tasks',
    'compliance_reports',
    'user_profiles'
  ]
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`)
      } else {
        console.log(`✅ ${table}: Table exists, ${data ? data.length : 0} rows found`)
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`)
    }
  }
}

checkTables()