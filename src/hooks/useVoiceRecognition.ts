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
  } = useAudioRecorder()

  // Handle recording errors
  useEffect(() => {
    if (recordingError) {
      setError(recordingError)
    }
  }, [recordingError])

  // Transcribe when recording stops
  useEffect(() => {
    if (audioBlob && !isRecording) {
      transcribeAudio(audioBlob)
    }
  }, [audioBlob, isRecording])

  const transcribeAudio = async (blob: Blob) => {
    setIsTranscribing(true)
    setError(null)

    try {
      // Create form data with audio file
      const formData = new FormData()
      formData.append('audio', blob, 'recording.webm')

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
      
      // Append new transcript
      setTranscript(prev => prev + ' ' + data.transcript.trim())
      setInterimTranscript('')
      clearRecording()

    } catch (err: any) {
      console.error('Transcription error:', err)
      setError(err.message || 'Failed to transcribe audio')
    } finally {
      setIsTranscribing(false)
    }
  }

  const startListening = useCallback(async () => {
    setError(null)
    setInterimTranscript('Recording...')
    await startRecording()
  }, [startRecording])

  const stopListening = useCallback(async () => {
    stopAudioRecording()
    setInterimTranscript('Transcribing...')
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
    startListening,
    stopListening,
    resetTranscript,
  }
}
