'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import { 
  ChevronDown, 
  ChevronRight,
  CheckCircle,
  Circle,
  Clock,
  AlertCircle,
  BookOpen,
  FileText,
  Users,
  Shield,
  Award,
  Rocket
} from 'lucide-react'

interface OnboardingTask {
  id: string
  title: string
  description: string
  completed: boolean
  time: string
}

interface OnboardingDay {
  day: number
  title: string
  icon: React.ElementType
  status: 'completed' | 'in-progress' | 'locked'
  tasks: OnboardingTask[]
}

const onboardingDays: OnboardingDay[] = [
  {
    day: 1,
    title: 'Platform Setup & Orientation',
    icon: Rocket,
    status: 'completed',
    tasks: [
      {
        id: '1-1',
        title: 'Complete account setup and profile',
        description: 'Add your firm information, upload photo, and verify credentials',
        completed: true,
        time: '15 min'
      },
      {
        id: '1-2',
        title: 'Watch platform overview video',
        description: 'Learn about KEEP Protocol and dashboard navigation',
        completed: true,
        time: '20 min'
      },
      {
        id: '1-3',
        title: 'Download and review KEEP Protocol handbook',
        description: 'Essential reading for understanding the system',
        completed: true,
        time: '45 min'
      },
      {
        id: '1-4',
        title: 'Join the KEEP Protocol community',
        description: 'Access to private forum and expert support',
        completed: true,
        time: '10 min'
      }
    ]
  },
  {
    day: 2,
    title: 'SOP Training & Documentation',
    icon: BookOpen,
    status: 'completed',
    tasks: [
      {
        id: '2-1',
        title: 'Complete 10-Phase SOP training module',
        description: 'Master the core KEEP Protocol process',
        completed: true,
        time: '90 min'
      },
      {
        id: '2-2',
        title: 'Download all SOP templates',
        description: 'Get the complete template library for your practice',
        completed: true,
        time: '15 min'
      },
      {
        id: '2-3',
        title: 'Review ethics compliance checklist',
        description: 'Understand ABA ethics rules for Bitcoin estate planning',
        completed: true,
        time: '30 min'
      },
      {
        id: '2-4',
        title: 'Complete SOP quiz',
        description: 'Test your understanding of the process',
        completed: true,
        time: '20 min'
      }
    ]
  },
  {
    day: 3,
    title: 'Document Review & Customization',
    icon: FileText,
    status: 'in-progress',
    tasks: [
      {
        id: '3-1',
        title: 'Review all template documents',
        description: 'Familiarize yourself with each template in the library',
        completed: true,
        time: '60 min'
      },
      {
        id: '3-2',
        title: 'Customize templates for your jurisdiction',
        description: 'Add your firm details and local requirements',
        completed: true,
        time: '45 min'
      },
      {
        id: '3-3',
        title: 'Set up document management system',
        description: 'Organize templates for efficient client work',
        completed: false,
        time: '30 min'
      },
      {
        id: '3-4',
        title: 'Create your first client intake form',
        description: 'Practice using the templates',
        completed: false,
        time: '20 min'
      }
    ]
  },
  {
    day: 4,
    title: 'Mock Client Exercise',
    icon: Users,
    status: 'locked',
    tasks: [
      {
        id: '4-1',
        title: 'Review mock client scenario',
        description: 'Study the provided client case details',
        completed: false,
        time: '30 min'
      },
      {
        id: '4-2',
        title: 'Complete full SOP process for mock client',
        description: 'Apply everything you\'ve learned',
        completed: false,
        time: '120 min'
      },
      {
        id: '4-3',
        title: 'Submit mock client documents for review',
        description: 'Get expert feedback on your work',
        completed: false,
        time: '15 min'
      },
      {
        id: '4-4',
        title: 'Review feedback and make corrections',
        description: 'Learn from expert guidance',
        completed: false,
        time: '45 min'
      }
    ]
  },
  {
    day: 5,
    title: 'Certification & Launch',
    icon: Award,
    status: 'locked',
    tasks: [
      {
        id: '5-1',
        title: 'Complete final certification exam',
        description: 'Demonstrate your mastery of KEEP Protocol',
        completed: false,
        time: '60 min'
      },
      {
        id: '5-2',
        title: 'Schedule 1-on-1 with KEEP expert',
        description: 'Get personalized guidance for your practice',
        completed: false,
        time: '30 min'
      },
      {
        id: '5-3',
        title: 'Receive KEEP Protocol certification',
        description: 'Official certification for your practice',
        completed: false,
        time: '5 min'
      },
      {
        id: '5-4',
        title: 'Launch your Bitcoin estate planning practice',
        description: 'You\'re ready to serve clients!',
        completed: false,
        time: '∞'
      }
    ]
  }
]

export function OnboardingChecklist() {
  const [expandedDays, setExpandedDays] = useState<number[]>([3])
  const [tasks, setTasks] = useState(onboardingDays)

  const toggleDay = (day: number) => {
    setExpandedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    )
  }

  const toggleTask = (dayIndex: number, taskId: string) => {
    setTasks(prev => prev.map((day, idx) => {
      if (idx !== dayIndex) return day
      
      return {
        ...day,
        tasks: day.tasks.map(task =>
          task.id === taskId
            ? { ...task, completed: !task.completed }
            : task
        )
      }
    }))
  }

  const calculateProgress = () => {
    const totalTasks = tasks.reduce((sum, day) => sum + day.tasks.length, 0)
    const completedTasks = tasks.reduce(
      (sum, day) => sum + day.tasks.filter(t => t.completed).length, 
      0
    )
    return Math.round((completedTasks / totalTasks) * 100)
  }

  const getStatusIcon = (status: OnboardingDay['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'in-progress': return <Clock className="h-5 w-5 text-yellow-600" />
      case 'locked': return <Circle className="h-5 w-5 text-gray-400" />
    }
  }

  const progress = calculateProgress()

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>5-Day Onboarding Progress</CardTitle>
          <CardDescription>
            Complete all tasks to become KEEP Protocol certified
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{progress}% Complete</span>
              <Badge variant={progress === 100 ? 'default' : 'secondary'}>
                {progress === 100 ? 'Certified' : 'In Progress'}
              </Badge>
            </div>
            <Progress value={progress} className="h-3" />
            
            {progress < 100 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Complete Day 3 tasks to unlock Day 4 mock client exercise
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Daily Tasks */}
      <div className="space-y-4">
        {tasks.map((day, dayIndex) => {
          const DayIcon = day.icon
          const isExpanded = expandedDays.includes(day.day)
          const completedTasks = day.tasks.filter(t => t.completed).length
          const totalTasks = day.tasks.length
          const dayProgress = Math.round((completedTasks / totalTasks) * 100)

          return (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.1 }}
            >
              <Card className={day.status === 'locked' ? 'opacity-75' : ''}>
                <Collapsible open={isExpanded} onOpenChange={() => toggleDay(day.day)}>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            {getStatusIcon(day.status)}
                          </div>
                          <DayIcon className="h-5 w-5 text-muted-foreground" />
                          <div className="text-left">
                            <CardTitle className="text-base">
                              Day {day.day}: {day.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {completedTasks} of {totalTasks} tasks completed
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={dayProgress} className="w-24 h-2" />
                          <Badge variant={
                            day.status === 'completed' ? 'default' :
                            day.status === 'in-progress' ? 'secondary' :
                            'outline'
                          }>
                            {dayProgress}%
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {day.tasks.map((task, taskIndex) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: taskIndex * 0.05 }}
                            className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                          >
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => toggleTask(dayIndex, task.id)}
                              disabled={day.status === 'locked'}
                            />
                            <div className="flex-1">
                              <p className="font-medium">{task.title}</p>
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                            </div>
                            <Badge variant="outline" className="ml-auto">
                              {task.time}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                      
                      {day.status === 'in-progress' && completedTasks === totalTasks && (
                        <div className="mt-4">
                          <Button className="w-full">
                            Mark Day {day.day} as Complete
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}