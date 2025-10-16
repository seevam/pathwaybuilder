// src/app/api/learning-hub/speak/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { text, voice = 'nova', speed = 1.0 } = body

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      )
    }

    // Validate voice
    const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']
    if (!validVoices.includes(voice)) {
      return NextResponse.json(
        { error: 'Invalid voice' },
        { status: 400 }
      )
    }

    console.log('[TTS API] Generating speech:', {
      textLength: text.length,
      voice,
      speed,
      textPreview: text.substring(0, 100) + '...'
    })

    // Generate speech using OpenAI TTS
    const mp3Response = await openai.audio.speech.create({
      model: 'tts-1', // Use 'tts-1-hd' for higher quality (costs more)
      voice: voice as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
      input: text,
      speed: speed,
      response_format: 'mp3', // Explicitly set format
    })

    console.log('[TTS API] Speech generated successfully')

    // Convert to buffer
    const buffer = Buffer.from(await mp3Response.arrayBuffer())

    console.log('[TTS API] Sending audio buffer, size:', buffer.length, 'bytes')

    // Return audio with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache',
        'Accept-Ranges': 'bytes',
      },
    })

  } catch (error: any) {
    console.error('[TTS API] Error:', error)
    
    // Handle specific OpenAI errors
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'OpenAI API key is invalid' },
        { status: 500 }
      )
    }
    
    if (error.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Failed to generate speech',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
