export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold">KEEP Protocol Dashboard</h1>
        <p className="text-lg text-muted-foreground">Bitcoin Estate Planning for Attorneys</p>
        <a 
          href="/dashboard"
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  )
}