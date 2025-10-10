// src/components/modules/ActivityList.tsx
'use client'

import { Activity } from '@prisma/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Circle, Lock, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ActivityListProps {
  activities: Activity[]
  completionMap: Map<string, boolean>
  moduleSlug: string
}

export function ActivityList({ activities, completionMap, moduleSlug }: ActivityListProps) {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Activities</h2>
        <div className="text-sm text-gray-500">
          Complete all activities to unlock the module deliverable
        </div>
      </div>

      <div className="space-y-3">
        {activities.map((activity, index) => {
          const isCompleted = completionMap.get(activity.id) || false
          const previousCompleted = index === 0 || completionMap.get(activities[index - 1].id)
          const isLocked = !previousCompleted && !isCompleted

          return (
            <ActivityCard
              key={activity.id}
              activity={activity}
              isCompleted={isCompleted}
              isLocked={isLocked}
              moduleSlug={moduleSlug}
            />
          )
        })}
      </div>
    </div>
  )
}

interface ActivityCardProps {
  activity: Activity
  isCompleted: boolean
  isLocked: boolean
  moduleSlug: string
}

function ActivityCard({ activity, isCompleted, isLocked, moduleSlug }: ActivityCardProps) {
  const activityTypeColors = {
    INTERACTIVE: 'text-blue-600 bg-blue-50',
    REFLECTION: 'text-purple-600 bg-purple-50',
    VIDEO: 'text-green-600 bg-green-50',
    READING: 'text-orange-600 bg-orange-50',
    QUIZ: 'text-pink-600 bg-pink-50',
    ASSESSMENT: 'text-indigo-600 bg-indigo-50',
  }

  const typeColor = activityTypeColors[activity.type] || 'text-gray-600 bg-gray-50'

  return (
    <Card
      className={cn(
        'p-6 transition-all',
        isLocked && 'opacity-60 cursor-not-allowed',
        !isLocked && 'hover:shadow-md cursor-pointer'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Status Icon */}
        <div className="flex-shrink-0 mt-1">
          {isCompleted ? (
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          ) : isLocked ? (
            <Lock className="h-6 w-6 text-gray-400" />
          ) : (
            <Circle className="h-6 w-6 text-gray-400" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {activity.title}
              </h3>
              <p className="text-sm text-gray-600">
                {activity.description}
              </p>
            </div>
            
            {/* Activity Type Badge */}
            <span
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap',
                typeColor
              )}
            >
              {activity.type}
            </span>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{activity.estimatedMinutes} min</span>
            </div>
            {isCompleted && (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                Completed
              </span>
            )}
            {isLocked && (
              <span className="text-gray-500 flex items-center gap-1">
                <Lock className="h-4 w-4" />
                Complete previous activity first
              </span>
            )}
          </div>

          {/* Action Button */}
          {!isLocked && (
            <Link href={`/${moduleSlug}/${activity.slug}`}>
              <Button
                variant={isCompleted ? 'outline' : 'default'}
                size="sm"
                className="gap-2"
              >
                {isCompleted ? 'Review' : 'Start Activity'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
}
