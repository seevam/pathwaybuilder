'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Circle, Plus } from 'lucide-react'
import Link from 'next/link'
import type { Task } from '@prisma/client'

interface TaskListProps {
  tasks: Task[]
  projectId: string
}

export function TaskList({ tasks, projectId }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Tasks</h2>
        <div className="text-center py-8 text-gray-500">
          <p className="mb-4">No tasks yet</p>
          <Link href={`/projects/${projectId}/plan`}>
            <Button>Add Tasks</Button>
          </Link>
        </div>
      </Card>
    )
  }

  const completedTasks = tasks.filter(t => t.completed)
  const pendingTasks = tasks.filter(t => !t.completed)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Tasks</h2>
          <p className="text-sm text-gray-500">
            {completedTasks.length} of {tasks.length} completed
          </p>
        </div>
        <Button size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="space-y-3">
        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">To Do</h3>
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  {task.description && (
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  )}
                  {task.estimatedHours && (
                    <p className="text-xs text-gray-500 mt-1">
                      Est. {task.estimatedHours}h
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="space-y-2 pt-4 border-t">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Completed ({completedTasks.length})
            </h3>
            {completedTasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50 opacity-60"
              >
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 line-through">
                    {task.title}
                  </h4>
                  {task.completedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Completed {new Date(task.completedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {completedTasks.length > 5 && (
              <p className="text-sm text-gray-500 text-center pt-2">
                + {completedTasks.length - 5} more completed tasks
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
