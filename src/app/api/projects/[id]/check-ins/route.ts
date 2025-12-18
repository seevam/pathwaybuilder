import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { ProjectCheckInSchema } from '@/lib/validations/project';
import { GamificationService } from '@/lib/services/gamification';

// POST /api/projects/[id]/check-ins - Create check-in
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { id } = await params;

    // Verify project ownership
    const project = await db.project.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Validate input
    const validated = ProjectCheckInSchema.parse(body);

    // Create check-in
    const checkIn = await db.projectCheckIn.create({
      data: {
        projectId: id,
        accomplishments: validated.accomplishments,
        challenges: validated.challenges || null,
        learnings: validated.learnings || null,
        nextSteps: validated.nextSteps || null,
        hoursLogged: validated.hoursLogged || null,
        moodRating: validated.moodRating || null,
      },
    });

    // Update project stats
    const hoursToAdd = validated.hoursLogged || 0;
    await db.project.update({
      where: { id },
      data: {
        hoursLogged: { increment: hoursToAdd },
        lastWorkedAt: new Date(),
      },
    });

    // Award XP for check-in (using GamificationService for proper level calculation)
    const xpAward = 20 + (hoursToAdd * 2); // Base 20 + 2 per hour
    const { leveledUp, newLevel, oldLevel } = await GamificationService.awardXP(
      user.id,
      xpAward,
      'Project check-in'
    );

    // Update streak
    await GamificationService.updateStreak(user.id);

    // Check for first check-in achievement
    const checkInCount = await db.projectCheckIn.count({
      where: {
        project: {
          userId: user.id,
        },
      },
    });
    if (checkInCount === 1) {
      await GamificationService.unlockAchievement(user.id, 'first-checkin');
    }

    // Check other achievements
    await GamificationService.checkAchievements(user.id);

    return NextResponse.json(
      {
        success: true,
        checkIn,
        xpAwarded: xpAward,
        leveledUp,
        newLevel: leveledUp ? newLevel : undefined,
        oldLevel: leveledUp ? oldLevel : undefined,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[CREATE_CHECKIN]', error);
    return NextResponse.json(
      { error: 'Failed to create check-in' },
      { status: 500 }
    );
  }
}
