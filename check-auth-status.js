// Check auth status - paste this in browser console

console.log('=== Checking Authentication Status ===');

// 1. Check all localStorage keys
console.log('\n1. localStorage keys:');
const allKeys = Object.keys(localStorage);
console.log('Total keys:', allKeys.length);

// 2. Check for Supabase-related keys
console.log('\n2. Supabase-related keys:');
const supabaseKeys = allKeys.filter(key => 
  key.toLowerCase().includes('supabase') || 
  key.toLowerCase().includes('auth') ||
  key.toLowerCase().includes('user')
);

if (supabaseKeys.length > 0) {
  supabaseKeys.forEach(key => {
    console.log(`- ${key}`);
    try {
      const value = localStorage.getItem(key);
      const parsed = JSON.parse(value);
      if (parsed?.user || parsed?.access_token) {
        console.log('  Found auth data:', parsed);
      }
    } catch (e) {
      // Not JSON, skip
    }
  });
} else {
  console.log('No Supabase keys found in localStorage');
}

// 3. Check sessionStorage too
console.log('\n3. sessionStorage keys:');
const sessionKeys = Object.keys(sessionStorage);
const authSessionKeys = sessionKeys.filter(key => 
  key.toLowerCase().includes('supabase') || 
  key.toLowerCase().includes('auth')
);

if (authSessionKeys.length > 0) {
  console.log('Found in sessionStorage:', authSessionKeys);
} else {
  console.log('No auth keys in sessionStorage');
}

// 4. Check current page URL
console.log('\n4. Current page:');
console.log('URL:', window.location.href);
console.log('Are you on the login page?', window.location.pathname.includes('login'));

// 5. Try to find Supabase in the page
console.log('\n5. Looking for Supabase client...');
if (window.Supabase) {
  console.log('Found window.Supabase');
} else if (window._supabase) {
  console.log('Found window._supabase');
} else {
  console.log('Supabase client not found in window object');
}

console.log('\n=== NEXT STEPS ===');
console.log('1. If you see no auth data above, you need to log in first');
console.log('2. Go to your login page and sign in');
console.log('3. After logging in, run this script again');
console.log('4. Or create a user directly in Supabase Dashboard:');
console.log('   - Go to your Supabase project');
console.log('   - Click Authentication > Users');
console.log('   - Click "Add user" or "Invite user"');
console.log('==================');