'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useUserProgress } from '@/contexts/UserProgressContext'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Loader2, 
  Shield, 
  Users, 
  FileText, 
  AlertCircle,
  CreditCard,
  Calendar,
  ArrowUpCircle,
  Bell,
  Mail,
  Smartphone,
  Monitor
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'

type LicenseTier = 'Core' | 'Premier' | 'Premier+'

interface LicenseInfo {
  tier: LicenseTier
  annualFee: number
  renewalDate: string
}

const licenseTiers = {
  Core: { price: 12000, features: ['Basic KEEP Framework', 'Standard Templates', 'Email Support'] },
  Premier: { price: 18000, features: ['Full KEEP Framework', 'Premium Templates', 'Priority Support', 'Training Sessions'] },
  'Premier+': { price: 30000, features: ['Full KEEP Framework', 'All Templates', 'Dedicated Support', 'Custom Training', 'White-glove Service'] }
}

export default function SettingsPage() {
  const { userProfile } = useUserProgress()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  
  // Mock license data - in production this would come from the database
  const [licenseInfo] = useState<LicenseInfo>({
    tier: 'Premier',
    annualFee: 18000,
    renewalDate: '2025-01-15'
  })
  
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    firm: userProfile?.firm || ''
  })

  const [notifications, setNotifications] = useState({
    templateUpdates: { email: true, inApp: true },
    frameworkChanges: { email: true, inApp: false },
    trainingOpportunities: { email: false, inApp: true },
    supportResponses: { email: true, sms: true }
  })

  // Update form when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        firm: userProfile.firm || ''
      })
    }
  }, [userProfile])

  const handleSave = async () => {
    if (!userProfile?.id) return
    
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: formData.name,
          firm: formData.firm
        })
        .eq('id', userProfile.id)
      
      if (error) throw error
      
      toast({
        title: 'Settings saved',
        description: 'Your profile has been updated successfully.'
      })
      
      // Reload the page to get updated data
      window.location.reload()
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: 'Error saving settings',
        description: 'Please try again later.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationUpdate = (category: string, type: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [type]: value
      }
    }))
    
    // In production, this would save to the database
    toast({
      title: 'Notification preferences updated',
      description: 'Your notification settings have been saved.'
    })
  }

  const getUpgradeTiers = () => {
    const currentTierIndex = Object.keys(licenseTiers).indexOf(licenseInfo.tier)
    return Object.entries(licenseTiers).slice(currentTierIndex + 1)
  }

  return (
    <>
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </motion.div>

      <div className="max-w-4xl">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>
              <div>
                <Label htmlFor="firm">Law Firm</Label>
                <Input
                  id="firm"
                  type="text"
                  value={formData.firm}
                  onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                  placeholder="Enter your firm name"
                />
              </div>
              <Button 
                onClick={handleSave} 
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Firm Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Firm Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="territory">Territory (Geographic Exclusivity)</Label>
                <Select defaultValue="northern-ca">
                  <SelectTrigger>
                    <SelectValue placeholder="Select territory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="northern-ca">Northern California</SelectItem>
                    <SelectItem value="southern-ca">Southern California</SelectItem>
                    <SelectItem value="ny-metro">New York Metro</SelectItem>
                    <SelectItem value="texas">Texas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Founding Member Benefit</AlertTitle>
                <AlertDescription>
                  Territory exclusivity is granted to Founding 10 members only.
                  Contact support to verify your exclusive territory rights.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </motion.div>

        {/* License Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                License Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-muted-foreground">Current License</span>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={licenseInfo.tier === 'Premier+' ? 'default' : licenseInfo.tier === 'Premier' ? 'secondary' : 'outline'}
                      className="font-semibold"
                    >
                      {licenseInfo.tier}
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-muted-foreground">Annual Fee</span>
                  <span className="font-semibold text-lg">
                    ${licenseInfo.annualFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-muted-foreground">Renewal Date</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {new Date(licenseInfo.renewalDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                
                {/* Upgrade Options */}
                {getUpgradeTiers().length > 0 && (
                  <div className="pt-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <ArrowUpCircle className="h-4 w-4" />
                      Upgrade Options
                    </h4>
                    <div className="space-y-3">
                      {getUpgradeTiers().map(([tier, info]) => (
                        <div key={tier} className="border rounded-lg p-4 hover:border-primary transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-semibold flex items-center gap-2">
                                {tier}
                                {tier === 'Premier+' && <Badge variant="default" className="text-xs">Best Value</Badge>}
                              </h5>
                              <p className="text-sm text-muted-foreground">
                                ${info.price.toLocaleString()}/year
                              </p>
                            </div>
                            <Button size="sm" variant="outline">
                              Upgrade
                            </Button>
                          </div>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {info.features.slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-1">
                                <span className="text-primary">•</span> {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t flex gap-3">
                <Button variant="outline">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Update Payment
                </Button>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Billing History
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Template Updates */}
                <div className="space-y-3">
                  <h4 className="font-medium">Template Updates</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Email notifications</span>
                    </div>
                    <Switch
                      checked={notifications.templateUpdates.email}
                      onCheckedChange={(checked) => handleNotificationUpdate('templateUpdates', 'email', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">In-App notifications</span>
                    </div>
                    <Switch
                      checked={notifications.templateUpdates.inApp}
                      onCheckedChange={(checked) => handleNotificationUpdate('templateUpdates', 'inApp', checked)}
                    />
                  </div>
                </div>

                {/* Framework Changes */}
                <div className="space-y-3 pt-3 border-t">
                  <h4 className="font-medium">Framework Changes</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Email notifications only</span>
                    </div>
                    <Switch
                      checked={notifications.frameworkChanges.email}
                      onCheckedChange={(checked) => handleNotificationUpdate('frameworkChanges', 'email', checked)}
                    />
                  </div>
                </div>

                {/* Training Opportunities */}
                <div className="space-y-3 pt-3 border-t">
                  <h4 className="font-medium">Training Opportunities</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">In-App notifications only</span>
                    </div>
                    <Switch
                      checked={notifications.trainingOpportunities.inApp}
                      onCheckedChange={(checked) => handleNotificationUpdate('trainingOpportunities', 'inApp', checked)}
                    />
                  </div>
                </div>

                {/* Support Responses */}
                <div className="space-y-3 pt-3 border-t">
                  <h4 className="font-medium">Support Responses</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Email notifications</span>
                    </div>
                    <Switch
                      checked={notifications.supportResponses.email}
                      onCheckedChange={(checked) => handleNotificationUpdate('supportResponses', 'email', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">SMS notifications</span>
                    </div>
                    <Switch
                      checked={notifications.supportResponses.sms}
                      onCheckedChange={(checked) => handleNotificationUpdate('supportResponses', 'sms', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  )
}