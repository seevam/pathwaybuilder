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

  // Find current/next module
  const moduleProgress = user.profile?.moduleOneProgress || 0
  
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
        {moduleProgress < 100 && (
          <ContinueJourney 
            moduleTitle="Module 1: Know Yourself"
            progress={moduleProgress}
            nextActivity="Values Card Sort"
            estimatedMinutes={15}
            moduleSlug="module-1"
          />
        )}

        {/* Quick Actions */}
        <QuickActions />

        {/* Modules Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Journey</h2>
            <div className="text-sm text-gray-500">
              {completedActivities} of {totalActivities} activities complete
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ModuleCard
              title="Module 1: Know Yourself"
              description="Discover your strengths, values, and personality"
              progress={user.profile?.moduleOneProgress || 0}
              estimatedTime="2-3 weeks"
              href="/module-1"
              unlocked={true}
              icon="🎯"
            />
            
            <ModuleCard
              title="Module 2: Explore Careers"
              description="From interests to real-world opportunities"
              progress={0}
              estimatedTime="2-3 weeks"
              href="/module-2"
              unlocked={false}
              icon="🗺️"
              lockMessage="Complete Module 1 first"
            />

            <ModuleCard
              title="Module 3: Work Style"
              description="Understand how you thrive in work environments"
              progress={0}
              estimatedTime="1-2 weeks"
              href="/module-3"
              unlocked={false}
              icon="💼"
              lockMessage="Complete Module 2 first"
            />

            <ModuleCard
              title="Module 4: Map Your Path"
              description="From high school to career readiness"
              progress={0}
              estimatedTime="2-3 weeks"
              href="/module-4"
              unlocked={false}
              icon="🧭"
              lockMessage="Complete Module 3 first"
            />

            <ModuleCard
              title="Module 5: Build Action Plan"
              description="Turn vision into concrete steps"
              progress={0}
              estimatedTime="1-2 weeks"
              href="/module-5"
              unlocked={false}
              icon="✅"
              lockMessage="Complete Module 4 first"
            />

            <ModuleCard
              title="Module 6: Own Your Story"
              description="Craft your narrative and digital presence"
              progress={0}
              estimatedTime="1-2 weeks"
              href="/module-6"
              unlocked={false}
              icon="📖"
              lockMessage="Complete Module 5 first"
            />
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
