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

      {/* Progress Overview - Modern Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <Award className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full">CLE</span>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gray-900">{earnedCredits}</div>
                <p className="text-sm text-gray-600">of {totalCredits} credits earned</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-50 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full">COURSES</span>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gray-900">{courses.filter(c => c.status === 'completed').length}</div>
                <p className="text-sm text-gray-600">of {courses.length} completed</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-amber-50 rounded-xl">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full">STATUS</span>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gray-900">{Math.round((earnedCredits / totalCredits) * 100)}%</div>
                <p className="text-sm text-gray-600">certification progress</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Course List - Modern Design */}
      <div className="space-y-6">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 rounded-3xl blur-sm opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-2xl font-bold text-gray-900">{course.title}</h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        course.status === 'completed' ? 'bg-green-100 text-green-700' :
                        course.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {course.status === 'completed' ? 'Completed' :
                         course.status === 'in-progress' ? 'In Progress' :
                         'Available'}
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4 text-lg">{course.description}</p>
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Award className="h-4 w-4" />
                        <span className="text-sm font-medium">{course.credits} CLE Credits</span>
                      </div>
                    </div>
                  </div>
                </div>

                {course.status === 'in-progress' && (
                  <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-semibold text-blue-900">Course Progress</span>
                      <span className="text-2xl font-bold text-blue-700">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {course.status === 'completed' && course.completedDate && (
                  <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-green-900">Course Completed</div>
                          <div className="text-sm text-green-700">
                            {new Date(course.completedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-white border border-green-200 rounded-xl text-green-700 font-medium hover:bg-green-50 transition-colors flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Certificate
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  {course.status === 'not-started' && (
                    <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl">
                      <PlayCircle className="h-5 w-5" />
                      Start Course
                    </button>
                  )}
                  {course.status === 'in-progress' && (
                    <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl">
                      <PlayCircle className="h-5 w-5" />
                      Continue Course
                    </button>
                  )}
                  {course.status === 'completed' && (
                    <button className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center gap-2">
                      <PlayCircle className="h-5 w-5" />
                      Review Course
                    </button>
                  )}
                  <button className="px-6 py-3 text-gray-600 font-medium hover:text-gray-900 transition-colors">
                    View Syllabus
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modern Certification Card */}
      <motion.div 
        className="mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl blur-2xl opacity-20"></div>
          <div className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">KEEP Bitcoin Estate Planning Certification</h2>
                <p className="text-gray-600 mt-1">
                  Demonstrate your expertise and commitment to professional Bitcoin estate planning
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <div className="text-3xl font-bold text-blue-600 mb-1">{earnedCredits}</div>
                <div className="text-sm font-medium text-blue-700">Credits Earned</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                <div className="text-3xl font-bold text-purple-600 mb-1">{totalCredits}</div>
                <div className="text-sm font-medium text-purple-700">Total Required</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {Math.round((earnedCredits / totalCredits) * 100)}%
                </div>
                <div className="text-sm font-medium text-green-700">Complete</div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Certification Progress</span>
                <span className="text-gray-600 font-medium">{earnedCredits} / {totalCredits} credits</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(earnedCredits / totalCredits) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">
                  {earnedCredits >= totalCredits ? 
                    '🎉 Congratulations! You\'re ready for certification.' :
                    `${totalCredits - earnedCredits} more credits needed to complete certification`
                  }
                </p>
                <p className="text-sm text-gray-600">
                  Your certificate will be issued within 24 hours of completion
                </p>
              </div>
              <button 
                disabled={earnedCredits < totalCredits}
                className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-200 flex items-center gap-3 ${
                  earnedCredits >= totalCredits 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {earnedCredits >= totalCredits ? (
                  <>
                    <Download className="h-5 w-5" />
                    Download Certificate
                  </>
                ) : (
                  'Complete Remaining Courses'
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}