// src/app/(dashboard)/module-3/[activity]/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { DISCAssessmentWrapper } from '@/components/activities/DISCAssessmentWrapper'
import { WorkPreferencesWrapper } from '@/components/activities/WorkPreferencesWrapper'
import { CollaborationStyleWrapper } from '@/components/activities/CollaborationStyleWrapper'
import { WorkStyleReflectionWrapper } from '@/components/activities/WorkStyleReflectionWrapper'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function Module3ActivityPage({
  params,
}: {
  params: { activity: string }
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const activity = await db.activity.findUnique({
    where: { slug: params.activity },
  })

  if (!activity) {
    notFound()
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Back button */}
      <div className="mb-6">
        <Link href="/module-3">
          <Button variant="ghost" size="sm">← Back to Module 3</Button>
        </Link>
      </div>

      {/* Activity Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{activity.title}</h1>
        <p className="text-muted-foreground">{activity.description}</p>
        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
          <span>⏱ {activity.estimatedMinutes} minutes</span>
        </div>
      </div>

      {/* Activity Content */}
      <div className="bg-card border rounded-lg p-6">
        {params.activity === 'disc-assessment' && (
          <DISCAssessmentWrapper activityId={activity.id} />
        )}

        {params.activity === 'work-preferences' && (
          <WorkPreferencesWrapper activityId={activity.id} />
        )}

        {params.activity === 'collaboration-style' && (
          <CollaborationStyleWrapper activityId={activity.id} />
        )}

        {params.activity === 'work-style-reflection' && (
          <WorkStyleReflectionWrapper activityId={activity.id} />
        )}

        {!['disc-assessment', 'work-preferences', 'collaboration-style', 'work-style-reflection'].includes(params.activity) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              This activity is coming soon...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
