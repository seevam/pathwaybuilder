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

    // ⭐ MODIFICATION 1: Destructure 'selectedInterest' from the request body
    const { type, selectedInterest } = await req.json() as { type: 'interests' | 'problems', selectedInterest?: string }

    let prompt = ''
    
    if (type === 'interests') {
      prompt = `You are a career counselor analyzing a high school student's profile to suggest **broad interest areas and domains** for a passion project.

Student Profile:
- Top Values: ${profile.topValues.join(', ')}
- Top Strengths: ${profile.topStrengths.map(s => s.name).join(', ')}
- RIASEC Code: ${profile.riasecCode || 'Not completed'}
- DISC Profile: ${profile.discProfile?.primary || 'Not completed'}

Based on this profile, generate 8-10 specific **fields of interest** that align with their values and strengths. These should be:
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
    } else if (type === 'problems') {
        // ⭐ MODIFICATION 2: Update the problem prompt to include the selected interest

        if (!selectedInterest) {
             return NextResponse.json(
                { success: false, error: 'A selected interest is required to generate problems.' },
                { status: 400 }
            )
        }

      prompt = `You are a career counselor analyzing a high school student's profile to suggest problem areas they might care about for a passion project.
        
**Primary Interest Area:** ${selectedInterest}

Student Profile:
- Top Values: ${profile.topValues.join(', ')}
- Top Strengths: ${profile.topStrengths.map(s => s.name).join(', ')}
- RIASEC Code: ${profile.riasecCode || 'Not completed'}
- Career Interests: ${profile.careerInterests.map(c => c.title).join(', ') || 'Not explored'}

Based on this profile **AND the selected Primary Interest Area**, generate 8-10 specific problem areas or topics they might be passionate about addressing. These should be:
- Real problems affecting their community or peers
- **Directly related to the Primary Interest Area**
- Aligned with their values and strengths/interests
- Solvable by a high school student
- Meaningful and impactful

Return ONLY a JSON object with this structure:
{
  "options": [
    {
      "id": "problem_1",
      "label": "Accessible Public Transit Mapping",
      "description": "Lack of reliable, real-time mapping information for students using public transportation.",
      "alignment": "Connects to your interest in technology and your helping others value."
    }
  ]
}`
    } else {
         return new NextResponse('Invalid type specified', { status: 400 })
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
