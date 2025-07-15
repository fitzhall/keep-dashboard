'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { HelpCircle, MessageSquare, Clock, CheckCircle, AlertCircle, Phone, Shield, Info } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useUserProgress } from '@/contexts/UserProgressContext'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { sendSlackNotification } from '@/lib/slack'

interface SupportTicket {
  id: string
  ticket_number: string
  subject: string
  category: string
  priority: string
  status: string
  description: string
  created_at: string
  response?: string
  responded_at?: string
}

// Helper function to format dates
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
}

export default function HotlinePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [isLoadingTickets, setIsLoadingTickets] = useState(true)
  const { userProfile, dispatch } = useUserProgress()
  const { toast } = useToast()
  const router = useRouter()
  
  // Form state
  const [formData, setFormData] = useState({
    category: '',
    priority: '',
    subject: '',
    description: ''
  })

  // Load user's tickets on mount
  useEffect(() => {
    async function loadTickets() {
      if (!userProfile?.id) return
      
      try {
        const { data, error } = await supabase
          .from('support_tickets')
          .select('*')
          .eq('user_id', userProfile.id)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        setTickets(data || [])
      } catch (error) {
        console.error('Error loading tickets:', error)
        toast({
          title: "Error loading tickets",
          description: "Please try refreshing the page",
          variant: "destructive"
        })
      } finally {
        setIsLoadingTickets(false)
      }
    }
    
    loadTickets()
  }, [userProfile?.id, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userProfile?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a support request",
        variant: "destructive"
      })
      return
    }
    
    if (!formData.category || !formData.priority || !formData.subject || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Save ticket to database
      const { data: newTicket, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: userProfile.id,
          category: formData.category,
          priority: formData.priority,
          subject: formData.subject,
          description: formData.description,
          status: 'open'
        })
        .select()
        .single()
      
      if (error) throw error
      
      // Add to activity log
      dispatch({
        type: 'ADD_ACTIVITY',
        activity: {
          type: 'support',
          title: 'Submitted support request',
          description: `${formData.priority} priority: ${formData.subject}`
        }
      })
      
      // Add to local tickets list
      setTickets([newTicket, ...tickets])
      
      // Reset form
      setFormData({
        category: '',
        priority: '',
        subject: '',
        description: ''
      })
      
      toast({
        title: "Support request submitted",
        description: `Ticket ${newTicket.ticket_number} created successfully`,
      })
      
      // Send Slack notification
      await sendSlackNotification({
        ticket_number: newTicket.ticket_number,
        category: newTicket.category,
        priority: newTicket.priority,
        subject: newTicket.subject,
        description: newTicket.description,
        user_email: userProfile.email
      })
      
    } catch (error) {
      console.error('Error submitting ticket:', error)
      toast({
        title: "Error submitting request",
        description: "Please try again or contact support directly",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Expert Hotline</h1>
        <p className="text-muted-foreground">
          Get expert guidance from Bitcoin estate planning specialists. 48-hour response guarantee.
        </p>
      </motion.div>

      {/* Response Time Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <Clock className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">4 Hours</div>
              <p className="text-xs text-muted-foreground">Urgent client matters</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medium Priority</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">24 Hours</div>
              <p className="text-xs text-muted-foreground">Need guidance</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Priority</CardTitle>
              <Clock className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">48 Hours</div>
              <p className="text-xs text-muted-foreground">General inquiries</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submit New Ticket */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Submit Support Request
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Our Bitcoin estate planning experts are here to help with any questions or challenges you're facing.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical Setup</SelectItem>
                          <SelectItem value="legal">Legal Guidance</SelectItem>
                          <SelectItem value="process">Process Questions</SelectItem>
                          <SelectItem value="compliance">Compliance</SelectItem>
                          <SelectItem value="client">Client Communication</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => setFormData({ ...formData, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - General inquiry</SelectItem>
                          <SelectItem value="medium">Medium - Need guidance</SelectItem>
                          <SelectItem value="high">High - Urgent client matter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject"
                      placeholder="Brief description of your question"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description</Label>
                    <Textarea 
                      id="description"
                      rows={6}
                      placeholder="Please provide as much detail as possible about your question or situation. Include relevant client context while keeping confidential details general."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting Request...' : 'Submit Support Request'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Emergency Contact */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <Phone className="h-5 w-5" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-600 mb-4">
                  For urgent matters requiring immediate attention during active cases.
                </p>
                <Button variant="destructive" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Emergency Line
                </Button>
                <p className="text-xs text-red-500 mt-3 text-center">
                  Available 24/7 for licensed attorneys with active cases
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Tips */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <strong>Be Specific:</strong> Include relevant details about your situation and which SOP phase you're in.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <strong>Client Privacy:</strong> Keep confidential details general while providing enough context for guidance.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <strong>Attach Context:</strong> Reference specific templates or compliance requirements when applicable.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Previous Tickets */}
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Your Recent Support Requests
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Track the status of your previous requests and view expert responses.
            </p>
          </CardHeader>
          <CardContent>
            {isLoadingTickets ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading your support requests...
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No support requests yet. Submit one above when you need help!
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket, index) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{ticket.ticket_number}</span>
                        <Badge 
                          variant={
                            ticket.status === 'open' ? 'secondary' :
                            ticket.status === 'answered' ? 'default' :
                            'outline'
                          }
                        >
                          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </Badge>
                        <Badge 
                          variant={
                            ticket.priority === 'high' ? 'destructive' :
                            ticket.priority === 'medium' ? 'secondary' :
                            'outline'
                          }
                        >
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </Badge>
                      </div>
                      <h3 className="font-medium">{ticket.subject}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
                        </span>
                        <span>Created {formatDate(ticket.created_at)}</span>
                        {ticket.responded_at && (
                          <span>Responded {formatDate(ticket.responded_at)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {ticket.status === 'answered' && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {ticket.status === 'open' && (
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      )}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}