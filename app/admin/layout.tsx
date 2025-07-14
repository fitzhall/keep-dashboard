import { auth0 } from '@/lib/auth0'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth0.getSession()
  
  if (!session) {
    redirect('/login')
  }

  // In production, you would check:
  // if (session.user.role !== 'admin') {
  //   redirect('/dashboard')
  // }

  return <DashboardLayout user={session.user}>{children}</DashboardLayout>
}