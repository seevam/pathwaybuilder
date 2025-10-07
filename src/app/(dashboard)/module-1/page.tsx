import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle } from 'lucide-react';

export default async function Module1Page() {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      activities: {
        include: {
          activity: true,
        },
      },
    },
  });

  if (!user) redirect('/sign-in');

  const activities = await db.activity.findMany({
    orderBy: { orderIndex: 'asc' },
  });

  const completedActivityIds = new Set(
    user.activities.filter(a => a.completed).map(a => a.activityId)
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">← Back to Dashboard</Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Module 1: Know Yourself 🎯</h1>
        <p className="text-muted-foreground">
          Discover your strengths, values, and personality
        </p>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const isCompleted = completedActivityIds.has(activity.id);
          
          return (
            <Link
              key={activity.id}
              href={`/module-1/${activity.slug}`}
              className="block"
            >
              <div className="border rounded-lg p-6 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">
                      {activity.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>⏱ {activity.estimatedMinutes} minutes</span>
                      {isCompleted && (
                        <span className="text-green-600 font-medium">✓ Completed</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
