'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Upload, MessageSquare, Target } from 'lucide-react'

interface QuickActionsProps {
  projectId: string
}

export function QuickActions({ projectId }: QuickActionsProps) {
  const actions = [
    {
      icon: Plus,
      label: 'Add Task',
      description: 'Create new task',
      onClick: () => {
        // TODO: Implement task creation
        console.log('Add task')
      },
    },
    {
      icon: MessageSquare,
      label: 'Check-In',
      description: 'Log progress',
      onClick: () => {
        // TODO: Implement check-in
        console.log('Check-in')
      },
    },
    {
      icon: Upload,
      label: 'Upload',
      description: 'Add document',
      onClick: () => {
        // TODO: Implement upload
        console.log('Upload')
      },
    },
    {
      icon: Target,
      label: 'Update Goal',
      description: 'Track milestone',
      onClick: () => {
        // TODO: Implement goal update
        console.log('Update goal')
      },
    },
  ]

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="space-y-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.label}
              variant="outline"
              className="w-full justify-start"
              onClick={action.onClick}
            >
              <Icon className="w-4 h-4 mr-3" />
              <div className="flex flex-col items-start">
                <span className="font-medium">{action.label}</span>
                <span className="text-xs text-gray-500">{action.description}</span>
              </div>
            </Button>
          )
        })}
      </div>
    </Card>
  )
}
