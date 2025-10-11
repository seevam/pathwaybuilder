// src/app/(dashboard)/module-1/[activity]/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { ValuesCardSortWrapper } from '@/components/activities/ValuesCardSortWrapper';
import { WhoAmI } from '@/components/activities/WhoAmI';
import { StrengthsDiscoveryWrapper } from '@/components/activities/StrengthsDiscoveryWrapper';
import { IntegrationReflectionWrapper } from '@/components/activities/IntegrationReflectionWrapper';
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

  const activity = await db.activity.findUnique({
    where: { slug: params.activity },
  });

  if (!activity) {
    notFound();
  }

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
        <h1 className="text-3xl font-bold mb-2">{activity.title}</h1>
        <p className="text-muted-foreground">{activity.description}</p>
        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
          <span>⏱ {activity.estimatedMinutes} minutes</span>
        </div>
      </div>

      {/* Activity Content */}
      <div className="bg-card border rounded-lg p-6">
        {params.activity === 'who-am-i' && (
          <WhoAmI activityId={activity.id} />
        )}
        
        {params.activity === 'values-card-sort' && (
          <ValuesCardSortWrapper />
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
}// src/components/ui/textarea.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
