import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { ProgressBar } from '@/components/dashboard/ProgressBar'
import { ModuleCard } from '@/components/dashboard/ModuleCard'
import { StatsCard } from '@/components/dashboard/StatsCard'

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
      },
    },
  })

  if (!user) {
    redirect('/sign-in')
  }

  const totalActivities = await db.activity.count()
  const completedActivities = user.activities.filter(a => a.completed).length

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {user.name}! 👋
        </h1>
      <p className="text-muted-foreground mt-2">
        Let&apos;s pick up where you left off.
      </p>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Overall Progress"
          value={`${user.profile?.overallProgress || 0}%`}
          description="Across all modules"
        />
        <StatsCard
          title="Activities Complete"
          value={`${completedActivities}/${totalActivities}`}
          description="Keep going!"
        />
        <StatsCard
          title="Time Invested"
          value={`${Math.round((user.activities.reduce((acc, a) => acc + (a.timeSpent || 0), 0)) / 3600)}h`}
          description="Hours spent learning"
        />
      </div>

      {/* Current Progress */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your Journey</h2>
        <ProgressBar
          current={user.profile?.overallProgress || 0}
          total={100}
          label="Overall Progress"
        />
      </div>

      {/* Module 1 Card */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Available Modules</h2>
        <div className="grid gap-6">
          <ModuleCard
            title="Module 1: Know Yourself"
            description="Discover your strengths, values, and personality"
            progress={user.profile?.moduleOneProgress || 0}
            estimatedTime="2-3 weeks"
            href="/module-1"
            unlocked={true}
          />
          
          {/* Locked future modules */}
          <ModuleCard
            title="Module 2: Explore Careers"
            description="Coming soon - unlock by completing Module 1"
            progress={0}
            estimatedTime="2-3 weeks"
            href="#"
            unlocked={false}
          />
        </div>
      </div>

      {/* Recent Activity */}
      {user.activities.length > 0 && (
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-2">
            {user.activities.slice(0, 5).map((completion) => (
              <li key={completion.id} className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span>
                <span>Completed &quot;{completion.activity.title}&quot;</span>
                <span className="text-muted-foreground ml-auto">
                  {new Date(completion.completedAt!).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
