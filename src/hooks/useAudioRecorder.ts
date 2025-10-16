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
  const isStoppingRef = useRef(false)
  const streamRef = useRef<MediaStream | null>(null)

  // Cleanup function
  const cleanup = useCallback(() => {
    console.log('[RECORDER] Cleaning up resources')
    
    // Clear timers
    if (silenceTimerRef.current) {
      clearInterval(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
    
    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(err => {
        console.error('[RECORDER] Error closing audio context:', err)
      })
      audioContextRef.current = null
    }
    
    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop()
        console.log('[RECORDER] Stopped track:', track.kind)
      })
      streamRef.current = null
    }
    
    analyserRef.current = null
    isStoppingRef.current = false
    setSilenceCountdown(3)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('[RECORDER] Component unmounting, cleaning up')
      cleanup()
    }
  }, [cleanup])

  const detectSilence = useCallback(() => {
    if (!analyserRef.current || !isRecording) {
      console.log('[SILENCE] Stopping detection - no analyser or not recording')
      return
    }

    const analyser = analyserRef.current
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    let consecutiveSilenceFrames = 0
    const SILENCE_THRESHOLD = 10
    const FRAMES_FOR_ONE_SECOND = 60 // Approximate, depends on requestAnimationFrame rate
    
    const checkAudio = () => {
      // Safety check - stop if not recording
      if (!isRecording || isStoppingRef.current) {
        console.log('[SILENCE] Stopping audio check - not recording or already stopping')
        return
      }

      try {
        analyser.getByteFrequencyData(dataArray)
        
        // Calculate average volume
        const average = dataArray.reduce((a, b) => a + b) / bufferLength
        
        if (average < SILENCE_THRESHOLD) {
          consecutiveSilenceFrames++
          
          // Calculate seconds of silence
          const silenceSeconds = Math.floor(consecutiveSilenceFrames / FRAMES_FOR_ONE_SECOND)
          
          if (silenceSeconds > 0 && silenceSeconds <= 3) {
            const countdown = 3 - silenceSeconds
            if (countdown !== silenceCountdown) {
              console.log('[SILENCE] Countdown:', countdown)
              setSilenceCountdown(countdown)
            }
            
            if (silenceSeconds >= 3) {
              console.log('[SILENCE] 3 seconds of silence detected - stopping')
              stopRecording()
              return // Exit the recursion
            }
          }
        } else {
          // Sound detected - reset
          if (consecutiveSilenceFrames > 0) {
            console.log('[SILENCE] Sound detected - resetting')
            consecutiveSilenceFrames = 0
            setSilenceCountdown(3)
          }
        }
        
        // Continue checking
        animationFrameRef.current = requestAnimationFrame(checkAudio)
      } catch (err) {
        console.error('[SILENCE] Error in audio check:', err)
        stopRecording()
      }
    }
    
    checkAudio()
  }, [isRecording, silenceCountdown])

  const stopRecording = useCallback(() => {
    console.log('[RECORDER] stopRecording called')
    
    // Prevent multiple calls
    if (isStoppingRef.current) {
      console.log('[RECORDER] Already stopping, ignoring')
      return
    }
    
    isStoppingRef.current = true
    
    // Stop animation frame first
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    // Clear silence timer
    if (silenceTimerRef.current) {
      clearInterval(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
    
    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      console.log('[RECORDER] Stopping MediaRecorder')
      try {
        mediaRecorderRef.current.stop()
      } catch (err) {
        console.error('[RECORDER] Error stopping media recorder:', err)
      }
    }
    
    setIsRecording(false)
  }, [])

  const startRecording = useCallback(async () => {
    try {
      console.log('[RECORDER] Starting recording')
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Audio recording is not supported in this browser')
        setIsSupported(false)
        return
      }

      // Clean up any existing resources first
      cleanup()
      
      // Reset state
      isStoppingRef.current = false
      chunksRef.current = []
      setAudioBlob(null)
      setSilenceCountdown(3)

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      })
      
      streamRef.current = stream

      // Create audio context for silence detection
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 2048
      analyser.smoothingTimeConstant = 0.8
      source.connect(analyser)
      
      audioContextRef.current = audioContext
      analyserRef.current = analyser

      // Create MediaRecorder
      let mimeType = 'audio/webm;codecs=opus'
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm'
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/mp4'
      }
      
      console.log('[RECORDER] Using mime type:', mimeType)

      const mediaRecorder = new MediaRecorder(stream, { mimeType })

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
          console.log('[RECORDER] Data chunk received, size:', event.data.size)
        }
      }

      mediaRecorder.onstop = () => {
        console.log('[RECORDER] MediaRecorder stopped, creating blob')
        const blob = new Blob(chunksRef.current, { type: mimeType })
        console.log('[RECORDER] Blob created, size:', blob.size)
        setAudioBlob(blob)
        
        // Cleanup after stopping
        cleanup()
      }

      mediaRecorder.onerror = (event: any) => {
        console.error('[RECORDER] MediaRecorder error:', event)
        setError('Recording failed')
        setIsRecording(false)
        cleanup()
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setError(null)

      // Start silence detection after a short delay
      setTimeout(() => {
        console.log('[RECORDER] Starting silence detection')
        detectSilence()
      }, 1000)

    } catch (err: any) {
      console.error('[RECORDER] Error starting recording:', err)
      setError(err.message || 'Failed to start recording')
      setIsRecording(false)
      cleanup()
    }
  }, [cleanup, detectSilence])

  const clearRecording = useCallback(() => {
    console.log('[RECORDER] Clearing recording')
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
