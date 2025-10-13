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

    const { type, selectedInterests } = await req.json() // 'interests' or 'problems', and selectedInterests array

    let prompt = ''
    
    if (type === 'interests') {
      prompt = `You are a career counselor analyzing a high school student's profile to suggest broad interest areas and fields of study.

Student Profile:
- Top Values: ${profile.topValues.join(', ')}
- Top Strengths: ${profile.topStrengths.map(s => s.name).join(', ')}
- RIASEC Code: ${profile.riasecCode || 'Not completed'}
- DISC Profile: ${profile.discProfile?.primary || 'Not completed'}

Based on this profile, generate 8-10 broad interest areas, fields of study, or domains that align with their values and strengths. These should be:
- Broad domains or fields (not specific projects)
- Academic or professional areas of study
- General interest categories
- Applicable to various career paths
- Diverse across different disciplines

Examples of good interest areas:
- "Environmental Science & Sustainability"
- "Digital Media & Communications"
- "Social Justice & Advocacy"
- "Healthcare & Wellness"
- "Business & Entrepreneurship"
- "Technology & Innovation"

Return ONLY a JSON object with this structure:
{
  "options": [
    {
      "id": "interest_1",
      "label": "Environmental Science & Sustainability",
      "description": "Study of ecosystems, climate, and sustainable practices",
      "alignment": "Matches your value of making an impact and analytical strengths"
    }
  ]
}`
    } else {
      // Problems are now filtered through selected interests
      const interestContext = selectedInterests && selectedInterests.length > 0
        ? `\n- Selected Interest Areas: ${selectedInterests.join(', ')}`
        : ''

      prompt = `You are a career counselor analyzing a high school student's profile to suggest problem areas they might care about.

Student Profile:
- Top Values: ${profile.topValues.join(', ')}
- Top Strengths: ${profile.topStrengths.map(s => s.name).join(', ')}
- RIASEC Code: ${profile.riasecCode || 'Not completed'}${interestContext}

IMPORTANT: Focus on problems that are directly relevant to their selected interest areas: ${selectedInterests?.join(', ') || 'their general profile'}.

Based on this profile and their interests, generate 8-10 specific problem areas or challenges within these domains. These should be:
- Real problems affecting their community, peers, or society
- Directly related to their selected interest areas
- Aligned with their values and strengths
- Solvable or addressable by a high school student
- Meaningful and impactful
- Specific enough to inspire action

Return ONLY a JSON object with this structure:
{
  "options": [
    {
      "id": "problem_1",
      "label": "Teen Mental Health & School Stress",
      "description": "Students struggling with anxiety, depression, and academic pressure",
      "alignment": "Relates to your Healthcare & Wellness interest and helping others value"
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
