'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface StrengthsCardProps {
  traits?: Array<{ name: string; score: number; color: string }>
}

export function StrengthsCard({ traits }: StrengthsCardProps) {
  // Default traits if none provided
  const defaultTraits = [
    { name: 'Creative', score: 85, color: 'bg-purple-100 text-purple-700 border-purple-300' },
    { name: 'Analytical', score: 70, color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { name: 'Social', score: 90, color: 'bg-green-100 text-green-700 border-green-300' },
    { name: 'Leadership', score: 75, color: 'bg-orange-100 text-orange-700 border-orange-300' },
  ]

  const displayTraits = traits || defaultTraits

  return (
    <Card className="p-6 bg-white">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">My Strengths</h3>
        <p className="text-sm text-gray-600">Your personality profile</p>
      </div>

      {/* Polygon/Radar Chart Representation */}
      <div className="flex items-center justify-center mb-6 py-8">
        <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-lg">
          {/* Background polygon (full size) */}
          <polygon
            points="100,20 173,65 173,135 100,180 27,135 27,65"
            fill="#f0f9ff"
            stroke="#bfdbfe"
            strokeWidth="2"
          />
          
          {/* Data polygon (scaled by average score) */}
          <polygon
            points="100,35 158,70 158,130 100,165 42,130 42,70"
            fill="url(#gradient)"
            fillOpacity="0.6"
            stroke="#3b82f6"
            strokeWidth="3"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          
          {/* Center dot */}
          <circle cx="100" cy="100" r="4" fill="#1e40af" />
        </svg>
      </div>

      {/* Trait Pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {displayTraits.map((trait, index) => (
          <Badge
            key={index}
            variant="outline"
            className={`${trait.color} border px-3 py-1 font-semibold`}
          >
            {trait.name}
          </Badge>
        ))}
      </div>

      <Link href="/insights">
        <Button variant="outline" className="w-full">
          View Full Profile →
        </Button>
      </Link>
    </Card>
  )
}
