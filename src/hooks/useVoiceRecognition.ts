// src/hooks/useVoiceRecognition.ts
import { useState, useEffect, useRef, useCallback } from 'react'

interface UseVoiceRecognitionReturn {
  isListening: boolean
  transcript: string
  interimTranscript: string
  isSupported: boolean
  error: string | null
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
}

export function useVoiceRecognition(): UseVoiceRecognitionReturn {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check if Web Speech API is supported
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setIsSupported(true)
        
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'
        recognition.maxAlternatives = 1

        recognition.onresult = (event: any) => {
          let interim = ''
          let final = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPart = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              final += transcriptPart + ' '
            } else {
              interim += transcriptPart
            }
          }

          if (final) {
            setTranscript(prev => prev + final)
            setInterimTranscript('')
            
            // Reset silence timer on final result
            resetSilenceTimer()
          } else {
            setInterimTranscript(interim)
            
            // Reset silence timer on any speech
            resetSilenceTimer()
          }
        }

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setError(event.error)
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
          clearSilenceTimer()
        }

        recognitionRef.current = recognition
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      clearSilenceTimer()
    }
  }, [])

  const resetSilenceTimer = useCallback(() => {
    clearSilenceTimer()
    
    // Auto-stop after 3 seconds of silence
    silenceTimerRef.current = setTimeout(() => {
      if (recognitionRef.current && isListening) {
        stopListening()
      }
    }, 3000)
  }, [isListening])

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
  }

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser')
      return
    }

    try {
      setError(null)
      recognitionRef.current?.start()
      setIsListening(true)
      resetSilenceTimer()
    } catch (err) {
      console.error('Error starting recognition:', err)
      setError('Failed to start speech recognition')
    }
  }, [isSupported, resetSilenceTimer])

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop()
      setIsListening(false)
      clearSilenceTimer()
    } catch (err) {
      console.error('Error stopping recognition:', err)
    }
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
  }, [])

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  }
}
