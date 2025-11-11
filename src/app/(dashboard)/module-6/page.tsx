// src/app/(dashboard)/module-6/page.tsx
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

export default async function Module6Page() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) redirect('/sign-in')

  const moduleData = await db.module.findFirst({
    where: { orderIndex: 6 },
    include: {
      activities: {
        orderBy: { orderIndex: 'asc' },
      },
    },
  })

  if (!moduleData) {
    return <div>Module not found</div>
  }

  // Check if previous module is complete
  const module5 = await db.module.findFirst({
    where: { orderIndex: 5 },
  })

  if (module5) {
    const module5Progress = await ModuleService.getModuleProgress(user.id, module5.id)
    if (module5Progress < 100) {
      return (
        <div className="container mx-auto p-6 max-w-5xl">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Module Locked</h2>
            <p className="text-gray-600 mb-4">
              Please complete Module 5 to unlock Module 6
            </p>
            <Link href="/module-5">
              <Button>Go to Module 5</Button>
            </Link>
          </div>
        </div>
      )
    }
  }

  const progress = await ModuleService.getModuleProgress(user.id, moduleData.id)

  const completions = await db.activityCompletion.findMany({
    where: {
      userId: user.id,
      activityId: { in: moduleData.activities.map(a => a.id) },
    },
  })

  const completionMap = new Map(
    completions.map(c => [c.activityId, c.completed])
  )

  const nextActivity = await ModuleService.getNextActivity(user.id, moduleData.id)
  const deliverableUnlocked = progress === 100

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <ModuleHeader
        module={moduleData}
        progress={progress}
        nextActivity={nextActivity}
      />

      <ActivityList
        activities={moduleData.activities}
        completionMap={completionMap}
        moduleSlug="module-6"
      />

      {deliverableUnlocked && (
        <ModuleDeliverable
          moduleId={moduleData.id}
          unlocked={deliverableUnlocked}
          progress={progress}
        />
      )}
    </div>
  )
}
