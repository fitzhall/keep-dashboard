'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useUserProgress } from '@/contexts/UserProgressContext'
import { getComplianceCategories, calculateOverallScore } from '@/lib/compliance-data'
import { useToast } from '@/hooks/use-toast'
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
  Clock,
  Loader2
} from 'lucide-react'

// Icon mapping for categories
const categoryIcons: Record<string, React.ElementType> = {
  'ethics': Shield,
  'documentation': FileText,
  'training': BookOpen,
  'client-management': Users,
  'business-practices': Briefcase,
  'certifications': Award
}

function getStatus(score: number): 'excellent' | 'good' | 'attention' | 'critical' {
  if (score >= 90) return 'excellent'
  if (score >= 80) return 'good'
  if (score >= 70) return 'attention'
  return 'critical'
}

function getStatusColor(status: 'excellent' | 'good' | 'attention' | 'critical') {
  switch (status) {
    case 'excellent': return 'text-green-600'
    case 'good': return 'text-blue-600'
    case 'attention': return 'text-yellow-600'
    case 'critical': return 'text-red-600'
  }
}

function getStatusBadge(status: 'excellent' | 'good' | 'attention' | 'critical') {
  switch (status) {
    case 'excellent': return 'default'
    case 'good': return 'secondary'
    case 'attention': return 'outline'
    case 'critical': return 'destructive'
  }
}

function getTrendIcon(trend: 'up' | 'down' | 'stable' | null) {
  switch (trend) {
    case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
    case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
    default: return <Minus className="h-4 w-4 text-gray-600" />
  }
}

function formatLastUpdated(date: string): string {
  const updated = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - updated.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  return `${Math.floor(diffDays / 7)} weeks ago`
}

export function ComplianceScorecard() {
  const { userProfile } = useUserProgress()
  const { toast } = useToast()
  const [categories, setCategories] = useState<any[]>([])
  const [overallScore, setOverallScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (userProfile?.id) {
      loadComplianceData()
    }
  }, [userProfile])

  async function loadComplianceData() {
    if (!userProfile?.id) {
      console.log('No user profile ID available')
      setIsLoading(false)
      return
    }

    try {
      console.log('Loading compliance data for user:', userProfile.id)
      const data = await getComplianceCategories(userProfile.id)
      console.log('Compliance categories loaded:', data)
      setCategories(data || [])
      const score = calculateOverallScore(data || [])
      setOverallScore(score)
    } catch (error) {
      console.error('Error loading compliance data:', error)
      setCategories([])
      setOverallScore(0)
      toast({
        title: 'Error loading compliance data',
        description: 'Please try refreshing the page',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getOverallStatus = (score: number) => {
    if (score >= 90) return { status: 'Excellent', color: 'text-green-600', icon: CheckCircle }
    if (score >= 80) return { status: 'Good', color: 'text-blue-600', icon: CheckCircle }
    if (score >= 70) return { status: 'Needs Attention', color: 'text-yellow-600', icon: AlertCircle }
    return { status: 'Critical', color: 'text-red-600', icon: XCircle }
  }

  const overall = getOverallStatus(overallScore)
  const OverallIcon = overall.icon

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

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
        {categories.length > 0 ? categories.map((category, index) => {
          const Icon = categoryIcons[category.category_id] || Shield
          const status = getStatus(category.score)
          
          return (
            <motion.div
              key={category.category_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Icon className={`h-5 w-5 ${getStatusColor(status)}`} />
                    {getTrendIcon(category.trend)}
                  </div>
                  <CardTitle className="text-base">{category.category_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between mb-3">
                    <div>
                      <span className="text-3xl font-bold">{category.score}%</span>
                      <p className="text-xs text-muted-foreground">
                        {category.items_completed}/{category.items_total} completed
                      </p>
                    </div>
                    <Badge variant={getStatusBadge(status)}>
                      {status}
                    </Badge>
                  </div>
                  <Progress value={category.score} className="h-2 mb-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Updated {formatLastUpdated(category.last_updated)}</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        }) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No compliance data available</p>
          </div>
        )}
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