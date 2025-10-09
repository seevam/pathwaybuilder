import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Plus, CheckCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react'
import { ProjectHeader } from '@/components/projects/ProjectHeader'
import { ProjectMetrics } from '@/components/projects/ProjectMetrics'
import { MilestoneTimeline } from '@/components/projects/MilestoneTimeline'
import { TaskList } from '@/components/projects/TaskList'
import { RecentActivity } from '@/components/projects/RecentActivity'
import { QuickActions } from '@/components/projects/QuickActions'

export default async function ProjectPage({
  params,
}: {
  params: { id: string }
}) {
  const { userId } = await auth()
  
  if (!userId) redirect('/sign-in')

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) redirect('/sign-in')

  const project = await db.project.findFirst({
    where: {
      id: params.id,
      userId: user.id,
    },
    include: {
      milestones: { 
        orderBy: { orderIndex: 'asc' },
      },
      tasks: { 
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      checkIns: { 
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      documents: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })

  if (!project) notFound()

  // Calculate metrics
  const totalTasks = await db.task.count({
    where: { projectId: project.id }
  })
  
  const completedTasks = await db.task.count({
    where: { 
      projectId: project.id,
      completed: true,
    }
  })

  const completedMilestones = project.milestones.filter(
    m => m.status === 'COMPLETED'
  ).length

  const totalHours = project.checkIns.reduce(
    (sum, checkIn) => sum + (checkIn.hoursLogged || 0), 
    0
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </Link>

        {/* Project Header */}
        <ProjectHeader project={project} />

        {/* Metrics Overview */}
        <ProjectMetrics 
          healthScore={project.healthScore}
          totalHours={totalHours}
          completedTasks={completedTasks}
          totalTasks={totalTasks}
          completedMilestones={completedMilestones}
          totalMilestones={project.milestones.length}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Timeline & Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {/* Milestone Timeline */}
            <MilestoneTimeline 
              milestones={project.milestones}
              projectId={project.id}
            />

            {/* Task List */}
            <TaskList 
              tasks={project.tasks}
              projectId={project.id}
            />
          </div>

          {/* Right Column - Quick Actions & Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActions projectId={project.id} />

            {/* Recent Activity */}
            <RecentActivity 
              checkIns={project.checkIns}
              documents={project.documents}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
