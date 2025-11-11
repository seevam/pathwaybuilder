import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { db } from '@/lib/db'

/**
 * POST /api/activities/ai-support
 * Get AI-powered guidance for completing an activity
 */
export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { activityId, activityTitle, activityDescription, userProgress } = body

    if (!activityId || !activityTitle) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Get the activity details
    const activity = await db.activity.findUnique({
      where: { id: activityId },
      include: {
        module: {
          select: {
            title: true,
          },
        },
      },
    })

    if (!activity) {
      return new NextResponse('Activity not found', { status: 404 })
    }

    // Get user's previous completions for context
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const previousCompletions = await db.activityCompletion.findMany({
      where: {
        userId: user.id,
        completed: true,
      },
      include: {
        activity: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        completedAt: 'desc',
      },
      take: 3, // Last 3 completed activities for context
    })

    // Build context from previous activities
    const contextSummary = previousCompletions.length > 0
      ? `The student has recently completed: ${previousCompletions.map(c => c.activity.title).join(', ')}.`
      : 'This is one of the student\'s first activities.'

    // Generate AI guidance
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a supportive career counselor helping high school students with pathway exploration activities. Provide clear, actionable guidance on how to approach and complete activities. Be encouraging, specific, and concise. Keep responses under 200 words.`,
        },
        {
          role: 'user',
          content: `Module: ${activity.module.title}
Activity: ${activityTitle}
Description: ${activityDescription || activity.description}

Context: ${contextSummary}

${userProgress ? `Current Progress: ${userProgress}` : ''}

Provide step-by-step guidance on how to successfully complete this activity. Include:
1. What the activity is asking for
2. How to approach it (2-3 specific steps)
3. Tips for thoughtful responses
4. An encouraging note`,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    })

    const guidance = completion.choices[0].message.content || 'Unable to generate guidance at this time.'

    return NextResponse.json({ guidance })
  } catch (error) {
    console.error('[AI_SUPPORT]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
