// src/app/api/profile/career-shortlist/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const careerShortlistSchema = z.object({
  shortlist: z.array(z.string()),
  researchedCareers: z.array(z.string())
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
    const { shortlist, researchedCareers } = careerShortlistSchema.parse(body)

    // Update or create profile with career shortlist
    const profile = await db.profile.upsert({
      where: { userId: user.id },
      update: {
        // Store shortlist and researched careers in the goals JSON field for now
        // In a production app, you might want to add dedicated fields to the schema
        goals: {
          careerShortlist: shortlist,
          researchedCareers: researchedCareers,
          updatedAt: new Date().toISOString()
        }
      },
      create: {
        userId: user.id,
        goals: {
          careerShortlist: shortlist,
          researchedCareers: researchedCareers,
          updatedAt: new Date().toISOString()
        }
      }
    })

    return NextResponse.json({
      success: true,
      profile
    })
  } catch (error) {
    console.error('[CAREER_SHORTLIST_POST]', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to save career shortlist' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        profile: true
      }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const goals = user.profile?.goals as any
    
    return NextResponse.json({
      success: true,
      careerShortlist: goals?.careerShortlist || [],
      researchedCareers: goals?.researchedCareers || []
    })
  } catch (error) {
    console.error('[CAREER_SHORTLIST_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
