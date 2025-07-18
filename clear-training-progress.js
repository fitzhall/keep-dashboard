// Run this in browser console to clear localStorage progress

// Clear training progress from localStorage
localStorage.removeItem('training_progress');
console.log('✅ Cleared training progress from localStorage');

// Check if any progress exists in localStorage
const progress = localStorage.getItem('training_progress');
if (!progress) {
  console.log('✅ Confirmed: No progress in localStorage');
} else {
  console.log('❌ Warning: Progress still exists in localStorage');
}

// Refresh the page to see fresh state
console.log('🔄 Refreshing page in 2 seconds...');
setTimeout(() => {
  window.location.reload();
}, 2000);