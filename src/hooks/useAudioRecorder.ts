// src/hooks/useAudioRecorder.ts
import { useState, useRef, useCallback, useEffect } from 'react'

interface UseAudioRecorderReturn {
  isRecording: boolean
  audioBlob: Blob | null
  startRecording: () => Promise<void>
  stopRecording: () => void
  clearRecording: () => void
  error: string | null
  isSupported: boolean
  silenceCountdown: number
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(true)
  const [silenceCountdown, setSilenceCountdown] = useState(3)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const detectSilence = useCallback(() => {
    if (!analyserRef.current || !isRecording) return

    const analyser = analyserRef.current
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    const checkAudio = () => {
      if (!isRecording) return

      analyser.getByteFrequencyData(dataArray)
      
      // Calculate average volume
      const average = dataArray.reduce((a, b) => a + b) / bufferLength
      
      // Threshold for silence (adjust as needed, lower = more sensitive)
      const SILENCE_THRESHOLD = 10
      
      if (average < SILENCE_THRESHOLD) {
        // Sound is below threshold - start/continue countdown
        if (!silenceTimerRef.current) {
          // Start countdown
          let countdown = 3
          setSilenceCountdown(countdown)
          
          console.log('[SILENCE] Starting countdown from 3...')
          
          silenceTimerRef.current = setInterval(() => {
            countdown--
            console.log('[SILENCE] Countdown:', countdown)
            setSilenceCountdown(countdown)
            
            if (countdown <= 0) {
              console.log('[SILENCE] Silence detected - auto-stopping recording')
              if (silenceTimerRef.current) {
                clearInterval(silenceTimerRef.current)
                silenceTimerRef.current = null
              }
              stopRecording()
            }
          }, 1000)
        }
      } else {
        // Sound detected - reset timer
        if (silenceTimerRef.current) {
          console.log('[SILENCE] Sound detected - resetting countdown')
          clearInterval(silenceTimerRef.current)
          silenceTimerRef.current = null
          setSilenceCountdown(3)
        }
      }
      
      // Continue checking
      animationFrameRef.current = requestAnimationFrame(checkAudio)
    }
    
    checkAudio()
  }, [isRecording])

  const startRecording = useCallback(async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Audio recording is not supported in this browser')
        setIsSupported(false)
        return
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      })

      // Create audio context for silence detection
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 2048
      source.connect(analyser)
      
      audioContextRef.current = audioContext
      analyserRef.current = analyser

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      })

      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
        
        // Cleanup
        if (silenceTimerRef.current) {
          clearInterval(silenceTimerRef.current)
          silenceTimerRef.current = null
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
          animationFrameRef.current = null
        }
        if (audioContextRef.current) {
          audioContextRef.current.close()
          audioContextRef.current = null
        }
      }

      mediaRecorder.onerror = (event: any) => {
        console.error('MediaRecorder error:', event)
        setError('Recording failed')
        setIsRecording(false)
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setError(null)
      setSilenceCountdown(3)

      // Start silence detection after a short delay
      setTimeout(() => {
        detectSilence()
      }, 500)

    } catch (err: any) {
      console.error('Error starting recording:', err)
      setError(err.message || 'Failed to start recording')
      setIsRecording(false)
    }
  }, [detectSilence])

  const stopRecording = useCallback(() => {
    console.log('[RECORDER] stopRecording called, isRecording:', isRecording)
    
    if (mediaRecorderRef.current && isRecording) {
      // Clear timers first
      if (silenceTimerRef.current) {
        clearInterval(silenceTimerRef.current)
        silenceTimerRef.current = null
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      
      console.log('[RECORDER] Stopping MediaRecorder')
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  const clearRecording = useCallback(() => {
    setAudioBlob(null)
    chunksRef.current = []
    setSilenceCountdown(3)
  }, [])

  return {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    clearRecording,
    error,
    isSupported,
    silenceCountdown,
  }
}
