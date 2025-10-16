// src/app/api/learning-hub/transcribe/route.ts
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

    // Get the audio file from form data
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    console.log('Transcribing audio file:', {
      name: audioFile.name,
      type: audioFile.type,
      size: audioFile.size
    })

    // Convert File to format OpenAI accepts
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en', // Optional: helps with accuracy
      response_format: 'json',
    })

    return NextResponse.json({
      success: true,
      transcript: transcription.text,
    })

  } catch (error: any) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to transcribe audio',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
