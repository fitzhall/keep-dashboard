'use client'

import { usePathname } from 'next/navigation'
import { 
  Home,
  FileText,
  Shield,
  Settings,
  Rocket,
  GraduationCap,
  LogOut,
  Users,
  HelpCircle,
  Award,
  BookOpen
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Start Here', href: '/start-here', icon: Rocket },
  { name: 'Training', href: '/training', icon: BookOpen },
  { name: 'KEEP SOP', href: '/sop', icon: GraduationCap },
  { name: 'Templates', href: '/templates', icon: FileText },
  { name: 'CLE Training', href: '/cle', icon: Award },
  { name: 'Expert Hotline', href: '/hotline', icon: HelpCircle },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 w-64 border-r bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b">
            <h1 className="text-xl font-bold">KEEP Protocol</h1>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-3 overflow-y-auto">
            <nav className="space-y-1 py-4">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-gray-100 ${
                      isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </a>
                )
              })}
            </nav>
          </div>

          {/* User section */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Test User</p>
                <p className="text-xs text-gray-500">user@example.com</p>
              </div>
              <a href="/" title="Home">
                <LogOut className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}