'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

const wizardOptions = [
  {
    id: 'new-licensee',
    title: 'New Licensee Onboarding',
    description: 'Get started with KEEP Protocol for the first time',
    icon: '🚀',
    steps: ['Account Setup', 'Training Overview', 'First Client']
  },
  {
    id: 'sop-implementation',
    title: 'KEEP SOP Implementation',
    description: 'Begin implementing the 10-phase framework',
    icon: '📋',
    steps: ['Current Assessment', 'Phase Planning', 'Resource Setup']
  },
  {
    id: 'audit-prep',
    title: 'Audit Preparation',
    description: 'Prepare for compliance audits and reviews',
    icon: '🔍',
    steps: ['Document Review', 'Compliance Check', 'Report Generation']
  }
]

export default function StartHerePage() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Start Here</h1>
          <p className="mt-2 text-secondary-600">
            Choose your path to get started with the KEEP Protocol system.
          </p>
        </div>

        {!selectedPath ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {wizardOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedPath(option.id)}
                className="card hover:shadow-lg transition-shadow duration-200 text-left group"
              >
                <div className="text-4xl mb-4">{option.icon}</div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  {option.title}
                </h3>
                <p className="text-secondary-600 mb-4">{option.description}</p>
                <div className="flex items-center text-primary-600 font-medium">
                  Get Started
                  <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl">
            <button
              onClick={() => setSelectedPath(null)}
              className="mb-6 text-primary-600 font-medium hover:text-primary-700"
            >
              ← Back to options
            </button>
            
            <div className="card">
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">
                {wizardOptions.find(o => o.id === selectedPath)?.title}
              </h2>
              
              <div className="space-y-4">
                {wizardOptions.find(o => o.id === selectedPath)?.steps.map((step, index) => (
                  <div key={index} className="flex items-center p-4 bg-secondary-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-medium">
                      {index + 1}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-secondary-900">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="btn-primary mt-6 w-full">
                Begin {wizardOptions.find(o => o.id === selectedPath)?.title}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}