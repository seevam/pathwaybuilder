// src/app/(dashboard)/module-4/[activity]/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { EducationPathwaysWrapper } from '@/components/activities/EducationPathwaysWrapper'
import { TimelineBuilderWrapper } from '@/components/activities/TimelineBuilderWrapper'
import { SkillGapAnalysisWrapper } from '@/components/activities/SkillGapAnalysisWrapper'
import { PathwayReflectionWrapper } from '@/components/activities/PathwayReflectionWrapper'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function Module4ActivityPage({
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
        <Link href="/module-4">
          <Button variant="ghost" size="sm">← Back to Module 4</Button>
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
        {params.activity === 'education-pathways' && (
          <EducationPathwaysWrapper activityId={activity.id} />
        )}

        {params.activity === 'timeline-builder' && (
          <TimelineBuilderWrapper activityId={activity.id} />
        )}

        {params.activity === 'skill-gap-analysis' && (
          <SkillGapAnalysisWrapper activityId={activity.id} />
        )}

        {params.activity === 'pathway-reflection' && (
          <PathwayReflectionWrapper activityId={activity.id} />
        )}

        {!['education-pathways', 'timeline-builder', 'skill-gap-analysis', 'pathway-reflection'].includes(params.activity) && (
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
