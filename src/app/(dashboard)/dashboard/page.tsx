// src/app/(dashboard)/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { ProgressBar } from '@/components/dashboard/ProgressBar'
import { ModuleCard } from '@/components/dashboard/ModuleCard'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { ContinueJourney } from '@/components/dashboard/ContinueJourney'
import { Flame, Target, Clock, TrendingUp } from 'lucide-react'

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
    },
  })

  if (!user) {
    redirect('/sign-in')
  }

  const totalActivities = await db.activity.count()
  const completedActivities = user.activities.filter(a => a.completed).length
  
  // Calculate streak (placeholder - will implement streak tracking later)
  const currentStreak = 0
  
  // Calculate time invested in hours
  const totalTimeSeconds = user.activities.reduce((acc, a) => acc + (a.timeSpent || 0), 0)
  const hoursInvested = Math.round(totalTimeSeconds / 3600)

  // ✅ FIX: Fetch all modules with progress dynamically
  const allModules = await db.module.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { orderIndex: 'asc' }
  })

  const modulesWithProgress = await Promise.all(
    allModules.map(async (module) => {
      // Get progress for this module
      const progress = await db.moduleProgress.findUnique({
        where: {
          userId_moduleId: {
            userId: user.id,
            moduleId: module.id
          }
        }
      })

      // Check if module is unlocked
      let isUnlocked = module.orderIndex === 1 // Module 1 always unlocked

      if (module.orderIndex > 1) {
        // Check if previous module is completed
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

      return {
        ...module,
        progress: progress?.progressPercent || 0,
        isUnlocked
      }
    })
  )

  // Find current/next module
  const currentModule = modulesWithProgress.find(m => 
    m.progress > 0 && m.progress < 100
  ) || modulesWithProgress[0]

  const moduleProgress = currentModule?.progress || 0
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Let&apos;s pick up where you left off.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            icon={<Target className="w-5 h-5 text-blue-600" />}
            title="Overall Progress"
            value={`${user.profile?.overallProgress || 0}%`}
            description="Across all modules"
            trend={user.profile?.overallProgress && user.profile.overallProgress > 0 ? '+' + user.profile.overallProgress : undefined}
          />
          <StatsCard
            icon={<Flame className="w-5 h-5 text-orange-500" />}
            title="Current Streak"
            value={`${currentStreak} days`}
            description="Keep it going!"
            highlighted={currentStreak >= 7}
          />
          <StatsCard
            icon={<TrendingUp className="w-5 h-5 text-green-600" />}
            title="Activities Complete"
            value={`${completedActivities}/${totalActivities}`}
            description="You're making progress"
          />
          <StatsCard
            icon={<Clock className="w-5 h-5 text-purple-600" />}
            title="Time Invested"
            value={`${hoursInvested}h`}
            description="Hours spent learning"
          />
        </div>

        {/* Continue Journey Section */}
        {currentModule && moduleProgress < 100 && (
          <ContinueJourney 
            moduleTitle={currentModule.title}
            progress={moduleProgress}
            nextActivity="Continue your activities"
            estimatedMinutes={15}
            moduleSlug={`module-${currentModule.orderIndex}`}
          />
        )}

        {/* Quick Actions */}
        <QuickActions />

        {/* ✅ FIXED: Modules Grid with Dynamic Unlocking */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Journey</h2>
            <div className="text-sm text-gray-500">
              {completedActivities} of {totalActivities} activities complete
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modulesWithProgress.map((module) => (
              <ModuleCard
                key={module.id}
                title={module.title}
                description={module.description}
                progress={module.progress}
                estimatedTime={`${module.estimatedHours} hours`}
                href={`/module-${module.orderIndex}`}
                unlocked={module.isUnlocked}
                icon={module.icon || '📚'}
                lockMessage={module.isUnlocked ? undefined : `Complete Module ${module.orderIndex - 1} first`}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {user.activities.length > 0 && (
          <RecentActivity activities={user.activities} />
        )}
      </div>
    </div>
  )
}
