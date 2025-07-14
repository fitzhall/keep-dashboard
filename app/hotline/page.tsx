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
import { useState } from 'react'

const tickets = [
  {
    id: 'HLP-001',
    subject: 'Multi-sig setup for family trust',
    category: 'Technical',
    priority: 'Medium',
    status: 'Open',
    createdAt: '2024-01-12',
    responseTime: '< 24 hours'
  },
  {
    id: 'HLP-002',
    subject: 'Regulatory compliance question - California',
    category: 'Legal',
    priority: 'High',
    status: 'Answered',
    createdAt: '2024-01-10',
    responseTime: '< 4 hours'
  },
  {
    id: 'HLP-003',
    subject: 'Best practices for key rotation',
    category: 'Process',
    priority: 'Low',
    status: 'Closed',
    createdAt: '2024-01-08',
    responseTime: '< 12 hours'
  }
]

export default function HotlinePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
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
                      <Select>
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
                      <Select>
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
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description</Label>
                    <Textarea 
                      id="description"
                      rows={6}
                      placeholder="Please provide as much detail as possible about your question or situation. Include relevant client context while keeping confidential details general."
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
                      <span className="font-bold">{ticket.id}</span>
                      <Badge 
                        variant={
                          ticket.status === 'Open' ? 'secondary' :
                          ticket.status === 'Answered' ? 'default' :
                          'outline'
                        }
                      >
                        {ticket.status}
                      </Badge>
                      <Badge 
                        variant={
                          ticket.priority === 'High' ? 'destructive' :
                          ticket.priority === 'Medium' ? 'secondary' :
                          'outline'
                        }
                      >
                        {ticket.priority}
                      </Badge>
                    </div>
                    <h3 className="font-medium">{ticket.subject}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {ticket.category}
                      </span>
                      <span>Created {ticket.createdAt}</span>
                      <span>Response: {ticket.responseTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {ticket.status === 'Answered' && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {ticket.status === 'Open' && (
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    )}
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}