import { auth0 } from '@/lib/auth0'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const session = await auth0.getSession()
  
  // Redirect authenticated users to dashboard, others to login
  if (session) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}