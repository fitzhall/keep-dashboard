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

      {/* Modern Response Time Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-red-50 rounded-xl">
                  <Clock className="h-5 w-5 text-red-600" />
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full">URGENT</span>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-red-600">4 Hours</div>
                <p className="text-sm text-gray-600">Urgent client matters</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-amber-50 rounded-xl">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full">STANDARD</span>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-amber-600">24 Hours</div>
                <p className="text-sm text-gray-600">Need guidance</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-50 rounded-xl">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full">GENERAL</span>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-green-600">48 Hours</div>
                <p className="text-sm text-gray-600">General inquiries</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Modern Submit Form */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl blur-sm opacity-50"></div>
              <div className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 rounded-xl">
                    <HelpCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Submit Support Request</h2>
                    <p className="text-gray-600">
                      Our Bitcoin estate planning experts are here to help with any questions or challenges you're facing.
                    </p>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Category</label>
                      <Select>
                        <SelectTrigger className="h-12 rounded-xl border-gray-200">
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
                      <label className="text-sm font-semibold text-gray-700">Priority</label>
                      <Select>
                        <SelectTrigger className="h-12 rounded-xl border-gray-200">
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
                    <label className="text-sm font-semibold text-gray-700">Subject</label>
                    <input 
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="Brief description of your question"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Detailed Description</label>
                    <textarea 
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                      placeholder="Please provide as much detail as possible about your question or situation. Include relevant client context while keeping confidential details general."
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting Request...' : 'Submit Support Request'}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Modern Sidebar */}
        <div className="space-y-6">
          {/* Emergency Contact */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur-lg opacity-20"></div>
              <div className="relative bg-white rounded-2xl p-6 border border-red-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-50 rounded-xl">
                    <Phone className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="font-bold text-red-700">Emergency Contact</h3>
                </div>
                <p className="text-sm text-red-600 mb-4">
                  For urgent matters requiring immediate attention during active cases.
                </p>
                <button className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl py-3 font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg">
                  <Phone className="h-4 w-4" />
                  Call Emergency Line
                </button>
                <p className="text-xs text-red-500 mt-3 text-center">
                  Available 24/7 for licensed attorneys with active cases
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quick Tips */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900">Quick Tips</h3>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="p-1 bg-blue-50 rounded-lg mt-0.5">
                    <Shield className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="text-sm">
                    <strong className="text-gray-900">Be Specific:</strong> 
                    <span className="text-gray-600"> Include relevant details about your situation and which SOP phase you're in.</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="p-1 bg-blue-50 rounded-lg mt-0.5">
                    <Shield className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="text-sm">
                    <strong className="text-gray-900">Client Privacy:</strong> 
                    <span className="text-gray-600"> Keep confidential details general while providing enough context for guidance.</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="p-1 bg-blue-50 rounded-lg mt-0.5">
                    <Shield className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="text-sm">
                    <strong className="text-gray-900">Attach Context:</strong> 
                    <span className="text-gray-600"> Reference specific templates or compliance requirements when applicable.</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modern Previous Tickets */}
      <motion.div 
        className="mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 rounded-3xl blur-sm opacity-50"></div>
          <div className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gray-50 rounded-xl">
                <MessageSquare className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Recent Support Requests</h2>
                <p className="text-gray-600">
                  Track the status of your previous requests and view expert responses.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {tickets.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex items-center justify-between p-6 border border-gray-100 rounded-2xl hover:border-gray-200 transition-all">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900 text-lg">{ticket.id}</span>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          ticket.status === 'Open' ? 'bg-yellow-100 text-yellow-700' :
                          ticket.status === 'Answered' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {ticket.status}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ticket.priority === 'High' ? 'bg-red-100 text-red-600' :
                          ticket.priority === 'Medium' ? 'bg-amber-100 text-amber-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {ticket.priority}
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          <span>{ticket.category}</span>
                        </div>
                        <span>Created {ticket.createdAt}</span>
                        <span>Response: {ticket.responseTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {ticket.status === 'Answered' && (
                        <div className="p-2 bg-green-50 rounded-full">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                      )}
                      {ticket.status === 'Open' && (
                        <div className="p-2 bg-yellow-50 rounded-full">
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                        </div>
                      )}
                      <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}