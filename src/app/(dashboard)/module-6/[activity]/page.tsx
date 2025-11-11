// src/app/(dashboard)/module-6/[activity]/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { StoryArcWrapper } from '@/components/activities/StoryArcWrapper'
import { ElevatorPitchWrapper } from '@/components/activities/ElevatorPitchWrapper'
import { DigitalPresenceWrapper } from '@/components/activities/DigitalPresenceWrapper'
import { FinalReflectionWrapper } from '@/components/activities/FinalReflectionWrapper'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function Module6ActivityPage({
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
      <div className="mb-6">
        <Link href="/module-6">
          <Button variant="ghost" size="sm">← Back to Module 6</Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{activity.title}</h1>
        <p className="text-muted-foreground">{activity.description}</p>
        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
          <span>⏱ {activity.estimatedMinutes} minutes</span>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6">
        {params.activity === 'story-arc' && (
          <StoryArcWrapper activityId={activity.id} />
        )}

        {params.activity === 'elevator-pitch' && (
          <ElevatorPitchWrapper activityId={activity.id} />
        )}

        {params.activity === 'digital-presence' && (
          <DigitalPresenceWrapper activityId={activity.id} />
        )}

        {params.activity === 'final-reflection' && (
          <FinalReflectionWrapper activityId={activity.id} />
        )}

        {!['story-arc', 'elevator-pitch', 'digital-presence', 'final-reflection'].includes(params.activity) && (
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
