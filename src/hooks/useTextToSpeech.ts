// src/hooks/useTextToSpeech.ts
import { useState, useCallback, useRef, useEffect } from 'react'

type OpenAIVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'

interface VoiceOption {
  id: OpenAIVoice
  name: string
  description: string
}

interface UseTextToSpeechReturn {
  isSpeaking: boolean
  isPaused: boolean
  isSupported: boolean
  isLoading: boolean
  error: string | null
  speak: (text: string, options?: SpeechOptions) => Promise<void>
  pause: () => void
  resume: () => void
  stop: () => void
  voices: VoiceOption[]
  selectedVoice: OpenAIVoice
  speed: number
  setVoice: (voice: OpenAIVoice) => void
  setSpeed: (speed: number) => void
}

interface SpeechOptions {
  voice?: OpenAIVoice
  speed?: number
}

const VOICE_OPTIONS: VoiceOption[] = [
  { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced' },
  { id: 'echo', name: 'Echo', description: 'Warm and engaging' },
  { id: 'fable', name: 'Fable', description: 'Expressive and dynamic' },
  { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative' },
  { id: 'nova', name: 'Nova', description: 'Energetic and bright' },
  { id: 'shimmer', name: 'Shimmer', description: 'Soft and gentle' },
]

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedVoice, setSelectedVoice] = useState<OpenAIVoice>('nova')
  const [speed, setSpeedState] = useState(1.0)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentBlobUrlRef = useRef<string | null>(null)

  // Check if audio is supported
  const isSupported = typeof Audio !== 'undefined'

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current)
        currentBlobUrlRef.current = null
      }
    }
  }, [])

  const speak = useCallback(async (text: string, options?: SpeechOptions) => {
    if (!isSupported) {
      setError('Audio playback is not supported')
      return
    }

    console.log('TTS: Starting speech generation...')

    // Stop and cleanup any current playback
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (currentBlobUrlRef.current) {
      URL.revokeObjectURL(currentBlobUrlRef.current)
      currentBlobUrlRef.current = null
    }

    setIsLoading(true)
    setError(null)

    try {
      const voice = options?.voice || selectedVoice
      const speechSpeed = options?.speed || speed

      console.log('TTS: Calling API with voice:', voice, 'speed:', speechSpeed)

      // Call TTS API
      const response = await fetch('/api/learning-hub/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice,
          speed: speechSpeed,
        })
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(error.error || 'Failed to generate speech')
      }

      console.log('TTS: Received audio response, creating blob...')

      // Get audio blob
      const audioBlob = await response.blob()
      console.log('TTS: Audio blob created:', audioBlob.type, audioBlob.size, 'bytes')

      // Create blob URL with explicit type
      const audioUrl = URL.createObjectURL(
        new Blob([audioBlob], { type: 'audio/mpeg' })
      )
      currentBlobUrlRef.current = audioUrl

      console.log('TTS: Creating audio element...')

      // Create and configure audio element
      const audio = new Audio()
      audio.preload = 'auto'
      audioRef.current = audio

      // Set up event handlers BEFORE setting src
      audio.onloadeddata = () => {
        console.log('TTS: Audio loaded successfully, duration:', audio.duration)
      }

      audio.oncanplay = () => {
        console.log('TTS: Audio can play, starting playback...')
      }

      audio.onplay = () => {
        console.log('TTS: Audio playing')
        setIsSpeaking(true)
        setIsPaused(false)
        setIsLoading(false)
      }

      audio.onended = () => {
        console.log('TTS: Audio ended')
        setIsSpeaking(false)
        setIsPaused(false)
        if (currentBlobUrlRef.current) {
          URL.revokeObjectURL(currentBlobUrlRef.current)
          currentBlobUrlRef.current = null
        }
      }

      audio.onerror = (e) => {
        console.error('TTS: Audio error:', e)
        console.error('Audio error details:', {
          error: audio.error,
          code: audio.error?.code,
          message: audio.error?.message,
          networkState: audio.networkState,
          readyState: audio.readyState
        })
        
        let errorMessage = 'Failed to play audio'
        if (audio.error) {
          switch (audio.error.code) {
            case MediaError.MEDIA_ERR_ABORTED:
              errorMessage = 'Audio playback was aborted'
              break
            case MediaError.MEDIA_ERR_NETWORK:
              errorMessage = 'Network error while loading audio'
              break
            case MediaError.MEDIA_ERR_DECODE:
              errorMessage = 'Audio decoding failed - format may not be supported'
              break
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMessage = 'Audio format not supported by your browser'
              break
          }
        }
        
        setError(errorMessage)
        setIsSpeaking(false)
        setIsLoading(false)
        
        if (currentBlobUrlRef.current) {
          URL.revokeObjectURL(currentBlobUrlRef.current)
          currentBlobUrlRef.current = null
        }
      }

      audio.onpause = () => {
        if (!audio.ended) {
          console.log('TTS: Audio paused')
          setIsPaused(true)
        }
      }

      audio.onresume = () => {
        console.log('TTS: Audio resumed')
        setIsPaused(false)
      }

      // Set the source and load
      audio.src = audioUrl
      console.log('TTS: Audio src set, loading...')
      
      // Explicitly load the audio
      audio.load()

      // Wait a bit for loading, then try to play
      setTimeout(async () => {
        try {
          console.log('TTS: Attempting to play...')
          await audio.play()
        } catch (playError) {
          console.error('TTS: Play error:', playError)
          setError('Failed to start audio playback: ' + (playError as Error).message)
          setIsSpeaking(false)
          setIsLoading(false)
        }
      }, 100)

    } catch (err: any) {
      console.error('TTS error:', err)
      setError(err.message || 'Failed to generate speech')
      setIsSpeaking(false)
      setIsLoading(false)
    }
  }, [isSupported, selectedVoice, speed])

  const pause = useCallback(() => {
    if (audioRef.current && isSpeaking && !isPaused) {
      console.log('TTS: Pausing audio')
      audioRef.current.pause()
      setIsPaused(true)
    }
  }, [isSpeaking, isPaused])

  const resume = useCallback(() => {
    if (audioRef.current && isSpeaking && isPaused) {
      console.log('TTS: Resuming audio')
      audioRef.current.play()
      setIsPaused(false)
    }
  }, [isSpeaking, isPaused])

  const stop = useCallback(() => {
    console.log('TTS: Stopping audio')
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    if (currentBlobUrlRef.current) {
      URL.revokeObjectURL(currentBlobUrlRef.current)
      currentBlobUrlRef.current = null
    }
    setIsSpeaking(false)
    setIsPaused(false)
  }, [])

  const setVoice = useCallback((voice: OpenAIVoice) => {
    setSelectedVoice(voice)
  }, [])

  const setSpeed = useCallback((newSpeed: number) => {
    // OpenAI TTS supports 0.25 to 4.0
    setSpeedState(Math.max(0.25, Math.min(4.0, newSpeed)))
  }, [])

  return {
    isSpeaking,
    isPaused,
    isSupported,
    isLoading,
    error,
    speak,
    pause,
    resume,
    stop,
    voices: VOICE_OPTIONS,
    selectedVoice,
    speed,
    setVoice,
    setSpeed,
  }
}
