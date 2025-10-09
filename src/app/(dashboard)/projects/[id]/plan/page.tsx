// src/app/(dashboard)/projects/[id]/plan/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import ProjectPlanningTabs from '@/components/projects/ProjectPlanningTabs'

export default async function ProjectPlanPage({
  params,
}: {
  params: { id: string }
}) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) {
    redirect('/sign-in')
  }

  const project = await db.project.findFirst({
    where: {
      id: params.id,
      userId: user.id,
    },
    include: {
      milestones: {
        orderBy: { orderIndex: 'asc' },
      },
      tasks: true,
      checkIns: true,
      documents: true,
    },
  })

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Link href={`/projects/${project.id}`}>
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Project
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Plan Your Project
          </h1>
          <p className="text-gray-600">
            {project.title}
          </p>
        </div>

        <ProjectPlanningTabs project={project} />
      </div>
    </div>
  )
}
