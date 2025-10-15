// src/app/(dashboard)/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { ModuleJourney } from '@/components/dashboard/ModuleJourney'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { ContinueJourney } from '@/components/dashboard/ContinueJourney'
import { ProfileSnapshot } from '@/components/dashboard/ProfileSnapshot'
import { Flame, Target, Clock, TrendingUp, Award } from 'lucide-react'

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

  const currentModule = modulesWithProgress.find(m => 
    m.progress > 0 && m.progress < 100
  ) || modulesWithProgress[0]

  const moduleProgress = currentModule?.progress || 0
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-green-500 bg-clip-text text-transparent">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Let&apos;s continue building your pathway to success.
          </p>
        </div>

        {/* Stats Overview - More Visual */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            icon={<Target className="w-6 h-6 text-blue-600" />}
            title="Overall Progress"
            value={`${user.profile?.overallProgress || 0}%`}
            description="Across all modules"
            trend={user.profile?.overallProgress && user.profile.overallProgress > 0 ? '+' + user.profile.overallProgress : undefined}
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
            icon={<TrendingUp className="w-6 h-6 text-green-600" />}
            title="Activities Complete"
            value={`${completedActivities}`}
            description={`of ${totalActivities} total`}
            progress={(completedActivities / totalActivities) * 100}
          />
          <StatsCard
            icon={<Clock className="w-6 h-6 text-purple-600" />}
            title="Time Invested"
            value={`${hoursInvested}`}
            description="Hours spent learning"
            unit="hours"
          />
        </div>

        {/* Journey Visualization - New Design */}
        <ModuleJourney modules={modulesWithProgress} />

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Continue Journey - Takes 2 columns */}
          <div className="lg:col-span-2">
            {currentModule && moduleProgress < 100 && (
              <ContinueJourney 
                moduleTitle={currentModule.title}
                progress={moduleProgress}
                nextActivity="Continue your activities"
                estimatedMinutes={15}
                moduleSlug={`module-${currentModule.orderIndex}`}
              />
            )}
          </div>

          {/* Profile Snapshot */}
          <div className="lg:col-span-1">
            <ProfileSnapshot 
              overallProgress={user.profile?.overallProgress || 0}
              completedActivities={completedActivities}
              totalActivities={totalActivities}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Activity - Enhanced Design */}
        {user.activities.length > 0 && (
          <RecentActivity activities={user.activities} />
        )}

        {/* Achievements Preview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              Your Achievements
            </h2>
          </div>
          <div className="flex gap-4 items-center">
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
    </div>
  )
}
