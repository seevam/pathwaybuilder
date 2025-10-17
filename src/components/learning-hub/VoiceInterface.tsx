// src/components/learning-hub/VoiceInterface.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition'
import { useTextToSpeech } from '@/hooks/useTextToSpeech'
import { AIAvatar } from './AIAvatar'
import { WaveformVisualizer } from './WaveformVisualizer'
import { VoiceControls } from './VoiceControls'
import { VoiceSettings } from './VoiceSettings'
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
  const [shouldAutoSend, setShouldAutoSend] = useState(false)
  const { toast } = useToast()
  const hasShownWelcome = useRef(false)

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported: voiceSupported,
    error: voiceError,
    isTranscribing,
    silenceCountdown,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecognition()

  const {
    isSpeaking,
    isPaused,
    isSupported: ttsSupported,
    isLoading: ttsLoading,
    speak,
    pause,
    resume,
    stop: stopSpeaking,
    voices,
    selectedVoice,
    speed,
    setVoice,
    setSpeed,
  } = useTextToSpeech()

  // Show welcome message on first load (only once)
  useEffect(() => {
    if (!hasShownWelcome.current && !currentResponse) {
      hasShownWelcome.current = true
      const welcome = `Hi ${userName}! I'm in voice mode now. Just tap the button and start speaking to me!`
      setCurrentResponse(welcome)
      setTimeout(() => {
        speak(welcome)
      }, 500)
    }
  }, [userName, speak])

  // Auto-send message after transcription completes
  useEffect(() => {
    if (!isTranscribing && transcript && shouldAutoSend && !isProcessing) {
      console.log('Auto-sending message:', transcript)
      setShouldAutoSend(false)
      handleSendMessage()
    }
  }, [isTranscribing, transcript, shouldAutoSend, isProcessing])

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
    if (!transcript.trim() || isProcessing) {
      console.log('Cannot send - no transcript or already processing')
      return
    }

    const userMessage = transcript.trim()
    console.log('Sending message to AI:', userMessage)
    
    setIsProcessing(true)
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
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }

      const data = await response.json()
      const aiResponse = data.response

      console.log('AI response received:', aiResponse.substring(0, 100) + '...')

      setCurrentResponse(aiResponse)
      
      // Clear transcript after successful send
      resetTranscript()
      
      // Speak the response with current settings
      setTimeout(async () => {
        await speak(aiResponse, {
          voice: selectedVoice,
          speed: speed,
        })
      }, 300)

      // Notify parent
      if (onNewMessage) {
        onNewMessage(userMessage, aiResponse)
      }
    } catch (error: any) {
      console.error('Error processing voice message:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to process your message. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStopListening = async () => {
    console.log('Stop listening clicked')
    await stopListening()
    // Set flag to auto-send after transcription
    if (transcript || isTranscribing) {
      setShouldAutoSend(true)
    }
  }

  const handleTestVoice = async () => {
    stopSpeaking()
    const testMessage = "Hi! This is how I sound with the current settings."
    await speak(testMessage, {
      voice: selectedVoice,
      speed: speed,
    })
  }

  if (!voiceSupported || !ttsSupported) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="text-6xl mb-4">🎤❌</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Voice Mode Not Available
        </h2>
        <p className="text-gray-600 mb-4">
          Your browser doesn&apos;t support audio recording or playback.
        </p>
        <p className="text-sm text-gray-500">
          Try using a modern browser like Chrome, Edge, or Safari.
        </p>
      </div>
    )
  }

  const displayText = isTranscribing
    ? 'Transcribing your voice...'
    : isListening 
    ? (transcript + (interimTranscript ? ' ' + interimTranscript : '')) || 'Listening...'
    : transcript || 'Tap "Start Speaking" to begin'

  const isLoading = isProcessing || isTranscribing || ttsLoading

  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      {/* Voice Settings Button */}
      <div className="w-full max-w-2xl flex justify-end">
        <VoiceSettings
          voices={voices}
          selectedVoice={selectedVoice}
          speed={speed}
          onVoiceChange={setVoice}
          onSpeedChange={setSpeed}
          onTest={handleTestVoice}
        />
      </div>

      {/* AI Avatar */}
      <AIAvatar 
        isListening={isListening}
        isSpeaking={isSpeaking || ttsLoading}
        size="lg"
      />

      {/* Waveform Visualizer */}
      <WaveformVisualizer 
        isActive={isListening || isSpeaking}
        color={isListening ? "bg-green-500" : "bg-purple-500"}
      />

      {/* Silence Countdown Indicator */}
      {isListening && transcript && silenceCountdown < 3 && (
        <Card className="px-4 py-2 bg-yellow-50 border-yellow-300">
          <p className="text-sm font-semibold text-yellow-800">
            ⏱️ Auto-stopping in {silenceCountdown} second{silenceCountdown !== 1 ? 's' : ''}...
          </p>
        </Card>
      )}

      {/* Current Transcript or Response */}
      <Card className="w-full max-w-2xl p-6 min-h-[120px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <span className="ml-3 text-gray-600">
              {isTranscribing ? 'Transcribing your voice...' : 
               isProcessing ? 'Processing your question...' :
               'Generating speech...'}
            </span>
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
              <span className="text-sm font-semibold text-green-700">
                You&apos;re saying:
              </span>
            </div>
            <p className="text-gray-800 leading-relaxed">
              {displayText}
            </p>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p className="mb-2">{displayText}</p>
            {transcript && !shouldAutoSend && (
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
        onStopListening={handleStopListening}
        onPauseSpeaking={pause}
        onResumeSpeaking={resume}
        onStopSpeaking={stopSpeaking}
        disabled={isLoading}
      />

      {/* Tips */}
      <Card className="w-full max-w-2xl p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3 text-sm text-blue-900">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-semibold mb-1">Voice Mode Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Speak clearly - using OpenAI Whisper for transcription</li>
              <li>Recording auto-stops after 3 seconds of silence</li>
              <li>Or click &quot;Stop Listening&quot; when done</li>
              <li>You can pause/resume my responses anytime</li>
              <li>Customize my voice in settings!</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
