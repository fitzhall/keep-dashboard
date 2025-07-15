const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

async function runMigration() {
  // Create admin client with service role key
  const supabase = createClient(
    'https://jicdgyirlvwewqsacyyo.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppY2RneWlybHZ3ZXdxc2FjeXlvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjUyNDk4OCwiZXhwIjoyMDY4MTAwOTg4fQ.YuiZ0IfrFk35on7HEHPJeJ6MUQ4TsElAU-M2xQdqank'
  )

  try {
    console.log('Reading schema.sql...')
    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    // Since Supabase doesn't allow direct SQL execution via JS client,
    // we'll create tables one by one using the API
    console.log('\n⚠️  Direct SQL execution not available via JS client.')
    console.log('\n📋 Please run the following SQL in your Supabase dashboard:\n')
    console.log('1. Go to: https://supabase.com/dashboard/project/jicdgyirlvwewqsacyyo/sql/new')
    console.log('2. Copy and paste the contents of: /supabase/schema.sql')
    console.log('3. Click "Run"\n')
    
    // Test connection
    const { data, error } = await supabase.from('user_profiles').select('count').single()
    if (error && error.code === '42P01') {
      console.log('❌ Tables not yet created. Please run the SQL schema first.')
    } else if (!error) {
      console.log('✅ Database connection successful!')
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

runMigration()