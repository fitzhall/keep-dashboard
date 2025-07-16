'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  HeadphonesIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Shield, 
  Info,
  Star,
  MessageSquare,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock license tier - would come from user profile
const licenseTier = 'Premier' // 'Core', 'Premier', or 'Premier+'

// Support tiers based on license
const supportTiers = {
  Core: {
    responseTime: '48 hours',
    channels: ['Email support'],
    consultations: 'Quarterly group calls',
    price: '$12,000/year'
  },
  Premier: {
    responseTime: '24 hours',
    channels: ['Phone + Email support'],
    consultations: 'Monthly 1:1 calls',
    price: '$18,000/year'
  },
  'Premier+': {
    responseTime: 'Same day',
    channels: ['Dedicated hotline'],
    consultations: 'Unlimited consultations',
    price: '$30,000/year'
  }
}

// Recent support tickets (mock data)
const recentTickets = [
  {
    id: '2025-001',
    subject: 'Multisig setup guidance',
    category: 'Technical',
    status: 'resolved',
    responseTime: '18 hours',
    date: '2025-07-14'
  },
  {
    id: '2025-002',
    subject: 'State law compliance question',
    category: 'Legal',
    status: 'in-progress',
    responseTime: '6 hours',
    date: '2025-07-15'
  },
  {
    id: '2025-003',
    subject: 'Client communication template',
    category: 'Templates',
    status: 'resolved',
    responseTime: '12 hours',
    date: '2025-07-12'
  }
]

// Ticket categories
const ticketCategories = [
  { value: 'technical', label: 'Technical Implementation' },
  { value: 'legal', label: 'Legal & Compliance' },
  { value: 'templates', label: 'Templates & Documents' },
  { value: 'training', label: 'Training & CLE' },
  { value: 'billing', label: 'Billing & Account' },
  { value: 'other', label: 'Other' }
]

export default function HotlinePage() {
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('normal')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentTier = supportTiers[licenseTier as keyof typeof supportTiers]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate ticket submission
    setTimeout(() => {
      setIsSubmitting(false)
      // Reset form
      setSubject('')
      setCategory('')
      setDescription('')
      setPriority('normal')
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Expert Support Hotline</h1>
        <p className="text-gray-600 mt-1">
          Get expert assistance with your Bitcoin estate planning practice
        </p>
      </div>

      {/* License Tier Info */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Star className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  {licenseTier} License Support
                  <Badge variant="outline">{currentTier.price}</Badge>
                </h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Response time: <strong>{currentTier.responseTime}</strong>
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    {currentTier.channels.join(', ')}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {currentTier.consultations}
                  </p>
                </div>
              </div>
            </div>
            {licenseTier !== 'Premier+' && (
              <Button variant="outline" size="sm">
                Upgrade License
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Submit Ticket Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Submit Support Request</CardTitle>
              <CardDescription>
                Our Bitcoin estate planning experts will respond within {currentTier.responseTime}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {ticketCategories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        {licenseTier === 'Premier+' && (
                          <SelectItem value="urgent">Urgent</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please provide detailed information about your request..."
                    rows={6}
                    required
                  />
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Include specific details about your Bitcoin estate planning scenario for faster resolution.
                  </AlertDescription>
                </Alert>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Submitting...</>
                  ) : (
                    <>
                      <HeadphonesIcon className="mr-2 h-4 w-4" />
                      Submit Support Request
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tickets */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Support Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-3 border rounded-lg space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">Ticket #{ticket.id}</p>
                        <p className="text-sm text-gray-600">{ticket.subject}</p>
                      </div>
                      <Badge variant={ticket.status === 'resolved' ? 'default' : 'secondary'}>
                        {ticket.status === 'resolved' ? (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        ) : (
                          <Clock className="mr-1 h-3 w-3" />
                        )}
                        {ticket.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{ticket.category}</span>
                      <span>•</span>
                      <span>Response: {ticket.responseTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          {licenseTier === 'Premier+' && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Priority Hotline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  As a Premier+ member, you have access to our priority hotline for urgent matters.
                </p>
                <Button className="w-full" variant="default">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Priority Hotline
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Available 9 AM - 6 PM EST
                </p>
              </CardContent>
            </Card>
          )}

          {/* Support Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Support Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium">9 AM - 6 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium">10 AM - 2 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Response times are based on business hours. Urgent matters for Premier+ members may receive after-hours support.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}