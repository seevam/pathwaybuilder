// src/app/(dashboard)/learning-hub/[sessionId]/page.tsx
import { currentUser } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { LearningHubLayout } from '@/components/learning-hub/LearningHubLayout'

interface SessionPageProps {
  params: {
    sessionId: string
  }
}

export default async function SessionPage({ params }: SessionPageProps) {
  const clerkUser = await currentUser()
  if (!clerkUser) redirect('/sign-in')

  const user = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
  })

  if (!user) redirect('/sign-in')

  // Fetch session with messages
  const session = await db.learningSession.findFirst({
    where: {
      id: params.sessionId,
      userId: user.id,
    },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  if (!session) notFound()

  // Transform messages for the component
  const initialMessages = session.messages.map(m => ({
    id: m.id,
    role: m.role,
    content: m.content,
    category: m.category,
    createdAt: m.createdAt,
  }))

  return (
    <LearningHubLayout 
      userName={user.name}
      sessionId={session.id}
      initialMessages={initialMessages}
    />
  )
}
