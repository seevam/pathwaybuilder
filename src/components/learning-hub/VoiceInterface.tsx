// src/components/learning-hub/VoiceInterface.tsx
'use client'

import { useState, useEffect } from 'react'
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition'
import { useTextToSpeech } from '@/hooks/useTextToSpeech'
import { AIAvatar } from './AIAvatar'
import { WaveformVisualizer } from './WaveformVisualizer'
import { VoiceControls } from './VoiceControls'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Send, Loader2 } from 'lucide-react'

interface VoiceInterfaceProps {
  sessionId?: string
  userName?: string
  onNewMessage?: (userMessage: string, aiResponse: string) => void
}

export function VoiceInterface({ 
  sessionId,
  userName = 'there',
  onNewMessage
}: VoiceInterfaceProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentResponse, setCurrentResponse] = useState('')
  const [silenceCountdown, setSilenceCountdown] = useState(3)
  const { toast } = useToast()

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported: voiceSupported,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecognition()

  // Countdown timer for visual feedback
  useEffect(() => {
    if (isListening && (transcript || interimTranscript)) {
      setSilenceCountdown(3)
      const interval = setInterval(() => {
        setSilenceCountdown(prev => {
          if (prev <= 0) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isListening, transcript, interimTranscript])

  const {
    isSpeaking,
    isPaused,
    isSupported: ttsSupported,
    speak,
    pause,
    resume,
    stop: stopSpeaking,
  } = useTextToSpeech()

  // Show welcome message on first load
  useEffect(() => {
    if (!currentResponse) {
      const welcome = `Hi ${userName}! I'm in voice mode now. Just tap the button and start speaking to me!`
      setCurrentResponse(welcome)
      setTimeout(() => {
        speak(welcome)
      }, 500)
    }
  }, [userName])

  // Show errors
  useEffect(() => {
    if (voiceError) {
      toast({
        title: 'Voice Error',
        description: voiceError,
        variant: 'destructive'
      })
    }
  }, [voiceError, toast])

  const handleSendMessage = async () => {
    if (!transcript.trim() || isProcessing) return

    const userMessage = transcript.trim()
    setIsProcessing(true)
    resetTranscript()
    stopSpeaking()

    try {
      const response = await fetch('/api/learning-hub/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId,
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      const aiResponse = data.response

      setCurrentResponse(aiResponse)
      
      // Speak the response
      setTimeout(() => {
        speak(aiResponse)
      }, 300)

      // Notify parent
      if (onNewMessage) {
        onNewMessage(userMessage, aiResponse)
      }
    } catch (error: any) {
      console.error('Error processing voice message:', error)
      toast({
        title: 'Error',
        description: 'Failed to process your message. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (!voiceSupported || !ttsSupported) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="text-6xl mb-4">🎤❌</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Voice Mode Not Available
        </h2>
        <p className="text-gray-600 mb-4">
          Your browser doesn&apos;t support voice features. Try using Chrome, Edge, or Safari.
        </p>
        <p className="text-sm text-gray-500">
          Voice recognition and text-to-speech require modern browser features.
        </p>
      </div>
    )
  }

  const displayText = isListening 
    ? (transcript + interimTranscript) || 'Listening...'
    : transcript || 'Tap "Start Speaking" to begin'

  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      {/* AI Avatar */}
      <AIAvatar 
        isListening={isListening}
        isSpeaking={isSpeaking}
        size="lg"
      />

      {/* Waveform Visualizer */}
      <WaveformVisualizer 
        isActive={isListening}
        color="bg-green-500"
      />

      {/* Current Transcript or Response */}
      <Card className="w-full max-w-2xl p-6 min-h-[120px]">
        {isProcessing ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <span className="ml-3 text-gray-600">Processing your question...</span>
          </div>
        ) : isSpeaking ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-purple-700">Sage is speaking:</span>
            </div>
            <p className="text-gray-800 leading-relaxed">{currentResponse}</p>
          </div>
        ) : isListening ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-green-700">You&apos;re saying:</span>
            </div>
            <p className="text-gray-800 leading-relaxed">
              {displayText}
              {interimTranscript && (
                <span className="text-gray-400 italic">{interimTranscript}</span>
              )}
            </p>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p className="mb-2">{displayText}</p>
            {transcript && (
              <Button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-purple-600 to-blue-600"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Voice Controls */}
      <VoiceControls
        isListening={isListening}
        isSpeaking={isSpeaking}
        isPaused={isPaused}
        onStartListening={startListening}
        onStopListening={() => {
          stopListening()
          // Auto-send after stopping
          if (transcript.trim()) {
            setTimeout(() => handleSendMessage(), 500)
          }
        }}
        onPauseSpeaking={pause}
        onResumeSpeaking={resume}
        onStopSpeaking={stopSpeaking}
        disabled={isProcessing}
      />

      {/* Tips */}
      <Card className="w-full max-w-2xl p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3 text-sm text-blue-900">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-semibold mb-1">Voice Mode Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Speak clearly and pause when finished</li>
              <li>The system auto-stops after 3 seconds of silence</li>
              <li>You can pause/resume my responses anytime</li>
              <li>Switch to text mode if voice isn&apos;t working well</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
