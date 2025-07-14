'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { AuditTable } from '@/components/AuditTable'
import { motion } from 'framer-motion'
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
    <>
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Compliance Center</h1>
        <p className="text-muted-foreground">
          Manage ethics requirements and regulatory compliance for Bitcoin estate planning.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Ethics Checklist */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ethics Checklist</CardTitle>
            <div className="space-y-2">
              <Progress value={progressPercentage} className="w-full" />
              <p className="text-sm text-muted-foreground">{completedCount} of {totalCount} completed</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ethicsItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <Checkbox
                    checked={checkedItems.includes(item.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setCheckedItems([...checkedItems, item.id])
                      } else {
                        setCheckedItems(checkedItems.filter(id => id !== item.id))
                      }
                    }}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* 5-Day Onboarding */}
          <Card>
            <CardHeader>
              <CardTitle>5-Day Onboarding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {onboardingDays.map((day, index) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">Day {day.day}: {day.task}</span>
                    <Badge variant={
                      day.status === 'Complete' ? 'default' :
                      day.status === 'In Progress' ? 'secondary' :
                      'outline'
                    }>
                      {day.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quality Control */}
          <Card>
            <CardHeader>
              <CardTitle>Quality Control</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Submit completed client files for expert review
              </p>
              <Button className="w-full">
                Submit for Review
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Audit Trail */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Compliance Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <AuditTable />
        </CardContent>
      </Card>
    </>
  )
}