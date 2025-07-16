'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { Download, Search, FileText, Shield, Users, BookOpen, Scale, CreditCard } from 'lucide-react'
import { useState } from 'react'
import { useUserProgress } from '@/contexts/UserProgressContext'

interface Template {
  id: number
  name: string
  description: string
  category: string
  filename: string
  size: string
  downloads: number
  updated: string
  icon: any
  premium: boolean
  tierRestriction?: string
}

const templates: Template[] = [
  {
    id: 1,
    name: 'KEEP Engagement Letter Template',
    description: 'Professional engagement letter for KEEP Framework implementation',
    category: 'Legal Documents',
    filename: 'keep-engagement-letter-template.md',
    size: '120 KB',
    downloads: 1247,
    updated: '2025-07-03',
    icon: Scale,
    premium: false
  },
  {
    id: 2,
    name: 'KEEP Framework License Agreement',
    description: 'Complete licensing agreement for KEEP Framework usage',
    category: 'Legal Documents',
    filename: 'keep-framework-license-agreement.md',
    size: '460 KB',
    downloads: 892,
    updated: '2025-07-03',
    icon: FileText,
    premium: false
  },
  {
    id: 3,
    name: 'KEEP Ethics Checklist Template',
    description: 'Comprehensive ethics compliance verification for Bitcoin estate planning',
    category: 'Legal Documents',
    filename: 'keep-ethics-checklist-template.md',
    size: '37 KB',
    downloads: 654,
    updated: '2025-07-03',
    icon: Shield,
    premium: false
  },
  {
    id: 4,
    name: 'Bitcoin Multisig Design Worksheet',
    description: 'Technical worksheet for designing multi-signature wallet configurations',
    category: 'Assessment Tools',
    filename: 'bitcoin-multisig-design-worksheet.md',
    size: '439 KB',
    downloads: 543,
    updated: '2025-07-03',
    icon: Users,
    premium: false
  },
  {
    id: 5,
    name: 'Client Risk Assessment Template',
    description: 'Comprehensive risk assessment form for Bitcoin estate planning clients',
    category: 'Assessment Tools',
    filename: 'client-risk-assessment-template.md',
    size: 'TBD KB',
    downloads: 432,
    updated: '2025-07-03',
    icon: Users,
    premium: false
  },
  {
    id: 6,
    name: 'Probate Proofing SOP Template',
    description: 'Standard operating procedures for probate-proofing Bitcoin estates',
    category: 'Compliance',
    filename: 'probate-proofing-sop-template.md',
    size: '38 KB',
    downloads: 321,
    updated: '2025-07-03',
    icon: Shield,
    premium: false
  },
  {
    id: 7,
    name: 'Probate Proofing Implementation Guide',
    description: 'Complete guide for implementing probate-proofing procedures',
    category: 'Compliance',
    filename: 'probate-proofing-implementation-guide.md',
    size: '617 KB',
    downloads: 234,
    updated: '2025-07-03',
    icon: Shield,
    premium: false
  },
  {
    id: 8,
    name: 'Quality Control Submission Form',
    description: 'Form for quality control review and compliance verification',
    category: 'Compliance',
    filename: 'quality-control-submission-form.md',
    size: 'TBD KB',
    downloads: 189,
    updated: '2025-07-03',
    icon: Shield,
    premium: false
  },
  {
    id: 9,
    name: 'Bitcoin Beneficiary Instructions Guide',
    description: 'Step-by-step instructions for beneficiaries to access Bitcoin inheritance',
    category: 'Client Education',
    filename: 'bitcoin-beneficiary-instructions-guide.md',
    size: '557 KB',
    downloads: 876,
    updated: '2025-07-03',
    icon: BookOpen,
    premium: false
  },
  {
    id: 10,
    name: 'KEEP Framework Client Guide',
    description: 'Comprehensive guide explaining the KEEP Framework to clients',
    category: 'Client Education',
    filename: 'keep-framework-client-guide.md',
    size: '588 KB',
    downloads: 654,
    updated: '2025-07-03',
    icon: BookOpen,
    premium: false
  },
  {
    id: 11,
    name: 'Bitcoin Trust Governance Playbook',
    description: 'Complete playbook for Bitcoin trust governance and management',
    category: 'Technical Guides',
    filename: 'bitcoin-trust-governance-playbook.md',
    size: '668 KB',
    downloads: 421,
    updated: '2025-07-03',
    icon: Shield,
    premium: false
  },
  {
    id: 12,
    name: 'Enhanced Client Workflows Guide',
    description: 'Advanced workflows for Bitcoin estate planning client engagement',
    category: 'Technical Guides',
    filename: 'enhanced-client-workflows-guide.md',
    size: '477 KB',
    downloads: 332,
    updated: '2025-07-03',
    icon: Shield,
    premium: false
  },
  {
    id: 13,
    name: 'KEEP Framework Executive Summary',
    description: 'High-level overview of the KEEP Framework methodology',
    category: 'Technical Guides',
    filename: 'keep-framework-executive-summary.md',
    size: '414 KB',
    downloads: 765,
    updated: '2025-07-03',
    icon: FileText,
    premium: false
  },
  {
    id: 14,
    name: 'Billable Hours Upside Calculator',
    description: 'Calculate potential revenue from Bitcoin estate planning services',
    category: 'Business Development',
    filename: 'billable-hours-upside-calculator.md',
    size: '37 KB',
    downloads: 234,
    updated: '2025-07-03',
    icon: CreditCard,
    premium: true,
    tierRestriction: 'Premier+ Only'
  },
  {
    id: 15,
    name: 'Bitcoin Estate Planning Sales Playbook',
    description: 'Complete sales strategies for Bitcoin estate planning services',
    category: 'Business Development',
    filename: 'bitcoin-estate-planning-sales-playbook.md',
    size: '437 KB',
    downloads: 189,
    updated: '2025-07-03',
    icon: CreditCard,
    premium: true,
    tierRestriction: 'Premier+ Only'
  },
  {
    id: 16,
    name: 'Practice Marketing Templates',
    description: 'Marketing materials for promoting Bitcoin estate planning services',
    category: 'Business Development',
    filename: 'practice-marketing-templates.md',
    size: 'TBD KB',
    downloads: 156,
    updated: '2025-07-03',
    icon: CreditCard,
    premium: true,
    tierRestriction: 'Premier Only'
  }
]

const categories = ['All', 'Legal Documents', 'Assessment Tools', 'Compliance', 'Client Education', 'Technical Guides', 'Business Development']

export default function TemplatesPage() {
  const { progress, dispatch } = useUserProgress()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDownload = (filename: string, templateName: string) => {
    // Create download link
    const link = document.createElement('a')
    link.href = `/templates/${filename}`
    link.download = filename
    link.click()
    
    // Track the download in progress
    dispatch({ 
      type: 'DOWNLOAD_TEMPLATE', 
      templateId: filename, 
      templateName 
    })
  }

  const isDownloaded = (filename: string) => {
    return progress.templatesDownloaded.includes(filename)
  }

  return (
    <>
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Template Library</h1>
        <p className="text-muted-foreground">
          Download professional Bitcoin estate planning templates and documents. All templates are updated regularly and reviewed by legal experts.
        </p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <template.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                        {template.premium && (
                          <Badge variant="default" className="text-xs">
                            {template.tierRestriction || 'Premium'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {template.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>{template.size}</span>
                  <span>{template.downloads} downloads</span>
                  <span>Updated {template.updated}</span>
                </div>

                <Button 
                  className="w-full"
                  onClick={() => handleDownload(template.filename, template.name)}
                  disabled={template.premium}
                  variant={isDownloaded(template.filename) ? "secondary" : "default"}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {template.premium ? (template.tierRestriction || 'Premium Only') : isDownloaded(template.filename) ? 'Downloaded' : 'Download'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No templates found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or category filter.
          </p>
        </motion.div>
      )}

      {/* Premium Notice */}
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Unlock Premium Templates</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Get access to advanced templates and exclusive content with a Premium license.
                </p>
              </div>
              <Button>Upgrade to Premium</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}