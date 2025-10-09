'use client'

import { Card } from '@/components/ui/card'
import { FileText, MessageSquare, Image } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { ProjectCheckIn, ProjectDocument } from '@prisma/client'

interface RecentActivityProps {
  checkIns: ProjectCheckIn[]
  documents: ProjectDocument[]
}

export function RecentActivity({ checkIns, documents }: RecentActivityProps) {
  // Combine and sort activities by date
  const activities: Array<{
    id: string
    type: 'checkin' | 'document'
    date: Date
    title: string
    icon: any
  }> = [
    ...checkIns.map(c => ({
      id: c.id,
      type: 'checkin' as const,
      date: c.createdAt,
      title: `Check-in: ${c.accomplishments.substring(0, 50)}...`,
      icon: MessageSquare,
    })),
    ...documents.map(d => ({
      id: d.id,
      type: 'document' as const,
      date: d.createdAt,
      title: `Uploaded: ${d.title}`,
      icon: d.type === 'PHOTO' ? Image : FileText,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10)

  if (activities.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="text-center py-8 text-gray-500">
          <p>No activity yet</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      <div className="space-y-3">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-purple-100 rounded-lg">
                <Icon className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
