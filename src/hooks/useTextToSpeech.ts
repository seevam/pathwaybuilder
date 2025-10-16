// src/hooks/useTextToSpeech.ts
import { useState, useEffect, useCallback, useRef } from 'react'

interface UseTextToSpeechReturn {
  isSpeaking: boolean
  isPaused: boolean
  isSupported: boolean
  error: string | null
  speak: (text: string, options?: SpeechOptions) => void
  pause: () => void
  resume: () => void
  stop: () => void
  voices: SpeechSynthesisVoice[]
  setVoice: (voice: SpeechSynthesisVoice) => void
  setRate: (rate: number) => void
  setPitch: (pitch: number) => void
}

interface SpeechOptions {
  voice?: SpeechSynthesisVoice
  rate?: number
  pitch?: number
}

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [rate, setRateState] = useState(1.0)
  const [pitch, setPitchState] = useState(1.0)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setIsSupported(true)

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        setVoices(availableVoices)
        
        // Try to find a good English voice
        const englishVoice = availableVoices.find(v => v.lang.startsWith('en-'))
        if (englishVoice) {
          setSelectedVoice(englishVoice)
        }
      }

      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const speak = useCallback((text: string, options?: SpeechOptions) => {
    if (!isSupported) {
      setError('Text-to-speech is not supported in this browser')
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    
    utterance.voice = options?.voice || selectedVoice
    utterance.rate = options?.rate || rate
    utterance.pitch = options?.pitch || pitch

    utterance.onstart = () => {
      setIsSpeaking(true)
      setIsPaused(false)
      setError(null)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      setIsPaused(false)
    }

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event)
      setError('Failed to speak text')
      setIsSpeaking(false)
      setIsPaused(false)
    }

    utterance.onpause = () => {
      setIsPaused(true)
    }

    utterance.onresume = () => {
      setIsPaused(false)
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [isSupported, selectedVoice, rate, pitch])

  const pause = useCallback(() => {
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause()
    }
  }, [isSpeaking, isPaused])

  const resume = useCallback(() => {
    if (isSpeaking && isPaused) {
      window.speechSynthesis.resume()
    }
  }, [isSpeaking, isPaused])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    setIsPaused(false)
  }, [])

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice)
  }, [])

  const setRate = useCallback((newRate: number) => {
    setRateState(Math.max(0.1, Math.min(10, newRate)))
  }, [])

  const setPitch = useCallback((newPitch: number) => {
    setPitchState(Math.max(0, Math.min(2, newPitch)))
  }, [])

  return {
    isSpeaking,
    isPaused,
    isSupported,
    error,
    speak,
    pause,
    resume,
    stop,
    voices,
    setVoice,
    setRate,
    setPitch,
  }
}
