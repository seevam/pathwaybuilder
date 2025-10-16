// src/components/learning-hub/VoiceInterface.tsx
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition'
import { useTextToSpeech } from '@/hooks/useTextToSpeech'
import { AIAvatar } from './AIAvatar'
import { WaveformVisualizer } from './WaveformVisualizer'
import { VoiceSettings } from './VoiceSettings'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Pause, Play, RotateCcw } from 'lucide-react'

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
  const [conversationActive, setConversationActive] = useState(true)
  const [hasShownWelcome, setHasShownWelcome] = useState(false)
  const { toast } = useToast()
  const lastTranscriptRef = useRef('')
  const isSendingRef = useRef(false) // ✅ ADD: Track if we're currently sending

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

  // Stable callback for sending messages
  const handleSendMessage = useCallback(async (messageText: string) => {
    // ✅ ADD: Prevent duplicate sends
    if (!messageText.trim() || isProcessing || isSendingRef.current) {
      console.log('[AUTO-SEND] Cannot send - already processing or no message', {
        hasMessage: !!messageText.trim(),
        isProcessing,
        isSending: isSendingRef.current
      })
      return
    }

    console.log('[AUTO-SEND] Sending message:', messageText)
    
    isSendingRef.current = true // ✅ Set flag immediately
    setIsProcessing(true)
    stopSpeaking()

    try {
      const response = await fetch('/api/learning-hub/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          sessionId,
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }

      const data = await response.json()
      const aiResponse = data.response

      console.log('[AUTO-SEND] AI response received')

      setCurrentResponse(aiResponse)
      lastTranscriptRef.current = '' // Clear after successful send
      
      // Speak the response
      await speak(aiResponse, {
        voice: selectedVoice,
        speed: speed,
      })

      // Notify parent
      if (onNewMessage) {
        onNewMessage(messageText, aiResponse)
      }

    } catch (error: any) {
      console.error('[AUTO-SEND] Error:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to process your message. Please try again.',
        variant: 'destructive'
      })
      
      // ✅ IMPORTANT: Restart listening after error
      if (conversationActive) {
        setTimeout(() => {
          console.log('[AUTO-SEND] Restarting after error')
          startListening()
        }, 1000)
      }
    } finally {
      setIsProcessing(false)
      isSendingRef.current = false // ✅ Clear flag
    }
  }, [sessionId, speak, selectedVoice, speed, onNewMessage, stopSpeaking, toast, conversationActive, startListening, isProcessing])

  // Show welcome message and start listening on first load
  useEffect(() => {
    if (!hasShownWelcome && voiceSupported && ttsSupported) {
      setHasShownWelcome(true)
      const welcome = `Hi ${userName}! I'm ready to chat. Just start speaking, and I'll listen automatically.`
      setCurrentResponse(welcome)
      
      // Speak welcome, then start listening
      speak(welcome).then(() => {
        setTimeout(() => {
          if (conversationActive) {
            console.log('[INIT] Starting initial listening')
            startListening()
          }
        }, 500)
      })
    }
  }, [hasShownWelcome, voiceSupported, ttsSupported, userName, speak, conversationActive, startListening])

  // ✅ UPDATED: Auto-send when transcription completes
  useEffect(() => {
    console.log('[AUTO-SEND CHECK]', {
      isTranscribing,
      isListening,
      hasTranscript: !!transcript,
      transcript: transcript.substring(0, 50),
      isProcessing,
      isSending: isSendingRef.current,
      conversationActive,
      lastTranscript: lastTranscriptRef.current.substring(0, 50)
    })

    // ✅ CHANGE: Also check isSendingRef
    if (!isTranscribing && 
        !isListening && 
        transcript && 
        transcript.trim() !== '' &&
        transcript !== lastTranscriptRef.current &&
        !isProcessing && 
        !isSendingRef.current && // ✅ ADD: Check sending flag
        conversationActive) {
      
      console.log('[AUTO-SEND] Conditions met! Preparing to send...')
      lastTranscriptRef.current = transcript
      
      // ✅ CHANGE: Don't reset transcript before sending, save it first
      const messageToSend = transcript
      
      // Small delay to ensure everything is settled
      const timer = setTimeout(() => {
        console.log('[AUTO-SEND] Triggering send now')
        resetTranscript() // Clear transcript AFTER saving it
        handleSendMessage(messageToSend)
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [isTranscribing, isListening, transcript, isProcessing, conversationActive, handleSendMessage, resetTranscript])

  // ✅ UPDATED: Auto-restart listening after AI finishes speaking
  useEffect(() => {
    // ✅ CHANGE: Also check isSendingRef
    if (!isSpeaking && 
        !ttsLoading && 
        !isListening && 
        !isProcessing && 
        !isSendingRef.current && // ✅ ADD: Check sending flag
        conversationActive && 
        hasShownWelcome) {
      
      console.log('[AUTO-RESTART] AI finished, restarting listening in 1s...')
      const timer = setTimeout(() => {
        // ✅ CHANGE: Double-check before starting
        if (!isListening && !isSendingRef.current && conversationActive) {
          console.log('[AUTO-RESTART] Starting listening now')
          startListening()
        } else {
          console.log('[AUTO-RESTART] Skipping - conditions changed', {
            isListening,
            isSending: isSendingRef.current,
            conversationActive
          })
        }
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [isSpeaking, ttsLoading, isListening, isProcessing, conversationActive, hasShownWelcome, startListening])

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

  const handleTestVoice = async () => {
    const wasActive = conversationActive
    setConversationActive(false)
    stopListening()
    stopSpeaking()
    
    const testMessage = "Hi! This is how I sound with the current settings."
    await speak(testMessage, {
      voice: selectedVoice,
      speed: speed,
    })
    
    // Wait a bit, then resume if it was active
    setTimeout(() => {
      setConversationActive(wasActive)
      if (wasActive) {
        startListening()
      }
    }, 1000)
  }

  const toggleConversation = () => {
    if (conversationActive) {
      console.log('[CONTROL] Pausing conversation')
      setConversationActive(false)
      stopListening()
      stopSpeaking()
    } else {
      console.log('[CONTROL] Resuming conversation')
      setConversationActive(true)
      startListening()
    }
  }

  const resetConversation = () => {
    console.log('[CONTROL] Resetting conversation')
    stopListening()
    stopSpeaking()
    resetTranscript()
    setCurrentResponse('')
    lastTranscriptRef.current = ''
    isSendingRef.current = false // ✅ Reset flag
    setIsProcessing(false) // ✅ Reset processing
    setConversationActive(true)
    
    // Restart listening after reset
    setTimeout(() => {
      startListening()
    }, 500)
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
    ? (transcript + (interimTranscript ? ' ' + interimTranscript : '')) || 'Listening... start speaking'
    : transcript || 'Processing...'

  const isLoading = isProcessing || isTranscribing || ttsLoading

  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      {/* Controls Header */}
      <div className="w-full max-w-2xl flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            onClick={toggleConversation}
            variant={conversationActive ? "default" : "outline"}
            size="sm"
            className="gap-2"
          >
            {conversationActive ? (
              <>
                <Pause className="w-4 h-4" />
                Pause Chat
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Resume Chat
              </>
            )}
          </Button>
          
          <Button
            onClick={resetConversation}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

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
        isListening={isListening && conversationActive}
        isSpeaking={isSpeaking || ttsLoading}
        size="lg"
      />

      {/* Waveform Visualizer */}
      <WaveformVisualizer 
        isActive={(isListening || isSpeaking) && conversationActive}
        color={isListening ? "bg-green-500" : "bg-purple-500"}
      />

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${
          !conversationActive ? 'bg-gray-400' :
          isListening ? 'bg-green-500 animate-pulse' :
          isSpeaking ? 'bg-purple-500 animate-pulse' :
          isProcessing ? 'bg-blue-500 animate-pulse' :
          'bg-yellow-500'
        }`} />
        <span className="text-sm font-semibold text-gray-700">
          {!conversationActive ? 'Paused' :
           isListening ? 'Listening' :
           isSpeaking ? 'Speaking' :
           isProcessing ? 'Thinking' :
           'Ready'}
        </span>
      </div>

      {/* Silence Countdown Indicator */}
      {isListening && transcript && silenceCountdown < 3 && conversationActive && (
        <Card className="px-4 py-2 bg-yellow-50 border-yellow-300 animate-pulse">
          <p className="text-sm font-semibold text-yellow-800">
            ⏱️ Sending in {silenceCountdown} second{silenceCountdown !== 1 ? 's' : ''}...
          </p>
        </Card>
      )}

      {/* Current Transcript or Response */}
      <Card className="w-full max-w-2xl p-6 min-h-[120px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <span className="ml-3 text-gray-600">
              {isTranscribing ? 'Transcribing...' : 
               isProcessing ? 'Thinking...' :
               'Generating speech...'}
            </span>
          </div>
        ) : isSpeaking ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-purple-700">Sage:</span>
            </div>
            <p className="text-gray-800 leading-relaxed">{currentResponse}</p>
          </div>
        ) : isListening && conversationActive ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-green-700">
                You:
              </span>
            </div>
            <p className="text-gray-800 leading-relaxed">
              {displayText}
            </p>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>{conversationActive ? 'Ready to listen...' : 'Conversation paused'}</p>
          </div>
        )}
      </Card>

      {/* Debug Info */}
      <Card className="w-full max-w-2xl p-3 bg-gray-50 border-gray-200 text-xs">
        <div className="font-mono">
          <div>Listening: {isListening ? '✅' : '❌'}</div>
          <div>Transcribing: {isTranscribing ? '✅' : '❌'}</div>
          <div>Processing: {isProcessing ? '✅' : '❌'}</div>
          <div>Sending: {isSendingRef.current ? '✅' : '❌'}</div>
          <div>Speaking: {isSpeaking ? '✅' : '❌'}</div>
          <div>Transcript: {transcript ? `"${transcript.substring(0, 50)}..."` : 'none'}</div>
          <div>Countdown: {silenceCountdown}s</div>
        </div>
      </Card>

      {/* Tips */}
      <Card className="w-full max-w-2xl p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3 text-sm text-blue-900">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-semibold mb-1">Automatic Voice Chat:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Just start speaking - no button needed!</li>
              <li>Automatically sends after 3 seconds of silence</li>
              <li>AI responds instantly with voice</li>
              <li>Continues listening after each response</li>
              <li>Click &quot;Pause Chat&quot; to stop the conversation</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
