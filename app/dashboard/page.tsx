'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  GraduationCap, 
  FileText, 
  HeadphonesIcon,
  TrendingUp,
  Shield,
  BookOpen,
  Award,
  ArrowRight,
  Clock,
  Users,
  Briefcase,
  Target,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Zap,
  MessageSquare,
  Download,
  PlayCircle
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

  // Mock data for demo
  const upcomingTasks = [
    { id: 1, title: 'Complete Module 2: Technical Implementation', type: 'training', dueIn: '2 days' },
    { id: 2, title: 'Review Multi-sig Setup Documentation', type: 'reading', dueIn: '3 days' },
    { id: 3, title: 'Schedule Mock Client Session', type: 'practice', dueIn: '1 week' }
  ]

  const recentClients = [
    { id: 1, name: 'Johnson Family Trust', phase: 3, lastActivity: '2 hours ago' },
    { id: 2, name: 'Smith Estate', phase: 1, lastActivity: '1 day ago' }
  ]

  return (
    <div className="space-y-8">
      {/* Personalized Welcome with Key Metrics */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {userProfile?.name?.split(' ')[0] || 'Attorney'}! 👋
          </h1>
          <p className="text-blue-100 mb-6 text-lg">
            You're making great progress on your Bitcoin estate planning certification.
          </p>
          
          {/* Quick Stats in Welcome Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Certification Progress</p>
                  <p className="text-2xl font-bold">{Math.round(overallProgress)}%</p>
                </div>
                <GraduationCap className="h-8 w-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">CLE Credits</p>
                  <p className="text-2xl font-bold">{totalCredits}/11.5</p>
                </div>
                <Award className="h-8 w-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Current SOP Phase</p>
                  <p className="text-2xl font-bold">Phase {currentPhase}</p>
                </div>
                <Target className="h-8 w-8 text-blue-200" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Main Content Area with Tabs */}
      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="today">Today's Focus</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
        </TabsList>

        {/* Today's Focus Tab */}
        <TabsContent value="today" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Priority Actions */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-2 border-blue-200 bg-blue-50/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      Your Next Steps
                    </CardTitle>
                    <Badge variant="outline" className="bg-blue-100">
                      {upcomingTasks.length} tasks
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center",
                          task.type === 'training' && "bg-purple-100",
                          task.type === 'reading' && "bg-green-100",
                          task.type === 'practice' && "bg-orange-100"
                        )}>
                          {task.type === 'training' && <PlayCircle className="h-5 w-5 text-purple-600" />}
                          {task.type === 'reading' && <BookOpen className="h-5 w-5 text-green-600" />}
                          {task.type === 'practice' && <Users className="h-5 w-5 text-orange-600" />}
                        </div>
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted-foreground">Due in {task.dueIn}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        Start <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold">Continue Training</h3>
                      <p className="text-sm text-muted-foreground">Pick up where you left off</p>
                      <Button asChild className="w-full">
                        <Link href="/training">Resume</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold">Client Templates</h3>
                      <p className="text-sm text-muted-foreground">Download what you need</p>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/templates">Browse</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Practice Readiness Mini */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Practice Readiness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Overall Readiness</span>
                        <span className="font-medium">65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>Foundational Knowledge</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span>Technical Implementation</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-4 w-4 rounded-full border-2" />
                        <span>Compliance & Ethics</span>
                      </div>
                    </div>
                    <Button asChild size="sm" className="w-full mt-3">
                      <Link href="/training">View Full Assessment</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Support Card */}
              <Card className="border-orange-200 bg-orange-50/50">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold">Need Help?</h3>
                    <p className="text-sm text-muted-foreground">
                      Expert support is just a click away
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/support">Get Support</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Certification Journey */}
            <Card>
              <CardHeader>
                <CardTitle>Your Certification Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progress.courses.map((course, index) => (
                    <div key={course.id} className="flex items-center gap-4">
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center font-semibold",
                        course.status === 'completed' ? "bg-green-100 text-green-700" :
                        course.status === 'in-progress' ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-400"
                      )}>
                        {course.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Module {index + 1}</p>
                        <Progress 
                          value={course.progress} 
                          className="h-2 mt-1"
                        />
                      </div>
                      <Badge variant={course.status === 'completed' ? 'default' : 'outline'}>
                        {course.status === 'completed' ? '2.5 Credits' : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SOP Implementation Progress */}
            <Card>
              <CardHeader>
                <CardTitle>SOP Implementation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-2">
                    {progress.sopPhases.slice(0, 5).map((phase) => (
                      <div
                        key={phase.phase}
                        className={cn(
                          "h-2 rounded-full",
                          phase.status === 'completed' ? "bg-green-500" :
                          phase.status === 'in-progress' ? "bg-blue-500" :
                          "bg-gray-200"
                        )}
                      />
                    ))}
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">Phase {currentPhase} of 10</p>
                    <p className="text-sm text-muted-foreground">Currently Active</p>
                  </div>
                  <Button asChild className="w-full">
                    <Link href="/sop">View SOP Guide</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Client Engagements</CardTitle>
                <Button size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  New Client
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Phase {client.phase} • Last activity: {client.lastActivity}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resource Quick Access */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" asChild>
          <Link href="/templates">
            <Download className="h-5 w-5" />
            <span className="text-sm">Templates</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" asChild>
          <Link href="/cle">
            <Award className="h-5 w-5" />
            <span className="text-sm">CLE Courses</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" asChild>
          <Link href="/hotline">
            <HeadphonesIcon className="h-5 w-5" />
            <span className="text-sm">Hotline</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" asChild>
          <Link href="/support">
            <MessageSquare className="h-5 w-5" />
            <span className="text-sm">Support</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}