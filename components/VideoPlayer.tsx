'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Youtube, Video, AlertCircle, Clock, CheckCircle2 } from 'lucide-react'

interface VideoPlayerProps {
  title: string
  videoUrl: string
  videoId?: string
  moduleId?: string
  duration?: number
  description?: string
  onComplete?: () => void
  isCompleted?: boolean
}

export function VideoPlayer({ 
  title, 
  videoUrl,
  videoId,
  moduleId,
  duration, 
  description,
  onComplete,
  isCompleted = false
}: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [markedComplete, setMarkedComplete] = useState(isCompleted)

  // Detect video platform
  const detectVideoType = (url: string): 'youtube' | 'vimeo' | 'loom' | 'other' => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
    if (url.includes('vimeo.com')) return 'vimeo'
    if (url.includes('loom.com')) return 'loom'
    return 'other'
  }

  // Get video ID from URL
  const getVideoId = (url: string, type: string): string | null => {
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

  // Generate embed URL
  const getEmbedUrl = (url: string): string | null => {
    const type = detectVideoType(url)
    const videoId = getVideoId(url, type)
    
    if (!videoId) return null

    switch (type) {
      case 'youtube':
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
      case 'vimeo':
        return `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`
      case 'loom':
        return `https://www.loom.com/embed/${videoId}`
      default:
        return null
    }
  }

  const videoType = detectVideoType(videoUrl)
  const embedUrl = getEmbedUrl(videoUrl)

  // Platform icon and badge
  const getPlatformIcon = () => {
    switch (videoType) {
      case 'youtube':
        return <Youtube className="h-4 w-4" />
      default:
        return <Video className="h-4 w-4" />
    }
  }

  const getPlatformBadge = () => {
    return (
      <Badge variant="outline" className="capitalize">
        {getPlatformIcon()}
        <span className="ml-1">{videoType}</span>
      </Badge>
    )
  }

  if (!embedUrl) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Unable to load video. Please check the URL and try again.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        {/* Video Header */}
        <div className="p-4 border-b">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <h3 className="font-semibold">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
              <div className="flex items-center gap-3 mt-2">
                {getPlatformBadge()}
                {duration && (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {duration} min
                  </span>
                )}
              </div>
            </div>
            {videoId && (
              <Button
                variant={markedComplete ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setMarkedComplete(true)
                  onComplete?.()
                }}
                disabled={markedComplete}
                className="ml-4"
              >
                {markedComplete ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Completed
                  </>
                ) : (
                  <>Mark Complete</>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Video Embed */}
        <div className="relative aspect-video bg-black">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="absolute inset-0" />
              <div className="relative text-white">Loading video...</div>
            </div>
          )}
          
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Alert variant="destructive" className="max-w-sm">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load video. Please try refreshing the page.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              setHasError(true)
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}