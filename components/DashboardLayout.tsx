
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
  Users,
  HelpCircle,
  Award,
  BookOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/Header'
import { usePermissions } from '@/hooks/use-permissions'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['admin', 'attorney', 'paralegal'] },
  { name: 'Start Here', href: '/start-here', icon: Rocket, roles: ['admin', 'attorney', 'paralegal'] },
  { name: 'Training', href: '/training', icon: BookOpen, roles: ['admin', 'attorney', 'paralegal'] },
  { name: 'KEEP SOP', href: '/sop', icon: GraduationCap, roles: ['admin', 'attorney', 'paralegal'] },
  { name: 'Templates', href: '/templates', icon: FileText, roles: ['admin', 'attorney', 'paralegal'] },
  // { name: 'Compliance', href: '/compliance', icon: Shield, roles: ['admin', 'attorney', 'paralegal'] }, // TEMPORARILY DISABLED
  { name: 'CLE Training', href: '/cle', icon: Award, roles: ['admin', 'attorney'] },
  { name: 'Expert Hotline', href: '/hotline', icon: HelpCircle, roles: ['admin', 'attorney'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin', 'attorney', 'paralegal'] },
]

const adminNavigation = [
  { name: 'Admin Panel', href: '/admin', icon: Users, roles: ['admin'] },
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
  const { user: currentUser } = usePermissions()

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(currentUser.role)
  )

  const filteredAdminNavigation = adminNavigation.filter(item => 
    item.roles.includes(currentUser.role)
  )

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
              {filteredNavigation.map((item) => {
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
              {filteredAdminNavigation.length > 0 && (
                <div className="mt-8 pt-8 border-t">
                  <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Administration
                  </h3>
                  {filteredAdminNavigation.map((item) => {
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
              )}
            </nav>
          </ScrollArea>

          {/* User section */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>{currentUser.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{currentUser.name}</p>
                    <Badge variant="secondary" className="text-xs">
                      {currentUser.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  {currentUser.firm && (
                    <p className="text-xs text-muted-foreground">{currentUser.firm}</p>
                  )}
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