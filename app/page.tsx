'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const router = useRouter()

  const handleDashboardClick = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold">KEEP Protocol Dashboard</h1>
        <p className="text-lg text-muted-foreground">Bitcoin Estate Planning for Attorneys</p>
        <Button 
          onClick={handleDashboardClick}
          size="lg"
          className="px-8"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}