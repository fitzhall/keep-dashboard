'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  
  useEffect(() => {
    // For now, always redirect to dashboard since we're using mock auth
    router.push('/dashboard')
  }, [router])
  
  return null
}