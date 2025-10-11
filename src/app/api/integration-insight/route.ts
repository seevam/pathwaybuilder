// src/app/api/integration-insight/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import OpenAI from 'openai'
import { z } from 'zod'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const requestSchema = z.object({
  responses: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        profile: true,
        activities: {
          where: { completed: true },
          include: { activity: true }
        }
      }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const body = await req.json()
    const { responses } = requestSchema.parse(body)

    // Gather all Module 1 data for context
    const valuesData = user.activities.find(a => a.activity.slug === 'values-card-sort')?.data
    const strengthsData = user.activities.find(a => a.activity.slug === 'strengths-discovery')?.data
    const whoAmIData = user.activities.find(a => a.activity.slug === 'who-am-i')?.data

    const prompt = `You are an insightful career counselor helping a high school student integrate their self-discovery journey.

Student Profile Data:
${valuesData ? `Top Values: ${JSON.stringify((valuesData as any).alwaysTrue || [])}` : ''}
${strengthsData ? `Strength Ratings: ${JSON.stringify((strengthsData as any).categoryScores || {})}` : ''}
${whoAmIData ? `Who Am I Responses: ${JSON.stringify(whoAmIData)}` : ''}

Student's Reflection Responses:
${responses}

Generate a comprehensive integration insight in the following JSON format:

{
  "keyThemes": [
    {
      "theme": "Theme Name",
      "explanation": "2-3 sentences explaining this theme in their profile"
    }
  ],
  "summary": "A warm, encouraging 3-4 paragraph summary that:\n- Celebrates their unique combination of values, strengths, and reflections\n- Points out meaningful patterns and connections\n- Validates their self-awareness and growth\n- Feels personal and specific to THEIR responses",
  "alignment": "A paragraph explaining how their values and strengths align (or where there might be growth areas)",
  "nextSteps": [
    "Specific, actionable next step based on their profile",
    "Another concrete suggestion",
    "A third recommendation for their journey"
  ]
}

Be warm, specific, and encouraging. Use their actual words and discoveries. Make them feel seen and understood.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a warm, insightful career counselor. Return valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    })

    const insight = JSON.parse(completion.choices[0].message.content || '{}')

    return NextResponse.json({
      success: true,
      insight
    })
  } catch (error) {
    console.error('[INTEGRATION_INSIGHT]', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to generate insight' },
      { status: 500 }
    )
  }
}
