// src/app/(dashboard)/module-1/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { ModuleService } from '@/lib/services/module-service'
import { ModuleHeader } from '@/components/modules/ModuleHeader'
import { ActivityList } from '@/components/modules/ActivityList'
import { ModuleDeliverable } from '@/components/modules/ModuleDeliverable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function Module1Page() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) redirect('/sign-in')

  // Get module with activities
  const moduleData = await db.module.findFirst({
    where: { orderIndex: 1 },
    include: {
      activities: {
        orderBy: { orderIndex: 'asc' },
      },
    },
  })

  if (!module) {
    return <div>Module not found</div>
  }

  // Get user's progress for this module
  const progress = await ModuleService.getModuleProgress(user.id, moduleData.id)

  // Get activity completions
  const completions = await db.activityCompletion.findMany({
    where: {
      userId: user.id,
      activityId: { in: moduleDataactivities.map(a => a.id) },
    },
  })

  const completionMap = new Map(
    completions.map(c => [c.activityId, c.completed])
  )

  // Get next activity
  const nextActivity = await ModuleService.getNextActivity(user.id, moduleData.id)

  // Check if deliverable is unlocked (all activities complete)
  const deliverableUnlocked = progress === 100

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Module Header */}
      <ModuleHeader
        module={moduleData}
        progress={progress}
        nextActivity={nextActivity}
      />

      {/* Activity List */}
      <ActivityList
        activities={moduleData.activities}
        completionMap={completionMap}
        moduleSlug="module-1"
      />

      {/* Module Deliverable */}
      <ModuleDeliverable
        moduleId={moduleData.id}
        unlocked={deliverableUnlocked}
        progress={progress}
      />
    </div>
  )
}
