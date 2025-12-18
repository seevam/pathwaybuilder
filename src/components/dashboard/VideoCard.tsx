'use client'

import { Card } from '@/components/ui/card'
import { PlayCircle, Sparkles } from 'lucide-react'

interface VideoCardProps {
  title?: string
  description?: string
  videoUrl?: string
  thumbnail?: string
}

export function VideoCard({
  title = 'How to Use PathwayBuilder',
  description = 'Learn how to make the most of your PathwayBuilder experience with this quick tutorial.',
  videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder - update with actual product video
  thumbnail
}: VideoCardProps) {
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
            src={videoUrl}
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
