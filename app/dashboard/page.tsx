'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  GraduationCap, 
  FileText, 
  HeadphonesIcon,
  Shield,
  BookOpen,
  Award,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  FileCheck,
  Info,
  Download,
  PlayCircle,
  BookMarked,
  Scale,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { useUserProgress } from '@/contexts/UserProgressContext'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const { progress, userProfile } = useUserProgress()
  
  // Determine license tier (mock data - would come from user profile)
  const licenseTier = 'Premier' // Could be 'Core', 'Premier', or 'Premier+'
  const licensePrice = licenseTier === 'Core' ? 12000 : licenseTier === 'Premier' ? 18000 : 30000
  
  // Calculate metrics
  const completedCourses = progress.courses.filter(c => c.status === 'completed').length
  const totalCredits = completedCourses * 2.5
  const certificationProgress = (completedCourses / progress.courses.length) * 100
  const templatesDownloaded = progress.templatesDownloaded.length

  // 5-Day Implementation Progress
  const implementationDays = [
    { day: 1, title: 'Framework Mastery', status: 'complete', hours: 2 },
    { day: 2, title: 'Template Integration', status: 'complete', hours: 1.5 },
    { day: 3, title: 'Risk Assessment Setup', status: 'in-progress', hours: 2.5 },
    { day: 4, title: 'Workflow Implementation', status: 'pending', hours: 3 },
    { day: 5, title: 'Practice Integration', status: 'pending', hours: 2 }
  ]

  const completedDays = implementationDays.filter(d => d.status === 'complete').length
  const implementationProgress = (completedDays / 5) * 100

  // Recent templates with KEEP specific names
  const popularTemplates = [
    { id: 1, name: 'KEEP Engagement Letter Template', size: '120 KB', updated: '2025-07-03' },
    { id: 2, name: 'Bitcoin Multisig Design Worksheet', size: '439 KB', updated: '2025-07-03' },
    { id: 3, name: 'Client Risk Assessment Template', size: '215 KB', updated: '2025-07-03' }
  ]

  // Recent activity
  const recentActivity = [
    { type: 'update', message: 'Template Update: Engagement Letter v2025-07-03 available' },
    { type: 'framework', message: 'Framework Update: New probate proofing guidance added' },
    { type: 'training', message: 'Training: CLE presentation materials updated' }
  ]

  return (
    <div className="space-y-6">
      {/* Professional Header with License Info */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome to KEEP Protocol, {userProfile?.name?.split(' ')[0] || 'Attorney'}
          </h1>
          <p className="text-gray-600 mt-1">
            You're licensed for {licenseTier} tier access. Complete your 5-day implementation to begin serving Bitcoin estate planning clients with confidence.
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Star className="h-3 w-3" />
          {licenseTier} License
        </Badge>
      </div>

      {/* Key Metrics Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">5-Day Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{implementationProgress}%</div>
            <Progress value={implementationProgress} className="mt-2 h-1" />
            <p className="text-xs text-gray-500 mt-1">Day {completedDays + 1} of 5</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">CLE Credits Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">4.5</div>
            <p className="text-xs text-gray-500 mt-1">Plus 0.25 ethics credits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Templates Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">25</div>
            <p className="text-xs text-gray-500 mt-1">{templatesDownloaded} downloaded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Support Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-600">
              {licenseTier === 'Core' ? '48hr' : licenseTier === 'Premier' ? '24hr' : 'Same Day'}
            </div>
            <p className="text-xs text-gray-500 mt-1">Expert hotline active</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Implementation Progress & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* 5-Day Implementation Progress */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>5-Day Implementation Progress</CardTitle>
                  <CardDescription>Master the KEEP Protocol with our structured plan</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/start-here">
                    View Full Plan <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {implementationDays.map((day) => (
                  <div
                    key={day.day}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border",
                      day.status === 'complete' && "bg-green-50 border-green-200",
                      day.status === 'in-progress' && "bg-blue-50 border-blue-200",
                      day.status === 'pending' && "bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2">
                        {day.status === 'complete' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : day.status === 'in-progress' ? (
                          <Clock className="h-5 w-5 text-blue-600" />
                        ) : (
                          <span className="text-sm font-medium text-gray-400">{day.day}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">Day {day.day}: {day.title}</p>
                        <p className="text-xs text-gray-500">Est. {day.hours} hours</p>
                      </div>
                    </div>
                    {day.status === 'in-progress' && (
                      <Button size="sm" asChild>
                        <Link href="/start-here">Continue</Link>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Access your most-used resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/templates">
                    <FileText className="mr-2 h-4 w-4" />
                    Download Engagement Letter
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/templates">
                    <FileCheck className="mr-2 h-4 w-4" />
                    Access Assessment Worksheet
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/compliance">
                    <Shield className="mr-2 h-4 w-4" />
                    View Ethics Checklist
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/hotline">
                    <HeadphonesIcon className="mr-2 h-4 w-4" />
                    Contact Expert Hotline
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <div className={cn(
                      "h-2 w-2 rounded-full mt-1.5",
                      activity.type === 'update' && "bg-blue-500",
                      activity.type === 'framework' && "bg-green-500",
                      activity.type === 'training' && "bg-purple-500"
                    )} />
                    <p className="text-gray-600">{activity.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Templates & Resources */}
        <div className="space-y-6">
          {/* Popular Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Essential Templates</CardTitle>
              <CardDescription>Most-used KEEP documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{template.name}</p>
                        <p className="text-xs text-gray-500">{template.size} • Updated {template.updated}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-3" variant="outline" size="sm" asChild>
                <Link href="/templates">View All Templates</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Training Module */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">CLE Training</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg bg-blue-50 border-blue-200">
                  <h4 className="font-medium text-sm mb-1">
                    Bitcoin Inheritance: Practical Drafting & Risk-Mitigation
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">
                    For Estate-Planning Professionals
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      4.5 CLE + 0.25 Ethics
                    </Badge>
                    <Button size="sm" variant="link" asChild>
                      <Link href="/training">
                        Start <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* License Info */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="h-10 w-10 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                  <Star className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold">{licenseTier} License</h3>
                <p className="text-sm text-gray-600">
                  Annual fee: ${licensePrice.toLocaleString()}
                </p>
                <Button variant="link" size="sm" asChild>
                  <Link href="/settings">View License Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}