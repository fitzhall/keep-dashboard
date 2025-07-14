
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  DocumentDuplicateIcon,
  ShieldCheckIcon,
  CogIcon,
  RocketLaunchIcon,
  AcademicCapIcon,
  ArrowRightOnRectangleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Start Here', href: '/start-here', icon: RocketLaunchIcon },
  { name: 'KEEP SOP', href: '/sop', icon: AcademicCapIcon },
  { name: 'Templates', href: '/templates', icon: DocumentDuplicateIcon },
  { name: 'Compliance', href: '/compliance', icon: ShieldCheckIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
]

const adminNavigation = [
  { name: 'Admin Panel', href: '/admin', icon: UserGroupIcon },
]

interface DashboardLayoutProps {
  children: React.ReactNode
  user?: {
    name?: string
    email?: string
    picture?: string
  }
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-secondary-200">
            <h1 className="text-xl font-bold text-primary-600">KEEP Protocol</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${isActive 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 h-5 w-5 flex-shrink-0
                      ${isActive ? 'text-primary-600' : 'text-secondary-400 group-hover:text-secondary-500'}
                    `}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            })}
            
            {/* Admin Section - In production, check user.role === 'admin' */}
            <div className="mt-8 pt-8 border-t border-secondary-200">
              <h3 className="px-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                Administration
              </h3>
              <div className="mt-2 space-y-1">
                {adminNavigation.map((item) => {
                  const isActive = pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        group flex items-center px-2 py-2 text-sm font-medium rounded-md
                        ${isActive 
                          ? 'bg-primary-100 text-primary-700' 
                          : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                        }
                      `}
                    >
                      <item.icon
                        className={`
                          mr-3 h-5 w-5 flex-shrink-0
                          ${isActive ? 'text-primary-600' : 'text-secondary-400 group-hover:text-secondary-500'}
                        `}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          </nav>

          {/* User section */}
          <div className="border-t border-secondary-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-secondary-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-secondary-500">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
              <a
                href="/auth/logout"
                className="text-secondary-400 hover:text-secondary-600"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="min-h-screen p-8">{children}</main>
      </div>
    </div>
  )
}