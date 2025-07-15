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
  Video, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink,
  Clock,
  Loader2,
  AlertCircle,
  Youtube,
  Film
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useUserProgress } from '@/contexts/UserProgressContext'

// CLE courses mapping
const cleCourses = [
  { id: 1, name: 'Foundation Training' },
  { id: 2, name: 'Advanced Strategies' },
  { id: 3, name: 'Ethics & Compliance' },
  { id: 4, name: 'Case Studies' }
]

// KEEP modules mapping
const keepModules = [
  { id: 'keep-101', name: 'KEEP Protocol Fundamentals' },
  { id: 'sop-mastery', name: 'Mastering the 10-Phase SOP' },
  { id: 'tools-tech', name: 'Tools & Technology' },
  { id: 'compliance-docs', name: 'Documentation & Compliance' },
  { id: 'advanced-scenarios', name: 'Advanced Client Scenarios' }
]

interface TrainingVideo {
  id: string
  title: string
  description: string | null
  video_url: string
  video_type: 'youtube' | 'vimeo' | 'loom' | 'other' | null
  duration_minutes: number | null
  category: 'cle' | 'keep'
  module_id: string | null
  course_id: number | null
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function AdminTrainingPage() {
  const [videos, setVideos] = useState<TrainingVideo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingVideo, setEditingVideo] = useState<TrainingVideo | null>(null)
  const [activeTab, setActiveTab] = useState<'cle' | 'keep'>('cle')
  
  const { userProfile } = useUserProgress()
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState<{
    title: string
    description: string
    video_url: string
    video_type: 'youtube' | 'vimeo' | 'loom' | 'other'
    duration_minutes: string
    category: 'cle' | 'keep'
    module_id: string
    course_id: string
    order_index: string
  }>({
    title: '',
    description: '',
    video_url: '',
    video_type: 'youtube',
    duration_minutes: '',
    category: 'cle',
    module_id: '',
    course_id: '',
    order_index: '0'
  })

  useEffect(() => {
    loadVideos()
  }, [])

  async function loadVideos() {
    try {
      const { data, error } = await supabase
        .from('training_videos')
        .select('*')
        .order('category')
        .order('order_index')
        .order('created_at', { ascending: false })

      if (error) throw error
      setVideos(data || [])
    } catch (error) {
      console.error('Error loading videos:', error)
      toast({
        title: 'Error loading videos',
        description: 'Could not fetch training videos',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  function detectVideoType(url: string): 'youtube' | 'vimeo' | 'loom' | 'other' {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
    if (url.includes('vimeo.com')) return 'vimeo'
    if (url.includes('loom.com')) return 'loom'
    return 'other'
  }

  function getVideoId(url: string, type: string): string | null {
    switch (type) {
      case 'youtube':
        const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
        return ytMatch ? ytMatch[1] : null
      case 'vimeo':
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
        return vimeoMatch ? vimeoMatch[1] : null
      case 'loom':
        const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/)
        return loomMatch ? loomMatch[1] : null
      default:
        return null
    }
  }

  function getEmbedUrl(url: string, type: string): string {
    const videoId = getVideoId(url, type)
    if (!videoId) return url

    switch (type) {
      case 'youtube':
        return `https://www.youtube.com/embed/${videoId}`
      case 'vimeo':
        return `https://player.vimeo.com/video/${videoId}`
      case 'loom':
        return `https://www.loom.com/embed/${videoId}`
      default:
        return url
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userProfile?.id) return

    try {
      const videoType = detectVideoType(formData.video_url)
      
      const videoData = {
        title: formData.title,
        description: formData.description || null,
        video_url: formData.video_url,
        video_type: videoType,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
        category: formData.category,
        module_id: formData.category === 'keep' ? formData.module_id : null,
        course_id: formData.category === 'cle' ? parseInt(formData.course_id) : null,
        order_index: parseInt(formData.order_index) || 0,
        is_active: true,
        created_by: userProfile.id
      }

      if (editingVideo) {
        const { error } = await supabase
          .from('training_videos')
          .update(videoData)
          .eq('id', editingVideo.id)

        if (error) throw error
        
        toast({
          title: 'Video updated',
          description: 'Training video has been updated successfully'
        })
      } else {
        const { error } = await supabase
          .from('training_videos')
          .insert(videoData)

        if (error) throw error
        
        toast({
          title: 'Video added',
          description: 'New training video has been added successfully'
        })
      }

      setShowDialog(false)
      resetForm()
      loadVideos()
    } catch (error) {
      console.error('Error saving video:', error)
      toast({
        title: 'Error saving video',
        description: 'Please try again',
        variant: 'destructive'
      })
    }
  }

  const handleEdit = (video: TrainingVideo) => {
    setEditingVideo(video)
    setFormData({
      title: video.title,
      description: video.description || '',
      video_url: video.video_url,
      video_type: video.video_type || 'youtube',
      duration_minutes: video.duration_minutes?.toString() || '',
      category: video.category,
      module_id: video.module_id || '',
      course_id: video.course_id?.toString() || '',
      order_index: video.order_index.toString()
    })
    setShowDialog(true)
  }

  const handleDelete = async (video: TrainingVideo) => {
    if (!confirm('Are you sure you want to delete this video?')) return

    try {
      const { error } = await supabase
        .from('training_videos')
        .update({ is_active: false })
        .eq('id', video.id)

      if (error) throw error

      toast({
        title: 'Video deleted',
        description: 'Training video has been removed'
      })
      
      loadVideos()
    } catch (error) {
      console.error('Error deleting video:', error)
      toast({
        title: 'Error deleting video',
        description: 'Please try again',
        variant: 'destructive'
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      video_url: '',
      video_type: 'youtube',
      duration_minutes: '',
      category: activeTab,
      module_id: '',
      course_id: '',
      order_index: '0'
    })
    setEditingVideo(null)
  }

  const filteredVideos = videos.filter(v => v.category === activeTab && v.is_active)

  return (
    <>
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Training Video Management</h1>
        <p className="text-muted-foreground">
          Upload and manage training videos for CLE and KEEP modules.
        </p>
      </motion.div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Supported platforms:</strong> YouTube, Vimeo, and Loom. Simply paste the video URL and we'll handle the embedding.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'cle' | 'keep')}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="cle">CLE Training Videos</TabsTrigger>
            <TabsTrigger value="keep">KEEP Training Videos</TabsTrigger>
          </TabsList>
          
          <Button onClick={() => {
            resetForm()
            setFormData(prev => ({ ...prev, category: activeTab }))
            setShowDialog(true)
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Video
          </Button>
        </div>

        <TabsContent value="cle">
          <Card>
            <CardHeader>
              <CardTitle>CLE Training Videos</CardTitle>
              <CardDescription>
                Videos for continuing legal education courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredVideos.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVideos.map((video) => (
                      <TableRow key={video.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{video.title}</p>
                            {video.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {video.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {video.course_id && 
                            cleCourses.find(c => c.id === video.course_id)?.name
                          }
                        </TableCell>
                        <TableCell>
                          {video.duration_minutes && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {video.duration_minutes} min
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {video.video_type}
                          </Badge>
                        </TableCell>
                        <TableCell>{video.order_index}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => window.open(video.video_url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(video)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(video)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Video className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No CLE videos yet</p>
                  <p className="text-sm">Click "Add Video" to upload your first video</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keep">
          <Card>
            <CardHeader>
              <CardTitle>KEEP Training Videos</CardTitle>
              <CardDescription>
                Videos for KEEP Protocol specific training modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredVideos.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVideos.map((video) => (
                      <TableRow key={video.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{video.title}</p>
                            {video.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {video.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {video.module_id && 
                            keepModules.find(m => m.id === video.module_id)?.name
                          }
                        </TableCell>
                        <TableCell>
                          {video.duration_minutes && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {video.duration_minutes} min
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {video.video_type}
                          </Badge>
                        </TableCell>
                        <TableCell>{video.order_index}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => window.open(video.video_url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(video)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(video)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Video className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No KEEP videos yet</p>
                  <p className="text-sm">Click "Add Video" to upload your first video</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Video Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingVideo ? 'Edit Training Video' : 'Add Training Video'}
            </DialogTitle>
            <DialogDescription>
              Add a new training video from YouTube, Vimeo, or Loom.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Video Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Introduction to KEEP Protocol"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="video_url">Video URL</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Paste the full URL from YouTube, Vimeo, or Loom
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the video content..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value: 'cle' | 'keep') => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cle">CLE Training</SelectItem>
                      <SelectItem value="keep">KEEP Training</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                    placeholder="45"
                  />
                </div>
              </div>

              {formData.category === 'cle' && (
                <div className="grid gap-2">
                  <Label htmlFor="course">Course</Label>
                  <Select 
                    value={formData.course_id} 
                    onValueChange={(value) => setFormData({ ...formData, course_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {cleCourses.map(course => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.category === 'keep' && (
                <div className="grid gap-2">
                  <Label htmlFor="module">Module</Label>
                  <Select 
                    value={formData.module_id} 
                    onValueChange={(value) => setFormData({ ...formData, module_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a module" />
                    </SelectTrigger>
                    <SelectContent>
                      {keepModules.map(module => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: e.target.value })}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setShowDialog(false)
                resetForm()
              }}>
                Cancel
              </Button>
              <Button type="submit">
                {editingVideo ? 'Update Video' : 'Add Video'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}