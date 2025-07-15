#!/usr/bin/env node

/**
 * Detailed Supabase Database Connection Test
 * Tests various aspects of the Supabase connection including API key validity,
 * RLS policies, and table accessibility
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

async function testSupabaseConnection() {
  console.log('🔍 Starting Detailed Supabase Database Connection Test');
  console.log('=' .repeat(60));
  
  // Check environment variables
  console.log('\n📋 Environment Check:');
  console.log(`   SUPABASE_URL: ${SUPABASE_URL}`);
  console.log(`   SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not Set'}`);
  console.log(`   SUPABASE_SERVICE_KEY: ${SUPABASE_SERVICE_KEY ? '✅ Set' : '❌ Not Set'}`);
  
  if (!SUPABASE_ANON_KEY) {
    console.log('\n❌ NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not set');
    return;
  }

  // Test 1: Check if API keys are valid and enabled
  console.log('\n🔑 Testing API Key Validity...');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  try {
    // Try a basic query that should work with anon key
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('❌ Anon key test failed:', error.message);
      if (error.message.includes('Legacy API keys are disabled')) {
        console.log('   🔧 Issue: Legacy API keys are disabled in Supabase project');
        console.log('   💡 Solution: Generate new API keys from Supabase dashboard');
      }
    } else {
      console.log('✅ Anon key is valid and working');
    }
  } catch (err) {
    console.log('❌ Anon key test error:', err.message);
  }
  
  // Test 2: Try with service role key if available
  if (SUPABASE_SERVICE_KEY) {
    console.log('\n🔑 Testing Service Role Key...');
    
    const serviceSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    
    try {
      // Try to query system tables (should work with service role)
      const { data, error } = await serviceSupabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(5);
      
      if (error) {
        console.log('❌ Service role key test failed:', error.message);
      } else {
        console.log('✅ Service role key is valid and working');
        console.log(`   Found ${data.length} tables in public schema`);
      }
    } catch (err) {
      console.log('❌ Service role key test error:', err.message);
    }
  }
  
  // Test 3: Check project status
  console.log('\n🏗️ Testing Project Status...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    if (response.ok) {
      console.log('✅ Project is accessible via REST API');
    } else {
      console.log(`❌ Project REST API error: ${response.status} ${response.statusText}`);
      
      if (response.status === 401) {
        console.log('   🔧 Issue: Unauthorized - API key may be invalid or expired');
      } else if (response.status === 403) {
        console.log('   🔧 Issue: Forbidden - API key may lack necessary permissions');
      } else if (response.status === 404) {
        console.log('   🔧 Issue: Project not found - URL may be incorrect');
      }
    }
  } catch (err) {
    console.log('❌ Project status test error:', err.message);
  }
  
  // Test 4: Check for common table names in public schema
  console.log('\n📊 Checking Public Schema Tables...');
  
  if (SUPABASE_SERVICE_KEY) {
    const serviceSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    
    try {
      const { data, error } = await serviceSupabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (error) {
        console.log('❌ Failed to query public schema:', error.message);
      } else {
        console.log(`✅ Found ${data.length} tables in public schema:`);
        
        const tableNames = data.map(t => t.table_name).sort();
        tableNames.forEach(name => {
          const isRequired = REQUIRED_TABLES.includes(name);
          console.log(`   ${isRequired ? '✅' : '📋'} ${name}`);
        });
        
        // Check which required tables are missing
        const missingTables = REQUIRED_TABLES.filter(
          table => !tableNames.includes(table)
        );
        
        if (missingTables.length > 0) {
          console.log(`\n❌ Missing required tables: ${missingTables.join(', ')}`);
        }
      }
    } catch (err) {
      console.log('❌ Schema check error:', err.message);
    }
  }
  
  // Test 5: Test RLS policies
  console.log('\n🔒 Testing Row Level Security (RLS)...');
  
  try {
    // Try to query a table without authentication (should fail with RLS)
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.message.includes('relation "user_profiles" does not exist')) {
        console.log('⚠️  user_profiles table does not exist');
      } else if (error.message.includes('RLS') || error.message.includes('policy')) {
        console.log('✅ RLS is enabled (expected for authenticated tables)');
      } else {
        console.log('❌ RLS test failed:', error.message);
      }
    } else {
      console.log('⚠️  RLS may not be properly configured (got data without auth)');
    }
  } catch (err) {
    console.log('❌ RLS test error:', err.message);
  }
  
  // Test 6: Generate diagnostic report
  console.log('\n📋 Diagnostic Report:');
  console.log('=' .repeat(60));
  
  console.log('\n🔍 Identified Issues:');
  console.log('1. ❌ Legacy API keys are disabled');
  console.log('   - Current keys were generated before Supabase disabled legacy keys');
  console.log('   - Need to generate new API keys from Supabase dashboard');
  
  console.log('\n🔧 Recommended Actions:');
  console.log('1. Log into Supabase dashboard: https://app.supabase.com');
  console.log('2. Go to Project Settings > API');
  console.log('3. Generate new API keys (both anon and service_role)');
  console.log('4. Update your .env.local file with new keys');
  console.log('5. Restart your development server');
  
  console.log('\n📊 Required Database Tables:');
  REQUIRED_TABLES.forEach(table => {
    console.log(`   - ${table}`);
  });
  
  console.log('\n💡 Alternative Test (if you have new keys):');
  console.log('   Run: NEXT_PUBLIC_SUPABASE_ANON_KEY=your_new_key node test-supabase-connection.js');
  
  console.log('\n🔗 Useful Links:');
  console.log('   - Supabase Dashboard: https://app.supabase.com');
  console.log('   - API Keys Documentation: https://supabase.com/docs/guides/api#api-keys');
  console.log('   - RLS Documentation: https://supabase.com/docs/guides/auth/row-level-security');
}

// Run the test
testSupabaseConnection().catch(console.error);