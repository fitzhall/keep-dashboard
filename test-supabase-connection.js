#!/usr/bin/env node

/**
 * Supabase Database Connection Test
 * Tests the connection to the Supabase database and verifies required tables exist
 */

const { createClient } = require('@supabase/supabase-js');

// Configuration
const SUPABASE_URL = 'https://jicdgyirlvwewqsacyyo.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Required tables for compliance functionality
const REQUIRED_TABLES = [
  'compliance_categories',
  'ethics_checklist',
  'onboarding_tasks',
  'compliance_reports',
  'user_profiles'
];

// Test user ID for testing purposes
const TEST_USER_ID = 'test-user-12345';

async function testSupabaseConnection() {
  console.log('🔍 Starting Supabase Database Connection Test');
  console.log('=' .repeat(50));
  
  // Check environment variables
  console.log('\n📋 Environment Check:');
  console.log(`   SUPABASE_URL: ${SUPABASE_URL}`);
  console.log(`   SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not Set'}`);
  
  if (!SUPABASE_ANON_KEY) {
    console.log('\n❌ NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not set');
    console.log('   Please set this variable to test the database connection.');
    return;
  }

  // Initialize Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  console.log('\n🔌 Testing Basic Connection...');
  
  try {
    // Test 1: Basic connection test
    const { data: healthCheck, error: healthError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);
    
    if (healthError) {
      console.log('❌ Basic connection failed:', healthError.message);
      return;
    }
    
    console.log('✅ Basic connection successful');
    
    // Test 2: Check if required tables exist
    console.log('\n📊 Checking Required Tables:');
    
    const tableCheckResults = {};
    
    for (const tableName of REQUIRED_TABLES) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`   ❌ ${tableName}: ${error.message}`);
          tableCheckResults[tableName] = { exists: false, error: error.message };
        } else {
          console.log(`   ✅ ${tableName}: Table exists`);
          tableCheckResults[tableName] = { exists: true, recordCount: data?.length || 0 };
        }
      } catch (err) {
        console.log(`   ❌ ${tableName}: ${err.message}`);
        tableCheckResults[tableName] = { exists: false, error: err.message };
      }
    }
    
    // Test 3: Test data queries on existing tables
    console.log('\n🔍 Testing Data Queries:');
    
    for (const tableName of REQUIRED_TABLES) {
      if (tableCheckResults[tableName]?.exists) {
        try {
          const { data, error, count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact' })
            .limit(5);
          
          if (error) {
            console.log(`   ❌ ${tableName} query failed: ${error.message}`);
          } else {
            console.log(`   ✅ ${tableName}: ${count || 0} records found`);
            if (data && data.length > 0) {
              console.log(`      Sample columns: ${Object.keys(data[0]).join(', ')}`);
            }
          }
        } catch (err) {
          console.log(`   ❌ ${tableName} query error: ${err.message}`);
        }
      }
    }
    
    // Test 4: Test compliance data functions
    console.log('\n⚙️ Testing Compliance Data Functions:');
    
    // Test compliance_categories table specifically
    if (tableCheckResults['compliance_categories']?.exists) {
      try {
        const { data, error } = await supabase
          .from('compliance_categories')
          .select('*')
          .eq('user_id', TEST_USER_ID);
        
        if (error) {
          console.log('   ❌ Compliance categories query failed:', error.message);
        } else {
          console.log(`   ✅ Compliance categories query successful: ${data?.length || 0} records`);
        }
      } catch (err) {
        console.log('   ❌ Compliance categories query error:', err.message);
      }
    }
    
    // Test ethics_checklist table
    if (tableCheckResults['ethics_checklist']?.exists) {
      try {
        const { data, error } = await supabase
          .from('ethics_checklist')
          .select('*')
          .eq('user_id', TEST_USER_ID);
        
        if (error) {
          console.log('   ❌ Ethics checklist query failed:', error.message);
        } else {
          console.log(`   ✅ Ethics checklist query successful: ${data?.length || 0} records`);
        }
      } catch (err) {
        console.log('   ❌ Ethics checklist query error:', err.message);
      }
    }
    
    // Test 5: Test write operations (if tables exist)
    console.log('\n✍️ Testing Write Operations:');
    
    if (tableCheckResults['compliance_categories']?.exists) {
      try {
        const testData = {
          user_id: TEST_USER_ID,
          category_id: 'test-category',
          category_name: 'Test Category',
          score: 85,
          items_completed: 17,
          items_total: 20,
          trend: 'up'
        };
        
        const { data, error } = await supabase
          .from('compliance_categories')
          .upsert(testData, { onConflict: 'user_id,category_id' })
          .select();
        
        if (error) {
          console.log('   ❌ Write operation failed:', error.message);
        } else {
          console.log('   ✅ Write operation successful');
          
          // Clean up test data
          await supabase
            .from('compliance_categories')
            .delete()
            .eq('user_id', TEST_USER_ID)
            .eq('category_id', 'test-category');
        }
      } catch (err) {
        console.log('   ❌ Write operation error:', err.message);
      }
    }
    
    // Test 6: Check table schemas
    console.log('\n📋 Checking Table Schemas:');
    
    try {
      const { data: schemaData, error: schemaError } = await supabase
        .from('information_schema.columns')
        .select('table_name, column_name, data_type, is_nullable')
        .in('table_name', REQUIRED_TABLES)
        .order('table_name')
        .order('ordinal_position');
      
      if (schemaError) {
        console.log('   ❌ Schema check failed:', schemaError.message);
      } else if (schemaData) {
        const tableSchemas = {};
        schemaData.forEach(col => {
          if (!tableSchemas[col.table_name]) {
            tableSchemas[col.table_name] = [];
          }
          tableSchemas[col.table_name].push({
            column: col.column_name,
            type: col.data_type,
            nullable: col.is_nullable
          });
        });
        
        for (const [tableName, columns] of Object.entries(tableSchemas)) {
          console.log(`   📊 ${tableName}:`);
          columns.forEach(col => {
            console.log(`      - ${col.column}: ${col.type} ${col.nullable === 'YES' ? '(nullable)' : '(required)'}`);
          });
        }
      }
    } catch (err) {
      console.log('   ❌ Schema check error:', err.message);
    }
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log('=' .repeat(50));
    
    const existingTables = Object.entries(tableCheckResults)
      .filter(([_, result]) => result.exists)
      .map(([table, _]) => table);
    
    const missingTables = Object.entries(tableCheckResults)
      .filter(([_, result]) => !result.exists)
      .map(([table, _]) => table);
    
    console.log(`✅ Tables Found: ${existingTables.length}/${REQUIRED_TABLES.length}`);
    if (existingTables.length > 0) {
      console.log(`   - ${existingTables.join(', ')}`);
    }
    
    if (missingTables.length > 0) {
      console.log(`❌ Missing Tables: ${missingTables.length}`);
      console.log(`   - ${missingTables.join(', ')}`);
    }
    
    if (existingTables.length === REQUIRED_TABLES.length) {
      console.log('\n🎉 All required tables are present and accessible!');
    } else {
      console.log('\n⚠️  Some tables are missing. The compliance features may not work properly.');
    }
    
  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
    console.log('Full error:', error);
  }
}

// Run the test
testSupabaseConnection().catch(console.error);