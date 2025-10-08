import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProgressBar } from './ProgressBar'
import { Clock, ArrowRight } from 'lucide-react'

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
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-green-50 shadow-lg">
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            Continue Your Journey
          </h3>
          <h2 className="text-2xl font-bold text-gray-900">
            {moduleTitle}
          </h2>
        </div>

        <ProgressBar
          current={progress}
          total={100}
          label="Module Progress"
          className="py-2"
        />

        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">
              Next Up: {nextActivity}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{estimatedMinutes} minutes remaining</span>
            </div>
          </div>

          <Link href={`/${moduleSlug}`}>
            <Button size="lg" className="gap-2">
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
