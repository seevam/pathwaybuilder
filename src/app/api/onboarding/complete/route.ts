// src/app/api/onboarding/complete/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const onboardingSchema = z.object({
  goals: z.array(z.string()).min(1, 'At least one goal is required'),
  otherGoal: z.string().optional(),
  assessmentsCompleted: z.array(z.string()).optional()
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const body = await req.json();
    const { goals, otherGoal, assessmentsCompleted } = onboardingSchema.parse(body);

    // Update or create profile with onboarding data
    const profile = await db.profile.upsert({
      where: { userId: user.id },
      update: {
        goals: goals,
        // Store other goal if provided
        bio: otherGoal || undefined,
      },
      create: {
        userId: user.id,
        goals: goals,
        bio: otherGoal || undefined,
      },
    });

    // Create analytics event
    // await trackEvent('onboarding_completed', { userId: user.id, goals });

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('[ONBOARDING_COMPLETE]', error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify({ error: error.errors }), { status: 400 });
    }
    return new NextResponse('Internal Error', { status: 500 });
  }
}
