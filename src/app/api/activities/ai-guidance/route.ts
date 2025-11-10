import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { openai } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { activityId, activityTitle, activityType, currentProgress } = body

    // Fetch activity details from database
    const activity = await db.activity.findUnique({
      where: { id: activityId },
      include: {
        module: {
          select: {
            title: true,
            description: true,
          }
        }
      }
    })

    if (!activity) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      )
    }

    // Fetch previous responses for context
    const previousCompletions = await db.activityCompletion.findMany({
      where: {
        userId: user.id,
        completed: true,
      },
      include: {
        activity: {
          select: {
            title: true,
            type: true,
            orderIndex: true,
          }
        }
      },
      orderBy: {
        activity: {
          orderIndex: 'asc'
        }
      },
      take: 5 // Get last 5 completed activities for context
    })

    // Build context from previous responses
    const previousContext = previousCompletions.map(comp => ({
      activity: comp.activity.title,
      type: comp.activity.type,
      data: comp.data
    }))

    // Create a comprehensive prompt for AI guidance
    const systemPrompt = `You are an encouraging and supportive career guidance assistant helping high school students complete self-discovery activities. Your role is to:

1. Explain what the activity is asking them to do
2. Provide clear, step-by-step guidance on how to complete it
3. Offer tips and examples to help them think deeply
4. Encourage authentic self-reflection
5. Reference their previous work when relevant

Keep your guidance:
- Clear and easy to understand (high school level)
- Encouraging and supportive
- Specific and actionable
- Around 200-300 words
- Structured with clear sections or bullet points`

    const userPrompt = `Help a student complete this activity:

Activity: ${activityTitle}
Type: ${activityType}
Module: ${activity.module.title}
Description: ${activity.description}

${previousContext.length > 0 ? `
Previous Activities Completed:
${previousContext.map(ctx => `- ${ctx.activity} (${ctx.type})`).join('\n')}
` : ''}

${currentProgress ? `
Current Progress:
${JSON.stringify(currentProgress, null, 2)}
` : ''}

Provide helpful guidance on how to complete this activity. Be specific about what they should do, and give examples or prompts to help them think deeply. If they've started working on it, acknowledge their progress and guide them on next steps.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const guidance = completion.choices[0].message.content || ''

    return NextResponse.json({
      success: true,
      guidance
    })

  } catch (error) {
    console.error('Error generating AI guidance:', error)
    return NextResponse.json(
      { error: 'Failed to generate guidance' },
      { status: 500 }
    )
  }
}
