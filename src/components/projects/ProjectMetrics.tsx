'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, CheckCircle, Clock, Target } from 'lucide-react'

interface ProjectMetricsProps {
  healthScore: number
  totalHours: number
  completedTasks: number
  totalTasks: number
  completedMilestones: number
  totalMilestones: number
}

export function ProjectMetrics({
  healthScore,
  totalHours,
  completedTasks,
  totalTasks,
  completedMilestones,
  totalMilestones,
}: ProjectMetricsProps) {
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  const milestoneProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0

  const healthColor = healthScore >= 75 ? 'text-green-600' : 
                      healthScore >= 50 ? 'text-yellow-600' : 
                      'text-red-600'

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      {/* Health Score */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Project Health</p>
            <p className={`text-3xl font-bold ${healthColor}`}>
              {healthScore}/100
            </p>
          </div>
          <div className={`p-3 rounded-full ${healthScore >= 75 ? 'bg-green-100' : healthScore >= 50 ? 'bg-yellow-100' : 'bg-red-100'}`}>
            <TrendingUp className={`w-6 h-6 ${healthColor}`} />
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${healthScore >= 75 ? 'bg-green-600' : healthScore >= 50 ? 'bg-yellow-600' : 'bg-red-600'}`}
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Hours Logged */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Hours Logged</p>
            <p className="text-3xl font-bold text-gray-900">
              {totalHours}
            </p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Total time invested
        </p>
      </Card>

      {/* Task Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Tasks</p>
            <p className="text-3xl font-bold text-gray-900">
              {completedTasks}/{totalTasks}
            </p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <CheckCircle className="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full"
              style={{ width: `${taskProgress}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Milestone Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Milestones</p>
            <p className="text-3xl font-bold text-gray-900">
              {completedMilestones}/{totalMilestones}
            </p>
          </div>
          <div className="p-3 bg-orange-100 rounded-full">
            <Target className="w-6 h-6 text-orange-600" />
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-600 h-2 rounded-full"
              style={{ width: `${milestoneProgress}%` }}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
