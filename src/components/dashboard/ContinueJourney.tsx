// src/components/dashboard/ContinueJourney.tsx
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, ArrowRight, Zap } from 'lucide-react'

interface ContinueJourneyProps {
  moduleTitle: string
  progress: number
  nextActivity: string
  estimatedMinutes: number
  moduleSlug: string
}

export function ContinueJourney({
  moduleTitle,
  progress,
  nextActivity,
  estimatedMinutes,
  moduleSlug
}: ContinueJourneyProps) {
  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 shadow-xl hover:shadow-2xl transition-all">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-500" />
            <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wider">
              Continue Your Journey
            </h3>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            {moduleTitle}
          </h2>
        </div>

        {/* Progress Visualization */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className="text-gray-700">Module Progress</span>
            <span className="text-blue-600">{progress}%</span>
          </div>
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transition-all duration-700 rounded-full"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Next Activity Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Next Up
            </p>
            <p className="text-lg font-bold text-gray-900">
              {nextActivity}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{estimatedMinutes} minutes remaining</span>
            </div>
          </div>

          <Link href={`/${moduleSlug}`}>
            <Button 
              size="lg" 
              className="gap-2 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
