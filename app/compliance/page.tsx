'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { AuditTable } from '@/components/AuditTable'
import { ComplianceScorecard } from '@/components/ComplianceScorecard'
import { AuditReportGenerator } from '@/components/AuditReportGenerator'
import { OnboardingChecklist } from '@/components/OnboardingChecklist'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import { useUserProgress } from '@/contexts/UserProgressContext'
import { getEthicsChecklist, toggleEthicsChecklistItem } from '@/lib/compliance-data'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export default function CompliancePage() {
  const { userProfile } = useUserProgress()
  const { toast } = useToast()
  const [ethicsItems, setEthicsItems] = useState<any[]>([])
  const [isLoadingEthics, setIsLoadingEthics] = useState(true)

  useEffect(() => {
    if (userProfile?.id) {
      loadEthicsChecklist()
    }
  }, [userProfile])

  async function loadEthicsChecklist() {
    if (!userProfile?.id) return

    try {
      const data = await getEthicsChecklist(userProfile.id)
      setEthicsItems(data || [])
    } catch (error) {
      console.error('Error loading ethics checklist:', error)
      setEthicsItems([])
      toast({
        title: 'Error loading checklist',
        description: 'Please try refreshing the page',
        variant: 'destructive'
      })
    } finally {
      setIsLoadingEthics(false)
    }
  }

  async function handleEthicsToggle(itemId: number) {
    if (!userProfile?.id) return

    try {
      await toggleEthicsChecklistItem(userProfile.id, itemId)
      await loadEthicsChecklist()
    } catch (error) {
      console.error('Error toggling checklist item:', error)
      toast({
        title: 'Error updating checklist',
        description: 'Please try again',
        variant: 'destructive'
      })
    }
  }

  const completedCount = ethicsItems.filter(item => item.completed).length
  const totalCount = ethicsItems.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

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

      <Tabs defaultValue="scorecard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="scorecard">Compliance Scorecard</TabsTrigger>
          <TabsTrigger value="onboarding">5-Day Onboarding</TabsTrigger>
          <TabsTrigger value="checklist">Ethics Checklist</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="reports">Audit Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="scorecard">
          <ComplianceScorecard />
        </TabsContent>

        <TabsContent value="onboarding">
          <OnboardingChecklist />
        </TabsContent>

        <TabsContent value="checklist" className="space-y-6">

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
            {isLoadingEthics ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {ethicsItems.map((item, index) => (
                  <motion.div
                    key={item.item_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-accent transition-colors"
                  >
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => handleEthicsToggle(item.item_id)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
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

        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Recent Compliance Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <AuditTable />
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