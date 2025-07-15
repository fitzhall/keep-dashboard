import { auth0 } from '@/lib/auth0'
import { redirect } from 'next/navigation'
import LoginClient from './login-client'

export default async function LoginPage() {
  const session = await auth0.getSession()
  
  if (session) {
    redirect('/dashboard')
  }
  return <LoginClient />
}