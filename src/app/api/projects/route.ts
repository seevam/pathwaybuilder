// src/app/api/projects/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const createProjectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['CREATIVE', 'SOCIAL_IMPACT', 'ENTREPRENEURIAL', 'RESEARCH', 'TECHNICAL', 'LEADERSHIP']),
  status: z.enum(['IDEATION', 'PLANNING', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'ABANDONED']).optional(),
  ideaSource: z.any().optional(),
})

export async function POST(req: Request) {
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

    const body = await req.json()
    const validatedData = createProjectSchema.parse(body)

    const project = await db.project.create({
      data: {
        userId: user.id,
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        status: validatedData.status || 'IDEATION',
        ideaSource: validatedData.ideaSource || null,
      },
    })

    return NextResponse.json({
      success: true,
      project,
    })
  } catch (error) {
    console.error('[CREATE_PROJECT]', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
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

    const projects = await db.project.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            milestones: true,
            tasks: true,
            checkIns: true,
            documents: true,
          },
        },
        milestones: {
          select: {
            status: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      projects,
    })
  } catch (error) {
    console.error('[GET_PROJECTS]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
