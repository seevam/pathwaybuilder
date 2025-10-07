// src/app/(auth)/onboarding/page.tsx
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

export default async function OnboardingPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  // Check if user has already completed onboarding
  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { profile: true }
  });

  // If user has completed onboarding (check for goals in profile), redirect to dashboard
  if (Array.isArray(user?.profile?.goals) && user.profile.goals.length > 0) {
    redirect('/dashboard');
  }

  return <OnboardingFlow userName={user?.name || 'there'} />;
}
