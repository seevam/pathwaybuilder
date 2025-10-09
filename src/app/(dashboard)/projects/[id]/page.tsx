import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

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
      milestones: { orderBy: { orderIndex: 'asc' } },
      tasks: true,
      checkIns: { orderBy: { createdAt: 'desc' } },
      documents: true,
    },
  })

  if (!project) notFound()

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
        <p className="text-gray-600 mb-8">{project.description}</p>

        {/* TODO: Add project dashboard content */}
        <p>Project dashboard coming soon...</p>
      </div>
    </div>
  )
}
