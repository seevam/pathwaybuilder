import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        profile: true,
        activities: {
          where: { completed: true },
        },
        projects: {
          where: {
            status: {
              in: ['PLANNING', 'IN_PROGRESS']
            }
          },
          include: {
            milestones: true,
            tasks: true,
          },
          orderBy: { updatedAt: 'desc' },
          take: 1
        }
      },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const completedActivities = user.activities.filter(a => a.completed).length
    const currentStreak = 0 // Calculate based on your logic
    const totalAchievements = 2 // Calculate based on your logic

    const allModules = await db.module.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { orderIndex: 'asc' }
    })

    const modulesWithProgress = await Promise.all(
      allModules.map(async (module) => {
        const progress = await db.moduleProgress.findUnique({
          where: {
            userId_moduleId: {
              userId: user.id,
              moduleId: module.id
            }
          }
        })

        let isUnlocked = module.orderIndex === 1

        if (module.orderIndex > 1) {
          const previousModule = await db.module.findFirst({
            where: { orderIndex: module.orderIndex - 1 }
          })

          if (previousModule) {
            const previousProgress = await db.moduleProgress.findUnique({
              where: {
                userId_moduleId: {
                  userId: user.id,
                  moduleId: previousModule.id
                }
              }
            })

            isUnlocked = previousProgress?.status === 'COMPLETED'
          }
        }

        const progressPercent = progress?.progressPercent ?? 0
        
        return {
          ...module,
          icon: module.icon ?? undefined,
          progress: progressPercent,
          status: progressPercent === 100 ? 'completed' : 
                  progressPercent > 0 ? 'active' : 'pending',
          isUnlocked
        }
      })
    )

    const completedModules = modulesWithProgress.filter(m => m.status === 'completed').length

    // Get active project data
    const activeProject = user.projects[0]
    const projectData = activeProject ? {
      projectTitle: activeProject.title,
      progress: activeProject.healthScore,
      milestonesCompleted: activeProject.milestones.filter(m => m.status === 'COMPLETED').length,
      totalMilestones: activeProject.milestones.length,
      streak: 5,
      nextActions: activeProject.tasks.slice(0, 3).map(task => ({
        id: task.id,
        title: task.title,
        completed: task.completed
      }))
    } : {}

    // Get strengths data
    const strengthsActivity = await db.activityCompletion.findFirst({
      where: {
        userId: user.id,
        activity: { slug: 'strengths-discovery' },
        completed: true
      }
    })

    const strengthsData = strengthsActivity?.data as any
    const traits = strengthsData?.categoryScores ? Object.entries(strengthsData.categoryScores).map(([name, score]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      score: score as number,
      color: 'bg-blue-100 text-blue-700 border-blue-300'
    })) : undefined

    return NextResponse.json({
      userName: user.name,
      completedModules,
      currentStreak,
      totalAchievements,
      modulesWithProgress,
      projectData,
      traits
    })
  } catch (error) {
    console.error('[DASHBOARD_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
