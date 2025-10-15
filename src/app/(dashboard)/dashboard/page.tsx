import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { ModuleTracker } from '@/components/dashboard/ModuleTracker'
import { StrengthsCard } from '@/components/dashboard/StrengthsCard'
import { PassionProjectCard } from '@/components/dashboard/PassionProjectCard'

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
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
    redirect('/sign-in')
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
    streak: 5, // Calculate based on check-ins
    nextActions: activeProject.tasks.slice(0, 3).map(task => ({
      id: task.id,
      title: task.title,
      completed: task.completed
    }))
  } : {}

  // Get strengths data from activities
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        userName={user.name}
        completedModules={completedModules}
        currentStreak={currentStreak}
        totalAchievements={totalAchievements}
      />

      {/* Main Content */}
      <main className="flex-1 ml-56 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Module Tracker - Full Width */}
          <ModuleTracker modules={modulesWithProgress} />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Passion Project Card - 2 columns */}
            <div className="lg:col-span-2">
              <PassionProjectCard {...projectData} />
            </div>

            {/* Strengths Card - 1 column */}
            <div className="lg:col-span-1">
              <StrengthsCard traits={traits} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
