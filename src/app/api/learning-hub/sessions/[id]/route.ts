// src/app/api/learning-hub/sessions/[id]/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
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

    const session = await db.learningSession.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!session) {
      return new NextResponse('Session not found', { status: 404 })
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        title: session.title || 'New Conversation',
        category: session.category,
        startedAt: session.startedAt,
        updatedAt: session.updatedAt,
        messages: session.messages.map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
          category: m.category,
          createdAt: m.createdAt,
        }))
      }
    })
  } catch (error) {
    console.error('[GET_SESSION]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(
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

    // Delete session (messages will cascade delete)
    await db.learningSession.deleteMany({
      where: {
        id: params.id,
        userId: user.id,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Session deleted successfully'
    })
  } catch (error) {
    console.error('[DELETE_SESSION]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
