import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateReflectionInsight } from '@/lib/openai'
import { reflectionSchema } from '@/lib/validations'

export async function POST(req: Request) {
  try {
    const { userId } = auth()
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
    const { prompt, response } = reflectionSchema.parse(body)

    // Generate AI insight
    const aiInsight = await generateReflectionInsight(prompt, response)

    // Save reflection
    const reflection = await db.reflection.create({
      data: {
        userId: user.id,
        prompt,
        response,
        aiInsight,
      },
    })

    return NextResponse.json({
      success: true,
      reflection,
    })
  } catch (error) {
    console.error('[AI_REFLECT]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
