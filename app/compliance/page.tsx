'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  FileCheck, 
  AlertCircle, 
  CheckCircle2,
  Download,
  BookOpen,
  Scale,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Ethics Checklist Items based on ABA Model Rules
const ethicsChecklist = [
  {
    id: 'rule-1.1',
    rule: 'ABA Model Rule 1.1',
    title: 'Technical Competence Verification',
    description: 'Maintain competence in Bitcoin custody and digital asset law',
    completed: true
  },
  {
    id: 'rule-1.6',
    rule: 'ABA Model Rule 1.6',
    title: 'Client Confidentiality for Digital Assets',
    description: 'Protect confidential information including private keys and wallet addresses',
    completed: true
  },
  {
    id: 'rule-1.7',
    rule: 'ABA Model Rule 1.7',
    title: 'Conflict Checks for Co-Signer Roles',
    description: 'Ensure no conflicts of interest when serving as multisig co-signer',
    completed: false
  },
  {
    id: 'rule-1.4',
    rule: 'ABA Model Rule 1.4',
    title: 'Client Communication Standards',
    description: 'Maintain clear communication about Bitcoin custody arrangements',
    completed: true
  },
  {
    id: 'state-bar',
    rule: 'State Requirements',
    title: 'State Bar Bitcoin Practice Guidelines Review',
    description: 'Comply with state-specific cryptocurrency regulations',
    completed: false
  },
  {
    id: 'malpractice',
    rule: 'Insurance',
    title: 'Malpractice Insurance Coverage Verification',
    description: 'Ensure professional liability coverage includes digital asset practice',
    completed: true
  }
]

// 5-Day Onboarding Tasks
const onboardingTasks = [
  {
    day: 1,
    title: 'Day 1: Complete Framework Executive Summary',
    duration: '2 hours',
    tasks: [
      'Read KEEP Framework Executive Summary',
      'Watch introductory video series',
      'Complete knowledge assessment quiz',
      'Set up practice dashboard'
    ],
    status: 'completed'
  },
  {
    day: 2,
    title: 'Day 2: Integrate Engagement Letter Template',
    duration: '1.5 hours',
    tasks: [
      'Download KEEP Engagement Letter Template',
      'Customize with firm branding',
      'Review compliance requirements',
      'Test document generation'
    ],
    status: 'completed'
  },
  {
    day: 3,
    title: 'Day 3: Setup Risk Assessment Process',
    duration: '2.5 hours',
    tasks: [
      'Configure Bitcoin Multisig Design Worksheet',
      'Implement Client Risk Assessment Template',
      'Create intake workflow',
      'Train team on assessment tools'
    ],
    status: 'in-progress'
  },
  {
    day: 4,
    title: 'Day 4: Configure Client Workflows',
    duration: '3 hours',
    tasks: [
      'Map 10-phase SOP to practice',
      'Assign team responsibilities',
      'Set up progress tracking',
      'Create client communication templates'
    ],
    status: 'pending'
  },
  {
    day: 5,
    title: 'Day 5: Prepare Marketing Materials',
    duration: '2 hours',
    tasks: [
      'Customize marketing templates',
      'Update website with Bitcoin services',
      'Prepare client education materials',
      'Schedule launch announcement'
    ],
    status: 'pending'
  }
]

// Compliance Documents
const complianceDocuments = [
  {
    name: 'KEEP Ethics Checklist Template',
    size: '37 KB',
    updated: '2025-07-03'
  },
  {
    name: 'Quality Control Submission Form',
    size: '215 KB',
    updated: '2025-07-03'
  },
  {
    name: 'Probate Proofing SOP Template',
    size: '38 KB',
    updated: '2025-07-03'
  }
]

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState('ethics')
  const [checkedItems, setCheckedItems] = useState<string[]>(['rule-1.1', 'rule-1.6', 'rule-1.4', 'malpractice'])

  const handleCheckChange = (itemId: string, checked: boolean) => {
    if (checked) {
      setCheckedItems([...checkedItems, itemId])
    } else {
      setCheckedItems(checkedItems.filter(id => id !== itemId))
    }
  }

  const ethicsProgress = Math.round((checkedItems.length / ethicsChecklist.length) * 100)
  const completedOnboardingDays = onboardingTasks.filter(day => day.status === 'completed').length
  const onboardingProgress = (completedOnboardingDays / 5) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Compliance Center</h1>
        <p className="text-gray-600 mt-1">
          Ensure your Bitcoin estate planning practice meets all ethical and regulatory requirements
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Ethics Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{ethicsProgress}%</div>
            <Progress value={ethicsProgress} className="mt-2 h-1" />
            <p className="text-xs text-gray-500 mt-1">{checkedItems.length} of {ethicsChecklist.length} requirements met</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">5-Day Onboarding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{onboardingProgress}%</div>
            <Progress value={onboardingProgress} className="mt-2 h-1" />
            <p className="text-xs text-gray-500 mt-1">Day {completedOnboardingDays + 1} of 5</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ethics">Ethics Checklist</TabsTrigger>
          <TabsTrigger value="onboarding">5-Day Onboarding</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Ethics Checklist Tab */}
        <TabsContent value="ethics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ABA Model Rules Compliance</CardTitle>
              <CardDescription>
                Ensure your practice meets all ethical requirements for Bitcoin estate planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ethicsChecklist.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "p-4 rounded-lg border",
                      checkedItems.includes(item.id) && "bg-green-50 border-green-200"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={checkedItems.includes(item.id)}
                        onCheckedChange={(checked) => handleCheckChange(item.id, checked as boolean)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {item.rule}
                          </Badge>
                          <h4 className="font-medium">{item.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      {checkedItems.includes(item.id) && (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Alert className="mt-6 border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <strong>Important:</strong> Review these requirements quarterly and update as regulations change. 
                  Consult with your state bar for jurisdiction-specific Bitcoin practice guidelines.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5-Day Onboarding Tab */}
        <TabsContent value="onboarding" className="space-y-6">
          <div className="space-y-4">
            {onboardingTasks.map((day) => (
              <Card
                key={day.day}
                className={cn(
                  day.status === 'completed' && "border-green-200",
                  day.status === 'in-progress' && "border-blue-200"
                )}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {day.status === 'completed' && (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      )}
                      {day.status === 'in-progress' && (
                        <Clock className="h-5 w-5 text-blue-600" />
                      )}
                      {day.status === 'pending' && (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                      )}
                      <div>
                        <CardTitle className="text-lg">{day.title}</CardTitle>
                        <CardDescription>Estimated time: {day.duration}</CardDescription>
                      </div>
                    </div>
                    {day.status === 'in-progress' && (
                      <Button size="sm">
                        Continue <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                {(day.status === 'completed' || day.status === 'in-progress') && (
                  <CardContent>
                    <ul className="space-y-2">
                      {day.tasks.map((task, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            day.status === 'completed' ? "bg-green-500" : "bg-gray-400"
                          )} />
                          <span className={cn(
                            day.status === 'completed' ? "text-gray-900" : "text-gray-600"
                          )}>
                            {task}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Documents</CardTitle>
              <CardDescription>
                Essential templates and forms for maintaining compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {complianceDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.size} • Updated {doc.updated}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>

              <Alert className="mt-6">
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                  All compliance documents are regularly updated to reflect current regulations. 
                  Check for updates monthly to ensure you have the latest versions.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Scale className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">State-Specific Requirements</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Bitcoin regulations vary by jurisdiction. Ensure you're compliant with your state's requirements.
                  </p>
                  <Button variant="outline" size="sm">
                    Check State Requirements
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}