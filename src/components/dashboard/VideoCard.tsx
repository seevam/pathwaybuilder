'use client'

import { Card } from '@/components/ui/card'
import { PlayCircle, Sparkles } from 'lucide-react'

interface VideoCardProps {
  title?: string
  description?: string
  videoUrl?: string
  thumbnail?: string
}

// Helper function to convert YouTube URLs to embed format
function getYouTubeEmbedUrl(url: string): string {
  try {
    // If already an embed URL, return as-is
    if (url.includes('/embed/')) {
      return url
    }

    // Extract video ID from various YouTube URL formats
    const urlObj = new URL(url)
    let videoId = ''

    // Handle youtube.com/watch?v=VIDEO_ID
    if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('v')) {
      videoId = urlObj.searchParams.get('v') || ''
    }
    // Handle youtu.be/VIDEO_ID
    else if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1)
    }
    // Handle youtube.com/v/VIDEO_ID
    else if (urlObj.pathname.startsWith('/v/')) {
      videoId = urlObj.pathname.split('/')[2]
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`
    }

    return url
  } catch {
    // If URL parsing fails, return original URL
    return url
  }
}

export function VideoCard({
  title = 'How to Use PathwayBuilder',
  description = 'Learn how to make the most of your PathwayBuilder experience with this quick tutorial.',
  videoUrl = 'https://www.youtube.com/embed/h0vzUf0BmgA', // Placeholder - update with actual product video
  thumbnail
}: VideoCardProps) {
  const embedUrl = getYouTubeEmbedUrl(videoUrl)

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 border-2 border-purple-200">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>

      <p className="text-gray-700 mb-4">
        {description}
      </p>

      <div className="relative w-full rounded-lg overflow-hidden shadow-lg border-2 border-white">
        <div className="relative pb-[56.25%]"> {/* 16:9 aspect ratio */}
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-purple-700 bg-purple-100 px-4 py-2 rounded-lg">
        <PlayCircle className="w-4 h-4" />
        <span className="font-medium">Watch this video to get started quickly</span>
      </div>
    </Card>
  )
}
