// Simple version - paste this in browser console while on your dashboard

// Look for Supabase in window or common Next.js locations
let supabaseClient;

// Try different ways to find supabase
if (window.supabase) {
  supabaseClient = window.supabase;
  console.log('Found supabase in window');
} else if (window.__NEXT_DATA__) {
  // Try to find it in React DevTools
  console.log('Checking for Supabase in React components...');
  
  // Alternative: Check localStorage for session
  const supabaseSession = Object.keys(localStorage)
    .find(key => key.includes('supabase.auth.token'));
  
  if (supabaseSession) {
    const session = JSON.parse(localStorage.getItem(supabaseSession));
    console.log('=== FOUND SESSION IN LOCALSTORAGE ===');
    console.log('User ID:', session?.user?.id);
    console.log('Email:', session?.user?.email);
    console.log('=====================================');
    
    if (session?.user?.id) {
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
  '${session.user.id}'::uuid,
  '${session.user.id}',
  '${session.user.email}',
  '${session.user.email?.split('@')[0] || 'Admin'}',
  'admin',
  'KEEP Protocol Admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  auth0_id = '${session.user.id}',
  firm = 'KEEP Protocol Admin',
  updated_at = NOW();

-- Then check if it worked:
SELECT * FROM public.user_profiles WHERE id = '${session.user.id}'::uuid;
      `;
      
      console.log('\n=== COPY THIS SQL AND RUN IN SUPABASE ===');
      console.log(sql);
      console.log('=========================================\n');
    }
  } else {
    console.log('No Supabase session found in localStorage');
    console.log('Make sure you are logged in to the dashboard');
  }
}

// Also check for any auth cookies
console.log('\n=== Checking cookies ===');
const cookies = document.cookie.split(';');
const authCookies = cookies.filter(c => 
  c.includes('auth') || 
  c.includes('supabase') || 
  c.includes('session')
);
if (authCookies.length > 0) {
  console.log('Found auth-related cookies:', authCookies);
} else {
  console.log('No auth cookies found');
}