import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function GET() {
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
          include: {
            activity: {
              include: {
                module: true
              }
            }
          }
        }
      }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    // If no activities completed, return empty state
    if (user.activities.length === 0) {
      return NextResponse.json({
        success: true,
        insights: null
      })
    }

    // Compile all activity data
    const activityData = user.activities.map(ac => ({
      activity: ac.activity.title,
      module: ac.activity.module.title,
      responses: ac.data
    }))

    // Generate AI insights
    const prompt = `You are a career counselor analyzing a high school student's self-discovery activities.

Student Name: ${user.name}
Activities Completed: ${user.activities.length}

Activity Responses:
${JSON.stringify(activityData, null, 2)}

Generate a comprehensive analysis in the following JSON format:

{
  "personality": {
    "traits": [
      {"name": "Creative", "score": 85},
      {"name": "Analytical", "score": 70},
      {"name": "Social", "score": 90},
      {"name": "Leadership", "score": 75},
      {"name": "Detail-Oriented", "score": 65}
    ],
    "summary": "A brief 2-sentence summary of their personality"
  },
  "strengths": [
    {"name": "Strength Name", "description": "Why this is a strength", "icon": "💪"},
    // 3-5 strengths
  ],
  "interests": [
    {"category": "Creative", "score": 85},
    {"category": "Social", "score": 75},
    {"category": "Technical", "score": 60},
    {"category": "Analytical", "score": 70},
    {"category": "Physical", "score": 50}
  ],
  "careerPaths": [
    {"title": "Career Title", "match": 85, "description": "Why this fits"},
    // 3-4 career paths
  ],
  "recommendations": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2",
    // 3-5 recommendations
  ],
  "overallInsight": "A warm, encouraging 3-4 sentence summary that celebrates their uniqueness and potential"
}

Be specific, encouraging, and data-driven. Use varied emojis for strengths (💡, 🎨, 🤝, 🎯, etc.).`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an insightful career counselor. Return valid JSON only.'
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

    const insights = JSON.parse(completion.choices[0].message.content || '{}')

    return NextResponse.json({
      success: true,
      insights
    })
  } catch (error) {
    console.error('[INSIGHTS_GET]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate insights' },
      { status: 500 }
    )
  }
}
