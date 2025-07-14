import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-secondary-900 mb-4">404 - Page Not Found</h2>
        <p className="text-secondary-600 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link href="/dashboard" className="btn-primary">
          Return to Dashboard
        </Link>
      </div>
    </div>
  )
}