'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import { PlayCircle, CheckCircle, Clock, Download, Award } from 'lucide-react'
import { useUserProgress } from '@/contexts/UserProgressContext'

const coursesData = [
  {
    id: 1,
    title: 'Bitcoin Estate Planning Fundamentals',
    description: 'Complete overview of Bitcoin estate planning principles and regulatory requirements',
    duration: '2.5 hours',
    credits: 2.5
  },
  {
    id: 2,
    title: 'Technical Custody Solutions',
    description: 'Deep dive into multisig, hardware wallets, and institutional custody options',
    duration: '3 hours',
    credits: 3
  },
  {
    id: 3,
    title: 'Ethics & Compliance in Crypto Law',
    description: 'Navigate ethical considerations and compliance requirements for cryptocurrency law',
    duration: '2 hours',
    credits: 2
  },
  {
    id: 4,
    title: 'Advanced Trust Structures',
    description: 'Complex trust arrangements for high-net-worth Bitcoin estate planning',
    duration: '4 hours',
    credits: 4
  }
]

export default function CLEPage() {
  const { progress, dispatch } = useUserProgress()
  
  // Merge course data with progress
  const courses = coursesData.map(courseData => {
    const courseProgress = progress.courses.find(c => c.id === courseData.id)
    return {
      ...courseData,
      status: courseProgress?.status || 'not-started',
      progress: courseProgress?.progress || 0,
      completedDate: courseProgress?.completedDate
    }
  })
  
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0)
  const earnedCredits = courses
    .filter(course => course.status === 'completed')
    .reduce((sum, course) => sum + course.credits, 0)

  const handleCourseAction = (courseId: number, action: 'start' | 'continue' | 'complete') => {
    switch (action) {
      case 'start':
        dispatch({ type: 'START_COURSE', courseId })
        dispatch({ type: 'UPDATE_COURSE_PROGRESS', courseId, progress: 5 }) // Start with 5%
        break
      case 'continue':
        // Simulate progress increment
        const currentCourse = progress.courses.find(c => c.id === courseId)
        if (currentCourse && currentCourse.progress < 100) {
          const newProgress = Math.min(currentCourse.progress + 15, 100)
          dispatch({ type: 'UPDATE_COURSE_PROGRESS', courseId, progress: newProgress })
          if (newProgress === 100) {
            dispatch({ type: 'COMPLETE_COURSE', courseId })
          }
        }
        break
      case 'complete':
        dispatch({ type: 'COMPLETE_COURSE', courseId })
        break
    }
  }

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
      <div className="space-y-8">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                      <Badge 
                        variant={
                          course.status === 'completed' ? 'default' :
                          course.status === 'in-progress' ? 'secondary' :
                          'outline'
                        }
                        className="px-3 py-1"
                      >
                        {course.status === 'completed' ? 'Completed' :
                         course.status === 'in-progress' ? 'In Progress' :
                         'Not Started'}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{course.description}</p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        {course.credits} CLE Credits
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {course.status === 'in-progress' && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="font-medium text-blue-700">Course Progress</span>
                      <span className="font-bold text-blue-700">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="w-full h-2" />
                  </div>
                )}
                
                {course.status === 'completed' && course.completedDate && (
                  <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-green-700 font-medium">
                          Completed on {new Date(course.completedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download Certificate
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {course.status === 'not-started' && (
                    <Button 
                      size="lg" 
                      className="px-6"
                      onClick={() => handleCourseAction(course.id, 'start')}
                    >
                      <PlayCircle className="h-5 w-5 mr-2" />
                      Start Course
                    </Button>
                  )}
                  {course.status === 'in-progress' && (
                    <Button 
                      size="lg" 
                      className="px-6"
                      onClick={() => handleCourseAction(course.id, 'continue')}
                    >
                      <PlayCircle className="h-5 w-5 mr-2" />
                      Continue Course
                    </Button>
                  )}
                  {course.status === 'completed' && (
                    <Button variant="outline" size="lg" className="px-6">
                      <PlayCircle className="h-5 w-5 mr-2" />
                      Review Course
                    </Button>
                  )}
                  <Button variant="ghost" size="lg">
                    View Syllabus
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Certification Card */}
      <motion.div 
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="border-primary bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">KEEP Bitcoin Estate Planning Certification</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Demonstrate your expertise and commitment to professional Bitcoin estate planning
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-primary">{earnedCredits}</div>
                  <div className="text-sm text-muted-foreground">Credits Earned</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold">{totalCredits}</div>
                  <div className="text-sm text-muted-foreground">Total Required</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((earnedCredits / totalCredits) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Certification Progress</span>
                  <span className="text-muted-foreground">{earnedCredits} / {totalCredits} credits</span>
                </div>
                <Progress value={(earnedCredits / totalCredits) * 100} className="h-3" />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {earnedCredits >= totalCredits ? 
                      '🎉 Congratulations! You\'re ready for certification.' :
                      `${totalCredits - earnedCredits} more credits needed to complete certification`
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your certificate will be issued within 24 hours of completion
                  </p>
                </div>
                <Button 
                  size="lg"
                  disabled={earnedCredits < totalCredits}
                  className="px-8"
                >
                  {earnedCredits >= totalCredits ? 
                    <><Download className="h-4 w-4 mr-2" />Download Certificate</> : 
                    'Complete Remaining Courses'
                  }
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}