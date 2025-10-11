import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { z } from 'zod'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const requestSchema = z.object({
  answers: z.string(),
})

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { answers } = requestSchema.parse(body)

    const prompt = `You are an insightful career counselor analyzing a high school student's self-reflection responses.

Based on their answers to "Who Am I?" questions, provide a warm, encouraging, and specific analysis that helps them understand themselves better.

Student's Responses:
${answers}

Provide a personalized insight (150-200 words) that:
1. Identifies 2-3 key themes or patterns in their responses
2. Highlights their unique strengths and qualities
3. Suggests potential career interests or paths that align with their personality
4. Ends with an encouraging, forward-looking statement

Write in a warm, conversational tone - like a supportive mentor who truly sees and values them.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a warm, insightful career counselor who helps students discover their potential. Be specific, encouraging, and authentic.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 350,
    })

    const insight = completion.choices[0].message.content || 
      "Your responses show thoughtfulness and self-awareness. These are valuable qualities that will serve you well as you explore different career paths and opportunities."

    return NextResponse.json({
      success: true,
      insight
    })
  } catch (error) {
    console.error('[ANALYZE_IDENTITY]', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to analyze responses' 
      },
      { status: 500 }
    )
  }
}
