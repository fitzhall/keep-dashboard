import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Use service role key for admin operations
const supabaseUrl = 'https://jicdgyirlvwewqsacyyo.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppY2RneWlybHZ3ZXdxc2FjeXlvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjUyNDk4OCwiZXhwIjoyMDY4MTAwOTg4fQ.YuiZ0IfrFk35on7HEHPJeJ6MUQ4TsElAU-M2xQdqank'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
})

async function runMigrations() {
  try {
    console.log('🚀 Starting database setup...')
    
    // Read the schema SQL file
    const schemaPath = join(__dirname, '..', 'supabase', 'schema.sql')
    const schema = readFileSync(schemaPath, 'utf8')
    
    // Split by semicolons and filter out empty statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => s + ';')
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      console.log(`\n⏳ Executing statement ${i + 1}/${statements.length}...`)
      
      // Skip comments
      if (statement.trim().startsWith('--')) continue
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement }).single()
      
      if (error) {
        // Try direct execution as fallback
        const { error: directError } = await supabase.from('_').rpc('exec', { query: statement })
        
        if (directError) {
          console.error(`❌ Error executing statement ${i + 1}:`, directError.message)
          console.error('Statement:', statement.substring(0, 100) + '...')
          // Continue with other statements
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`)
        }
      } else {
        console.log(`✅ Statement ${i + 1} executed successfully`)
      }
    }
    
    console.log('\n🎉 Database setup complete!')
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  }
}

// Alternative approach: Use the SQL Editor API
async function setupDatabaseViaAPI() {
  console.log('\n📋 Database Schema Setup Instructions:\n')
  console.log('Since direct SQL execution requires database credentials, please:')
  console.log('\n1. Go to your Supabase SQL Editor:')
  console.log('   https://supabase.com/dashboard/project/jicdgyirlvwewqsacyyo/sql/new')
  console.log('\n2. Copy the entire contents of: /supabase/schema.sql')
  console.log('\n3. Paste and click "Run"\n')
  console.log('The schema includes:')
  console.log('  ✅ User profiles table')
  console.log('  ✅ Course progress tracking')
  console.log('  ✅ SOP phase tracking')
  console.log('  ✅ Template downloads')
  console.log('  ✅ Activity logging')
  console.log('  ✅ Support tickets')
  console.log('  ✅ Row Level Security policies')
  console.log('  ✅ Automatic triggers\n')
}

// Run the setup
setupDatabaseViaAPI()