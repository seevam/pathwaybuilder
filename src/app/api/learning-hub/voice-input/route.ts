// src/app/api/learning-hub/voice-input/route.ts
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

    const formData = await req.formData()
    const audio = formData.get('audio') as File

    if (!audio) {
      return NextResponse.json(
        { success: false, error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // Use OpenAI Whisper for transcription
    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: 'whisper-1',
      language: 'en',
    })

    return NextResponse.json({
      success: true,
      transcript: transcription.text,
    })
  } catch (error) {
    console.error('[VOICE_INPUT]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process audio' },
      { status: 500 }
    )
  }
}
