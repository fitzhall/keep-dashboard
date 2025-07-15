#!/usr/bin/env node

/**
 * Quick Test Script for New Supabase API Keys
 * Run this after you get new API keys from the Supabase dashboard
 */

const { createClient } = require('@supabase/supabase-js');

// Configuration
const SUPABASE_URL = 'https://jicdgyirlvwewqsacyyo.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Required tables for compliance functionality
const REQUIRED_TABLES = [
  'compliance_categories',
  'ethics_checklist',
  'onboarding_tasks',
  'compliance_reports',
  'user_profiles'
];

async function testNewKeys() {
  console.log('🔍 Testing New Supabase API Keys');
  console.log('=' .repeat(40));
  
  if (!SUPABASE_ANON_KEY) {
    console.log('❌ Please set NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
    console.log('Usage: NEXT_PUBLIC_SUPABASE_ANON_KEY=your_new_key node test-new-keys.js');
    return;
  }
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  console.log('\n✅ Testing anon key...');
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log('❌ Anon key failed:', error.message);
      return;
    }
    console.log('✅ Anon key working!');
  } catch (err) {
    console.log('❌ Anon key error:', err.message);
    return;
  }
  
  if (SUPABASE_SERVICE_KEY) {
    console.log('\n✅ Testing service key...');
    const serviceSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    
    try {
      const { data, error } = await serviceSupabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(5);
      
      if (error) {
        console.log('❌ Service key failed:', error.message);
      } else {
        console.log('✅ Service key working!');
        console.log(`   Found ${data.length} tables`);
        
        // Check required tables
        const { data: allTables, error: tablesError } = await serviceSupabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public');
        
        if (!tablesError && allTables) {
          const tableNames = allTables.map(t => t.table_name);
          
          console.log('\n📊 Required tables status:');
          REQUIRED_TABLES.forEach(table => {
            const exists = tableNames.includes(table);
            console.log(`   ${exists ? '✅' : '❌'} ${table}`);
          });
          
          const missingTables = REQUIRED_TABLES.filter(
            table => !tableNames.includes(table)
          );
          
          if (missingTables.length === 0) {
            console.log('\n🎉 All required tables exist!');
          } else {
            console.log(`\n⚠️  Missing tables: ${missingTables.join(', ')}`);
            console.log('   You may need to run the database initialization scripts');
          }
        }
      }
    } catch (err) {
      console.log('❌ Service key error:', err.message);
    }
  }
  
  console.log('\n🔄 Next steps:');
  console.log('1. Update your .env.local file with the new keys');
  console.log('2. Restart your development server');
  console.log('3. Test the compliance features in your application');
}

testNewKeys().catch(console.error);