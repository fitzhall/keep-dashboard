'use client'

import { useState, useEffect } from 'react'
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
  Video,
  X
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { useUserProgress } from '@/contexts/UserProgressContext'
import { cn } from '@/lib/utils'
import { VideoPlayer } from '@/components/VideoPlayer'
import { getTrainingVideosByModule, getAllKeepVideos, type TrainingVideo } from '@/lib/training-videos'
import { markVideoComplete, getUserVideoProgress, type TrainingProgress } from '@/lib/training-progress'
import { useToast } from '@/hooks/use-toast'
import { getUpcomingWorkshops, registerForWorkshop, getUserRegistrations, type Workshop } from '@/lib/workshops'
import { WorkshopCard } from '@/components/WorkshopCard'

// Process Training Modules
const processTrainingModules = [
  {
    id: 'template-mastery',
    title: 'Template Mastery Workshop',
    description: 'Master all 25 KEEP templates and their use cases',
    duration: '3 hours',
    modules: [
      {
        name: 'Engagement & Onboarding Templates',
        topics: [
          'KEEP Engagement Letter Template customization',
          'Conflict Check procedures',
          'Pre-Engagement Questionnaire workflow',
          'Client Welcome Package assembly'
        ],
        status: 'completed'
      },
      {
        name: 'Assessment & Planning Templates',
        topics: [
          'Client Risk Assessment Template walkthrough',
          'Bitcoin Multisig Design Worksheet',
          'Estate Planning Profile Form',
          'Digital Asset Inventory Template'
        ],
        status: 'in-progress'
      },
      {
        name: 'Technical Documentation',
        topics: [
          'Hardware Wallet Setup Guide customization',
          'Multisig Wallet Creation Checklist',
          'Key Backup Instructions',
          'Recovery Testing Procedures'
        ],
        status: 'pending'
      },
      {
        name: 'Ongoing Management Templates',
        topics: [
          'Annual Review Checklist implementation',
          'Beneficiary Communication Templates',
          'Quality Control Submission Form',
          'Probate Proofing SOP Template'
        ],
        status: 'pending'
      }
    ],
    progress: 35
  },
  {
    id: 'sop-implementation',
    title: '10-Phase SOP Deep Dive',
    description: 'Implement each phase of the KEEP Protocol workflow',
    duration: '4 hours',
    modules: [
      {
        name: 'Client Onboarding (Phases 1-3)',
        topics: [
          'Initial consultation structure',
          'Risk assessment methodology',
          'Engagement letter execution',
          'Expectation setting'
        ],
        status: 'completed'
      },
      {
        name: 'Technical Setup (Phases 4-6)',
        topics: [
          'Multisig design principles',
          'Hardware wallet configuration',
          'Key ceremony protocols',
          'Documentation standards'
        ],
        status: 'pending'
      },
      {
        name: 'Testing & Verification (Phases 7-8)',
        topics: [
          'Recovery testing procedures',
          'Beneficiary education approach',
          'Access verification methods',
          'Documentation updates'
        ],
        status: 'pending'
      },
      {
        name: 'Ongoing Management (Phases 9-10)',
        topics: [
          'Annual review processes',
          'Update triggers and procedures',
          'Beneficiary communication',
          'Quality control measures'
        ],
        status: 'pending'
      }
    ],
    progress: 25
  },
  {
    id: 'team-training',
    title: 'Team Training & Delegation',
    description: 'Train your team on KEEP Protocol implementation',
    duration: '2 hours',
    modules: [
      {
        name: 'Role Definition',
        topics: [
          'Attorney responsibilities',
          'Paralegal tasks',
          'Administrative support',
          'Technical coordinator role'
        ],
        status: 'pending'
      },
      {
        name: 'Internal Workflows',
        topics: [
          'Task assignment protocols',
          'Quality control checkpoints',
          'Documentation standards',
          'Client communication guidelines'
        ],
        status: 'pending'
      }
    ],
    progress: 0
  }
]

// Best Practices Workshops
const bestPracticesWorkshops = [
  {
    id: 'client-communication',
    title: 'Client Communication Excellence',
    description: 'Master Bitcoin estate planning conversations',
    duration: '90 mins',
    topics: [
      'Explaining Bitcoin inheritance risks',
      'Addressing technical concerns',
      'Setting realistic expectations',
      'Handling objections'
    ],
    format: 'Interactive workshop with role-play',
    status: 'available'
  },
  {
    id: 'risk-mitigation',
    title: 'Risk Mitigation Strategies',
    description: 'Identify and prevent common pitfalls',
    duration: '2 hours',
    topics: [
      'Common failure points analysis',
      'Malpractice prevention',
      'Documentation best practices',
      'Quality control implementation'
    ],
    format: 'Case study analysis',
    status: 'available'
  },
  {
    id: 'technical-competence',
    title: 'Technical Competence Building',
    description: 'Hands-on Bitcoin custody training',
    duration: '3 hours',
    topics: [
      'Hardware wallet fundamentals',
      'Multisig setup walkthrough',
      'Recovery testing procedures',
      'Security best practices'
    ],
    format: 'Hands-on lab with test wallets',
    status: 'available'
  },
  {
    id: 'practice-integration',
    title: 'Practice Integration Strategies',
    description: 'Seamlessly add Bitcoin services to your practice',
    duration: '2 hours',
    topics: [
      'Pricing strategies',
      'Service packaging',
      'Marketing approaches',
      'Team training plans'
    ],
    format: 'Strategic planning session',
    status: 'available'
  }
]

// Training Resources
const trainingResources = [
  {
    title: 'Template Video Guides',
    description: 'Step-by-step walkthroughs for each template',
    icon: Video,
    action: 'Watch',
    available: true,
    count: 25
  },
  {
    title: 'Process Flowcharts',
    description: 'Visual guides for each SOP phase',
    icon: FileText,
    action: 'Download',
    available: true,
    count: 10
  },
  {
    title: 'Team Training Materials',
    description: 'Ready-to-use training deck for your staff',
    icon: PlayCircle,
    action: 'Access',
    available: true,
    count: 1
  },
  {
    title: 'Practice Scenarios',
    description: 'Real-world case studies and solutions',
    icon: BookOpen,
    action: 'Review',
    available: true,
    count: 15
  }
]

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState('templates')
  const [videos, setVideos] = useState<TrainingVideo[]>([])
  const [selectedVideo, setSelectedVideo] = useState<TrainingVideo | null>(null)
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [videoProgress, setVideoProgress] = useState<TrainingProgress[]>([])
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [userRegistrations, setUserRegistrations] = useState<string[]>([])
  const [loadingWorkshops, setLoadingWorkshops] = useState(false)
  const router = useRouter()
  const { progress } = useUserProgress()
  const { toast } = useToast()

  const handleStartTraining = (moduleId: string) => {
    // In a real app, this would navigate to the actual training content
    router.push(`/training/${moduleId}`)
  }

  // Calculate progress
  const completedTemplateModules = processTrainingModules[0].modules.filter(m => m.status === 'completed').length
  const templateProgress = (completedTemplateModules / processTrainingModules[0].modules.length) * 100

  // Load videos, workshops and progress when component mounts
  useEffect(() => {
    loadVideos()
    loadProgress()
    loadWorkshops()
  }, [])

  const loadVideos = async () => {
    setLoadingVideos(true)
    try {
      const keepVideos = await getAllKeepVideos()
      setVideos(keepVideos)
    } catch (error) {
      console.error('Error loading videos:', error)
    } finally {
      setLoadingVideos(false)
    }
  }

  const loadWorkshops = async () => {
    setLoadingWorkshops(true)
    try {
      const [upcomingWorkshops, userRegs] = await Promise.all([
        getUpcomingWorkshops(),
        getUserRegistrations()
      ])
      setWorkshops(upcomingWorkshops)
      setUserRegistrations(userRegs.map(r => r.workshop_id))
    } catch (error) {
      console.error('Error loading workshops:', error)
    } finally {
      setLoadingWorkshops(false)
    }
  }

  const handleWorkshopRegister = async (workshop: Workshop) => {
    const result = await registerForWorkshop(workshop.id)
    if (result.success) {
      toast({
        title: "Success",
        description: `You've been registered for ${workshop.title}`,
      })
      // Reload workshops to update registration status
      loadWorkshops()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to register for workshop",
        variant: "destructive",
      })
    }
  }

  const loadProgress = async () => {
    try {
      const progress = await getUserVideoProgress()
      setVideoProgress(progress)
    } catch (error) {
      console.error('Error loading progress:', error)
    }
  }

  const handleVideoComplete = async (video: TrainingVideo) => {
    const success = await markVideoComplete(video.id, video.module_id || undefined)
    if (success) {
      toast({
        title: 'Video completed!',
        description: 'Your progress has been saved.'
      })
      loadProgress() // Reload progress
    } else {
      toast({
        title: 'Error saving progress',
        description: 'Please try again later.',
        variant: 'destructive'
      })
    }
  }

  const isVideoCompleted = (videoId: string) => {
    return videoProgress.some(p => p.video_id === videoId && p.completed)
  }

  // Group videos by module
  const videosByModule = videos.reduce((acc, video) => {
    if (video.module_id) {
      if (!acc[video.module_id]) {
        acc[video.module_id] = []
      }
      acc[video.module_id].push(video)
    }
    return acc
  }, {} as Record<string, TrainingVideo[]>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Training Center</h1>
        <p className="text-gray-600 mt-1">
          Master the KEEP Protocol templates and implementation process
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Template Training</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{processTrainingModules[0].progress}%</div>
            <Progress value={processTrainingModules[0].progress} className="mt-2 h-1" />
            <p className="text-xs text-gray-500 mt-1">8 of 25 templates mastered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">SOP Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{processTrainingModules[1].progress}%</div>
            <Progress value={processTrainingModules[1].progress} className="mt-2 h-1" />
            <p className="text-xs text-gray-500 mt-1">Phase 3 of 10</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Workshops Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">2</div>
            <p className="text-xs text-gray-500 mt-1">of 4 available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Team Members Trained</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">0</div>
            <p className="text-xs text-gray-500 mt-1">Start team training</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates">Template Training</TabsTrigger>
          <TabsTrigger value="sop">SOP Training</TabsTrigger>
          <TabsTrigger value="workshops">Workshops</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Template Training Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{processTrainingModules[0].title}</CardTitle>
                  <CardDescription>{processTrainingModules[0].description}</CardDescription>
                  <span className="text-sm text-gray-500">
                    <Clock className="inline mr-1 h-3 w-3" />
                    {processTrainingModules[0].duration}
                  </span>
                </div>
                <Button>
                  Continue Training <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processTrainingModules[0].modules.map((module, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-4 rounded-lg border",
                      module.status === 'completed' && "bg-green-50 border-green-200",
                      module.status === 'in-progress' && "bg-blue-50 border-blue-200"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2">
                          {module.status === 'completed' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : module.status === 'in-progress' ? (
                            <PlayCircle className="h-5 w-5 text-blue-600" />
                          ) : (
                            <span className="text-sm font-medium text-gray-400">{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{module.name}</h4>
                          <p className="text-sm text-gray-500">
                            {module.topics.length} templates to master
                            {videosByModule[processTrainingModules[0].modules[index].name] && 
                              ` • ${videosByModule[processTrainingModules[0].modules[index].name].length} videos`
                            }
                          </p>
                        </div>
                      </div>
                      {module.status === 'in-progress' && (
                        <Button size="sm">Resume</Button>
                      )}
                    </div>
                    <div className="ml-11 space-y-1">
                      {module.topics.map((topic, i) => (
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

        {/* SOP Training Tab */}
        <TabsContent value="sop" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{processTrainingModules[1].title}</CardTitle>
                  <CardDescription>{processTrainingModules[1].description}</CardDescription>
                  <span className="text-sm text-gray-500">
                    <Clock className="inline mr-1 h-3 w-3" />
                    {processTrainingModules[1].duration}
                  </span>
                </div>
                <Button variant="outline">
                  View SOP Guide <BookOpen className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6 border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  Each phase builds on the previous one. Complete them in order for best results.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                {processTrainingModules[1].modules.map((module, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-4 rounded-lg border",
                      module.status === 'completed' && "bg-green-50 border-green-200",
                      module.status === 'in-progress' && "bg-blue-50 border-blue-200",
                      module.status === 'pending' && "opacity-75"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2">
                          {module.status === 'completed' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : module.status === 'in-progress' ? (
                            <PlayCircle className="h-5 w-5 text-blue-600" />
                          ) : (
                            <span className="text-sm font-medium text-gray-400">{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{module.name}</h4>
                          <p className="text-sm text-gray-500">
                            {module.topics.length} key procedures
                          </p>
                        </div>
                      </div>
                      {module.status === 'completed' && (
                        <Button size="sm" variant="outline">Review</Button>
                      )}
                      {module.status === 'pending' && index === 1 && (
                        <Button size="sm">Start</Button>
                      )}
                    </div>
                    <div className="ml-11 space-y-1">
                      {module.topics.map((topic, i) => (
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

        {/* Workshops Tab */}
        <TabsContent value="workshops" className="space-y-6">
          {loadingWorkshops ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading workshops...</p>
              </div>
            </div>
          ) : workshops.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Upcoming Workshops</h3>
                <p className="text-muted-foreground text-center">
                  Check back soon for new workshop announcements.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Register for live workshops to earn CLE credits and learn from Bitcoin estate planning experts.
                </AlertDescription>
              </Alert>
              <div className="grid gap-4 md:grid-cols-2">
                {workshops.map((workshop) => (
                  <WorkshopCard
                    key={workshop.id}
                    workshop={workshop}
                    onRegister={handleWorkshopRegister}
                    isRegistered={userRegistrations.includes(workshop.id)}
                  />
                ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {trainingResources.map((resource) => {
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
                        {resource.count && (
                          <Badge variant="secondary" className="mt-2">
                            {resource.count} items
                          </Badge>
                        )}
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
                <Users className="h-5 w-5" />
                Expert Support & Office Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Get help implementing the KEEP Protocol in your practice
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Template Implementation Workshop</p>
                    <p className="text-xs text-gray-500">Weekly • Tuesdays 2:00 PM EST</p>
                  </div>
                  <Button size="sm" variant="outline">Join</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-sm">SOP Process Q&A</p>
                    <p className="text-xs text-gray-500">Weekly • Thursdays 3:00 PM EST</p>
                  </div>
                  <Button size="sm" variant="outline">Join</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-sm">1-on-1 Implementation Support</p>
                    <p className="text-xs text-gray-500">Schedule a personal session</p>
                  </div>
                  <Button size="sm" variant="default">Book</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training Videos Section */}
          {videos.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Training Videos
                </CardTitle>
                <CardDescription>Watch video tutorials for each module</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {videos.slice(0, 5).map((video) => {
                    const completed = isVideoCompleted(video.id)
                    return (
                      <Button
                        key={video.id}
                        variant="outline"
                        className={cn(
                          "w-full justify-start",
                          completed && "border-green-500 bg-green-50 hover:bg-green-100"
                        )}
                        onClick={() => setSelectedVideo(video)}
                      >
                        {completed ? (
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                        ) : (
                          <PlayCircle className="h-4 w-4 mr-2" />
                        )}
                        <span className="flex-1 text-left truncate">{video.title}</span>
                        {video.duration_minutes && (
                          <span className="text-xs text-gray-500 ml-2">
                            {video.duration_minutes} min
                          </span>
                        )}
                      </Button>
                    )
                  })}
                  {videos.length > 5 && (
                    <p className="text-sm text-center text-gray-500 mt-2">
                      And {videos.length - 5} more videos available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Team Training Program</CardTitle>
              <CardDescription>Get your entire team certified on the KEEP Protocol</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-sm">Attorney Training Track</p>
                      <p className="text-xs text-gray-500">Full protocol certification</p>
                    </div>
                  </div>
                  <Badge>Required</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-sm">Paralegal Training Track</p>
                      <p className="text-xs text-gray-500">Template management & client coordination</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Recommended</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-sm">Support Staff Training</p>
                      <p className="text-xs text-gray-500">Basic protocol awareness</p>
                    </div>
                  </div>
                  <Badge variant="outline">Optional</Badge>
                </div>
                <Button className="w-full">Start Team Training</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Video Player Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedVideo?.title}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedVideo(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedVideo && (
            <VideoPlayer
              title={selectedVideo.title}
              videoUrl={selectedVideo.video_url}
              videoId={selectedVideo.id}
              moduleId={selectedVideo.module_id || undefined}
              duration={selectedVideo.duration_minutes || undefined}
              description={selectedVideo.description || undefined}
              isCompleted={isVideoCompleted(selectedVideo.id)}
              onComplete={() => handleVideoComplete(selectedVideo)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}