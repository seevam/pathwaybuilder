'use client'

import { cn } from '@/lib/utils'

interface ProgressBarProps {
  current: number
  total: number
  label?: string
  className?: string
}

export function ProgressBar({ current, total, label, className }: ProgressBarProps) {
  const percentage = (current / total) * 100

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{label}</span>
          <span className="text-muted-foreground">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
