import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const moduleId = searchParams.get('moduleId')
    const activityId = searchParams.get('activityId')

    // Build the where clause
    let whereClause: any = {
      userId: user.id,
      completed: true,
    }

    // If activityId is provided, get that specific activity
    if (activityId) {
      whereClause.activityId = activityId
    }

    // If moduleId is provided, get all activities from that module
    if (moduleId && !activityId) {
      whereClause.activity = {
        moduleId: moduleId
      }
    }

    const completions = await db.activityCompletion.findMany({
      where: whereClause,
      include: {
        activity: {
          select: {
            id: true,
            slug: true,
            title: true,
            type: true,
            orderIndex: true,
            moduleId: true,
          }
        }
      },
      orderBy: {
        activity: {
          orderIndex: 'asc'
        }
      }
    })

    // Transform the data for easier consumption
    const responses = completions.map(completion => ({
      activityId: completion.activityId,
      activitySlug: completion.activity.slug,
      activityTitle: completion.activity.title,
      activityType: completion.activity.type,
      moduleId: completion.activity.moduleId,
      data: completion.data,
      completedAt: completion.completedAt,
      timeSpent: completion.timeSpent,
    }))

    return NextResponse.json({ responses })

  } catch (error) {
    console.error('Error fetching activity responses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity responses' },
      { status: 500 }
    )
  }
}
