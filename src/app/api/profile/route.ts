import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/profile - Get current user's profile
export async function GET() {
  try {
    const user = await requireAuth();

    const profile = await db.profile.findUnique({
      where: { userId: user.id },
    });

    // Also fetch IB stats for header display
    const userData = await db.user.findUnique({
      where: { id: user.id },
      include: {
        ibUserStats: true,
      },
    });

    return NextResponse.json({
      success: true,
      profile,
      selectedFeature: profile?.selectedFeature,
      ibUserStats: userData?.ibUserStats,
    });
  } catch (error) {
    console.error('[GET_PROFILE]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/profile - Create or update profile
export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    // Use upsert to create or update profile
    const profile = await db.profile.upsert({
      where: { userId: user.id },
      update: {
        gradeLevel: body.gradeLevel,
        collegeTimeline: body.collegeTimeline,
        timeCommitment: body.timeCommitment,
        currentActivities: body.currentActivities || [],
        favoriteSubjects: body.favoriteSubjects || [],
        skillsConfidence: body.skillsConfidence || {},
        workStyle: body.workStyle,
        impactPreference: body.impactPreference,
        challengeLevel: body.challengeLevel,
        completionPercent: 20, // Completed quick start (step 1 of 6)
      },
      create: {
        userId: user.id,
        gradeLevel: body.gradeLevel,
        collegeTimeline: body.collegeTimeline,
        timeCommitment: body.timeCommitment,
        currentActivities: body.currentActivities || [],
        favoriteSubjects: body.favoriteSubjects || [],
        skillsConfidence: body.skillsConfidence || {},
        workStyle: body.workStyle,
        impactPreference: body.impactPreference,
        challengeLevel: body.challengeLevel,
        topValues: [],
        strengthsRadar: {},
        problemFocus: [],
        completionPercent: 20, // Completed quick start (step 1 of 6)
      },
    });

    return NextResponse.json(
      { success: true, profile },
      { status: 201 }
    );
  } catch (error) {
    console.error('[CREATE_PROFILE]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/profile - Update profile
export async function PATCH(req: Request) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const profile = await db.profile.update({
      where: { userId: user.id },
      data: body,
    });

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('[UPDATE_PROFILE]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
