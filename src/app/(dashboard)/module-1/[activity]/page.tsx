// src/app/(dashboard)/module-1/[activity]/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { ValuesCardSortWrapper } from '@/components/activities/ValuesCardSortWrapper';
import { WhoAmI } from '@/components/activities/WhoAmI';
import { StrengthsDiscoveryWrapper } from '@/components/activities/StrengthsDiscoveryWrapper';
import { IntegrationReflectionWrapper } from '@/components/activities/IntegrationReflectionWrapper';
import { AISupportButton } from '@/components/activities/AISupportButton';
import { ActivityResults } from '@/components/activities/ActivityResults';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function ActivityPage({
  params,
}: {
  params: { activity: string };
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    redirect('/sign-in');
  }

  const activity = await db.activity.findUnique({
    where: { slug: params.activity },
  });

  if (!activity) {
    notFound();
  }

  // Check if activity is already completed
  const completion = await db.activityCompletion.findUnique({
    where: {
      userId_activityId: {
        userId: user.id,
        activityId: activity.id,
      },
    },
  });

  const isCompleted = completion?.completed || false;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Back button */}
      <div className="mb-6">
        <Link href="/module-1">
          <Button variant="ghost" size="sm">← Back to Module 1</Button>
        </Link>
      </div>

      {/* Activity Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{activity.title}</h1>
            <p className="text-muted-foreground">{activity.description}</p>
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <span>⏱ {activity.estimatedMinutes} minutes</span>
            </div>
          </div>
          {!isCompleted && (
            <AISupportButton
              activityId={activity.id}
              activityTitle={activity.title}
              activityDescription={activity.description}
            />
          )}
        </div>
      </div>

      {/* Show Results if Completed */}
      {isCompleted && (
        <div className="mb-6">
          <ActivityResults
            activityId={activity.id}
            activityTitle={activity.title}
          />
        </div>
      )}

      {/* Activity Content */}
      <div className="bg-card border rounded-lg p-6">
        {params.activity === 'who-am-i' && (
          <WhoAmI activityId={activity.id} />
        )}
        
        {params.activity === 'values-card-sort' && (
          <ValuesCardSortWrapper activityId={activity.id} />
        )}
        
        {params.activity === 'strengths-discovery' && (
          <StrengthsDiscoveryWrapper activityId={activity.id} />
        )}
        
        {params.activity === 'integration-reflection' && (
          <IntegrationReflectionWrapper activityId={activity.id} />
        )}
        
        {!['who-am-i', 'values-card-sort', 'strengths-discovery', 'integration-reflection'].includes(params.activity) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              This activity is coming soon...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
