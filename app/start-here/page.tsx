'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ArrowLeft, Rocket, FileText, Search } from 'lucide-react'

const wizardOptions = [
  {
    id: 'new-licensee',
    title: 'New Licensee Onboarding',
    description: 'Get started with KEEP Protocol for the first time',
    icon: Rocket,
    steps: ['Account Setup', 'Training Overview', 'First Client']
  },
  {
    id: 'sop-implementation',
    title: 'KEEP SOP Implementation',
    description: 'Begin implementing the 10-phase framework',
    icon: FileText,
    steps: ['Current Assessment', 'Phase Planning', 'Resource Setup']
  },
  {
    id: 'audit-prep',
    title: 'Audit Preparation',
    description: 'Prepare for compliance audits and reviews',
    icon: Search,
    steps: ['Document Review', 'Compliance Check', 'Report Generation']
  }
]

export default function StartHerePage() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Start Here</h1>
        <p className="text-muted-foreground">
          Choose your path to get started with the KEEP Protocol system.
        </p>
      </div>

      {!selectedPath ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {wizardOptions.map((option) => {
            const IconComponent = option.icon
            return (
              <Card 
                key={option.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 group hover:border-primary"
                onClick={() => setSelectedPath(option.id)}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {option.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{option.description}</p>
                  <div className="flex items-center text-primary font-medium">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="max-w-2xl">
          <Button
            variant="ghost"
            onClick={() => setSelectedPath(null)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to options
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {wizardOptions.find(o => o.id === selectedPath)?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {wizardOptions.find(o => o.id === selectedPath)?.steps.map((step, index) => (
                  <div key={index} className="flex items-center p-4 bg-muted rounded-lg">
                    <Badge variant="default" className="w-8 h-8 rounded-full flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div className="ml-4">
                      <p className="font-medium">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button className="w-full" size="lg">
                Begin {wizardOptions.find(o => o.id === selectedPath)?.title}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}