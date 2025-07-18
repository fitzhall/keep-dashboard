'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { Download, Search, FileText, Shield, Users, BookOpen, Scale, CreditCard, File } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useUserProgress } from '@/contexts/UserProgressContext'
import { getTemplates, getTemplateCategories, downloadTemplate, getUserDownloads, type Template } from '@/lib/templates'
import { toast } from '@/hooks/use-toast'

const categoryIcons: Record<string, any> = {
  'estate-planning': Scale,
  'bitcoin-custody': Shield,
  'legal-forms': FileText,
  'assessment-tools': Users,
  'compliance': Shield,
  'client-education': BookOpen,
  'technical-guides': FileText,
  'business-development': CreditCard
}

export default function TemplatesPage() {
  const { progress } = useUserProgress()
  const [templates, setTemplates] = useState<Template[]>([])
  const [categories, setCategories] = useState<string[]>(['All'])
  const [userDownloads, setUserDownloads] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTemplates()
    loadUserDownloads()
  }, [])

  const loadTemplates = async () => {
    setLoading(true)
    try {
      const [templatesData, categoriesData] = await Promise.all([
        getTemplates(),
        getTemplateCategories()
      ])
      
      setTemplates(templatesData)
      setCategories(['All', ...categoriesData.map(c => c.id)])
    } catch (error) {
      console.error('Error loading templates:', error)
      toast({
        title: "Error",
        description: "Failed to load templates",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const loadUserDownloads = async () => {
    try {
      const downloads = await getUserDownloads()
      setUserDownloads(downloads.map(d => d.template_id))
    } catch (error) {
      console.error('Error loading user downloads:', error)
    }
  }

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDownload = async (template: Template) => {
    try {
      await downloadTemplate(template)
      
      toast({
        title: "Success",
        description: `Downloaded ${template.file_name}`,
      })
      
      // Reload downloads to update the UI
      loadUserDownloads()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download template",
        variant: "destructive"
      })
    }
  }

  const isDownloaded = (templateId: string) => {
    return userDownloads.includes(templateId)
  }

  const formatCategoryName = (category: string): string => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return 'N/A'
    const kb = bytes / 1024
    return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(1)} MB`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    )
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
                    {category === 'All' ? 'All' : formatCategoryName(category)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => {
          const IconComponent = categoryIcons[template.category] || File
          const downloaded = isDownloaded(template.id)
          
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {formatCategoryName(template.category)}
                          </Badge>
                          {template.file_type && (
                            <Badge variant="outline" className="text-xs">
                              {template.file_type.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground mb-4 flex-1">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span>{formatFileSize(template.file_size)}</span>
                    <span>Updated {new Date(template.updated_at).toLocaleDateString()}</span>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => handleDownload(template)}
                    variant={downloaded ? "secondary" : "default"}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {downloaded ? 'Downloaded' : 'Download'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
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

      {/* Download History Notice */}
      {userDownloads.length > 0 && (
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Your Downloads</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You have downloaded {userDownloads.length} template{userDownloads.length !== 1 ? 's' : ''}.
                    Templates marked as "Downloaded" are tracked for your reference.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </>
  )
}