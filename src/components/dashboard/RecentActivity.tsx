import { Card } from '@/components/ui/card'
import { CheckCircle2, Award, TrendingUp } from 'lucide-react'
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
  // Get unique recent activities (last 5)
  const recentActivities = activities.slice(0, 5)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ASSESSMENT':
        return <Award className="w-5 h-5 text-purple-500" />
      case 'INTERACTIVE':
        return <TrendingUp className="w-5 h-5 text-blue-500" />
      default:
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        
        {recentActivities.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">
            No activities completed yet. Start your first module to get going!
          </p>
        ) : (
          <ul className="space-y-3">
            {recentActivities.map((completion) => (
              <li key={completion.id} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(completion.activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Completed &quot;{completion.activity.title}&quot;
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {completion.completedAt
                      ? formatDistanceToNow(new Date(completion.completedAt), { addSuffix: true })
                      : 'Recently'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}
