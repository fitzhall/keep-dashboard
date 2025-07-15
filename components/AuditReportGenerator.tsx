'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download } from 'lucide-react'

export function AuditReportGenerator() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Compliance Report
          </CardTitle>
          <CardDescription>
            Create comprehensive compliance reports for your practice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Generate detailed compliance reports including:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Executive Summary</li>
              <li>Compliance Scorecard</li>
              <li>Ethics Requirements</li>
              <li>Training Records</li>
              <li>Audit Trail</li>
            </ul>
            
            <div className="pt-4">
              <Button className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No reports generated yet. Generate your first compliance report above.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}