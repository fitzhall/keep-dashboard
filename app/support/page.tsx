'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  BookOpen,
  Video,
  Calendar,
  ExternalLink,
  Send,
  Loader2
} from 'lucide-react'
import { useUserProgress } from '@/contexts/UserProgressContext'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

// Support categories matching the hotline system
const supportCategories = {
  technical: { label: 'Technical Issue', icon: AlertCircle, color: 'text-red-600' },
  legal: { label: 'Legal Question', icon: FileText, color: 'text-blue-600' },
  process: { label: 'Process/SOP Help', icon: BookOpen, color: 'text-green-600' },
  compliance: { label: 'Compliance Question', icon: CheckCircle, color: 'text-orange-600' },
  client: { label: 'Client Situation', icon: MessageSquare, color: 'text-purple-600' }
}

// Quick help resources
const quickResources = [
  {
    title: 'KEEP SOP Guide',
    description: 'Complete 10-phase implementation guide',
    icon: BookOpen,
    link: '/sop'
  },
  {
    title: 'Video Tutorials',
    description: 'Step-by-step video walkthroughs',
    icon: Video,
    link: '/cle'
  },
  {
    title: 'Template Library',
    description: 'Download all required templates',
    icon: FileText,
    link: '/templates'
  },
  {
    title: 'Expert Hotline',
    description: 'Direct access to KEEP experts',
    icon: Phone,
    link: '/hotline'
  }
]

// FAQ data
const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How do I begin implementing KEEP Protocol?',
        a: 'Start with the "Start Here" section and choose the New Licensee Onboarding workflow. This will guide you through account setup, training, and your first client.'
      },
      {
        q: 'What training is required before working with clients?',
        a: 'Complete the Foundation Training course and review the KEEP Protocol basics. This typically takes 4-6 hours and provides CLE credits.'
      },
      {
        q: 'How do I access the templates?',
        a: 'Visit the Templates section to download all required documents. Templates are organized by SOP phase for easy access.'
      }
    ]
  },
  {
    category: 'Technical',
    questions: [
      {
        q: 'How do I generate Bitcoin addresses for clients?',
        a: 'Use the tools provided in Phase 2 (Custody Design). Never generate addresses online or on compromised devices.'
      },
      {
        q: 'What hardware wallets are recommended?',
        a: 'KEEP Protocol supports Ledger, Trezor, and Coldcard. Specific recommendations depend on client needs and technical expertise.'
      },
      {
        q: 'How do I verify multisig setups?',
        a: 'Follow the verification checklist in Phase 4 (Vault Build). Always test with small amounts first.'
      }
    ]
  },
  {
    category: 'Compliance',
    questions: [
      {
        q: 'What documentation is required for audit compliance?',
        a: 'Maintain all signed documents, client communications, and phase completion records. Use the compliance checklist for guidance.'
      },
      {
        q: 'How often should I review client plans?',
        a: 'Annual reviews are minimum. Recommend quarterly check-ins for high-value estates or active traders.'
      },
      {
        q: 'What are the state-specific requirements?',
        a: 'Check the compliance section for your state. Most states follow standard estate planning requirements with additional crypto considerations.'
      }
    ]
  }
]

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof supportCategories>('technical')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recentTickets, setRecentTickets] = useState<any[]>([])
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  
  const { userProfile } = useUserProgress()
  const { toast } = useToast()
  const router = useRouter()

  // Load recent tickets
  useEffect(() => {
    async function loadTickets() {
      if (!userProfile?.id) return

      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (data && !error) {
        setRecentTickets(data)
      }
    }

    loadTickets()
  }, [userProfile])

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userProfile?.id) return

    setIsSubmitting(true)
    
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: userProfile.id,
          category: selectedCategory,
          priority,
          subject,
          description,
          status: 'open'
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: 'Support ticket created',
        description: `Ticket #${data.ticket_number} has been submitted. We'll respond within 24 hours.`,
      })

      // Reset form
      setSubject('')
      setDescription('')
      setPriority('medium')
      
      // Reload tickets
      setRecentTickets([data, ...recentTickets.slice(0, 4)])
      
    } catch (error) {
      console.error('Error creating ticket:', error)
      toast({
        title: 'Error creating ticket',
        description: 'Please try again or contact support directly.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      open: { variant: 'default' as const, icon: Clock },
      answered: { variant: 'secondary' as const, icon: MessageSquare },
      closed: { variant: 'outline' as const, icon: CheckCircle }
    }
    
    const { variant, icon: Icon } = variants[status] || variants.open
    
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
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
        <h1 className="text-3xl font-bold tracking-tight">Support Center</h1>
        <p className="text-muted-foreground">
          Get help with KEEP Protocol implementation and Bitcoin estate planning.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {quickResources.map((resource, index) => (
          <motion.div
            key={resource.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="cursor-pointer hover:shadow-md transition-all group"
              onClick={() => router.push(resource.link)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <resource.icon className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {resource.description}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="ticket" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ticket">Submit Ticket</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
        </TabsList>

        {/* Submit Ticket Tab */}
        <TabsContent value="ticket" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ticket Form */}
            <Card>
              <CardHeader>
                <CardTitle>Submit Support Ticket</CardTitle>
                <CardDescription>
                  Describe your issue and we'll respond within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={selectedCategory} 
                      onValueChange={(value: any) => setSelectedCategory(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(supportCategories).map(([key, cat]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <cat.icon className={`h-4 w-4 ${cat.color}`} />
                              {cat.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={priority} 
                      onValueChange={(value: any) => setPriority(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - General question</SelectItem>
                        <SelectItem value="medium">Medium - Need help soon</SelectItem>
                        <SelectItem value="high">High - Urgent/Blocking issue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide details about your issue or question..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || !subject || !description}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Ticket
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent Tickets */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Tickets</CardTitle>
                <CardDescription>
                  Track your submitted support requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentTickets.length > 0 ? (
                  <div className="space-y-4">
                    {recentTickets.map((ticket) => (
                      <div 
                        key={ticket.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => router.push('/hotline')}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">#{ticket.ticket_number}</p>
                            <p className="text-sm text-muted-foreground">{ticket.subject}</p>
                          </div>
                          {getStatusBadge(ticket.status)}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {(() => {
                              const categoryInfo = supportCategories[ticket.category as keyof typeof supportCategories]
                              const Icon = categoryInfo?.icon
                              return Icon ? <Icon className="h-3 w-3" /> : null
                            })()}
                            {supportCategories[ticket.category as keyof typeof supportCategories].label}
                          </span>
                          <span>
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No support tickets yet</p>
                    <p className="text-sm">Submit a ticket when you need help</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Common questions about KEEP Protocol implementation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {faqs.map((category) => (
                  <div key={category.category}>
                    <h3 className="font-semibold text-lg mb-4">{category.category}</h3>
                    <div className="space-y-3">
                      {category.questions.map((faq, index) => {
                        const faqId = `${category.category}-${index}`
                        const isExpanded = expandedFaq === faqId
                        
                        return (
                          <div 
                            key={index}
                            className="border rounded-lg overflow-hidden"
                          >
                            <button
                              className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors flex items-center justify-between"
                              onClick={() => setExpandedFaq(isExpanded ? null : faqId)}
                            >
                              <span className="font-medium">{faq.q}</span>
                              <AlertCircle className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                            {isExpanded && (
                              <div className="px-4 py-3 bg-muted/30 border-t">
                                <p className="text-muted-foreground">{faq.a}</p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Info Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Direct Support</CardTitle>
                <CardDescription>
                  For urgent matters or complex questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Expert Hotline</p>
                    <p className="text-sm text-muted-foreground">1-800-KEEP-BTC</p>
                    <p className="text-xs text-muted-foreground">Mon-Fri 9AM-5PM EST</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">support@keepprotocol.com</p>
                    <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Schedule Consultation</p>
                    <p className="text-sm text-muted-foreground">Book 1-on-1 expert session</p>
                    <Button variant="link" className="h-auto p-0 text-xs">
                      Book Now →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Times</CardTitle>
                <CardDescription>
                  Expected response times by priority level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>High Priority:</strong> Response within 4 hours during business hours
                    </AlertDescription>
                  </Alert>
                  
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Medium Priority:</strong> Response within 24 hours
                    </AlertDescription>
                  </Alert>
                  
                  <Alert>
                    <MessageSquare className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Low Priority:</strong> Response within 48-72 hours
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm font-medium mb-2">Founding Member Benefits</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Priority support queue</li>
                    <li>• Direct expert hotline access</li>
                    <li>• Monthly strategy calls</li>
                    <li>• Exclusive resource library</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}