// src/app/api/learning-hub/sessions/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

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

    const sessions = await db.learningSession.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { messages: true }
        }
      },
      take: 50, // Last 50 sessions
    })

    return NextResponse.json({
      success: true,
      sessions: sessions.map(s => ({
        id: s.id,
        title: s.title || 'New Conversation',
        category: s.category,
        messageCount: s._count.messages,
        startedAt: s.startedAt,
        updatedAt: s.updatedAt,
        rating: s.rating,
      }))
    })
  } catch (error) {
    console.error('[GET_SESSIONS]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

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

    const session = await db.learningSession.create({
      data: {
        userId: user.id,
        mode: 'TEXT',
      }
    })

    return NextResponse.json({
      success: true,
      sessionId: session.id,
    })
  } catch (error) {
    console.error('[CREATE_SESSION]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
