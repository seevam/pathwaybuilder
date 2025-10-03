import Link from 'next/link'
import { LockIcon, ArrowRightIcon } from 'lucide-react'
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
}

export function ModuleCard({
  title,
  description,
  progress,
  estimatedTime,
  href,
  unlocked,
}: ModuleCardProps) {
  const content = (
    <div
      className={cn(
        'border rounded-lg p-6 transition-all',
        unlocked
          ? 'bg-card hover:shadow-md cursor-pointer'
          : 'bg-muted/50 cursor-not-allowed opacity-60'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        {!unlocked && <LockIcon className="w-5 h-5 text-muted-foreground" />}
      </div>

      <ProgressBar current={progress} total={100} label="Progress" />

      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-muted-foreground">⏱ {estimatedTime}</span>
        {unlocked && (
          <Button variant="ghost" size="sm">
            Continue <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )

  if (unlocked) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
