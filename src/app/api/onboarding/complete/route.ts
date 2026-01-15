import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const onboardingSchema = z.object({
  selectedFeature: z.enum(['CAREER_EXPLORATION', 'IB_LEARNING', 'PASSION_PROJECT']),
  grade: z.string().min(1, 'Grade is required'),
  primaryGoal: z.string().min(1, 'Primary goal is required'),
  xpEarned: z.number().min(0),

  // Career Exploration
  careerGoals: z.array(z.string()).optional(),
  weeklyCommitment: z.string().optional(),

  // Exam Prep / IB Learning
  ibSubjects: z.array(z.string()).optional(),
  examDate: z.string().optional(),
  studyStyle: z.string().optional(),

  // Passion Projects
  projectType: z.array(z.string()).optional(),
  projectStage: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

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
    const data = onboardingSchema.parse(body);

    // Prepare onboarding data to save
    const onboardingData: any = {
      selectedFeature: data.selectedFeature,
      grade: data.grade,
      primaryGoal: data.primaryGoal,
      xpEarned: data.xpEarned,
    };

    // Add feature-specific data
    if (data.selectedFeature === 'CAREER_EXPLORATION') {
      onboardingData.careerGoals = data.careerGoals;
      onboardingData.weeklyCommitment = data.weeklyCommitment;
    } else if (data.selectedFeature === 'IB_LEARNING') {
      onboardingData.ibSubjects = data.ibSubjects;
      onboardingData.examDate = data.examDate;
      onboardingData.studyStyle = data.studyStyle;
    } else if (data.selectedFeature === 'PASSION_PROJECT') {
      onboardingData.projectType = data.projectType;
      onboardingData.projectStage = data.projectStage;
    }

    // Update profile with onboarding data and selected feature
    const profile = await db.profile.upsert({
      where: { userId: user.id },
      update: {
        selectedFeature: data.selectedFeature,
        onboardingData: onboardingData,
        onboardingCompleted: true,
      },
      create: {
        userId: user.id,
        selectedFeature: data.selectedFeature,
        onboardingData: onboardingData,
        onboardingCompleted: true,
      },
    });

    // Award initial XP to user
    await db.user.update({
      where: { id: user.id },
      data: {
        xp: {
          increment: data.xpEarned
        }
      }
    });

    return NextResponse.json({
      success: true,
      profile,
      message: 'Onboarding completed successfully!'
    });
  } catch (error) {
    console.error('[ONBOARDING_COMPLETE]', error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify({ error: error.errors }), { status: 400 });
    }
    return new NextResponse('Internal Error', { status: 500 });
  }
}
