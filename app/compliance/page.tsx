'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { AuditTable } from '@/components/AuditTable'
import { motion } from 'framer-motion'
import * as Progress from '@radix-ui/react-progress'
import { useState } from 'react'

const ethicsItems = [
  {
    id: 1,
    title: 'Competence (ABA Rule 1.1)',
    description: 'Completed required Bitcoin estate planning training and certification',
    completed: false,
  },
  {
    id: 2,
    title: 'Confidentiality (ABA Rule 1.6)',
    description: 'Established secure procedures for handling client Bitcoin information',
    completed: true,
  },
  {
    id: 3,
    title: 'Conflict of Interest (ABA Rule 1.7)',
    description: 'Completed conflict check for cryptocurrency-related matters',
    completed: true,
  },
  {
    id: 4,
    title: 'Client Communication (ABA Rule 1.4)',
    description: 'Provided clear written explanation of Bitcoin estate planning process',
    completed: false,
  },
]

const onboardingDays = [
  { day: 1, task: 'Platform Setup', status: 'Complete' },
  { day: 2, task: 'SOP Training', status: 'Complete' },
  { day: 3, task: 'Document Review', status: 'In Progress' },
  { day: 4, task: 'Mock Client', status: 'Pending' },
  { day: 5, task: 'Certification', status: 'Pending' },
]

export default function CompliancePage() {
  const [checkedItems, setCheckedItems] = useState<number[]>([2, 3])
  const completedCount = checkedItems.length
  const totalCount = ethicsItems.length
  const progressPercentage = (completedCount / totalCount) * 100

  return (
    <DashboardLayout>
      <div className="p-8">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-secondary-900">Compliance Center</h1>
          <p className="mt-2 text-secondary-600">
            Manage ethics requirements and regulatory compliance for Bitcoin estate planning.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Ethics Checklist */}
          <Card className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-secondary-900">Ethics Checklist</h2>
              <div className="mt-2">
                <Progress.Root className="relative overflow-hidden bg-secondary-200 rounded-full w-full h-2">
                  <Progress.Indicator
                    className="bg-primary-600 w-full h-full transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${100 - progressPercentage}%)` }}
                  />
                </Progress.Root>
                <p className="text-sm text-secondary-600 mt-1">{completedCount} of {totalCount} completed</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {ethicsItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 border border-secondary-200 rounded-lg hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                      checked={checkedItems.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCheckedItems([...checkedItems, item.id])
                        } else {
                          setCheckedItems(checkedItems.filter(id => id !== item.id))
                        }
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-secondary-900">{item.title}</p>
                      <p className="text-sm text-secondary-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* 5-Day Onboarding */}
            <Card>
              <h3 className="font-semibold text-secondary-900 mb-4">5-Day Onboarding</h3>
              <div className="space-y-3">
                {onboardingDays.map((day, index) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-secondary-600">Day {day.day}: {day.task}</span>
                    <span className={`text-sm font-medium ${
                      day.status === 'Complete' ? 'text-green-600' :
                      day.status === 'In Progress' ? 'text-amber-600' :
                      'text-secondary-400'
                    }`}>
                      {day.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Quality Control */}
            <Card>
              <h3 className="font-semibold text-secondary-900 mb-4">Quality Control</h3>
              <p className="text-sm text-secondary-600 mb-4">
                Submit completed client files for expert review
              </p>
              <motion.button 
                className="btn-primary w-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Submit for Review
              </motion.button>
            </Card>
          </div>
        </div>

        {/* Audit Trail */}
        <Card className="mt-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Recent Compliance Activities</h2>
          <AuditTable />
        </Card>
      </div>
    </DashboardLayout>
  )
}