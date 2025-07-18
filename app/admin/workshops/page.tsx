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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  Clock,
  Loader2,
  AlertCircle,
  MapPin,
  DollarSign,
  Award,
  Video,
  Building,
  Globe,
  Check,
  X
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import type { Workshop, WorkshopRegistration } from '@/lib/workshops'

// Extended type for admin view with joined data
interface WorkshopRegistrationWithUser extends WorkshopRegistration {
  user?: {
    id: string
    name: string
    email: string
  }
  workshop?: Workshop
}

interface WorkshopFormData {
  title: string
  description: string
  workshop_type: 'webinar' | 'in-person' | 'hybrid'
  category: string
  instructor_name: string
  instructor_bio: string
  start_datetime: string
  end_datetime: string
  location: string
  meeting_url: string
  meeting_password: string
  max_attendees: number
  price: number
  cle_credits: number
  materials_url: string
  is_featured: boolean
}

export default function AdminWorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [registrations, setRegistrations] = useState<WorkshopRegistrationWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null)
  const [activeTab, setActiveTab] = useState('upcoming')
  const { toast } = useToast()

  const [formData, setFormData] = useState<WorkshopFormData>({
    title: '',
    description: '',
    workshop_type: 'webinar',
    category: 'estate-planning',
    instructor_name: '',
    instructor_bio: '',
    start_datetime: '',
    end_datetime: '',
    location: 'Online',
    meeting_url: '',
    meeting_password: '',
    max_attendees: 50,
    price: 0,
    cle_credits: 0,
    materials_url: '',
    is_featured: false
  })

  useEffect(() => {
    loadWorkshops()
    loadRegistrations()
  }, [])

  const loadWorkshops = async () => {
    try {
      const { data, error } = await supabase
        .from('workshops')
        .select('*')
        .order('start_datetime', { ascending: false })

      if (error) throw error
      setWorkshops(data || [])
    } catch (error) {
      console.error('Error loading workshops:', error)
      toast({
        title: "Error",
        description: "Failed to load workshops",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const loadRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('workshop_registrations')
        .select(`
          *,
          workshop:workshops(*),
          user:user_profiles(*)
        `)
        .order('registered_at', { ascending: false })

      if (error) throw error
      setRegistrations(data || [])
    } catch (error) {
      console.error('Error loading registrations:', error)
    }
  }

  const handleAddWorkshop = async () => {
    try {
      const { error } = await supabase
        .from('workshops')
        .insert([{
          ...formData,
          timezone: 'America/New_York'
        }])

      if (error) throw error

      toast({
        title: "Success",
        description: "Workshop created successfully"
      })

      setShowAddDialog(false)
      resetForm()
      loadWorkshops()
    } catch (error) {
      console.error('Error adding workshop:', error)
      toast({
        title: "Error",
        description: "Failed to create workshop",
        variant: "destructive"
      })
    }
  }

  const handleUpdateWorkshop = async () => {
    if (!selectedWorkshop) return

    try {
      const { error } = await supabase
        .from('workshops')
        .update(formData)
        .eq('id', selectedWorkshop.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Workshop updated successfully"
      })

      setShowEditDialog(false)
      resetForm()
      loadWorkshops()
    } catch (error) {
      console.error('Error updating workshop:', error)
      toast({
        title: "Error",
        description: "Failed to update workshop",
        variant: "destructive"
      })
    }
  }

  const handleDeleteWorkshop = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workshop?')) return

    try {
      const { error } = await supabase
        .from('workshops')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Workshop deleted successfully"
      })

      loadWorkshops()
    } catch (error) {
      console.error('Error deleting workshop:', error)
      toast({
        title: "Error",
        description: "Failed to delete workshop",
        variant: "destructive"
      })
    }
  }

  const handleUpdateRegistration = async (registrationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('workshop_registrations')
        .update({ registration_status: status })
        .eq('id', registrationId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Registration updated successfully"
      })

      loadRegistrations()
    } catch (error) {
      console.error('Error updating registration:', error)
      toast({
        title: "Error",
        description: "Failed to update registration",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      workshop_type: 'webinar',
      category: 'estate-planning',
      instructor_name: '',
      instructor_bio: '',
      start_datetime: '',
      end_datetime: '',
      location: 'Online',
      meeting_url: '',
      meeting_password: '',
      max_attendees: 50,
      price: 0,
      cle_credits: 0,
      materials_url: '',
      is_featured: false
    })
    setSelectedWorkshop(null)
  }

  const openEditDialog = (workshop: Workshop) => {
    setSelectedWorkshop(workshop)
    setFormData({
      title: workshop.title,
      description: workshop.description || '',
      workshop_type: workshop.workshop_type,
      category: workshop.category,
      instructor_name: workshop.instructor_name || '',
      instructor_bio: workshop.instructor_bio || '',
      start_datetime: new Date(workshop.start_datetime).toISOString().slice(0, 16),
      end_datetime: new Date(workshop.end_datetime).toISOString().slice(0, 16),
      location: workshop.location || 'Online',
      meeting_url: workshop.meeting_url || '',
      meeting_password: workshop.meeting_password || '',
      max_attendees: workshop.max_attendees,
      price: workshop.price,
      cle_credits: workshop.cle_credits,
      materials_url: workshop.materials_url || '',
      is_featured: workshop.is_featured
    })
    setShowEditDialog(true)
  }

  const upcomingWorkshops = workshops.filter(w => new Date(w.start_datetime) > new Date())
  const pastWorkshops = workshops.filter(w => new Date(w.start_datetime) <= new Date())

  const getWorkshopIcon = (type: string) => {
    switch (type) {
      case 'webinar': return <Video className="h-4 w-4" />
      case 'in-person': return <Building className="h-4 w-4" />
      case 'hybrid': return <Globe className="h-4 w-4" />
      default: return <Calendar className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
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
        <h1 className="text-3xl font-bold tracking-tight">Workshop Management</h1>
        <p className="text-muted-foreground">
          Create and manage workshops, webinars, and training events.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workshops</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workshops.length}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingWorkshops.length} upcoming
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrations.length}</div>
            <p className="text-xs text-muted-foreground">
              {registrations.filter(r => r.registration_status === 'registered').length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${registrations
                .filter(r => r.payment_status === 'paid')
                .reduce((sum, r) => sum + r.payment_amount, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              From paid registrations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CLE Credits</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workshops.reduce((sum, w) => sum + w.cle_credits, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total credits available
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
          </TabsList>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Workshop
          </Button>
        </div>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Workshops</CardTitle>
              <CardDescription>
                Manage upcoming workshops and events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workshop</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Attendees</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingWorkshops.map((workshop) => (
                    <TableRow key={workshop.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{workshop.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {workshop.category} • {workshop.cle_credits} CLE
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getWorkshopIcon(workshop.workshop_type)}
                          <span className="text-sm">{workshop.workshop_type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(workshop.start_datetime).toLocaleDateString()}</div>
                          <div className="text-muted-foreground">
                            {new Date(workshop.start_datetime).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{workshop.instructor_name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{workshop.current_attendees} / {workshop.max_attendees}</div>
                          <Progress 
                            value={(workshop.current_attendees / workshop.max_attendees) * 100} 
                            className="w-20 h-2 mt-1"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        {workshop.price === 0 ? 'Free' : `$${workshop.price}`}
                      </TableCell>
                      <TableCell>
                        {workshop.is_featured && (
                          <Badge variant="default" className="mr-1">Featured</Badge>
                        )}
                        <Badge variant={workshop.is_active ? "outline" : "secondary"}>
                          {workshop.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(workshop)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteWorkshop(workshop.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle>Past Workshops</CardTitle>
              <CardDescription>
                View completed workshops and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workshop</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Attendees</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Recording</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastWorkshops.map((workshop) => {
                    const workshopRegs = registrations.filter(r => r.workshop_id === workshop.id)
                    const revenue = workshopRegs
                      .filter(r => r.payment_status === 'paid')
                      .reduce((sum, r) => sum + r.payment_amount, 0)
                    
                    return (
                      <TableRow key={workshop.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{workshop.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {workshop.instructor_name}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(workshop.start_datetime).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {workshopRegs.filter(r => r.registration_status === 'attended').length} / {workshop.current_attendees}
                        </TableCell>
                        <TableCell>${revenue.toLocaleString()}</TableCell>
                        <TableCell>
                          {workshop.recording_url ? (
                            <Badge variant="outline">Available</Badge>
                          ) : (
                            <Badge variant="secondary">Not recorded</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registrations">
          <Card>
            <CardHeader>
              <CardTitle>Workshop Registrations</CardTitle>
              <CardDescription>
                Manage attendee registrations and payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Attendee</TableHead>
                    <TableHead>Workshop</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {registration.user?.name || 'Unknown User'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {registration.user?.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{registration.workshop?.title}</div>
                          <div className="text-muted-foreground">
                            {registration.workshop && new Date(registration.workshop.start_datetime).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(registration.registered_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          registration.registration_status === 'attended' ? 'default' :
                          registration.registration_status === 'registered' ? 'outline' :
                          registration.registration_status === 'cancelled' ? 'secondary' :
                          'destructive'
                        }>
                          {registration.registration_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          registration.payment_status === 'paid' ? 'default' :
                          registration.payment_status === 'free' ? 'outline' :
                          'secondary'
                        }>
                          {registration.payment_status === 'free' ? 'Free' : 
                           registration.payment_status === 'paid' ? `$${registration.payment_amount}` :
                           'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {registration.registration_status === 'registered' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateRegistration(registration.id, 'attended')}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          {registration.registration_status !== 'cancelled' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateRegistration(registration.id, 'cancelled')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Workshop Dialog */}
      <Dialog open={showAddDialog || showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false)
          setShowEditDialog(false)
          resetForm()
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {showEditDialog ? 'Edit Workshop' : 'Add New Workshop'}
            </DialogTitle>
            <DialogDescription>
              {showEditDialog ? 'Update workshop details' : 'Create a new workshop or training event'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Workshop title"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Workshop description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="workshop_type">Type</Label>
                <Select
                  value={formData.workshop_type}
                  onValueChange={(value: any) => setFormData({ ...formData, workshop_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="estate-planning">Estate Planning</SelectItem>
                    <SelectItem value="bitcoin-basics">Bitcoin Basics</SelectItem>
                    <SelectItem value="advanced-custody">Advanced Custody</SelectItem>
                    <SelectItem value="legal-compliance">Legal Compliance</SelectItem>
                    <SelectItem value="practice-management">Practice Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_datetime">Start Date & Time</Label>
                <Input
                  id="start_datetime"
                  type="datetime-local"
                  value={formData.start_datetime}
                  onChange={(e) => setFormData({ ...formData, start_datetime: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="end_datetime">End Date & Time</Label>
                <Input
                  id="end_datetime"
                  type="datetime-local"
                  value={formData.end_datetime}
                  onChange={(e) => setFormData({ ...formData, end_datetime: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="instructor_name">Instructor Name</Label>
              <Input
                id="instructor_name"
                value={formData.instructor_name}
                onChange={(e) => setFormData({ ...formData, instructor_name: e.target.value })}
                placeholder="Instructor name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Online or physical address"
              />
            </div>

            {(formData.workshop_type === 'webinar' || formData.workshop_type === 'hybrid') && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="meeting_url">Meeting URL</Label>
                  <Input
                    id="meeting_url"
                    value={formData.meeting_url}
                    onChange={(e) => setFormData({ ...formData, meeting_url: e.target.value })}
                    placeholder="Zoom, Teams, or other meeting link"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="meeting_password">Meeting Password (Optional)</Label>
                  <Input
                    id="meeting_password"
                    value={formData.meeting_password}
                    onChange={(e) => setFormData({ ...formData, meeting_password: e.target.value })}
                    placeholder="Meeting password if required"
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="max_attendees">Max Attendees</Label>
                <Input
                  id="max_attendees"
                  type="number"
                  value={formData.max_attendees}
                  onChange={(e) => setFormData({ ...formData, max_attendees: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cle_credits">CLE Credits</Label>
                <Input
                  id="cle_credits"
                  type="number"
                  step="0.5"
                  value={formData.cle_credits}
                  onChange={(e) => setFormData({ ...formData, cle_credits: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="is_featured">Feature this workshop</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddDialog(false)
              setShowEditDialog(false)
              resetForm()
            }}>
              Cancel
            </Button>
            <Button onClick={showEditDialog ? handleUpdateWorkshop : handleAddWorkshop}>
              {showEditDialog ? 'Update' : 'Create'} Workshop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Add Progress component import at the top
import { Progress } from '@/components/ui/progress'