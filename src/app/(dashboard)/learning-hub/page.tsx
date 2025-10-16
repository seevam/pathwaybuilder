// src/app/(dashboard)/learning-hub/page.tsx
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { LearningHubLayout } from '@/components/learning-hub/LearningHubLayout'

export default async function LearningHubPage() {
  const clerkUser = await currentUser()
  if (!clerkUser) redirect('/sign-in')

  const user = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
  })

  if (!user) redirect('/sign-in')

  return <LearningHubLayout userName={user.name} />
}
