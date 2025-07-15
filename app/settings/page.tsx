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
import { Loader2, Shield, Users, FileText, AlertCircle } from 'lucide-react'

export default function SettingsPage() {
  const { userProfile } = useUserProgress()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    firm: userProfile?.firm || ''
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                License Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground">License Type</span>
                  <Badge variant={userProfile?.role === 'admin' ? 'default' : 'secondary'}>
                    {userProfile?.role === 'admin' ? 'Enterprise' : 
                     userProfile?.role === 'attorney' ? 'Professional' : 'Standard'}
                  </Badge>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground">Role</span>
                  <span className="font-medium capitalize">{userProfile?.role || 'User'}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-medium">
                    {userProfile?.created_at 
                      ? new Date(userProfile.created_at).toLocaleDateString()
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium">KEEP Protocol v1.0</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t flex gap-3">
                <Button variant="outline" disabled>
                  <Users className="mr-2 h-4 w-4" />
                  Manage Team
                </Button>
                <Button variant="outline" disabled>
                  <FileText className="mr-2 h-4 w-4" />
                  Billing History
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  )
}