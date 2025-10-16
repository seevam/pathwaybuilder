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
    if (audioBlob && !isRecording && !isTranscribing) {
      transcribeAudio(audioBlob)
    }
  }, [audioBlob, isRecording])

  const transcribeAudio = async (blob: Blob) => {
    setIsTranscribing(true)
    setError(null)
    setInterimTranscript('Transcribing...')

    try {
      // Create form data with audio file
      const formData = new FormData()
      formData.append('audio', blob, 'recording.webm')

      console.log('Sending audio to Whisper API...')

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
      
      console.log('Transcription result:', data.transcript)

      // Set the transcript
      const newTranscript = data.transcript.trim()
      setTranscript(newTranscript)
      setInterimTranscript('')
      clearRecording()

    } catch (err: any) {
      console.error('Transcription error:', err)
      setError(err.message || 'Failed to transcribe audio')
      setInterimTranscript('')
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
