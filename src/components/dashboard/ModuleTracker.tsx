'use client'

import Link from 'next/link'
import { CheckCircle2, Circle, Lock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Module {
  id: string
  title: string
  orderIndex: number
  progress: number
  status: string
  isUnlocked: boolean
}

interface ModuleTrackerProps {
  modules: Module[]
}

export function ModuleTracker({ modules }: ModuleTrackerProps) {
  const completedCount = modules.filter(m => m.status === 'completed').length
  const overallProgress = (completedCount / modules.length) * 100

  const activeModule = modules.find(m => m.status === 'active') || modules[0]
  const nextAction = activeModule
    ? `Continue Module ${activeModule.orderIndex}: ${activeModule.title}`
    : 'Start your journey'

  return (
    <Card className="p-8 bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">My Journey</h2>
        <p className="text-gray-600">Your path through the modules</p>
      </div>

      {/* Module Path */}
      <div className="relative py-8 mb-6">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 mx-8">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transition-all duration-1000"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {/* Module Circles */}
        <div className="relative flex items-center justify-between">
          {modules.map((module) => {
            const isCompleted = module.status === 'completed'
            const isActive = module.status === 'active'
            const isLocked = !module.isUnlocked

            return (
              <Link
                key={module.id}
                href={module.isUnlocked ? `/module-${module.orderIndex}` : '#'}
                className={cn(
                  'flex flex-col items-center group transition-transform',
                  module.isUnlocked ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed'
                )}
              >
                <div
                  className={cn(
                    'w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg border-4 transition-all relative z-10',
                    isCompleted
                      ? 'bg-blue-500 border-blue-600 text-white shadow-lg'
                      : isActive
                      ? 'bg-orange-500 border-orange-600 text-white shadow-xl ring-4 ring-orange-200'
                      : isLocked
                      ? 'bg-gray-200 border-gray-300 text-gray-400'
                      : 'bg-white border-gray-300 text-gray-600'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-8 h-8" />
                  ) : isLocked ? (
                    <Lock className="w-6 h-6" />
                  ) : (
                    module.orderIndex
                  )}
                </div>
                <div className="text-xs font-semibold text-gray-700 mt-2 text-center max-w-[80px]">
                  {module.title}
                </div>
                {isActive && module.progress > 0 && (
                  <div className="text-xs text-orange-600 font-bold mt-1">
                    {module.progress}%
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Next Action Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-wider mb-1 opacity-90">
              Next Action Item
            </div>
            <div className="text-xl font-bold">{nextAction}</div>
          </div>
          {activeModule && (
            <Link href={`/module-${activeModule.orderIndex}`}>
              <Button size="lg" variant="secondary">
                Continue →
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
