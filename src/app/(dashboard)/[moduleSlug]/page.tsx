import { currentUser } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { ModuleService } from '@/lib/services/module-service'
import { ModuleHeader } from '@/components/modules/ModuleHeader'
import { ActivityList } from '@/components/modules/ActivityList'
import { ModuleDeliverable } from '@/components/modules/ModuleDeliverable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Lock } from 'lucide-react'

interface ModulePageProps {
  params: {
    moduleSlug: string
  }
}

const MODULE_SLUG_MAP: Record<string, number> = {
  'module-1': 1,
  'module-2': 2,
  'module-3': 3,
  'module-4': 4,
  'module-5': 5,
  'module-6': 6,
}

export default async function ModulePage({ params }: ModulePageProps) {
  // ✅ Validate slug BEFORE calling auth
  const orderIndex = MODULE_SLUG_MAP[params.moduleSlug]
  if (!orderIndex) {
    notFound() // Return 404 for invalid slugs like "favicon.ico"
  }

  // Now safe to call auth
  const clerkUser = await currentUser()
  if (!clerkUser) redirect('/sign-in')

  const user = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
  })

  if (!user) redirect('/sign-in')

  const isUnlocked = await ModuleService.isModuleUnlocked(user.id, orderIndex)
  
  if (!isUnlocked) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card className="p-8 text-center">
          <Lock className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Module Locked
          </h1>
          <p className="text-gray-600 mb-6">
            Complete Module {orderIndex - 1} to unlock this module.
          </p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const moduleData = await db.module.findFirst({
    where: { orderIndex },
    include: {
      activities: {
        orderBy: { orderIndex: 'asc' },
      },
    },
  })

  if (!moduleData) notFound()

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
        moduleSlug={params.moduleSlug}
      />

      <ModuleDeliverable
        moduleId={moduleData.id}
        orderIndex={moduleData.orderIndex}
        unlocked={deliverableUnlocked}
        progress={progress}
      />
    </div>
  )
}
