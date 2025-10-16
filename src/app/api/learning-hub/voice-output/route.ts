// src/app/api/learning-hub/voice-output/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { text, voice = 'alloy', speed = 1.0 } = await req.json()

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'No text provided' },
        { status: 400 }
      )
    }

    // Use OpenAI TTS
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
      input: text,
      speed: speed,
    })

    const buffer = Buffer.from(await mp3.arrayBuffer())

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('[VOICE_OUTPUT]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate speech' },
      { status: 500 }
    )
  }
}
