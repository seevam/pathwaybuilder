'use client'

import { Card } from '@/components/ui/card'
import { CheckCircle2, Circle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface PassionProjectCardProps {
  projectTitle?: string
  progress?: number
  milestonesCompleted?: number
  totalMilestones?: number
  streak?: number
  nextActions?: Array<{ id: string; title: string; completed: boolean }>
}

export function PassionProjectCard({
  projectTitle = 'No active project',
  progress = 0,
  milestonesCompleted = 0,
  totalMilestones = 0,
  streak = 0,
  nextActions = []
}: PassionProjectCardProps) {
  const hasProject = progress > 0

  // Default next actions if none provided
  const defaultActions = [
    { id: '1', title: 'Complete project research', completed: true },
    { id: '2', title: 'Draft project timeline', completed: false },
    { id: '3', title: 'Identify required resources', completed: false },
  ]

  const displayActions = nextActions.length > 0 ? nextActions : (hasProject ? defaultActions : [])

  return (
    <Card className="p-8 bg-white">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-1">Passion Project Dashboard</h3>
        <p className="text-gray-600">{projectTitle}</p>
      </div>

      {hasProject ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Progress Donut Chart */}
          <div className="lg:col-span-2 flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="20"
                />
                {/* Progress circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="20"
                  strokeDasharray={`${(progress / 100) * 502.65} 502.65`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-blue-600">{progress}%</div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>
          </div>

          {/* Metrics and Actions */}
          <div className="lg:col-span-3 space-y-4">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Milestones Completed</div>
                <div className="text-2xl font-bold text-gray-900">
                  {milestonesCompleted}/{totalMilestones}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Progress Streak</div>
                <div className="text-2xl font-bold text-orange-600 flex items-center gap-2">
                  {streak} <span className="text-lg">🔥</span>
                </div>
              </div>
            </div>

            {/* Next Action Items */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="font-semibold text-gray-900 mb-3">Next 3 Action Items</div>
              <div className="space-y-2">
                {displayActions.slice(0, 3).map((action) => (
                  <div
                    key={action.id}
                    className="flex items-start gap-3 p-2 bg-white rounded border border-gray-200"
                  >
                    {action.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`text-sm ${
                        action.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}
                    >
                      {action.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/projects">
              <Button className="w-full">
                View Full Project →
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚀</div>
          <p className="text-gray-600 mb-6">
            You haven&apos;t started a passion project yet.
          </p>
          <Link href="/projects/brainstorm">
            <Button size="lg">
              Start New Project
            </Button>
          </Link>
        </div>
      )}
    </Card>
  )
}
