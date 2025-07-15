'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
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
  CheckCircle,
  FileText,
  Download,
  ExternalLink,
  Users,
  Shield,
  Rocket,
  AlertCircle,
  Lock
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUserProgress } from '@/contexts/UserProgressContext'

// KEEP Protocol Training Modules (Non-CLE)
const keepTrainingModules = [
  {
    id: 'keep-101',
    title: 'KEEP Protocol Fundamentals',
    description: 'Understanding the core principles and philosophy',
    duration: '45 mins',
    modules: [
      'Why Bitcoin Estate Planning Matters',
      'The KEEP Protocol Framework',
      'Your Role as a KEEP Attorney',
      'Client Communication Best Practices'
    ],
    status: 'available',
    progress: 0
  },
  {
    id: 'sop-mastery',
    title: 'Mastering the 10-Phase SOP',
    description: 'Deep dive into each phase with practical examples',
    duration: '2 hours',
    modules: [
      'Phase 1-2: Intake & Custody Design',
      'Phase 3-4: Drafting & Vault Build',
      'Phase 5-6: Delivery & Education',
      'Phase 7-10: Maintenance & Compliance'
    ],
    status: 'available',
    progress: 0
  },
  {
    id: 'tools-tech',
    title: 'Tools & Technology',
    description: 'Using hardware wallets, multisig, and verification tools',
    duration: '90 mins',
    modules: [
      'Hardware Wallet Setup & Security',
      'Multisig Configuration',
      'Address Verification',
      'Recovery Testing Procedures'
    ],
    status: 'available',
    progress: 0
  },
  {
    id: 'compliance-docs',
    title: 'Documentation & Compliance',
    description: 'Maintaining proper records and meeting requirements',
    duration: '1 hour',
    modules: [
      'Required Documentation',
      'State-Specific Requirements',
      'Audit Preparation',
      'Best Practices for Record Keeping'
    ],
    status: 'available',
    progress: 0
  },
  {
    id: 'advanced-scenarios',
    title: 'Advanced Client Scenarios',
    description: 'Complex cases and special situations',
    duration: '90 mins',
    modules: [
      'High Net Worth Estates',
      'Business Bitcoin Holdings',
      'International Considerations',
      'Special Needs Planning'
    ],
    status: 'locked',
    progress: 0,
    requirement: 'Complete fundamentals first'
  }
]

// Quick start resources
const quickStartResources = [
  {
    title: 'KEEP Protocol Whitepaper',
    description: 'The foundational document explaining our approach',
    icon: FileText,
    action: 'Download PDF'
  },
  {
    title: 'Implementation Checklist',
    description: 'Step-by-step guide for your first client',
    icon: CheckCircle,
    action: 'View Checklist'
  },
  {
    title: 'Video: First Client Walkthrough',
    description: '30-minute video showing complete process',
    icon: PlayCircle,
    action: 'Watch Now'
  },
  {
    title: 'Office Hours Recording',
    description: 'Latest Q&A session with KEEP experts',
    icon: Users,
    action: 'View Recording'
  }
]

export default function TrainingPage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const router = useRouter()
  const { progress } = useUserProgress()

  // Calculate overall training progress
  const completedCourses = progress.courses.filter(c => c.status === 'completed').length
  const totalCourses = progress.courses.length
  const cleProgress = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0

  const completedKeepModules = keepTrainingModules.filter(m => m.progress === 100).length
  const totalKeepModules = keepTrainingModules.filter(m => m.status !== 'locked').length
  const keepProgress = totalKeepModules > 0 ? (completedKeepModules / totalKeepModules) * 100 : 0

  return (
    <>
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Training Center</h1>
        <p className="text-muted-foreground">
          Complete your KEEP Protocol certification and earn CLE credits.
        </p>
      </motion.div>

      {/* Training Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    CLE Training
                  </CardTitle>
                  <CardDescription>
                    Earn continuing legal education credits
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  {completedCourses} of {totalCourses} complete
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={cleProgress} className="mb-4" />
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>{cleProgress.toFixed(0)}% Complete</span>
                <span>{16 - completedCourses * 4} CLE hours remaining</span>
              </div>
              <Button 
                className="w-full" 
                onClick={() => router.push('/cle')}
              >
                Continue CLE Training
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    KEEP Training
                  </CardTitle>
                  <CardDescription>
                    Master the KEEP Protocol system
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  {completedKeepModules} of {totalKeepModules} complete
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={keepProgress} className="mb-4" />
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>{keepProgress.toFixed(0)}% Complete</span>
                <span>~6 hours remaining</span>
              </div>
              <Button className="w-full" variant="default">
                Continue KEEP Training
                <PlayCircle className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Start Section */}
      <Alert className="mb-8">
        <Rocket className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            <strong>New to KEEP?</strong> Start with the fundamentals module to understand the core concepts.
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedModule('keep-101')}
          >
            Start Fundamentals
          </Button>
        </AlertDescription>
      </Alert>

      {/* Training Tabs */}
      <Tabs defaultValue="keep" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="keep">KEEP Modules</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="schedule">Live Sessions</TabsTrigger>
        </TabsList>

        {/* KEEP Modules Tab */}
        <TabsContent value="keep" className="space-y-4">
          {keepTrainingModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`${module.status === 'locked' ? 'opacity-60' : 'hover:shadow-md transition-shadow cursor-pointer'}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{module.title}</h3>
                        {module.status === 'locked' && (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                        {module.progress === 100 && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">{module.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {module.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {module.modules.length} lessons
                        </span>
                      </div>

                      {module.status === 'available' && (
                        <div className="space-y-2">
                          <Progress value={module.progress} className="h-2" />
                          <div className="flex flex-wrap gap-2">
                            {module.modules.map((lesson, idx) => (
                              <Badge 
                                key={idx} 
                                variant={module.progress > (idx / module.modules.length) * 100 ? 'default' : 'outline'}
                                className="text-xs"
                              >
                                {lesson}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {module.status === 'locked' && (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{module.requirement}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="ml-4">
                      {module.status === 'available' && (
                        <Button
                          onClick={() => setSelectedModule(module.id)}
                          variant={module.progress > 0 ? 'default' : 'outline'}
                        >
                          {module.progress > 0 ? 'Continue' : 'Start'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickStartResources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <resource.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {resource.description}
                        </p>
                        <Button variant="outline" size="sm">
                          {resource.action}
                          <Download className="ml-2 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Additional Learning Resources</CardTitle>
              <CardDescription>
                Deepen your understanding of Bitcoin estate planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Security Best Practices Guide</p>
                      <p className="text-sm text-muted-foreground">Essential security protocols for client assets</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Case Studies Library</p>
                      <p className="text-sm text-muted-foreground">Real-world examples and solutions</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Template Customization Guide</p>
                      <p className="text-sm text-muted-foreground">How to adapt templates for your jurisdiction</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Sessions Tab */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Live Sessions</CardTitle>
              <CardDescription>
                Join expert-led training sessions and Q&A
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">Weekly Office Hours</h4>
                      <p className="text-sm text-muted-foreground">Open Q&A with KEEP experts</p>
                    </div>
                    <Badge>Every Tuesday</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>2:00 PM EST</span>
                    <span>•</span>
                    <span>60 minutes</span>
                  </div>
                  <Button className="w-full mt-3" variant="outline">
                    Add to Calendar
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">Advanced Multisig Workshop</h4>
                      <p className="text-sm text-muted-foreground">Deep dive into complex custody setups</p>
                    </div>
                    <Badge variant="secondary">Jan 25</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>3:00 PM EST</span>
                    <span>•</span>
                    <span>90 minutes</span>
                  </div>
                  <Button className="w-full mt-3" variant="outline">
                    Register
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">Compliance & Audit Prep</h4>
                      <p className="text-sm text-muted-foreground">Preparing for state compliance reviews</p>
                    </div>
                    <Badge variant="secondary">Feb 1</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>1:00 PM EST</span>
                    <span>•</span>
                    <span>2 hours</span>
                  </div>
                  <Button className="w-full mt-3" variant="outline">
                    Register
                  </Button>
                </div>
              </div>

              <Alert className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  All sessions are recorded and available in the resource library within 24 hours.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}