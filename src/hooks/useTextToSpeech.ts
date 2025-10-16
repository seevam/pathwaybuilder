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
  const audioContextRef = useRef<AudioContext | null>(null)

  // Check if audio is supported
  const isSupported = typeof Audio !== 'undefined'

  useEffect(() => {
    // Create audio context for better control
    if (typeof window !== 'undefined' && window.AudioContext) {
      audioContextRef.current = new AudioContext()
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const speak = useCallback(async (text: string, options?: SpeechOptions) => {
    if (!isSupported) {
      setError('Audio playback is not supported')
      return
    }

    // Stop any current playback
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    setIsLoading(true)
    setError(null)

    try {
      const voice = options?.voice || selectedVoice
      const speechSpeed = options?.speed || speed

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
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate speech')
      }

      // Get audio blob
      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      // Create and play audio
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onplay = () => {
        setIsSpeaking(true)
        setIsPaused(false)
        setIsLoading(false)
      }

      audio.onended = () => {
        setIsSpeaking(false)
        setIsPaused(false)
        URL.revokeObjectURL(audioUrl)
      }

      audio.onerror = () => {
        setError('Failed to play audio')
        setIsSpeaking(false)
        setIsLoading(false)
        URL.revokeObjectURL(audioUrl)
      }

      audio.onpause = () => {
        if (!audio.ended) {
          setIsPaused(true)
        }
      }

      await audio.play()

    } catch (err: any) {
      console.error('TTS error:', err)
      setError(err.message || 'Failed to generate speech')
      setIsSpeaking(false)
      setIsLoading(false)
    }
  }, [isSupported, selectedVoice, speed])

  const pause = useCallback(() => {
    if (audioRef.current && isSpeaking && !isPaused) {
      audioRef.current.pause()
      setIsPaused(true)
    }
  }, [isSpeaking, isPaused])

  const resume = useCallback(() => {
    if (audioRef.current && isSpeaking && isPaused) {
      audioRef.current.play()
      setIsPaused(false)
    }
  }, [isSpeaking, isPaused])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
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
