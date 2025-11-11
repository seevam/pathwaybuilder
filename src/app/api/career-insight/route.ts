// src/app/api/career-insight/route.ts
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

    // Gather Module 2 career exploration data
    const riasecData = user.activities.find(a => a.activity.slug === 'riasec-assessment')?.data
    const careerClustersData = user.activities.find(a => a.activity.slug === 'career-clusters')?.data
    const dayInLifeData = user.activities.find(a => a.activity.slug === 'day-in-life')?.data

    // Also pull Module 1 data for deeper insights
    const valuesData = user.activities.find(a => a.activity.slug === 'values-card-sort')?.data
    const strengthsData = user.activities.find(a => a.activity.slug === 'strengths-discovery')?.data

    const prompt = `You are an experienced career counselor helping a high school student make sense of their career exploration journey.

Student Profile:
${valuesData ? `Values: ${JSON.stringify((valuesData as any).alwaysTrue || [])}` : ''}
${strengthsData ? `Strengths: ${JSON.stringify((strengthsData as any).categoryScores || {})}` : ''}
${riasecData ? `RIASEC Results: ${JSON.stringify((riasecData as any).scores || {})}` : ''}
${careerClustersData ? `Explored Careers: ${JSON.stringify((careerClustersData as any).interestedCareers || [])}` : ''}
${dayInLifeData ? `Day-in-Life Research: ${JSON.stringify(dayInLifeData)}` : ''}

Career Reflection Responses:
${responses}

Generate a comprehensive career insight in the following JSON format:

{
  "summary": "A warm, encouraging 3-4 paragraph summary that:\n- Acknowledges their career discoveries and surprises\n- Identifies patterns in their interests\n- Connects their career interests to their values and strengths from Module 1\n- Celebrates their self-awareness and curiosity\n- Feels personal and specific to THEIR responses",
  "keyThemes": [
    {
      "theme": "Theme Title",
      "explanation": "2-3 sentences about a pattern or insight in their career interests"
    }
  ],
  "nextSteps": [
    "Specific, actionable next step for career exploration",
    "Another concrete suggestion",
    "A third recommendation for deepening their understanding"
  ]
}

Be warm, specific, and encouraging. Use their actual words. Make them feel excited about their career possibilities.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a warm, experienced career counselor. Return valid JSON only.'
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
    console.error('[CAREER_INSIGHT]', error)

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
