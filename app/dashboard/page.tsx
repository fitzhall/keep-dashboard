'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  GraduationCap, 
  FileText, 
  HeadphonesIcon,
  Shield,
  BookOpen,
  Award,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  FileCheck,
  Info,
  Download,
  PlayCircle,
  FileDown,
  BookMarked,
  Scale
} from 'lucide-react'
import Link from 'next/link'
import { useUserProgress } from '@/contexts/UserProgressContext'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const { progress, userProfile } = useUserProgress()
  
  // Calculate metrics
  const completedCourses = progress.courses.filter(c => c.status === 'completed').length
  const totalCredits = completedCourses * 2.5
  const certificationProgress = (completedCourses / progress.courses.length) * 100
  const templatesDownloaded = progress.templatesDownloaded.length

  // Practice readiness components
  const readinessItems = [
    { 
      title: 'Foundational Knowledge',
      status: 'complete',
      description: 'Core Bitcoin estate planning principles'
    },
    { 
      title: 'Technical Implementation',
      status: 'in-progress',
      progress: 65,
      description: 'Multi-sig and custody solutions'
    },
    { 
      title: 'Compliance & Ethics',
      status: 'pending',
      description: 'State regulations and ethics requirements'
    },
    { 
      title: 'Advanced Structures',
      status: 'pending',
      description: 'Complex trust and tax strategies'
    }
  ]

  // Recent templates
  const popularTemplates = [
    { id: 1, name: 'Bitcoin Trust Amendment', category: 'Trust Documents', downloads: 234 },
    { id: 2, name: 'Multi-Sig Letter of Instruction', category: 'Key Management', downloads: 189 },
    { id: 3, name: 'Digital Asset Power of Attorney', category: 'Legal Forms', downloads: 156 }
  ]

  return (
    <div className="space-y-6">
      {/* Professional Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          KEEP Protocol Training Center
        </h1>
        <p className="text-gray-600 mt-1">
          {userProfile?.name || 'Attorney'} • {userProfile?.firm || 'Your Firm'}
        </p>
      </div>

      {/* Key Metrics Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Certification Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{Math.round(certificationProgress)}%</div>
            <Progress value={certificationProgress} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">CLE Credits Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{totalCredits}</div>
            <p className="text-xs text-gray-500 mt-1">of 11.5 available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Templates Downloaded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{templatesDownloaded}</div>
            <p className="text-xs text-gray-500 mt-1">of 25 available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Support Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-600">Active</div>
            <p className="text-xs text-gray-500 mt-1">48hr hotline available</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Training & Templates */}
        <div className="lg:col-span-2 space-y-6">
          {/* Training Progress */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Training Journey</CardTitle>
                  <CardDescription>Complete all modules to become KEEP certified</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/training">
                    View All Courses <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Current Course Progress */}
                <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <PlayCircle className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Current: Technical Implementation</h4>
                        <p className="text-sm text-gray-600">Module 2 of 4 • 3 CLE Credits</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>
                  </div>
                  <Progress value={65} className="h-2 mb-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">65% Complete</span>
                    <Button size="sm" asChild>
                      <Link href="/training">Continue Learning</Link>
                    </Button>
                  </div>
                </div>

                {/* Next Modules Preview */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Up Next:</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                    Module 3: Compliance & Ethics (2 CLE Credits)
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                    Module 4: Advanced Trust Structures (4 CLE Credits)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Library Quick Access */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Popular Templates</CardTitle>
                  <CardDescription>Most downloaded Bitcoin estate planning documents</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/templates">
                    Browse All <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-sm">{template.name}</p>
                        <p className="text-xs text-gray-500">{template.category}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Alert className="mt-4 border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm">
                  <strong>New:</strong> Updated trust templates now include RUFADAA language for all 50 states.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Practice Readiness & Resources */}
        <div className="space-y-6">
          {/* Practice Readiness Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Practice Readiness Assessment</CardTitle>
              <CardDescription>Your Bitcoin estate planning competency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {readinessItems.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.status === 'complete' && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                        {item.status === 'in-progress' && (
                          <Clock className="h-4 w-4 text-blue-600" />
                        )}
                        {item.status === 'pending' && (
                          <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                        )}
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                    </div>
                    {item.progress && (
                      <Progress value={item.progress} className="h-1.5" />
                    )}
                    <p className="text-xs text-gray-500 ml-6">{item.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm" asChild>
                <Link href="/sop">
                  <BookMarked className="mr-2 h-4 w-4" />
                  10-Phase SOP Guide
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm" asChild>
                <Link href="/compliance">
                  <Shield className="mr-2 h-4 w-4" />
                  Ethics Checklist
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm" asChild>
                <Link href="/cle">
                  <Award className="mr-2 h-4 w-4" />
                  CLE Certificates
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm" asChild>
                <Link href="/hotline">
                  <HeadphonesIcon className="mr-2 h-4 w-4" />
                  48hr Support Hotline
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Compliance Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Compliance Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <Scale className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">State Bar Requirements</p>
                    <p className="text-xs text-gray-500">Review your jurisdiction's crypto regulations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <FileCheck className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Malpractice Coverage</p>
                    <p className="text-xs text-gray-500">Ensure your policy covers digital assets</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Annual CLE Requirements</p>
                    <p className="text-xs text-gray-500">Track your ethics and tech credits</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Support Bar */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <p className="text-sm text-gray-600">
            Questions about Bitcoin estate planning? Our expert support team is available within 48 hours.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/support">Get Support</Link>
        </Button>
      </div>
    </div>
  )
}