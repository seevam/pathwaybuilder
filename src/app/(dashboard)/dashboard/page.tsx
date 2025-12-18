import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { ModuleTracker } from '@/components/dashboard/ModuleTracker'
import { StrengthsCard } from '@/components/dashboard/StrengthsCard'
import { PassionProjectCard } from '@/components/dashboard/PassionProjectCard'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { VideoCard } from '@/components/dashboard/VideoCard'
import { Flame, Target, Clock, Award } from 'lucide-react'

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
        include: {
          activity: true,
        },
        orderBy: {
          completedAt: 'desc'
        },
        take: 10
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

  const totalActivities = await db.activity.count()
  const completedActivities = user.activities.filter(a => a.completed).length
  
  const currentStreak = 0
  
  const totalTimeSeconds = user.activities.reduce((acc, a) => acc + (a.timeSpent || 0), 0)
  const hoursInvested = Math.round(totalTimeSeconds / 3600)

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
  const totalAchievements = completedModules + (completedActivities >= 10 ? 1 : 0)

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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-green-500 bg-clip-text text-transparent">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-base md:text-lg text-gray-600">
          Let&apos;s continue building your pathway to success.
        </p>
      </div>

      {/* Stats Overview - 4 Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={<Target className="w-6 h-6 text-blue-600" />}
          title="Overall Progress"
          value={`${user.profile?.overallProgress || 0}%`}
          description="Across all modules"
          circularProgress={user.profile?.overallProgress || 0}
        />
        <StatsCard
          icon={<Flame className="w-6 h-6 text-orange-500" />}
          title="Current Streak"
          value={`${currentStreak}`}
          description="Keep it going!"
          highlighted={currentStreak >= 7}
          unit="days"
        />
        <StatsCard
          icon={<Award className="w-6 h-6 text-green-600" />}
          title="Activities"
          value={`${completedActivities}`}
          description={`of ${totalActivities} total`}
          progress={(completedActivities / totalActivities) * 100}
        />
        <StatsCard
          icon={<Clock className="w-6 h-6 text-purple-600" />}
          title="Time Invested"
          value={`${hoursInvested}`}
          description="Hours learning"
          unit="hours"
        />
      </div>

      {/* Video Tutorial Card */}
      <VideoCard />

      {/* Module Tracker - Full Width */}
      <ModuleTracker modules={modulesWithProgress} />

      {/* Main Content Grid */}
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

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity */}
      {user.activities.length > 0 && (
        <RecentActivity activities={user.activities} />
      )}

      {/* Achievements Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-500" />
            Your Achievements
          </h2>
        </div>
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex gap-3">
            <span className="text-4xl opacity-100" title="First Steps">🏅</span>
            <span className="text-4xl opacity-100" title="Module Complete">🎯</span>
            <span className="text-4xl opacity-40" title="Locked">🔒</span>
            <span className="text-4xl opacity-40" title="Locked">🔒</span>
            <span className="text-4xl opacity-40" title="Locked">🔒</span>
          </div>
          <p className="text-sm text-gray-500 ml-4">
            Unlock more achievements as you progress through your journey!
          </p>
        </div>
      </div>
    </div>
  )
}
