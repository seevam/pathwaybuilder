// src/components/dashboard/ModuleJourney.tsx
'use client'

import Link from 'next/link'
import { LockIcon } from 'lucide-react'

interface Module {
  id: string
  title: string
  orderIndex: number
  progress: number
  status: string
  isUnlocked: boolean
  icon?: string
}

interface ModuleJourneyProps {
  modules: Module[]
}

export function ModuleJourney({ modules }: ModuleJourneyProps) {
  const completedCount = modules.filter(m => m.status === 'completed').length
  const progressPercent = (completedCount / Math.max(modules.length - 1, 1)) * 100

  const activeModule = modules.find(m => m.status === 'active')
  const nextAction = activeModule ? `Continue "${activeModule.title}"` : 'Start your journey'

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Learning Journey</h2>
        <p className="text-gray-600">Progress through each module to unlock the next</p>
      </div>

      {/* Journey Path */}
      <div className="relative py-8">
        {/* Progress Bar */}
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 -z-10 mx-12 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transition-all duration-1000 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Module Nodes */}
        <div className="flex items-center justify-between">
          {modules.map((module, index) => {
            const isCompleted = module.status === 'completed'
            const isActive = module.status === 'active'
            const isPending = module.status === 'pending'

            const nodeColor = isCompleted
              ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg shadow-green-200'
              : isActive
              ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-xl shadow-orange-200 ring-4 ring-orange-100 scale-110'
              : 'bg-gray-200 text-gray-400 shadow-sm'

            const textColor = isCompleted || isActive
              ? 'text-gray-900 font-semibold'
              : 'text-gray-500'

            const content = (
              <div className="flex flex-col items-center flex-1 z-10 transition-all duration-300">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 ${nodeColor} relative`}
                >
                  {isCompleted ? (
                    <span className="text-2xl">✓</span>
                  ) : isPending && !module.isUnlocked ? (
                    <LockIcon className="w-6 h-6" />
                  ) : (
                    <span className="text-2xl">{module.icon || module.orderIndex}</span>
                  )}
                  
                  {/* Progress ring for active module */}
                  {isActive && module.progress > 0 && (
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-orange-200"
                        fill="none"
                        strokeWidth="2"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        strokeDasharray="100, 100"
                      />
                      <path
                        className="text-white"
                        fill="none"
                        strokeWidth="2"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        strokeDasharray={`${module.progress}, 100`}
                      />
                    </svg>
                  )}
                </div>
                
                <p className={`text-sm mt-4 text-center max-w-[120px] leading-tight ${textColor}`}>
                  {module.title}
                </p>
                
                {isActive && module.progress > 0 && (
                  <span className="text-xs text-orange-600 font-semibold mt-1">
                    {module.progress}%
                  </span>
                )}
              </div>
            )

            if (module.isUnlocked) {
              return (
                <Link
                  key={module.id}
                  href={`/module-${module.orderIndex}`}
                  className="hover:scale-105 transition-transform"
                >
                  {content}
                </Link>
              )
            }

            return <div key={module.id}>{content}</div>
          })}
        </div>
      </div>

      {/* Next Action */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Next Action
            </span>
            <p className="text-lg font-semibold text-gray-800 mt-1">
              {nextAction}
            </p>
          </div>
          {activeModule && (
            <Link
              href={`/module-${activeModule.orderIndex}`}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              Continue →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
