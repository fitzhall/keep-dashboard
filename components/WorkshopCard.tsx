'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign, 
  Award,
  Video,
  Building,
  Globe
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Workshop } from '@/lib/workshops'

interface WorkshopCardProps {
  workshop: Workshop
  onRegister: (workshop: Workshop) => void
  isRegistered?: boolean
}

export function WorkshopCard({ workshop, onRegister, isRegistered = false }: WorkshopCardProps) {
  const startDate = new Date(workshop.start_datetime)
  const endDate = new Date(workshop.end_datetime)
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  const getWorkshopIcon = () => {
    switch (workshop.workshop_type) {
      case 'webinar':
        return <Video className="h-4 w-4" />
      case 'in-person':
        return <Building className="h-4 w-4" />
      case 'hybrid':
        return <Globe className="h-4 w-4" />
    }
  }

  const getAvailabilityColor = () => {
    switch (workshop.availability_status) {
      case 'full':
        return 'text-red-600'
      case 'filling':
        return 'text-amber-600'
      default:
        return 'text-green-600'
    }
  }

  const isUpcoming = startDate > new Date()

  return (
    <Card className={cn(
      "h-full flex flex-col",
      workshop.is_featured && "border-primary"
    )}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg">{workshop.title}</CardTitle>
            {workshop.is_featured && (
              <Badge variant="default" className="mt-1">Featured</Badge>
            )}
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            {getWorkshopIcon()}
            {workshop.workshop_type}
          </Badge>
        </div>
        <CardDescription className="mt-2">
          {workshop.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(startDate)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{formatTime(startDate)} - {formatTime(endDate)}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{workshop.location || 'Online'}</span>
          </div>

          {/* Instructor */}
          {workshop.instructor_name && (
            <div className="text-sm">
              <span className="text-muted-foreground">Instructor: </span>
              <span className="font-medium">{workshop.instructor_name}</span>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            {/* Attendees */}
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className={cn(getAvailabilityColor())}>
                {workshop.available_seats} / {workshop.max_attendees} seats
              </span>
            </div>

            {/* CLE Credits */}
            {workshop.cle_credits > 0 && (
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span>{workshop.cle_credits} CLE</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 text-sm font-medium">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>{workshop.price === 0 ? 'Free' : `$${workshop.price}`}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full mt-4"
          onClick={() => onRegister(workshop)}
          disabled={!isUpcoming || workshop.availability_status === 'full' || isRegistered}
          variant={isRegistered ? "secondary" : "default"}
        >
          {!isUpcoming ? 'Workshop Ended' :
           workshop.availability_status === 'full' ? 'Workshop Full' :
           isRegistered ? 'Registered' :
           'Register Now'}
        </Button>
      </CardContent>
    </Card>
  )
}