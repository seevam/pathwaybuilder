import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/activities/responses
 * Fetch all completed activity responses for the current user
 * Used for context carryover between activities
 */
export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url)
    const moduleId = searchParams.get('moduleId')
    const activityId = searchParams.get('activityId')

    // If specific activity requested
    if (activityId) {
      const completion = await db.activityCompletion.findUnique({
        where: {
          userId_activityId: {
            userId: user.id,
            activityId,
          },
        },
        include: {
          activity: {
            select: {
              slug: true,
              title: true,
              moduleId: true,
            },
          },
        },
      })

      return NextResponse.json({ completion })
    }

    // If module specified, get all completions for that module
    if (moduleId) {
      const activities = await db.activity.findMany({
        where: { moduleId },
        orderBy: { orderIndex: 'asc' },
      })

      const completions = await db.activityCompletion.findMany({
        where: {
          userId: user.id,
          activityId: { in: activities.map(a => a.id) },
          completed: true,
        },
        include: {
          activity: {
            select: {
              slug: true,
              title: true,
              orderIndex: true,
            },
          },
        },
        orderBy: {
          completedAt: 'asc',
        },
      })

      return NextResponse.json({ completions })
    }

    // Get all completions for the user
    const completions = await db.activityCompletion.findMany({
      where: {
        userId: user.id,
        completed: true,
      },
      include: {
        activity: {
          select: {
            slug: true,
            title: true,
            moduleId: true,
            orderIndex: true,
          },
        },
      },
      orderBy: {
        completedAt: 'asc',
      },
    })

    return NextResponse.json({ completions })
  } catch (error) {
    console.error('[ACTIVITIES_RESPONSES_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
