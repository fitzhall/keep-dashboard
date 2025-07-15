'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { 
  Shield, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  BookOpen,
  Users,
  Briefcase,
  Award,
  Clock
} from 'lucide-react'

interface ComplianceCategory {
  id: string
  name: string
  icon: React.ElementType
  score: number
  trend: 'up' | 'down' | 'stable'
  items: {
    completed: number
    total: number
  }
  lastUpdated: string
  status: 'excellent' | 'good' | 'attention' | 'critical'
}

const categories: ComplianceCategory[] = [
  {
    id: 'ethics',
    name: 'Ethics & Professional Responsibility',
    icon: Shield,
    score: 85,
    trend: 'up',
    items: { completed: 17, total: 20 },
    lastUpdated: '2 days ago',
    status: 'good'
  },
  {
    id: 'documentation',
    name: 'Client Documentation',
    icon: FileText,
    score: 92,
    trend: 'stable',
    items: { completed: 23, total: 25 },
    lastUpdated: '1 day ago',
    status: 'excellent'
  },
  {
    id: 'training',
    name: 'Required Training',
    icon: BookOpen,
    score: 78,
    trend: 'up',
    items: { completed: 7, total: 9 },
    lastUpdated: '3 days ago',
    status: 'attention'
  },
  {
    id: 'client-management',
    name: 'Client Management',
    icon: Users,
    score: 88,
    trend: 'up',
    items: { completed: 22, total: 25 },
    lastUpdated: '1 day ago',
    status: 'good'
  },
  {
    id: 'business-practices',
    name: 'Business Practices',
    icon: Briefcase,
    score: 95,
    trend: 'stable',
    items: { completed: 19, total: 20 },
    lastUpdated: 'Today',
    status: 'excellent'
  },
  {
    id: 'certifications',
    name: 'Certifications & Licenses',
    icon: Award,
    score: 65,
    trend: 'down',
    items: { completed: 13, total: 20 },
    lastUpdated: '1 week ago',
    status: 'critical'
  }
]

function getStatusColor(status: ComplianceCategory['status']) {
  switch (status) {
    case 'excellent': return 'text-green-600'
    case 'good': return 'text-blue-600'
    case 'attention': return 'text-yellow-600'
    case 'critical': return 'text-red-600'
  }
}

function getStatusBadge(status: ComplianceCategory['status']) {
  switch (status) {
    case 'excellent': return 'default'
    case 'good': return 'secondary'
    case 'attention': return 'outline'
    case 'critical': return 'destructive'
  }
}

function getTrendIcon(trend: ComplianceCategory['trend']) {
  switch (trend) {
    case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
    case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
    case 'stable': return <Minus className="h-4 w-4 text-gray-600" />
  }
}

export function ComplianceScorecard() {
  const overallScore = Math.round(
    categories.reduce((sum, cat) => sum + cat.score, 0) / categories.length
  )

  const getOverallStatus = (score: number) => {
    if (score >= 90) return { status: 'Excellent', color: 'text-green-600', icon: CheckCircle }
    if (score >= 80) return { status: 'Good', color: 'text-blue-600', icon: CheckCircle }
    if (score >= 70) return { status: 'Needs Attention', color: 'text-yellow-600', icon: AlertCircle }
    return { status: 'Critical', color: 'text-red-600', icon: XCircle }
  }

  const overall = getOverallStatus(overallScore)
  const OverallIcon = overall.icon

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Overall Compliance Score</CardTitle>
                <CardDescription>
                  Your comprehensive compliance status across all categories
                </CardDescription>
              </div>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-4xl font-bold">{overallScore}%</span>
                  </div>
                  <OverallIcon className={`absolute bottom-0 right-0 h-10 w-10 ${overall.color}`} />
                </div>
                <div>
                  <p className={`text-2xl font-semibold ${overall.color}`}>
                    {overall.status}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last updated: Today at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Next audit due</p>
                <p className="font-semibold">March 15, 2025</p>
              </div>
            </div>
            <Progress value={overallScore} className="h-3" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Breakdown */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => {
          const Icon = category.icon
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Icon className={`h-5 w-5 ${getStatusColor(category.status)}`} />
                    {getTrendIcon(category.trend)}
                  </div>
                  <CardTitle className="text-base">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between mb-3">
                    <div>
                      <span className="text-3xl font-bold">{category.score}%</span>
                      <p className="text-xs text-muted-foreground">
                        {category.items.completed}/{category.items.total} completed
                      </p>
                    </div>
                    <Badge variant={getStatusBadge(category.status)}>
                      {category.status}
                    </Badge>
                  </div>
                  <Progress value={category.score} className="h-2 mb-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Updated {category.lastUpdated}</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            Priority Action Items
          </CardTitle>
          <CardDescription>
            Address these items to improve your compliance score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium">KEEP Protocol Certification Expiring</p>
                  <p className="text-sm text-muted-foreground">Renew by March 1, 2025</p>
                </div>
              </div>
              <Button size="sm" variant="destructive">
                Renew Now
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium">Complete Advanced Bitcoin Security Training</p>
                  <p className="text-sm text-muted-foreground">2 modules remaining</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Continue
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Schedule Quarterly Compliance Review</p>
                  <p className="text-sm text-muted-foreground">Due this month</p>
                </div>
              </div>
              <Button size="sm" variant="secondary">
                Schedule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}