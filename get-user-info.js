// Run this in your browser console while on your dashboard

// First, check if supabase is available
if (typeof supabase === 'undefined') {
  console.log('Supabase not found in global scope. Trying to find it...');
  
  // Try to get it from Next.js
  const { supabase } = await import('/lib/supabase/client');
}

// Get current user
async function getUserInfo() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting user:', error);
      return;
    }
    
    if (!user) {
      console.log('No user logged in');
      console.log('Try logging in first at your dashboard login page');
      return;
    }
    
    console.log('=== YOUR USER INFO ===');
    console.log('User ID:', user.id);
    console.log('Email:', user.email);
    console.log('===================');
    
    // Create SQL statement for you
    const sql = `
-- Run this in Supabase SQL editor:
INSERT INTO public.user_profiles (
  id,
  auth0_id, 
  email,
  name,
  role,
  firm,
  created_at,
  updated_at
)
VALUES (
  '${user.id}'::uuid,
  '${user.id}',
  '${user.email}',
  '${user.email?.split('@')[0] || 'Admin'}',
  'admin',
  'KEEP Protocol Admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  auth0_id = '${user.id}',
  firm = 'KEEP Protocol Admin',
  updated_at = NOW();
    `;
    
    console.log('\n=== COPY THIS SQL AND RUN IN SUPABASE ===');
    console.log(sql);
    console.log('=========================================\n');
    
    // Also check if profile exists
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (profile) {
      console.log('You already have a profile:', profile);
    } else {
      console.log('No profile found. Run the SQL above to create one.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run it
getUserInfo();