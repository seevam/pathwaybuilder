import Link from 'next/link'
import { LockIcon, ArrowRightIcon, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProgressBar } from './ProgressBar'
import { cn } from '@/lib/utils'

interface ModuleCardProps {
  title: string
  description: string
  progress: number
  estimatedTime: string
  href: string
  unlocked: boolean
  icon?: string
  lockMessage?: string
}

export function ModuleCard({
  title,
  description,
  progress,
  estimatedTime,
  href,
  unlocked,
  icon,
  lockMessage
}: ModuleCardProps) {
  const isComplete = progress === 100
  
  const content = (
    <div
      className={cn(
        'border rounded-xl p-6 transition-all h-full',
        unlocked
          ? 'bg-white hover:shadow-lg hover:scale-[1.02] cursor-pointer'
          : 'bg-gray-50 cursor-not-allowed opacity-60'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          {icon && (
            <div className="text-3xl flex-shrink-0">{icon}</div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 leading-tight">
              {title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          </div>
        </div>
        <div className="flex-shrink-0 ml-2">
          {!unlocked && <LockIcon className="w-5 h-5 text-gray-400" />}
          {isComplete && <CheckCircle2 className="w-5 h-5 text-green-500" />}
        </div>
      </div>

      {unlocked && (
        <div className="space-y-3">
          <ProgressBar current={progress} total={100} label="Progress" />
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">⏱ {estimatedTime}</span>
            {isComplete ? (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Completed
              </span>
            ) : (
              <Button variant="ghost" size="sm" className="gap-1">
                {progress > 0 ? 'Continue' : 'Start'}
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {!unlocked && lockMessage && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <LockIcon className="w-4 h-4" />
            {lockMessage}
          </p>
        </div>
      )}
    </div>
  )

  if (unlocked) {
    return <Link href={href}>{content}</Link>
  }

  return (
    <div
      className="relative"
      title={lockMessage}
    >
      {content}
    </div>
  )
}
