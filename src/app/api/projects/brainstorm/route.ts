// src/app/api/projects/generate-options/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import OpenAI from 'openai'
import { UserDiscoveryContext } from '@/lib/services/discovery-context'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

    // Get user's discovery profile
    const profile = await UserDiscoveryContext.getUserProfile(user.id)

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Complete Module 1 activities first' },
        { status: 400 }
      )
    }

    const { type } = await req.json() // 'interests' or 'problems'

    let prompt = ''
    
    if (type === 'interests') {
      prompt = `You are a career counselor analyzing a high school student's profile to suggest **broad interest areas and domains** for a passion project.

Student Profile:
- Top Values: ${profile.topValues.join(', ')}
- Top Strengths: ${profile.topStrengths.map(s => s.name).join(', ')}
- RIASEC Code: ${profile.riasecCode || 'Not completed'}
- DISC Profile: ${profile.discProfile?.primary || 'Not completed'}

Based on this profile, generate 5-6 specific **fields of interest** that align with their values and strengths. These should be:
- **Broad interest domains** (not specific, actionable projects)
- Relevant to high school students
- Diverse across different fields (e.g., tech, arts, social issues)

Return ONLY a JSON object with this structure:
{
  "options": [
    {
      "id": "interest_1",
      "label": "User Experience (UX) Design",
      "description": "The field of designing intuitive and accessible digital or physical products.",
      "alignment": "Matches your creativity and problem-solving strengths"
    }
  ]
}`
    } else {
      prompt = `You are a career counselor analyzing a high school student's profile to suggest problem areas they might care about for a passion project.

Student Profile:
- Top Values: ${profile.topValues.join(', ')}
- Top Strengths: ${profile.topStrengths.map(s => s.name).join(', ')}
- RIASEC Code: ${profile.riasecCode || 'Not completed'}
- Career Interests: ${profile.careerInterests.map(c => c.title).join(', ') || 'Not explored'}

Based on this profile, generate 4-5 specific problem areas or topics they might be passionate about addressing. These should be:
- Real problems affecting their community or peers
- Aligned with their values and interests
- Solvable by a high school student
- Meaningful and impactful
- Diverse across social, environmental, educational, and health domains

Return ONLY a JSON object with this structure:
{
  "options": [
    {
      "id": "problem_1",
      "label": "Student Mental Health & Stress",
      "description": "Teen anxiety and lack of mental health resources in schools",
      "alignment": "Connects to your helping others value and empathy strength"
    }
  ]
}`
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a career counselor. Always return valid JSON only, no other text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    })

    const responseText = completion.choices[0].message.content
    if (!responseText) {
      throw new Error('No response from AI')
    }

    const parsed = JSON.parse(responseText)
    const options = parsed.options || []

    return NextResponse.json({
      success: true,
      options: options.slice(0, 10)
    })
  } catch (error) {
    console.error('[GENERATE_OPTIONS]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate options' },
      { status: 500 }
    )
  }
}
