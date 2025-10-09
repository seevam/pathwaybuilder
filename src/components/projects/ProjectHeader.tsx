'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Settings, Share2 } from 'lucide-react'
import Link from 'next/link'
import type { ProjectWithRelations } from '@/types'

interface ProjectHeaderProps {
  project: ProjectWithRelations
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const statusColors = {
    IDEATION: 'bg-gray-100 text-gray-700',
    PLANNING: 'bg-yellow-100 text-yellow-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    PAUSED: 'bg-orange-100 text-orange-700',
    COMPLETED: 'bg-green-100 text-green-700',
    ABANDONED: 'bg-red-100 text-red-700',
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {project.title}
            </h1>
            <Badge className={statusColors[project.status]}>
              {project.status.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-gray-600 text-lg mb-4">
            {project.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {project.startedAt && (
              <span>Started: {new Date(project.startedAt).toLocaleDateString()}</span>
            )}
            {project.targetCompletionAt && (
              <span>Target: {new Date(project.targetCompletionAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/projects/${project.id}/plan`}>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Edit Plan
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </Card>
  )
}
