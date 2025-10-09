'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, Circle, Clock } from 'lucide-react'
import Link from 'next/link'
import type { Milestone } from '@prisma/client'

interface MilestoneTimelineProps {
  milestones: Milestone[]
  projectId: string
}

export function MilestoneTimeline({ milestones, projectId }: MilestoneTimelineProps) {
  if (milestones.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Milestone Timeline</h2>
        <div className="text-center py-8 text-gray-500">
          <p className="mb-4">No milestones yet</p>
          <Link href={`/projects/${projectId}/plan`}>
            <Button>Add Milestones</Button>
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Milestone Timeline</h2>
        <Link href={`/projects/${projectId}/plan`}>
          <Button variant="outline" size="sm">
            Edit Milestones
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="flex items-start gap-4">
            {/* Status Icon */}
            <div className="flex-shrink-0 mt-1">
              {milestone.status === 'COMPLETED' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : milestone.status === 'IN_PROGRESS' ? (
                <div className="w-6 h-6 rounded-full border-4 border-blue-600 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                </div>
              ) : (
                <Circle className="w-6 h-6 text-gray-300" />
              )}
            </div>

            {/* Milestone Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">
                  {milestone.title}
                </h3>
                <Badge variant={
                  milestone.status === 'COMPLETED' ? 'default' :
                  milestone.status === 'IN_PROGRESS' ? 'secondary' :
                  'outline'
                }>
                  {milestone.status.replace('_', ' ')}
                </Badge>
              </div>

              {milestone.description && (
                <p className="text-sm text-gray-600 mb-2">
                  {milestone.description}
                </p>
              )}

              {milestone.targetDate && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>
                    Target: {new Date(milestone.targetDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Connector Line */}
            {index < milestones.length - 1 && (
              <div className="absolute left-[11px] mt-8 w-0.5 h-12 bg-gray-200" />
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
