// src/app/api/activities/riasec-code/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
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

    // Fetch RIASEC assessment completion
    const riasecCompletion = await db.activityCompletion.findFirst({
      where: {
        userId: user.id,
        activity: { slug: 'riasec-assessment' },
        completed: true
      }
    })

    if (!riasecCompletion || !riasecCompletion.data) {
      return NextResponse.json({
        success: true,
        riasecCode: null,
        message: 'RIASEC assessment not completed'
      })
    }

    const data = riasecCompletion.data as any
    const riasecCode = data.code || null

    return NextResponse.json({
      success: true,
      riasecCode,
      scores: data.scores || null
    })
  } catch (error) {
    console.error('[RIASEC_CODE_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
