import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Verify project ownership
    const project = await db.project.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!project) {
      return new NextResponse('Project not found', { status: 404 })
    }

    const body = await req.json()
    const { milestones } = body

    // Delete existing milestones
    await db.milestone.deleteMany({
      where: { projectId: params.id },
    })

    // Create new milestones
    const createdMilestones = await db.milestone.createMany({
      data: milestones.map((m: any) => ({
        ...m,
        projectId: params.id,
        targetDate: m.targetDate ? new Date(m.targetDate) : null,
      })),
    })

    return NextResponse.json({
      success: true,
      count: createdMilestones.count,
    })
  } catch (error) {
    console.error('[MILESTONES_CREATE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
