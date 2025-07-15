'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Users,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Building,
  FileCheck,
  Info
} from 'lucide-react'
import Link from 'next/link'
import { useUserProgress } from '@/contexts/UserProgressContext'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const { progress, userProfile } = useUserProgress()
  
  // Calculate metrics
  const completedCourses = progress.courses.filter(c => c.status === 'completed').length
  const totalCredits = completedCourses * 2.5
  const overallProgress = (completedCourses / progress.courses.length) * 100
  const currentPhase = progress.sopPhases.find(p => p.status === 'in-progress')?.phase || 1
  const completedPhases = progress.sopPhases.filter(p => p.status === 'completed').length

  // Mock client data for demo
  const activeClients = [
    { id: 1, name: 'Johnson Family Trust', phase: 3, status: 'active', lastActivity: '2 hours ago' },
    { id: 2, name: 'Smith Estate', phase: 1, status: 'pending', lastActivity: '1 day ago' },
    { id: 3, name: 'Davis Bitcoin Holdings', phase: 5, status: 'active', lastActivity: '3 days ago' }
  ]

  // Practice readiness components
  const readinessItems = [
    { 
      title: 'Foundational Knowledge',
      status: 'complete',
      description: 'Core Bitcoin estate planning principles'
    },
    { 
      title: 'Technical Implementation',
      status: 'in-progress',
      progress: 65,
      description: 'Multi-sig and custody solutions'
    },
    { 
      title: 'Compliance & Ethics',
      status: 'pending',
      description: 'State regulations and ethics requirements'
    },
    { 
      title: 'Advanced Structures',
      status: 'pending',
      description: 'Complex trust and tax strategies'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Professional Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {userProfile?.name || 'Attorney'}
        </h1>
        <p className="text-gray-600 mt-1">
          {userProfile?.firm || 'Your Firm'} • KEEP Protocol Licensed Attorney
        </p>
      </div>

      {/* Key Metrics Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{activeClients.length}</div>
            <p className="text-xs text-gray-500 mt-1">Across {completedPhases + 1} phases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">SOP Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">Phase {currentPhase}/10</div>
            <Progress value={currentPhase * 10} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">CLE Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{totalCredits}</div>
            <p className="text-xs text-gray-500 mt-1">of 11.5 available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{progress.complianceScore}%</div>
            <p className="text-xs text-gray-500 mt-1">Last audit: 7 days ago</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - SOP & Clients */}
        <div className="lg:col-span-2 space-y-6">
          {/* SOP Phase Tracker */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>10-Phase SOP Progress</CardTitle>
                  <CardDescription>Track your implementation across all clients</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/sop">
                    View Full Guide <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Phase Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Overall Phase Completion</span>
                    <span className="font-medium">{completedPhases} of 10 phases</span>
                  </div>
                  <div className="flex gap-1">
                    {progress.sopPhases.map((phase) => (
                      <div
                        key={phase.phase}
                        className={cn(
                          "h-2 flex-1 rounded-sm",
                          phase.status === 'completed' && "bg-blue-600",
                          phase.status === 'in-progress' && "bg-blue-400",
                          phase.status === 'not-started' && "bg-gray-200"
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Current Phase Details */}
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-sm">
                    <strong>Current Phase {currentPhase}:</strong> 
                    {currentPhase === 1 && " Initial Consultation & Intake"}
                    {currentPhase === 2 && " Asset Discovery & Documentation"}
                    {currentPhase === 3 && " Legal Structure Design"}
                    {currentPhase === 4 && " Technical Implementation"}
                    {currentPhase === 5 && " Beneficiary Setup"}
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Active Clients */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Client Matters</CardTitle>
                  <CardDescription>Bitcoin estate planning engagements</CardDescription>
                </div>
                <Button size="sm" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  New Client
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        client.status === 'active' ? "bg-green-500" : "bg-yellow-500"
                      )} />
                      <div>
                        <p className="font-medium text-sm">{client.name}</p>
                        <p className="text-xs text-gray-500">
                          Phase {client.phase} • Last activity: {client.lastActivity}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Practice Readiness & Actions */}
        <div className="space-y-6">
          {/* Practice Readiness Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Practice Readiness Assessment</CardTitle>
              <CardDescription>Your Bitcoin estate planning competency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {readinessItems.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.status === 'complete' && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                        {item.status === 'in-progress' && (
                          <Clock className="h-4 w-4 text-blue-600" />
                        )}
                        {item.status === 'pending' && (
                          <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                        )}
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                    </div>
                    {item.progress && (
                      <Progress value={item.progress} className="h-1.5" />
                    )}
                    <p className="text-xs text-gray-500 ml-6">{item.description}</p>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline" size="sm" asChild>
                <Link href="/training">Continue Training</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm" asChild>
                <Link href="/templates">
                  <FileText className="mr-2 h-4 w-4" />
                  Download Templates
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm" asChild>
                <Link href="/compliance">
                  <Shield className="mr-2 h-4 w-4" />
                  Compliance Center
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm" asChild>
                <Link href="/hotline">
                  <HeadphonesIcon className="mr-2 h-4 w-4" />
                  48hr Support Hotline
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Complete Module 2 Quiz</p>
                    <p className="text-xs text-gray-500">Due in 2 days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <FileCheck className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Ethics Checklist Review</p>
                    <p className="text-xs text-gray-500">Due in 5 days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Building className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Monthly Compliance Audit</p>
                    <p className="text-xs text-gray-500">Due in 1 week</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <p className="text-sm text-gray-600">
            Need help? Access 48-hour expert support through the KEEP hotline.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/support">Get Support</Link>
        </Button>
      </div>
    </div>
  )
}