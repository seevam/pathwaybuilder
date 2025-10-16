// src/components/learning-hub/VoiceSettings.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Settings, X, Volume2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type OpenAIVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'

interface VoiceOption {
  id: OpenAIVoice
  name: string
  description: string
}

interface VoiceSettingsProps {
  voices: VoiceOption[]
  selectedVoice: OpenAIVoice
  speed: number
  onVoiceChange: (voice: OpenAIVoice) => void
  onSpeedChange: (speed: number) => void
  onTest: () => void
}

export function VoiceSettings({
  voices,
  selectedVoice,
  speed,
  onVoiceChange,
  onSpeedChange,
  onTest,
}: VoiceSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Settings Button */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Settings className="w-4 h-4" />
        Voice Settings
      </Button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Settings Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <Card className="p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    Voice Settings
                  </h3>
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Voice Selection */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">
                      Choose Voice Personality
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {voices.map((voice) => (
                        <button
                          key={voice.id}
                          onClick={() => onVoiceChange(voice.id)}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            selectedVoice === voice.id
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300 bg-white'
                          }`}
                        >
                          <div className="font-semibold text-sm">{voice.name}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {voice.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Speed Control */}
                  <div>
                    <Label className="text-sm font-semibold">
                      Speed: {speed.toFixed(2)}x
                    </Label>
                    <Slider
                      value={[speed]}
                      onValueChange={([value]) => onSpeedChange(value)}
                      min={0.25}
                      max={4.0}
                      step={0.25}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0.25x (Slower)</span>
                      <span>1.0x (Normal)</span>
                      <span>4.0x (Faster)</span>
                    </div>
                  </div>

                  {/* Test Button */}
                  <Button
                    onClick={() => {
                      onTest()
                      setIsOpen(false)
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Test Voice Settings
                  </Button>

                  {/* Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-900">
                      <strong>💡 Tip:</strong> These voices are powered by OpenAI&apos;s advanced TTS technology for natural, high-quality speech.
                    </p>
                  </div>

                  {/* Cost Info */}
                  <p className="text-xs text-gray-500 text-center">
                    Using OpenAI TTS (~$0.015 per 1K characters)
                  </p>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
