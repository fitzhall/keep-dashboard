'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import { Shield, AlertCircle } from 'lucide-react'
import { ComplianceScorecard } from '@/components/ComplianceScorecard'
import { OnboardingChecklist } from '@/components/OnboardingChecklist'
import { AuditReportGenerator } from '@/components/AuditReportGenerator'

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState('scorecard')

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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="scorecard">Compliance Scorecard</TabsTrigger>
          <TabsTrigger value="onboarding">5-Day Onboarding</TabsTrigger>
          <TabsTrigger value="checklist">Ethics Checklist</TabsTrigger>
          <TabsTrigger value="reports">Audit Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="scorecard">
          <ComplianceScorecard />
        </TabsContent>

        <TabsContent value="onboarding">
          <OnboardingChecklist />
        </TabsContent>

        <TabsContent value="checklist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ethics Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">
                  Ethics checklist functionality is being updated. Please check back soon.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <AuditReportGenerator />
        </TabsContent>
      </Tabs>
    </>
  )
}