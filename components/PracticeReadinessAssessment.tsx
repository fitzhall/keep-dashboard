'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle2, 
  Circle, 
  Clock,
  ArrowRight,
  BookOpen,
  Wrench,
  Shield,
  Building
} from 'lucide-react'
import Link from 'next/link'

interface AssessmentItem {
  id: string
  title: string
  description: string
  status: 'complete' | 'in-progress' | 'pending'
  progress?: number
  icon: React.ElementType
  link: string
}

const assessmentItems: AssessmentItem[] = [
  {
    id: 'foundational',
    title: 'Foundational Knowledge',
    description: 'Bitcoin estate planning principles mastered',
    status: 'complete',
    icon: BookOpen,
    link: '/training'
  },
  {
    id: 'technical',
    title: 'Technical Implementation',
    description: 'Multi-sig and custody solutions',
    status: 'in-progress',
    progress: 65,
    icon: Wrench,
    link: '/training'
  },
  {
    id: 'compliance',
    title: 'Compliance & Ethics',
    description: 'Regulatory requirements and best practices',
    status: 'pending',
    icon: Shield,
    link: '/compliance'
  },
  {
    id: 'advanced',
    title: 'Advanced Structures',
    description: 'Complex trust and estate strategies',
    status: 'pending',
    icon: Building,
    link: '/training'
  }
]

export function PracticeReadinessAssessment() {
  const completedItems = assessmentItems.filter(item => item.status === 'complete').length
  const totalProgress = (completedItems / assessmentItems.length) * 100

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-600" />
      default:
        return <Circle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-100 text-green-800">Complete</Badge>
      case 'in-progress':
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Practice Readiness Assessment</CardTitle>
        <p className="text-sm text-muted-foreground">
          Your current status for offering Bitcoin estate planning services
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(totalProgress)}%</span>
          </div>
          <Progress value={totalProgress} className="h-2" />
        </div>

        {/* Assessment Items */}
        <div className="space-y-4">
          {assessmentItems.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getStatusIcon(item.status)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                  {item.status === 'in-progress' && item.progress && (
                    <div>
                      <Progress value={item.progress} className="h-1.5" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.progress}% complete
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Action Button */}
        {totalProgress < 100 && (
          <Button asChild className="w-full">
            <Link href="/training">
              Continue Assessment <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}