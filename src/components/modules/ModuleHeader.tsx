// src/components/modules/ModuleHeader.tsx
'use client'

import { Module, Activity } from '@prisma/client'
import { ProgressBar } from '@/components/dashboard/ProgressBar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Clock, Play, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface ModuleHeaderProps {
  module: Module & { activities: Activity[] }
  progress: number
  nextActivity: Activity | null
}

export function ModuleHeader({ module, progress, nextActivity }: ModuleHeaderProps) {
  const isComplete = progress === 100
  const hasStarted = progress > 0

  return (
    <div className="space-y-6 mb-8">
      {/* Title & Description */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-5xl">{module.icon}</span>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900">
              {module.title}
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              {module.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Your Progress</h3>
              <p className="text-sm text-gray-600">
                {isComplete
                  ? '🎉 Module Complete!'
                  : hasStarted
                  ? 'Keep going, you\'re doing great!'
                  : 'Ready to start your journey?'}
              </p>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {progress}%
            </div>
          </div>

          <ProgressBar
            current={progress}
            total={100}
            className="h-3"
          />

          {/* Next Activity CTA */}
          {nextActivity && !isComplete && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">
                  Next Up: {nextActivity.title}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{nextActivity.estimatedMinutes} minutes</span>
                </div>
              </div>
              <Link href={`/module-1/${nextActivity.slug}`}>
                <Button size="lg" className="gap-2">
                  {hasStarted ? (
                    <>
                      Continue
                      <Play className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Start Module
                      <Play className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </Link>
            </div>
          )}

          {isComplete && (
            <div className="flex items-center justify-center gap-2 text-green-600 font-medium pt-4 border-t">
              <CheckCircle2 className="h-5 w-5" />
              <span>All activities completed!</span>
            </div>
          )}
        </div>
      </Card>

      {/* Intro Video (if exists) */}
      {module.videoUrl && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            📹 Module Introduction (3 min)
          </h3>
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <video
              src={module.videoUrl}
              controls
              className="w-full h-full rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Watch this quick intro to understand what you&aposll discover in this module.
          </p>
        </Card>
      )}

      {/* Module Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {module.activities.length}
          </div>
          <div className="text-sm text-gray-600">Activities</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {module.estimatedHours}h
          </div>
          <div className="text-sm text-gray-600">Est. Time</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round((progress / 100) * module.activities.length)}/{module.activities.length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </Card>
      </div>
    </div>
  )
}
