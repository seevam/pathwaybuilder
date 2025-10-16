// src/hooks/useVoiceRecognition.ts
import { useState, useCallback, useEffect, useRef } from 'react'
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
  const hasTranscribedRef = useRef(false)
  
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

  // Transcribe function - defined first
  const transcribeAudio = useCallback(async (blob: Blob) => {
    console.log('[TRANSCRIBE] Starting transcription, blob size:', blob.size)
    setIsTranscribing(true)
    setError(null)
    setInterimTranscript('Transcribing...')
    hasTranscribedRef.current = true

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

  // Transcribe when recording stops and we have audio - NOW defined after transcribeAudio
  useEffect(() => {
    console.log('[VOICE-REC] State changed:', {
      hasAudioBlob: !!audioBlob,
      isRecording,
      isTranscribing,
      hasTranscribed: hasTranscribedRef.current
    })
    
    // Only transcribe if we have a blob, not recording, not already transcribing, and haven't transcribed this blob yet
    if (audioBlob && !isRecording && !isTranscribing && !hasTranscribedRef.current) {
      console.log('[VOICE-REC] Conditions met for transcription, calling transcribeAudio')
      transcribeAudio(audioBlob)
    }
    
    // Reset the flag when we start recording again
    if (isRecording) {
      hasTranscribedRef.current = false
    }
  }, [audioBlob, isRecording, isTranscribing, transcribeAudio])

  const startListening = useCallback(async () => {
    setError(null)
    setInterimTranscript('Recording...')
    hasTranscribedRef.current = false
    await startRecording()
  }, [startRecording])

  const stopListening = useCallback(async () => {
    stopAudioRecording()
  }, [stopAudioRecording])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
    hasTranscribedRef.current = false
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
