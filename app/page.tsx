import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to dashboard - the middleware will handle auth check
  redirect('/dashboard')
}