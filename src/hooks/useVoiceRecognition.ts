// src/hooks/useVoiceRecognition.ts
import { useState, useCallback, useEffect } from 'react'
import { useAudioRecorder } from './useAudioRecorder'

interface UseVoiceRecognitionReturn {
  isListening: boolean
  transcript: string
  interimTranscript: string
  isSupported: boolean
  error: string | null
  isTranscribing: boolean
  silenceCountdown: number
  startListening: () => Promise<void>
  stopListening: () => Promise<void>
  resetTranscript: () => void
}

export function useVoiceRecognition(): UseVoiceRecognitionReturn {
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  
  const {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording: stopAudioRecording,
    clearRecording,
    error: recordingError,
    isSupported,
    silenceCountdown,
  } = useAudioRecorder()

  // Handle recording errors
  useEffect(() => {
    if (recordingError) {
      setError(recordingError)
    }
  }, [recordingError])

  // Transcribe when recording stops and we have audio
  useEffect(() => {
    console.log('[VOICE-REC] State changed:', {
      hasAudioBlob: !!audioBlob,
      isRecording,
      isTranscribing
    })
    
    if (audioBlob && !isRecording && !isTranscribing) {
      console.log('[VOICE-REC] Conditions met for transcription, calling transcribeAudio')
      transcribeAudio(audioBlob)
    }
  }, [audioBlob, isRecording, isTranscribing, transcribeAudio])

  const transcribeAudio = useCallback(async (blob: Blob) => {
    console.log('[TRANSCRIBE] Starting transcription, blob size:', blob.size)
    setIsTranscribing(true)
    setError(null)
    setInterimTranscript('Transcribing...')

    try {
      // Create form data with audio file
      const formData = new FormData()
      formData.append('audio', blob, 'recording.webm')

      console.log('[TRANSCRIBE] Sending to Whisper API...')

      // Send to Whisper API endpoint
      const response = await fetch('/api/learning-hub/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Transcription failed')
      }

      const data = await response.json()
      
      console.log('[TRANSCRIBE] Success! Transcript:', data.transcript)

      // Set the transcript
      const newTranscript = data.transcript.trim()
      setTranscript(newTranscript)
      setInterimTranscript('')
      clearRecording()

    } catch (err: any) {
      console.error('[TRANSCRIBE] Error:', err)
      setError(err.message || 'Failed to transcribe audio')
      setInterimTranscript('')
    } finally {
      console.log('[TRANSCRIBE] Completed, setting isTranscribing to false')
      setIsTranscribing(false)
    }
  }, [clearRecording])

  const startListening = useCallback(async () => {
    setError(null)
    setInterimTranscript('Recording...')
    await startRecording()
  }, [startRecording])

  const stopListening = useCallback(async () => {
    stopAudioRecording()
  }, [stopAudioRecording])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
    clearRecording()
  }, [clearRecording])

  return {
    isListening: isRecording,
    transcript,
    interimTranscript,
    isSupported,
    error,
    isTranscribing,
    silenceCountdown,
    startListening,
    stopListening,
    resetTranscript,
  }
}
