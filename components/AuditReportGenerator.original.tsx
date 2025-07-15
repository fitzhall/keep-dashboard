'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { 
  FileText, 
  Download, 
  Calendar as CalendarIcon,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileDown,
  Mail,
  Printer
} from 'lucide-react'

interface ReportSection {
  id: string
  name: string
  description: string
  required: boolean
}

const reportSections: ReportSection[] = [
  {
    id: 'executive-summary',
    name: 'Executive Summary',
    description: 'High-level overview of compliance status',
    required: true
  },
  {
    id: 'compliance-scorecard',
    name: 'Compliance Scorecard',
    description: 'Detailed breakdown of all compliance categories',
    required: true
  },
  {
    id: 'ethics-checklist',
    name: 'Ethics Requirements',
    description: 'Status of ABA ethics rule compliance',
    required: true
  },
  {
    id: 'training-records',
    name: 'Training & Certification',
    description: 'CLE and KEEP training completion records',
    required: false
  },
  {
    id: 'client-documentation',
    name: 'Client Documentation Review',
    description: 'Summary of client file compliance',
    required: false
  },
  {
    id: 'audit-trail',
    name: 'Audit Trail',
    description: 'Complete activity log for selected period',
    required: false
  },
  {
    id: 'recommendations',
    name: 'Recommendations',
    description: 'Action items for improving compliance',
    required: true
  }
]

const reportFormats = [
  { value: 'pdf', label: 'PDF Document', icon: FileText },
  { value: 'excel', label: 'Excel Spreadsheet', icon: FileDown },
  { value: 'word', label: 'Word Document', icon: FileText }
]

export function AuditReportGenerator() {
  const [selectedSections, setSelectedSections] = useState<string[]>(
    reportSections.filter(s => s.required).map(s => s.id)
  )
  const [reportType, setReportType] = useState('monthly')
  const [reportFormat, setReportFormat] = useState('pdf')
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReport, setGeneratedReport] = useState<{
    url: string
    name: string
    size: string
  } | null>(null)

  const handleSectionToggle = (sectionId: string) => {
    const section = reportSections.find(s => s.id === sectionId)
    if (section?.required) return // Can't toggle required sections

    setSelectedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setGeneratedReport({
      url: '#',
      name: `Compliance_Audit_Report_${format(new Date(), 'yyyy-MM-dd')}.${reportFormat}`,
      size: '2.4 MB'
    })
    setIsGenerating(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Audit Report</CardTitle>
          <CardDescription>
            Create comprehensive compliance audit reports for internal review or regulatory submission
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Type */}
          <div className="space-y-3">
            <Label>Report Type</Label>
            <RadioGroup value={reportType} onValueChange={setReportType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly" className="font-normal cursor-pointer">
                  Monthly Compliance Report
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="quarterly" id="quarterly" />
                <Label htmlFor="quarterly" className="font-normal cursor-pointer">
                  Quarterly Audit Report
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="annual" id="annual" />
                <Label htmlFor="annual" className="font-normal cursor-pointer">
                  Annual Compliance Review
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="font-normal cursor-pointer">
                  Custom Date Range
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Date Range (for custom) */}
          {reportType === 'custom' && (
            <div className="space-y-3">
              <Label>Date Range</Label>
              <div className="flex gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? format(dateRange.from, "PPP") : "From date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !dateRange.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? format(dateRange.to, "PPP") : "To date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Report Sections */}
          <div className="space-y-3">
            <Label>Report Sections</Label>
            <div className="space-y-2">
              {reportSections.map(section => (
                <div
                  key={section.id}
                  className={cn(
                    "flex items-start space-x-3 p-3 rounded-lg border",
                    section.required && "bg-muted/50"
                  )}
                >
                  <Checkbox
                    checked={selectedSections.includes(section.id)}
                    onCheckedChange={() => handleSectionToggle(section.id)}
                    disabled={section.required}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label className="font-medium cursor-pointer">
                        {section.name}
                      </Label>
                      {section.required && (
                        <Badge variant="secondary" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Report Format */}
          <div className="space-y-3">
            <Label>Export Format</Label>
            <Select value={reportFormat} onValueChange={setReportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reportFormats.map(format => {
                  const Icon = format.icon
                  return (
                    <SelectItem key={format.value} value={format.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {format.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Generate Button */}
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-5 w-5" />
                Generate Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Report */}
      {generatedReport && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <p className="font-medium">Report Generated Successfully!</p>
                <p className="text-sm text-muted-foreground">
                  {generatedReport.name} ({generatedReport.size})
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
                <Button size="sm" variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Monthly_Compliance_Report_2025-02.pdf', date: 'Feb 1, 2025', size: '1.8 MB' },
              { name: 'Quarterly_Audit_Report_Q4_2024.pdf', date: 'Jan 15, 2025', size: '3.2 MB' },
              { name: 'Annual_Compliance_Review_2024.pdf', date: 'Jan 5, 2025', size: '5.4 MB' }
            ].map((report, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{report.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Generated on {report.date} • {report.size}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Add missing import
import { Badge } from '@/components/ui/badge'