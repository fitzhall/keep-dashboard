'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import { 
  Award, 
  BookOpen, 
  Shield, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  FileText, 
  HelpCircle,
  ArrowRight,
  Star,
  Target,
  Zap
} from 'lucide-react'

export default function DashboardPage() {
  // Mock data for professional development metrics
  const cleProgress = 22 // 2.5 out of 11.5 credits
  const sopPhasesCompleted = 3
  const totalSopPhases = 7
  const templatesDownloaded = 4
  const complianceScore = 85

  const recentActivity = [
    { 
      type: 'training', 
      title: 'Completed Bitcoin Estate Planning Fundamentals', 
      description: 'Earned 2.5 CLE credits', 
      time: '2 days ago',
      icon: Award,
      color: 'text-blue-600'
    },
    { 
      type: 'template', 
      title: 'Downloaded Bitcoin Trust Template', 
      description: 'Added to your practice toolkit', 
      time: '3 days ago',
      icon: FileText,
      color: 'text-green-600'
    },
    { 
      type: 'support', 
      title: 'Expert Hotline Response Received', 
      description: 'Multi-sig setup guidance provided', 
      time: '5 days ago',
      icon: HelpCircle,
      color: 'text-purple-600'
    },
    { 
      type: 'compliance', 
      title: 'Compliance Checklist Updated', 
      description: 'New California regulations added', 
      time: '1 week ago',
      icon: Shield,
      color: 'text-orange-600'
    }
  ]

  const nextSteps = [
    {
      title: 'Continue Technical Custody Solutions',
      description: 'Complete your in-progress course (65% done)',
      action: 'Continue Course',
      href: '/cle',
      priority: 'high'
    },
    {
      title: 'Review SOP Phase 4: Technical Implementation',
      description: 'Learn multi-signature wallet setup',
      action: 'Start Phase',
      href: '/sop',
      priority: 'medium'
    },
    {
      title: 'Download Beneficiary Designation Form',
      description: 'Premium template for client documentation',
      action: 'Download',
      href: '/templates',
      priority: 'low'
    }
  ]

  return (
    <>
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Professional Development Hub</h1>
        <p className="text-muted-foreground">
          Track your Bitcoin estate planning certification progress and practice readiness.
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CLE Progress</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cleProgress}%</div>
              <p className="text-xs text-muted-foreground">2.5 of 11.5 credits earned</p>
              <Progress value={cleProgress} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SOP Mastery</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sopPhasesCompleted}/{totalSopPhases}</div>
              <p className="text-xs text-muted-foreground">Phases completed</p>
              <Progress value={(sopPhasesCompleted / totalSopPhases) * 100} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Practice Toolkit</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templatesDownloaded}</div>
              <p className="text-xs text-muted-foreground">Templates downloaded</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{complianceScore}%</div>
              <p className="text-xs text-muted-foreground">Practice readiness</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Practice Readiness Status */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Practice Readiness Assessment
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Your current status for offering Bitcoin estate planning services
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Foundational Knowledge</p>
                      <p className="text-sm text-muted-foreground">Bitcoin estate planning principles mastered</p>
                    </div>
                  </div>
                  <Badge variant="default">Complete</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">Technical Implementation</p>
                      <p className="text-sm text-muted-foreground">Multi-sig and custody solutions (65% complete)</p>
                    </div>
                  </div>
                  <Badge variant="secondary">In Progress</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                    <div>
                      <p className="font-medium">Compliance & Ethics</p>
                      <p className="text-sm text-muted-foreground">Regulatory requirements and best practices</p>
                    </div>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                    <div>
                      <p className="font-medium">Advanced Structures</p>
                      <p className="text-sm text-muted-foreground">Complex trust arrangements</p>
                    </div>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <p className="font-medium text-blue-900">Current Status: Foundation Complete</p>
                </div>
                <p className="text-sm text-blue-700">
                  You've mastered the basics! Continue with technical training to offer comprehensive Bitcoin estate planning services.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Recommended Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nextSteps.map((step, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{step.title}</h4>
                      <Badge 
                        variant={step.priority === 'high' ? 'destructive' : step.priority === 'medium' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {step.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{step.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      {step.action}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Professional Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Professional Activity
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Your latest progress in mastering Bitcoin estate planning
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                  className="flex items-start gap-4 py-3 border-b last:border-0"
                >
                  <div className={`p-2 rounded-lg bg-muted`}>
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}