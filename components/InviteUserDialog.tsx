'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { UserPlus } from 'lucide-react'
import { inviteUser } from '@/lib/invitations'
import { useUserProgress } from '@/contexts/UserProgressContext'

interface InviteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteUserDialog({ open, onOpenChange }: InviteUserDialogProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'attorney' | 'paralegal' | 'admin'>('attorney')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { userProfile } = useUserProgress()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userProfile?.id) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to invite users',
        variant: 'destructive',
      })
      return
    }
    
    setIsSubmitting(true)

    try {
      const result = await inviteUser({
        email,
        role,
        invitedBy: userProfile.id
      })
      
      if (result.success) {
        toast({
          title: 'Invitation created',
          description: `Invitation link: ${result.inviteLink}`,
        })
        
        // In production, you would send an email here
        // For now, you can copy the invite link from the toast
        
        // Reset form
        setEmail('')
        setRole('attorney')
        onOpenChange(false)
      } else {
        throw new Error('Failed to create invitation')
      }
      
    } catch (error) {
      toast({
        title: 'Error creating invitation',
        description: 'Please check that you have admin permissions',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite New User
          </DialogTitle>
          <DialogDescription>
            Send an invitation to a new user to join the KEEP platform.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value: any) => setRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attorney">Attorney</SelectItem>
                  <SelectItem value="paralegal">Paralegal</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}