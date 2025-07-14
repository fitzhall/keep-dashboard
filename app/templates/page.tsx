'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { Download, Search, FileText, Shield, Users, BookOpen, Scale, CreditCard } from 'lucide-react'
import { useState } from 'react'
import { useUserProgress } from '@/contexts/UserProgressContext'

const templates = [
  {
    id: 1,
    name: 'Bitcoin Trust Template',
    description: 'Comprehensive irrevocable trust agreement for Bitcoin holdings',
    category: 'Legal Documents',
    filename: 'bitcoin-trust-template.md',
    size: '45 KB',
    downloads: 1247,
    updated: '2024-01-10',
    icon: Scale,
    premium: false
  },
  {
    id: 2,
    name: 'Client Intake Questionnaire',
    description: 'Comprehensive assessment form for Bitcoin estate planning clients',
    category: 'Assessment Tools',
    filename: 'client-intake-questionnaire.md',
    size: '32 KB',
    downloads: 892,
    updated: '2024-01-08',
    icon: Users,
    premium: false
  },
  {
    id: 3,
    name: 'Compliance Checklist',
    description: 'Step-by-step compliance verification for Bitcoin estate planning',
    category: 'Compliance',
    filename: 'compliance-checklist.md',
    size: '28 KB',
    downloads: 654,
    updated: '2024-01-12',
    icon: Shield,
    premium: false
  },
  {
    id: 4,
    name: 'Beneficiary Designation Form',
    description: 'Formal designation document for Bitcoin beneficiaries',
    category: 'Legal Documents',
    filename: 'beneficiary-designation.md',
    size: '18 KB',
    downloads: 543,
    updated: '2024-01-05',
    icon: FileText,
    premium: true
  },
  {
    id: 5,
    name: 'Family Recovery Guide',
    description: 'Step-by-step instructions for beneficiaries to access Bitcoin',
    category: 'Client Education',
    filename: 'family-recovery-guide.md',
    size: '25 KB',
    downloads: 432,
    updated: '2024-01-07',
    icon: BookOpen,
    premium: false
  },
  {
    id: 6,
    name: 'Multi-Signature Setup Guide',
    description: 'Technical guide for implementing multi-signature wallets',
    category: 'Technical Guides',
    filename: 'multisig-setup-guide.md',
    size: '38 KB',
    downloads: 321,
    updated: '2024-01-09',
    icon: Shield,
    premium: true
  },
  {
    id: 7,
    name: 'Fee Agreement Template',
    description: 'Bitcoin estate planning engagement agreement template',
    category: 'Business',
    filename: 'fee-agreement-template.md',
    size: '22 KB',
    downloads: 234,
    updated: '2024-01-11',
    icon: CreditCard,
    premium: false
  }
]

const categories = ['All', 'Legal Documents', 'Assessment Tools', 'Compliance', 'Client Education', 'Technical Guides', 'Business']

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
                            Premium
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
                  {template.premium ? 'Premium Only' : isDownloaded(template.filename) ? 'Downloaded' : 'Download'}
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