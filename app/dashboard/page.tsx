export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome to KEEP Protocol</h1>
        <p className="text-muted-foreground mt-2">Your Bitcoin Estate Planning Dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">Training Progress</h3>
          <p className="text-2xl font-bold">0%</p>
          <p className="text-sm text-muted-foreground">Get started with training</p>
        </div>
        
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">Templates</h3>
          <p className="text-2xl font-bold">15</p>
          <p className="text-sm text-muted-foreground">Available templates</p>
        </div>
        
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold mb-2">Support</h3>
          <p className="text-2xl font-bold">24/7</p>
          <p className="text-sm text-muted-foreground">Expert assistance</p>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="space-y-2">
          <a href="/training" className="block p-4 border rounded hover:bg-gray-50">
            → Start Training
          </a>
          <a href="/templates" className="block p-4 border rounded hover:bg-gray-50">
            → Browse Templates
          </a>
          <a href="/sop" className="block p-4 border rounded hover:bg-gray-50">
            → View SOP Guide
          </a>
        </div>
      </div>
    </div>
  )
}