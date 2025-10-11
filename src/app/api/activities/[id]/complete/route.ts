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

    // Get activity from database to find module
    const activity = await db.activity.findUnique({
      where: { id: params.id },
      include: { module: true }
    })

    if (!activity) {
      return new NextResponse('Activity not found', { status: 404 })
    }

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

    // Recalculate module progress
    const allActivities = await db.activity.findMany({
      where: { 
        moduleId: activity.moduleId,
        requiredForCompletion: true
      }
    })

    const completedActivities = await db.activityCompletion.count({
      where: {
        userId: user.id,
        activityId: { in: allActivities.map(a => a.id) },
        completed: true,
      },
    })

    const moduleProgress = Math.round((completedActivities / allActivities.length) * 100)

    // Update module progress
    await db.moduleProgress.upsert({
      where: {
        userId_moduleId: {
          userId: user.id,
          moduleId: activity.moduleId
        }
      },
      update: {
        progressPercent: moduleProgress,
        status: moduleProgress === 100 ? 'COMPLETED' : moduleProgress > 0 ? 'IN_PROGRESS' : 'NOT_STARTED',
        completedAt: moduleProgress === 100 ? new Date() : null,
      },
      create: {
        userId: user.id,
        moduleId: activity.moduleId,
        progressPercent: moduleProgress,
        status: moduleProgress > 0 ? 'IN_PROGRESS' : 'NOT_STARTED',
        startedAt: new Date(),
      }
    })

    // Update overall progress
    const allModules = await db.module.count()
    const allModuleProgress = await db.moduleProgress.findMany({
      where: { userId: user.id }
    })

    const totalProgress = allModuleProgress.reduce(
      (sum, mp) => sum + mp.progressPercent,
      0
    )
    const overallProgress = Math.round(totalProgress / allModules)

    await db.profile.upsert({
      where: { userId: user.id },
      update: { 
        moduleOneProgress: activity.module.orderIndex === 1 ? moduleProgress : undefined,
        overallProgress 
      },
      create: { 
        userId: user.id, 
        moduleOneProgress: activity.module.orderIndex === 1 ? moduleProgress : 0,
        overallProgress 
      },
    })

    return NextResponse.json({
      success: true,
      completion,
      progress: moduleProgress,
    })
  } catch (error) {
    console.error('[ACTIVITY_COMPLETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
