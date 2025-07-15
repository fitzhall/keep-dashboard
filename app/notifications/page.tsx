'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Bell, BookOpen, FileText, AlertCircle, MessageSquare, Shield, Check, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useUserProgress } from '@/contexts/UserProgressContext'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface Notification {
  id: string
  type: 'template' | 'training' | 'system' | 'support' | 'compliance'
  title: string
  message: string
  action_url?: string
  is_read: boolean
  created_at: string
}

const notificationIcons = {
  template: FileText,
  training: BookOpen,
  system: AlertCircle,
  support: MessageSquare,
  compliance: Shield,
}

const notificationColors = {
  template: 'text-blue-600 bg-blue-50',
  training: 'text-purple-600 bg-purple-50',
  system: 'text-yellow-600 bg-yellow-50',
  support: 'text-green-600 bg-green-50',
  compliance: 'text-red-600 bg-red-50',
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const { userProfile } = useUserProgress()
  const router = useRouter()

  useEffect(() => {
    if (!userProfile?.id) return

    const loadNotifications = async () => {
      try {
        const query = supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userProfile.id)
          .order('created_at', { ascending: false })

        if (filter === 'unread') {
          query.eq('is_read', false)
        }

        const { data, error } = await query

        if (error) throw error

        setNotifications(data || [])
      } catch (error) {
        console.error('Error loading notifications:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadNotifications()
  }, [userProfile?.id, filter])

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

      setNotifications((prev: Notification[]) =>
        prev.map(n => (n.id === notificationId ? { ...n, is_read: true } : n))
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    if (!userProfile?.id) return

    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userProfile.id)
        .eq('is_read', false)

      setNotifications((prev: Notification[]) => prev.map(n => ({ ...n, is_read: true })))
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      setNotifications((prev: Notification[]) => prev.filter(n => n.id !== notificationId))
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id)
    }
    
    if (notification.action_url) {
      router.push(notification.action_url)
    }
  }

  const unreadCount = notifications.filter((n: Notification) => !n.is_read).length

  return (
    <>
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with new templates, training courses, and system updates.
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
            >
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All notifications
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </Button>
        </div>
      </motion.div>

      {/* Notifications List */}
      {isLoading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">Loading notifications...</div>
          </CardContent>
        </Card>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </h3>
            <p className="text-muted-foreground">
              {filter === 'unread' 
                ? 'All caught up! Check back later for new updates.'
                : 'When you receive notifications, they\'ll appear here.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification, index) => {
            const Icon = notificationIcons[notification.type]
            const colorClass = notificationColors[notification.type]
            
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={cn(
                  "cursor-pointer hover:shadow-md transition-shadow",
                  !notification.is_read && "border-primary"
                )}>
                  <CardContent 
                    className="p-6"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn("p-3 rounded-lg flex-shrink-0", colorClass)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className={cn(
                              "font-medium mb-1",
                              !notification.is_read && "font-semibold"
                            )}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>
                                {formatDistanceToNow(new Date(notification.created_at), { 
                                  addSuffix: true 
                                })}
                              </span>
                              {notification.action_url && (
                                <Badge variant="outline" className="text-xs">
                                  Click to view
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {!notification.is_read && (
                        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </>
  )
}