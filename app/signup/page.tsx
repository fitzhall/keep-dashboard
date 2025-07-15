'use client'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { Loader2, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import { getInvitationByToken, acceptInvitation } from '@/lib/invitations'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

function SignupForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const [token] = useState(searchParams.get('token') || '')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [invitation, setInvitation] = useState<any>(null)
  const [error, setError] = useState('')
  
  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    firm: '',
    password: '',
    confirmPassword: ''
  })

  // Validate invitation token on mount
  useEffect(() => {
    async function validateInvitation() {
      if (!token) {
        setError('No invitation code provided')
        setIsLoading(false)
        return
      }

      const result = await getInvitationByToken(token)
      
      if (result.success && result.invitation) {
        setInvitation(result.invitation)
      } else {
        setError('Invalid or expired invitation code')
      }
      
      setIsLoading(false)
    }

    validateInvitation()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!invitation) return
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please ensure both passwords are the same',
        variant: 'destructive'
      })
      return
    }
    
    // Validate password strength
    if (formData.password.length < 8) {
      toast({
        title: 'Password too weak',
        description: 'Password must be at least 8 characters long',
        variant: 'destructive'
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Since we're using mock Auth0, we'll create the user directly in our database
      // In production, this would go through proper Auth0 signup flow
      
      // Create user profile
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          auth0_id: `auth0|${invitation.email.replace('@', '_')}`, // Mock auth0 ID
          email: invitation.email,
          name: formData.name,
          firm: formData.firm,
          role: invitation.role
        })
        .select()
        .single()
      
      if (profileError) throw profileError
      
      // Accept the invitation
      await acceptInvitation(token)
      
      // Initialize user progress records
      if (userProfile) {
        // Initialize course progress
        for (let i = 1; i <= 4; i++) {
          await supabase.from('course_progress').insert({
            user_id: userProfile.id,
            course_id: i,
            status: 'not-started',
            progress: 0
          })
        }
        
        // Initialize SOP progress
        for (let i = 1; i <= 7; i++) {
          await supabase.from('sop_progress').insert({
            user_id: userProfile.id,
            phase: i,
            status: 'not-started'
          })
        }
        
        // Initialize compliance score
        await supabase.from('compliance_scores').insert({
          user_id: userProfile.id,
          score: 0
        })
      }
      
      toast({
        title: 'Account created successfully!',
        description: 'You can now log in with your credentials',
      })
      
      // Redirect to login
      router.push('/login')
      
    } catch (error: any) {
      console.error('Signup error:', error)
      toast({
        title: 'Error creating account',
        description: error.message || 'Please try again later',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Invalid Invitation</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <p className="text-sm text-muted-foreground">
                Please contact your administrator for a new invitation link.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Create Your KEEP Account</CardTitle>
            <CardDescription>
              You've been invited to join as a {invitation?.role}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={invitation?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="firm">Law Firm / Organization</Label>
                <Input
                  id="firm"
                  type="text"
                  placeholder="Smith & Associates"
                  value={formData.firm}
                  onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters long
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  )
}