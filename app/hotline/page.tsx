'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { HelpCircle, MessageSquare, Clock, CheckCircle, AlertCircle, Phone } from 'lucide-react'
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Submit Support Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="Please provide as much detail as possible about your question or situation..."
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Response Guarantee
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">High Priority</span>
                  <Badge variant="destructive">4 hours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Medium Priority</span>
                  <Badge variant="secondary">24 hours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Low Priority</span>
                  <Badge variant="outline">48 hours</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <Phone className="h-5 w-5" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-600 mb-3">
                For urgent matters requiring immediate attention
              </p>
              <Button variant="destructive" className="w-full">
                Call Emergency Line
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Your Recent Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{ticket.id}</span>
                    <Badge 
                      variant={
                        ticket.status === 'Open' ? 'secondary' :
                        ticket.status === 'Answered' ? 'default' :
                        'outline'
                      }
                    >
                      {ticket.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{ticket.subject}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{ticket.category}</span>
                    <span>Created {ticket.createdAt}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}