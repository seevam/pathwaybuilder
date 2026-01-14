import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const { feature } = body;

    // Validate feature
    const validFeatures = ['CAREER_EXPLORATION', 'PASSION_PROJECT', 'IB_LEARNING'];
    if (!validFeatures.includes(feature)) {
      return NextResponse.json(
        { error: 'Invalid feature selected' },
        { status: 400 }
      );
    }

    // Get or create profile
    let profile = await db.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      profile = await db.profile.create({
        data: {
          userId: user.id,
          selectedFeature: feature,
        },
      });
    } else {
      profile = await db.profile.update({
        where: { userId: user.id },
        data: { selectedFeature: feature },
      });
    }

    return NextResponse.json({
      success: true,
      feature: profile.selectedFeature,
    });
  } catch (error) {
    console.error('Error updating feature:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update feature' },
      { status: 500 }
    );
  }
}
