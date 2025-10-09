import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { activityCompletionSchema } from '@/lib/validations'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const body = await req.json()
    const { data, timeSpent } = activityCompletionSchema.parse(body)

    // Mark activity as complete
    const completion = await db.activityCompletion.upsert({
      where: {
        userId_activityId: {
          userId: user.id,
          activityId: params.id,
        },
      },
      update: {
        completed: true,
        data,
        timeSpent,
        completedAt: new Date(),
      },
      create: {
        userId: user.id,
        activityId: params.id,
        completed: true,
        data,
        timeSpent,
        completedAt: new Date(),
      },
    })

    // Recalculate progress
    const totalActivities = await db.activity.count()
    const completedActivities = await db.activityCompletion.count({
      where: {
        userId: user.id,
        completed: true,
      },
    })

    const progress = Math.round((completedActivities / totalActivities) * 100)

    await db.profile.update({
      where: { userId: user.id },
      data: {
        moduleOneProgress: progress,
        overallProgress: progress,
      },
    })

    return NextResponse.json({
      success: true,
      completion,
      progress,
    })
  } catch (error) {
    console.error('[ACTIVITY_COMPLETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
