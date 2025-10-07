import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { ValuesCardSort } from '@/components/activities/ValuesCardSort';

export default async function ActivityPage({
  params,
}: {
  params: { activity: string };
}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const activity = await db.activity.findUnique({
    where: { slug: params.activity },
  });

  if (!activity) notFound();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{activity.title}</h1>
        <p className="text-muted-foreground">{activity.description}</p>
      </div>

      {/* Render activity based on slug */}
      {params.activity === 'values-card-sort' && (
        <ValuesCardSort
          onComplete={async (values) => {
            // Handle completion
            console.log('Values selected:', values);
          }}
        />
      )}

      {/* Add other activities here */}
    </div>
  );
}
