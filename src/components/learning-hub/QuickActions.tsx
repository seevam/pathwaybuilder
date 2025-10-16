// src/components/learning-hub/QuickActions.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Lightbulb, BookOpen, Sparkles, HelpCircle, Target } from 'lucide-react'

interface QuickActionsProps {
  onActionClick: (action: string) => void
  disabled?: boolean
}

const QUICK_ACTIONS = [
  {
    id: 'eli5',
    label: 'Explain like I\'m 5',
    icon: Lightbulb,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 hover:bg-yellow-100',
  },
  {
    id: 'example',
    label: 'Give me an example',
    icon: BookOpen,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
  },
  {
    id: 'quiz',
    label: 'Quiz me on this',
    icon: Target,
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100',
  },
  {
    id: 'summarize',
    label: 'Summarize',
    icon: Sparkles,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100',
  },
  {
    id: 'help',
    label: 'Related resources',
    icon: HelpCircle,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 hover:bg-pink-100',
  },
]

export function QuickActions({ onActionClick, disabled }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
      <div className="w-full mb-1">
        <p className="text-xs font-semibold text-gray-600 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Quick Actions
        </p>
      </div>
      {QUICK_ACTIONS.map((action) => (
        <Button
          key={action.id}
          variant="ghost"
          size="sm"
          disabled={disabled}
          onClick={() => onActionClick(action.label)}
          className={`${action.bgColor} ${action.color} border border-current/20 hover:scale-105 transition-transform`}
        >
          <action.icon className="w-4 h-4 mr-1" />
          {action.label}
        </Button>
      ))}
    </div>
  )
}
