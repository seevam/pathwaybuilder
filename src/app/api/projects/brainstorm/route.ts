// src/app/api/projects/brainstorm/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { z } from 'zod'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const brainstormSchema = z.object({
  interests: z.string().min(10, 'Please describe your interests in more detail'),
  problemArea: z.string().min(10, 'Please describe the problem area'),
  timeCommitment: z.enum(['2-3', '4-6', '7-10', '10+']),
  projectTypes: z.array(z.string()).min(1, 'Select at least one project type'),
})

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const validatedData = brainstormSchema.parse(body)

    // Generate AI-powered project ideas
    const prompt = `You are a career counselor helping a high school student brainstorm passion project ideas.

Student Profile:
- Interests: ${validatedData.interests}
- Problem they care about: ${validatedData.problemArea}
- Time commitment: ${validatedData.timeCommitment} hours per week
- Project types they're interested in: ${validatedData.projectTypes.join(', ')}

Generate 8 diverse, creative, and feasible passion project ideas. Each idea should:
1. Align with their interests and the problem area
2. Be achievable with their time commitment
3. Be meaningful and have measurable impact
4. Be unique and stand out in college applications
5. Match at least one of their preferred project types

For each idea, provide:
- Title (creative, catchy)
- Description (2-3 sentences explaining what they'd do)
- Category (creative, social_impact, entrepreneurial, research, technical, or leadership)
- Feasibility score (1-100, considering their time and resources)
- Time estimate (e.g., "4-6 months")
- Uniqueness rating (HIGH, MEDIUM, LOW)
- Key impact metrics (what they could measure)

Return ONLY a valid JSON array with 8 project ideas. Each idea should have this exact structure:
{
  "id": "unique-id",
  "title": "Project Title",
  "description": "Detailed description...",
  "category": "SOCIAL_IMPACT",
  "feasibilityScore": 85,
  "timeEstimate": "4-6 months",
  "uniqueness": "HIGH",
  "impactMetrics": ["metric1", "metric2"]
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert career counselor specializing in helping high school students develop meaningful passion projects. Always return valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
    })

    const responseText = completion.choices[0].message.content
    if (!responseText) {
      throw new Error('No response from AI')
    }

    // Parse the AI response
    let ideas
    try {
      const parsed = JSON.parse(responseText)
      ideas = parsed.ideas || parsed
      
      // Ensure ideas is an array
      if (!Array.isArray(ideas)) {
        throw new Error('Invalid response format')
      }

      // Add unique IDs if not present
      ideas = ideas.map((idea, index) => ({
        ...idea,
        id: idea.id || `idea_${Date.now()}_${index}`,
      }))
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText)
      throw new Error('Failed to parse AI response')
    }

    return NextResponse.json({
      success: true,
      ideas: ideas.slice(0, 8), // Ensure we only return 8 ideas
    })
  } catch (error) {
    console.error('[PROJECT_BRAINSTORM]', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate project ideas. Please try again.' 
      },
      { status: 500 }
    )
  }
}
