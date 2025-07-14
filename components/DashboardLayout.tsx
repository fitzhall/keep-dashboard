
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home,
  FileText,
  Shield,
  Settings,
  Rocket,
  GraduationCap,
  LogOut,
  Users
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Header } from '@/components/Header'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Start Here', href: '/start-here', icon: Rocket },
  { name: 'KEEP SOP', href: '/sop', icon: GraduationCap },
  { name: 'Templates', href: '/templates', icon: FileText },
  { name: 'Compliance', href: '/compliance', icon: Shield },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const adminNavigation = [
  { name: 'Admin Panel', href: '/admin', icon: Users },
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
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 w-64 border-r bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b">
            <h1 className="text-xl font-bold">KEEP Protocol</h1>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3">
            <nav className="space-y-1 py-4">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                      isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            
              {/* Admin Section */}
              <div className="mt-8 pt-8 border-t">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Administration
                </h3>
                {adminNavigation.map((item) => {
                  const isActive = pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </nav>
          </ScrollArea>

          {/* User section */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.picture} />
                  <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <a href="/auth/logout" title="Logout">
                  <LogOut className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col pl-64">
        <Header user={user} />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}