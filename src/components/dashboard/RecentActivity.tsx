// src/components/dashboard/RecentActivity.tsx
'use client'

import { Card } from '@/components/ui/card'
import { CheckCircle2, Award, TrendingUp, BookOpen } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Activity {
  id: string
  completed: boolean
  completedAt: Date | null
  activity: {
    id: string
    title: string
    type: string
  }
}

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const recentActivities = activities.slice(0, 5)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ASSESSMENT':
        return <Award className="w-5 h-5 text-purple-500" />
      case 'INTERACTIVE':
        return <TrendingUp className="w-5 h-5 text-blue-500" />
      case 'READING':
        return <BookOpen className="w-5 h-5 text-green-500" />
      default:
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'ASSESSMENT':
        return 'bg-purple-50 border-purple-200'
      case 'INTERACTIVE':
        return 'bg-blue-50 border-blue-200'
      case 'READING':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <Card className="p-8 border-2 border-gray-100 shadow-lg">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-500" />
            Recent Activity
          </h2>
          <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Last {recentActivities.length}
          </span>
        </div>
        
        {recentActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚀</div>
            <p className="text-gray-600 font-medium">
              No activities completed yet
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Start your first module to begin your journey!
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {recentActivities.map((completion) => (
              <li
                key={completion.id}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all hover:shadow-md ${getActivityColor(
                  completion.activity.type
                )}`}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {getActivityIcon(completion.activity.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 mb-1">
                    {completion.activity.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                      Completed
                    </span>
                    <span className="text-xs text-gray-500">
                      {completion.completedAt
                        ? formatDistanceToNow(new Date(completion.completedAt), {
                            addSuffix: true,
                          })
                        : 'Recently'}
                    </span>
                  </div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}
