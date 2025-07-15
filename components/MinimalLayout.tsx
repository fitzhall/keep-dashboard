export default function MinimalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Simple header */}
      <header className="border-b">
        <div className="px-6 py-4">
          <h1 className="text-xl font-bold">KEEP Protocol</h1>
        </div>
      </header>
      
      {/* Simple sidebar */}
      <div className="flex">
        <nav className="w-64 border-r min-h-screen p-4">
          <ul className="space-y-2">
            <li><a href="/dashboard" className="block p-2 hover:bg-gray-100 rounded">Dashboard</a></li>
            <li><a href="/training" className="block p-2 hover:bg-gray-100 rounded">Training</a></li>
            <li><a href="/templates" className="block p-2 hover:bg-gray-100 rounded">Templates</a></li>
            <li><a href="/sop" className="block p-2 hover:bg-gray-100 rounded">SOP Guide</a></li>
            <li><a href="/settings" className="block p-2 hover:bg-gray-100 rounded">Settings</a></li>
          </ul>
        </nav>
        
        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}