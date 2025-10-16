// src/components/learning-hub/VoiceControls.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Mic, MicOff, Play, Pause, StopCircle, Volume2, VolumeX } from 'lucide-react'
import { motion } from 'framer-motion'

interface VoiceControlsProps {
  isListening: boolean
  isSpeaking: boolean
  isPaused: boolean
  onStartListening: () => void
  onStopListening: () => void
  onPauseSpeaking: () => void
  onResumeSpeaking: () => void
  onStopSpeaking: () => void
  disabled?: boolean
}

export function VoiceControls({
  isListening,
  isSpeaking,
  isPaused,
  onStartListening,
  onStopListening,
  onPauseSpeaking,
  onResumeSpeaking,
  onStopSpeaking,
  disabled,
}: VoiceControlsProps) {
  return (
    <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
      {/* Microphone Control */}
      <div className="flex items-center gap-2">
        {!isListening ? (
          <Button
            onClick={onStartListening}
            disabled={disabled || isSpeaking}
            size="lg"
            className="relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <Mic className="w-5 h-5 mr-2" />
            Start Speaking
          </Button>
        ) : (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative"
          >
            <Button
              onClick={onStopListening}
              size="lg"
              className="relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
            >
              <MicOff className="w-5 h-5 mr-2" />
              Stop Listening
            </Button>
            
            {/* Pulsing indicator */}
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Divider */}
      {isSpeaking && (
        <>
          <div className="h-10 w-px bg-purple-300" />

          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            {!isPaused ? (
              <Button
                onClick={onPauseSpeaking}
                variant="outline"
                size="icon"
                className="border-purple-300 hover:bg-purple-100"
              >
                <Pause className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={onResumeSpeaking}
                variant="outline"
                size="icon"
                className="border-purple-300 hover:bg-purple-100"
              >
                <Play className="w-4 h-4" />
              </Button>
            )}

            <Button
              onClick={onStopSpeaking}
              variant="outline"
              size="icon"
              className="border-red-300 hover:bg-red-100 hover:text-red-600"
            >
              <StopCircle className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
