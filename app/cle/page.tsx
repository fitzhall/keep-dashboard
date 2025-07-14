'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import { PlayCircle, CheckCircle, Clock, Download, Award } from 'lucide-react'

const courses = [
  {
    id: 1,
    title: 'Bitcoin Estate Planning Fundamentals',
    description: 'Complete overview of Bitcoin estate planning principles and regulatory requirements',
    duration: '2.5 hours',
    credits: 2.5,
    status: 'completed',
    progress: 100,
    completedDate: '2024-01-10'
  },
  {
    id: 2,
    title: 'Technical Custody Solutions',
    description: 'Deep dive into multisig, hardware wallets, and institutional custody options',
    duration: '3 hours',
    credits: 3,
    status: 'in-progress',
    progress: 65,
    completedDate: null
  },
  {
    id: 3,
    title: 'Ethics & Compliance in Crypto Law',
    description: 'Navigate ethical considerations and compliance requirements for cryptocurrency law',
    duration: '2 hours',
    credits: 2,
    status: 'not-started',
    progress: 0,
    completedDate: null
  },
  {
    id: 4,
    title: 'Advanced Trust Structures',
    description: 'Complex trust arrangements for high-net-worth Bitcoin estate planning',
    duration: '4 hours',
    credits: 4,
    status: 'not-started',
    progress: 0,
    completedDate: null
  }
]

export default function CLEPage() {
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0)
  const earnedCredits = courses
    .filter(course => course.status === 'completed')
    .reduce((sum, course) => sum + course.credits, 0)

  return (
    <>
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">CLE Training</h1>
        <p className="text-muted-foreground">
          Complete your Bitcoin estate planning certification and earn CLE credits.
        </p>
      </motion.div>

      {/* Progress Overview */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credits Earned</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{earnedCredits}</div>
              <p className="text-xs text-muted-foreground">of {totalCredits} total credits</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.filter(c => c.status === 'completed').length}</div>
              <p className="text-xs text-muted-foreground">of {courses.length} courses</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certification Status</CardTitle>
              <Badge className="h-4 w-4 p-0 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">In Progress</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((earnedCredits / totalCredits) * 100)}% complete
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Course List */}
      <div className="grid gap-6">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <p className="text-muted-foreground">{course.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        {course.credits} CLE Credits
                      </span>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      course.status === 'completed' ? 'default' :
                      course.status === 'in-progress' ? 'secondary' :
                      'outline'
                    }
                  >
                    {course.status === 'completed' ? 'Completed' :
                     course.status === 'in-progress' ? 'In Progress' :
                     'Not Started'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {course.status === 'in-progress' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="w-full" />
                  </div>
                )}
                
                {course.status === 'completed' && course.completedDate && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="text-green-700 font-medium">
                        Completed on {new Date(course.completedDate).toLocaleDateString()}
                      </span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Certificate
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {course.status === 'not-started' && (
                    <Button>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Start Course
                    </Button>
                  )}
                  {course.status === 'in-progress' && (
                    <Button>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Continue Course
                    </Button>
                  )}
                  {course.status === 'completed' && (
                    <Button variant="outline">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Review Course
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Certification Card */}
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              KEEP Bitcoin Estate Planning Certification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Complete all courses to earn your official KEEP certification and demonstrate your expertise in Bitcoin estate planning.
            </p>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium">{earnedCredits} of {totalCredits} credits earned</span>
                <Progress value={(earnedCredits / totalCredits) * 100} className="w-64 mt-2" />
              </div>
              <Button disabled={earnedCredits < totalCredits}>
                {earnedCredits >= totalCredits ? 'Download Certificate' : 'Complete All Courses'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}