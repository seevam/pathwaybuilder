// src/components/modules/ModuleDeliverable.tsx
'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lock, Upload, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface ModuleDeliverableProps {
  moduleId: string
  unlocked: boolean
  progress: number
}

export function ModuleDeliverable({ moduleId, unlocked, progress }: ModuleDeliverableProps) {
  return (
    <Card className={`p-6 ${unlocked ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {unlocked ? (
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          ) : (
            <Lock className="h-8 w-8 text-gray-400" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Module Deliverable: Identity Collage
          </h3>
          <p className="text-gray-600 mb-4">
            Create a visual representation of your identity including your top values,
            strengths, personality highlights, and a personal motto.
          </p>

          {unlocked ? (
            <>
              <div className="bg-white rounded-lg p-4 mb-4 border">
                <h4 className="font-medium text-gray-900 mb-2">What to Include:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>✓ Your top 5 values</li>
                  <li>✓ Your key strengths (3-5)</li>
                  <li>✓ Personality highlights (RIASEC, DISC, TypeFinder)</li>
                  <li>✓ A personal motto or quote</li>
                  <li>✓ Images, colors, symbols that represent you</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Link href={`/deliverables/upload?moduleId=${moduleId}`}>
                  <Button className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Deliverable
                  </Button>
                </Link>
                <Link href="/templates/identity-collage">
                  <Button variant="outline">
                    View Template
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Lock className="h-5 w-5" />
                <span className="font-medium">Locked</span>
              </div>
              <p className="text-sm text-gray-600">
                Complete all {Math.round(100 - progress)}% of activities to unlock the module deliverable.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
