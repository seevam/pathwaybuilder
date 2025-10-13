// src/app/api/projects/brainstorm/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import OpenAI from 'openai'
import { UserDiscoveryContext } from '@/lib/services/discovery-context'
import { z } from 'zod'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const brainstormSchema = z.object({
  interests: z.string().min(1),
  problemArea: z.string().min(1),
  timeCommitment: z.string(),
  projectTypes: z.array(z.string()).min(1),
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
    const { interests, problemArea, timeCommitment, projectTypes } = brainstormSchema.parse(body)

    // Get user's discovery profile for personalization
    const profile = await UserDiscoveryContext.getUserProfile(user.id)

    const profileContext = profile ? `
Student Profile Context:
- Top Values: ${profile.topValues.join(', ')}
- Top Strengths: ${profile.topStrengths.map(s => s.name).join(', ')}
- RIASEC Code: ${profile.riasecCode || 'Not available'}
` : ''

    const prompt = `You are a career counselor helping a high school student brainstorm passion project ideas.

${profileContext}

Student Input:
- Interests: ${interests}
- Problem Area: ${problemArea}
- Time Commitment: ${timeCommitment} hours per week
- Preferred Project Types: ${projectTypes.join(', ')}

Generate 8 diverse, creative, and feasible passion project ideas. Each idea should:
1. Align with their interests and the problem area they care about
2. Be achievable with their time commitment
3. Be meaningful and have measurable impact
4. Be unique and stand out in college applications
5. Match at least one of their preferred project types

Return ONLY a JSON object with this exact structure:
{
  "ideas": [
    {
      "id": "idea_1",
      "title": "Clear, Engaging Project Title",
      "description": "2-3 sentence description of what the student will do and why it matters",
      "category": "CREATIVE" | "SOCIAL_IMPACT" | "ENTREPRENEURIAL" | "RESEARCH" | "TECHNICAL" | "LEADERSHIP",
      "feasibilityScore": 85,
      "timeEstimate": "4-6 months",
      "uniqueness": "HIGH" | "MEDIUM" | "LOW",
      "impactMetrics": ["Specific measurable outcome 1", "Specific measurable outcome 2", "Specific measurable outcome 3"]
    }
  ]
}

Make sure each project is:
- Specific and actionable (not vague)
- Appropriate for a high school student
- Genuinely impactful in addressing the problem area
- Diverse in approach (different types of projects)

Examples of GOOD project ideas:
- "Mental Health Podcast Series" - Interview 20 students about stress management
- "Food Waste Reduction App" - Build an app connecting cafeterias with food banks
- "Coding Workshop for Middle Schoolers" - Teach 50 students basic programming

Examples of BAD project ideas:
- "Help people" - Too vague
- "Cure cancer" - Not feasible for high school student
- "Generic volunteer work" - Not unique or impactful enough`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert career counselor. Always return valid JSON only, no other text. Be creative and specific.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.9,
      max_tokens: 3000,
      response_format: { type: 'json_object' }
    })

    const responseText = completion.choices[0].message.content
    if (!responseText) {
      throw new Error('No response from AI')
    }

    const parsed = JSON.parse(responseText)
    
    // Validate response structure
    if (!parsed.ideas || !Array.isArray(parsed.ideas)) {
      console.error('Invalid AI response structure:', parsed)
      throw new Error('Invalid response structure from AI')
    }

    // Ensure all ideas have required fields
    const ideas = parsed.ideas.map((idea: any, index: number) => ({
      id: idea.id || `idea_${Date.now()}_${index}`,
      title: idea.title || 'Untitled Project',
      description: idea.description || 'No description provided',
      category: idea.category || 'SOCIAL_IMPACT',
      feasibilityScore: idea.feasibilityScore || 50,
      timeEstimate: idea.timeEstimate || '4-6 months',
      uniqueness: idea.uniqueness || 'MEDIUM',
      impactMetrics: Array.isArray(idea.impactMetrics) ? idea.impactMetrics : []
    })).slice(0, 8)

    return NextResponse.json({
      success: true,
      ideas
    })
  } catch (error) {
    console.error('[BRAINSTORM]', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to generate project ideas' },
      { status: 500 }
    )
  }
}
