'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useUserProgress } from '@/contexts/UserProgressContext'
import { useToast } from '@/hooks/use-toast'
import { 
  ArrowRight, 
  ArrowLeft, 
  Rocket, 
  FileText, 
  CheckCircle2,
  Circle,
  BookOpen,
  Users,
  Shield,
  AlertCircle,
  Download,
  ExternalLink
} from 'lucide-react'

const wizardOptions = [
  {
    id: 'new-licensee',
    title: 'New Licensee Onboarding',
    description: 'Get started with KEEP Protocol for the first time',
    icon: Rocket,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    steps: [
      {
        title: 'Account Setup',
        tasks: [
          'Complete profile information',
          'Set up firm details',
          'Configure territory settings',
          'Add team members'
        ]
      },
      {
        title: 'Training Overview',
        tasks: [
          'Complete Foundation Training',
          'Review KEEP Protocol basics',
          'Understand compliance requirements',
          'Take initial assessment'
        ]
      },
      {
        title: 'First Client',
        tasks: [
          'Download intake templates',
          'Review SOP Phase 1',
          'Schedule initial consultation',
          'Begin documentation'
        ]
      }
    ]
  },
  {
    id: 'sop-implementation',
    title: 'KEEP SOP Implementation',
    description: 'Begin implementing the 10-phase framework with an existing client',
    icon: FileText,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    steps: [
      {
        title: 'Current Assessment',
        tasks: [
          'Review existing client documentation',
          'Identify Bitcoin holdings',
          'Assess current estate plan',
          'Determine phase starting point'
        ]
      },
      {
        title: 'Phase Planning',
        tasks: [
          'Select starting phase',
          'Set timeline and milestones',
          'Prepare required templates',
          'Schedule client meetings'
        ]
      },
      {
        title: 'Resource Setup',
        tasks: [
          'Download phase-specific templates',
          'Review compliance checklist',
          'Set up progress tracking',
          'Prepare client materials'
        ]
      }
    ]
  },
  {
    id: 'audit-prep',
    title: 'Audit Preparation',
    description: 'Prepare for compliance audits and reviews',
    icon: Shield,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    steps: [
      {
        title: 'Document Review',
        tasks: [
          'Gather all client files',
          'Check template versions',
          'Verify signatures and dates',
          'Organize by phase'
        ]
      },
      {
        title: 'Compliance Check',
        tasks: [
          'Run compliance scorecard',
          'Review state requirements',
          'Check professional standards',
          'Identify any gaps'
        ]
      },
      {
        title: 'Report Generation',
        tasks: [
          'Generate audit report',
          'Create compliance summary',
          'Prepare remediation plan',
          'Schedule follow-up'
        ]
      }
    ]
  }
]

export default function StartHerePage() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const router = useRouter()
  const { progress, dispatch } = useUserProgress()
  const { toast } = useToast()

  const selectedWizard = wizardOptions.find(o => o.id === selectedPath)

  const handleTaskComplete = (task: string) => {
    if (completedTasks.includes(task)) {
      setCompletedTasks(completedTasks.filter(t => t !== task))
    } else {
      setCompletedTasks([...completedTasks, task])
    }
  }

  const handleStepComplete = () => {
    if (selectedWizard && currentStep < selectedWizard.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete the workflow
      handleWorkflowComplete()
    }
  }

  const handleWorkflowComplete = () => {
    if (!selectedWizard) return

    // Add activity log
    dispatch({
      type: 'ADD_ACTIVITY',
      activity: {
        type: 'training',
        title: `Completed ${selectedWizard.title}`,
        description: 'Successfully completed onboarding workflow'
      }
    })

    toast({
      title: 'Workflow Complete!',
      description: `You've successfully completed the ${selectedWizard.title} workflow.`,
    })

    // Navigate based on workflow type
    switch (selectedPath) {
      case 'new-licensee':
        router.push('/training')
        break
      case 'sop-implementation':
        router.push('/sop')
        break
      case 'audit-prep':
        router.push('/compliance')
        break
      default:
        setSelectedPath(null)
        setCurrentStep(0)
        setCompletedTasks([])
    }
  }

  const currentStepTasks = selectedWizard?.steps[currentStep]?.tasks || []
  const isStepComplete = currentStepTasks.every(task => completedTasks.includes(task))
  const overallProgress = selectedWizard 
    ? (currentStep / selectedWizard.steps.length) * 100 
    : 0

  return (
    <>
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Start Here</h1>
        <p className="text-muted-foreground">
          Choose your path to get started with the KEEP Protocol system.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!selectedPath ? (
          <motion.div
            key="options"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {wizardOptions.map((option) => {
              const IconComponent = option.icon
              return (
                <Card 
                  key={option.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 group hover:border-primary"
                  onClick={() => setSelectedPath(option.id)}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${option.bgColor} flex items-center justify-center mb-4`}>
                      <IconComponent className={`h-6 w-6 ${option.color}`} />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {option.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{option.description}</p>
                    <div className="space-y-2 mb-4">
                      {option.steps.map((step, index) => (
                        <div key={index} className="flex items-center text-sm text-muted-foreground">
                          <Circle className="h-3 w-3 mr-2" />
                          {step.title}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center text-primary font-medium">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            key="wizard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto"
          >
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedPath(null)
                setCurrentStep(0)
                setCompletedTasks([])
              }}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to options
            </Button>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      {selectedWizard?.title}
                    </CardTitle>
                    <CardDescription>
                      {selectedWizard?.description}
                    </CardDescription>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${selectedWizard?.bgColor} flex items-center justify-center`}>
                    {selectedWizard && <selectedWizard.icon className={`h-6 w-6 ${selectedWizard.color}`} />}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">
                      Step {currentStep + 1} of {selectedWizard?.steps.length}
                    </span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>

                {/* Step Tabs */}
                <Tabs value={currentStep.toString()} className="mb-6">
                  <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${selectedWizard?.steps.length}, 1fr)` }}>
                    {selectedWizard?.steps.map((step, index) => (
                      <TabsTrigger 
                        key={index} 
                        value={index.toString()}
                        disabled={index > currentStep}
                        className="text-xs sm:text-sm"
                      >
                        {step.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                {/* Current Step Content */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">
                    {selectedWizard?.steps[currentStep].title}
                  </h3>

                  {currentStepTasks.map((task, index) => (
                    <motion.div
                      key={task}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-start p-4 rounded-lg border cursor-pointer transition-all ${
                        completedTasks.includes(task) 
                          ? 'bg-primary/5 border-primary' 
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => handleTaskComplete(task)}
                    >
                      <div className="mr-3 mt-0.5">
                        {completedTasks.includes(task) ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${completedTasks.includes(task) ? 'line-through' : ''}`}>
                          {task}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {/* Helper Content Based on Workflow */}
                  {selectedPath === 'new-licensee' && currentStep === 0 && (
                    <Alert className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Make sure to have your bar number and firm EIN ready for account setup.
                      </AlertDescription>
                    </Alert>
                  )}

                  {selectedPath === 'sop-implementation' && currentStep === 1 && (
                    <Alert className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Most firms start with Phase 1 (Intake) unless they have existing Bitcoin estate plans.
                      </AlertDescription>
                    </Alert>
                  )}

                  {selectedPath === 'audit-prep' && currentStep === 2 && (
                    <Alert className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Audit reports are automatically generated based on your compliance score and documentation.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>

                  {currentStep === (selectedWizard?.steps.length || 0) - 1 ? (
                    <Button
                      onClick={handleWorkflowComplete}
                      disabled={!isStepComplete}
                      size="lg"
                    >
                      Complete Workflow
                      <CheckCircle2 className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleStepComplete}
                      disabled={!isStepComplete}
                    >
                      Next Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Training Center</p>
                    <p className="text-sm text-muted-foreground">Access all courses</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => router.push('/training')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Templates</p>
                    <p className="text-sm text-muted-foreground">Download resources</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => router.push('/templates')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Support</p>
                    <p className="text-sm text-muted-foreground">Get help</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => router.push('/support')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}