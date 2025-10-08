// src/app/(dashboard)/projects/[id]/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'

export default async function ProjectDetailPage({
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
      tasks: {
        orderBy: { createdAt: 'desc' },
      },
      checkIns: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      _count: {
        select: {
          documents: true,
        },
      },
    },
  })

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </Link>

        <div className="space-y-6">
          {/* Header */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {project.title}
                </h1>
                <p className="text-gray-600">{project.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <div className="font-semibold">{project.status}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Category</div>
                <div className="font-semibold">{project.category}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Health Score</div>
                <div className="font-semibold">{project.healthScore}/100</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Documents</div>
                <div className="font-semibold">{project._count.documents}</div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4">
            <Button asChild className="h-auto py-6">
              <Link href={`/projects/${project.id}/plan`}>
                <div className="text-left">
                  <div className="font-semibold">Continue Planning</div>
                  <div className="text-sm opacity-90">Add goals, milestones, and tasks</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-6">
              <div className="text-left">
                <div className="font-semibold">Add Check-In</div>
                <div className="text-sm text-gray-600">Log progress and reflections</div>
              </div>
            </Button>
          </div>

          {/* Coming Soon */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-800">
              Full project management features (milestones, tasks, check-ins, documents) coming soon!
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
