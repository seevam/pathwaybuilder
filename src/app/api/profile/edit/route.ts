import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { avatarUrl, bio, skills, socialLinks } = body;

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Ensure profile exists
    if (!user.profile) {
      await db.profile.create({
        data: {
          userId: user.id,
        },
      });
    }

    // Update profile
    const updatedProfile = await db.profile.update({
      where: { userId: user.id },
      data: {
        avatarUrl,
        bio: bio?.substring(0, 500), // Limit bio to 500 characters
        skills: skills || [],
        socialLinks: socialLinks || null,
      },
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
