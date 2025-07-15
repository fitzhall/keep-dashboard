export default function TestServerPage() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#e0e0e0', minHeight: '100vh' }}>
      <h1>Server Test Page</h1>
      <p>This is a server-rendered page with no client-side JavaScript.</p>
      <p>If you can see this but not other pages, there is a client-side issue.</p>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'white' }}>
        <h2>Server Environment:</h2>
        <p>NODE_ENV: {process.env.NODE_ENV}</p>
        <p>Has Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Yes' : 'No'}</p>
      </div>
    </div>
  )
}