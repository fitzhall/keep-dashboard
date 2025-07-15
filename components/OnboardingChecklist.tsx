'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import { useUserProgress } from '@/contexts/UserProgressContext'
import { getOnboardingTasks, toggleOnboardingTask } from '@/lib/compliance-data'
import { useToast } from '@/hooks/use-toast'
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
  Rocket,
  Loader2
} from 'lucide-react'

// Day metadata (titles and icons)
const dayMetadata = [
  { title: 'Platform Setup & Orientation', icon: Rocket },
  { title: 'SOP Training & Documentation', icon: BookOpen },
  { title: 'Document Review & Customization', icon: FileText },
  { title: 'Mock Client Exercise', icon: Users },
  { title: 'Certification & Launch', icon: Award }
]

export function OnboardingChecklist() {
  const { userProfile } = useUserProgress()
  const { toast } = useToast()
  const [expandedDays, setExpandedDays] = useState<number[]>([3])
  const [tasks, setTasks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (userProfile?.id) {
      loadOnboardingTasks()
    }
  }, [userProfile])

  async function loadOnboardingTasks() {
    if (!userProfile?.id) return

    try {
      const data = await getOnboardingTasks(userProfile.id)
      setTasks(data)
    } catch (error) {
      console.error('Error loading onboarding tasks:', error)
      toast({
        title: 'Error loading tasks',
        description: 'Please try refreshing the page',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleToggleTask(taskId: string) {
    if (!userProfile?.id) return

    try {
      await toggleOnboardingTask(userProfile.id, taskId)
      await loadOnboardingTasks()
    } catch (error) {
      console.error('Error toggling task:', error)
      toast({
        title: 'Error updating task',
        description: 'Please try again',
        variant: 'destructive'
      })
    }
  }

  const toggleDay = (day: number) => {
    setExpandedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    )
  }

  const calculateProgress = () => {
    if (tasks.length === 0) return 0
    const completedTasks = tasks.filter((t: any) => t.completed).length
    return Math.round((completedTasks / tasks.length) * 100)
  }

  const getDayStatus = (dayNumber: number) => {
    const dayTasks = tasks.filter((t: any) => t.day_number === dayNumber)
    if (dayTasks.length === 0) return 'locked'
    
    const completedCount = dayTasks.filter((t: any) => t.completed).length
    if (completedCount === dayTasks.length) return 'completed'
    if (completedCount > 0) return 'in-progress'
    
    // Check if previous day is completed
    if (dayNumber > 1) {
      const prevDayTasks = tasks.filter((t: any) => t.day_number === dayNumber - 1)
      const prevCompleted = prevDayTasks.filter((t: any) => t.completed).length
      if (prevCompleted < prevDayTasks.length) return 'locked'
    }
    
    return 'in-progress'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'in-progress': return <Clock className="h-5 w-5 text-yellow-600" />
      case 'locked': return <Circle className="h-5 w-5 text-gray-400" />
    }
  }

  const progress = calculateProgress()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Group tasks by day
  const tasksByDay = tasks.reduce((acc, task) => {
    if (!acc[task.day_number]) acc[task.day_number] = []
    acc[task.day_number].push(task)
    return acc
  }, {} as Record<number, typeof tasks>)

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
                  Complete all tasks in order to unlock the next day's activities
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Daily Tasks */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((dayNumber) => {
          const dayTasks = tasksByDay[dayNumber] || []
          const dayMeta = dayMetadata[dayNumber - 1]
          const DayIcon = dayMeta.icon
          const isExpanded = expandedDays.includes(dayNumber)
          const completedTasks = dayTasks.filter((t: any) => t.completed).length
          const totalTasks = dayTasks.length
          const dayProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
          const status = getDayStatus(dayNumber)

          return (
            <motion.div
              key={dayNumber}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (dayNumber - 1) * 0.1 }}
            >
              <Card className={status === 'locked' ? 'opacity-75' : ''}>
                <Collapsible open={isExpanded} onOpenChange={() => toggleDay(dayNumber)}>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            {getStatusIcon(status)}
                          </div>
                          <DayIcon className="h-5 w-5 text-muted-foreground" />
                          <div className="text-left">
                            <CardTitle className="text-base">
                              Day {dayNumber}: {dayMeta.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {completedTasks} of {totalTasks} tasks completed
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={dayProgress} className="w-24 h-2" />
                          <Badge variant={
                            status === 'completed' ? 'default' :
                            status === 'in-progress' ? 'secondary' :
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
                        {dayTasks.map((task: any, taskIndex: number) => (
                          <motion.div
                            key={task.task_id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: taskIndex * 0.05 }}
                            className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                          >
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => handleToggleTask(task.task_id)}
                              disabled={status === 'locked'}
                            />
                            <div className="flex-1">
                              <p className="font-medium">{task.title}</p>
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                            </div>
                            {task.time_estimate && (
                              <Badge variant="outline" className="ml-auto">
                                {task.time_estimate}
                              </Badge>
                            )}
                          </motion.div>
                        ))}
                      </div>
                      
                      {status === 'in-progress' && completedTasks === totalTasks && (
                        <div className="mt-4">
                          <Button className="w-full" disabled>
                            Day {dayNumber} Complete!
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