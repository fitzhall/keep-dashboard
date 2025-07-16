'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  BookOpen, 
  Award, 
  Clock, 
  PlayCircle, 
  CheckCircle2,
  FileText,
  Download,
  Users,
  Shield,
  AlertCircle,
  Lock,
  Star,
  ArrowRight,
  Calendar,
  Video
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUserProgress } from '@/contexts/UserProgressContext'
import { cn } from '@/lib/utils'

// Primary CLE Course
const primaryCLECourse = {
  id: 'bitcoin-inheritance-cle',
  title: 'Bitcoin Inheritance: Practical Drafting & Risk-Mitigation for Estate-Planning Professionals',
  description: 'Comprehensive training on Bitcoin estate planning with CLE credit',
  duration: '4.5 hours',
  credits: 4.5,
  ethicsCredits: 0.25,
  segments: [
    {
      id: 'segment-1',
      title: 'Segment 1: The $471B Problem - Market Overview & Legal Challenges',
      duration: '1.25 hours',
      status: 'completed',
      topics: [
        'Bitcoin inheritance statistics and trends',
        'Common failure points in digital asset transfer',
        'Legal precedents and case studies',
        'Risk assessment framework'
      ]
    },
    {
      id: 'segment-2', 
      title: 'Segment 2: Regulatory Landscape - Current Law & Compliance Requirements',
      duration: '1 hour',
      status: 'in-progress',
      topics: [
        'State-by-state Bitcoin regulations',
        'RUFADAA implementation',
        'ABA Model Rules compliance',
        'Malpractice insurance considerations'
      ],
      hasEthicsCredit: true
    },
    {
      id: 'segment-3',
      title: 'Segment 3: KEEP Framework - Step-by-Step Implementation',
      duration: '1.5 hours',
      status: 'pending',
      topics: [
        '10-Phase SOP walkthrough',
        'Template integration',
        'Client communication protocols',
        'Documentation requirements'
      ]
    },
    {
      id: 'segment-4',
      title: 'Segment 4: Advanced Strategies - Complex Family Structures',
      duration: '45 mins',
      status: 'pending',
      topics: [
        'Multi-generational planning',
        'Blended family considerations',
        'International beneficiaries',
        'Special needs trusts with Bitcoin'
      ]
    }
  ],
  progress: 35
}

// 5-Day Implementation Modules
const implementationModules = [
  {
    id: 'day-1-framework',
    title: 'Day 1: Framework Mastery',
    description: 'Complete Framework Executive Summary',
    duration: '2 hours',
    modules: [
      'KEEP Protocol Overview',
      'Legal Framework Understanding',
      'Risk Mitigation Strategies',
      'Implementation Roadmap'
    ],
    status: 'completed',
    progress: 100
  },
  {
    id: 'day-2-templates',
    title: 'Day 2: Template Integration',
    description: 'Integrate Engagement Letter Template',
    duration: '1.5 hours',
    modules: [
      'Template Customization',
      'Firm Branding Integration',
      'Compliance Verification',
      'Practice Management Setup'
    ],
    status: 'completed',
    progress: 100
  },
  {
    id: 'day-3-assessment',
    title: 'Day 3: Risk Assessment Setup',
    description: 'Setup Risk Assessment Process',
    duration: '2.5 hours',
    modules: [
      'Client Intake Workflow',
      'Risk Assessment Tools',
      'Documentation Protocols',
      'Compliance Checklists'
    ],
    status: 'in-progress',
    progress: 65
  },
  {
    id: 'day-4-workflows',
    title: 'Day 4: Workflow Implementation',
    description: 'Configure Client Workflows',
    duration: '3 hours',
    modules: [
      'Phase-by-Phase Workflows',
      'Team Role Assignments',
      'Communication Templates',
      'Progress Tracking Setup'
    ],
    status: 'locked',
    progress: 0
  },
  {
    id: 'day-5-marketing',
    title: 'Day 5: Practice Integration',
    description: 'Prepare Marketing Materials',
    duration: '2 hours',
    modules: [
      'Marketing Template Customization',
      'Website Integration',
      'Client Education Materials',
      'Launch Planning'
    ],
    status: 'locked',
    progress: 0
  }
]

// Quick Resources
const quickResources = [
  {
    title: 'CLE Certificate Generator',
    description: 'Generate your certificate after completion',
    icon: Award,
    action: 'Generate',
    available: false
  },
  {
    title: 'Implementation Checklist',
    description: 'Track your 5-day progress',
    icon: FileText,
    action: 'Download',
    available: true
  },
  {
    title: 'Training Slides',
    description: 'PowerPoint deck for team training',
    icon: PlayCircle,
    action: 'Download',
    available: true
  },
  {
    title: 'Office Hours Schedule',
    description: 'Live Q&A with KEEP experts',
    icon: Calendar,
    action: 'View Schedule',
    available: true
  }
]

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState('cle-course')
  const router = useRouter()
  const { progress } = useUserProgress()

  const handleStartTraining = (moduleId: string) => {
    // In a real app, this would navigate to the actual training content
    router.push(`/training/${moduleId}`)
  }

  // Calculate progress
  const completedDays = implementationModules.filter(m => m.status === 'completed').length
  const implementationProgress = (completedDays / implementationModules.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Training Center</h1>
        <p className="text-gray-600 mt-1">
          Complete your KEEP Protocol certification and earn CLE credits
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">CLE Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{primaryCLECourse.progress}%</div>
            <Progress value={primaryCLECourse.progress} className="mt-2 h-1" />
            <p className="text-xs text-gray-500 mt-1">Segment 2 of 4</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">5-Day Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{Math.round(implementationProgress)}%</div>
            <Progress value={implementationProgress} className="mt-2 h-1" />
            <p className="text-xs text-gray-500 mt-1">Day {completedDays + 1} of 5</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Credits Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">4.75</div>
            <p className="text-xs text-gray-500 mt-1">Including 0.25 ethics</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cle-course">CLE Course</TabsTrigger>
          <TabsTrigger value="implementation">5-Day Implementation</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* CLE Course Tab */}
        <TabsContent value="cle-course" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{primaryCLECourse.title}</CardTitle>
                  <CardDescription>{primaryCLECourse.description}</CardDescription>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary">
                      <Award className="mr-1 h-3 w-3" />
                      {primaryCLECourse.credits} CLE Credits
                    </Badge>
                    <Badge variant="outline">
                      <Star className="mr-1 h-3 w-3" />
                      {primaryCLECourse.ethicsCredits} Ethics
                    </Badge>
                    <span className="text-sm text-gray-500">
                      <Clock className="inline mr-1 h-3 w-3" />
                      {primaryCLECourse.duration}
                    </span>
                  </div>
                </div>
                <Button>
                  Continue Course <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {primaryCLECourse.segments.map((segment, index) => (
                  <div
                    key={segment.id}
                    className={cn(
                      "p-4 rounded-lg border",
                      segment.status === 'completed' && "bg-green-50 border-green-200",
                      segment.status === 'in-progress' && "bg-blue-50 border-blue-200"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2">
                          {segment.status === 'completed' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : segment.status === 'in-progress' ? (
                            <PlayCircle className="h-5 w-5 text-blue-600" />
                          ) : (
                            <span className="text-sm font-medium text-gray-400">{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{segment.title}</h4>
                          <p className="text-sm text-gray-500">
                            {segment.duration}
                            {segment.hasEthicsCredit && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Includes Ethics Credit
                              </Badge>
                            )}
                          </p>
                        </div>
                      </div>
                      {segment.status === 'in-progress' && (
                        <Button size="sm">Resume</Button>
                      )}
                    </div>
                    <div className="ml-11 space-y-1">
                      {segment.topics.map((topic, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5-Day Implementation Tab */}
        <TabsContent value="implementation" className="space-y-6">
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              <strong>Currently on Day {completedDays + 1}:</strong> Complete each day's modules to unlock the next phase of your KEEP Protocol implementation.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {implementationModules.map((day) => (
              <Card
                key={day.id}
                className={cn(
                  day.status === 'locked' && "opacity-60"
                )}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {day.status === 'completed' && (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      )}
                      {day.status === 'in-progress' && (
                        <Clock className="h-5 w-5 text-blue-600" />
                      )}
                      {day.status === 'locked' && (
                        <Lock className="h-5 w-5 text-gray-400" />
                      )}
                      <div>
                        <CardTitle className="text-lg">{day.title}</CardTitle>
                        <CardDescription>{day.description} • {day.duration}</CardDescription>
                      </div>
                    </div>
                    {day.status === 'in-progress' && (
                      <Button size="sm">
                        Continue <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                {(day.status === 'completed' || day.status === 'in-progress') && (
                  <CardContent>
                    <Progress value={day.progress} className="mb-3" />
                    <div className="grid grid-cols-2 gap-2">
                      {day.modules.map((module, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className={cn(
                            "h-4 w-4",
                            day.progress > (i / day.modules.length) * 100
                              ? "text-green-600"
                              : "text-gray-300"
                          )} />
                          <span className={cn(
                            day.progress > (i / day.modules.length) * 100
                              ? "text-gray-900"
                              : "text-gray-500"
                          )}>
                            {module}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {quickResources.map((resource) => {
              const Icon = resource.icon
              return (
                <Card key={resource.title} className={cn(
                  !resource.available && "opacity-60"
                )}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{resource.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!resource.available}
                      >
                        {resource.action}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Live Office Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Join our weekly office hours for live Q&A with KEEP Protocol experts.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded">
                  <div>
                    <p className="font-medium text-sm">Every Tuesday</p>
                    <p className="text-xs text-gray-500">2:00 PM EST • Bitcoin Estate Planning Q&A</p>
                  </div>
                  <Button size="sm" variant="outline">Join</Button>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded">
                  <div>
                    <p className="font-medium text-sm">Every Thursday</p>
                    <p className="text-xs text-gray-500">3:00 PM EST • Technical Implementation</p>
                  </div>
                  <Button size="sm" variant="outline">Join</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}