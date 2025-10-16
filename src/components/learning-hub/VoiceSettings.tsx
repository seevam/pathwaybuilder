// src/components/learning-hub/VoiceSettings.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Settings, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface VoiceSettingsProps {
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  rate: number
  pitch: number
  onVoiceChange: (voice: SpeechSynthesisVoice) => void
  onRateChange: (rate: number) => void
  onPitchChange: (pitch: number) => void
  onTest: () => void
}

export function VoiceSettings({
  voices,
  selectedVoice,
  rate,
  pitch,
  onVoiceChange,
  onRateChange,
  onPitchChange,
  onTest,
}: VoiceSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Filter to English voices only
  const englishVoices = voices.filter(v => v.lang.startsWith('en-'))

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
                    <Settings className="w-5 h-5" />
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
                    <Label>Voice</Label>
                    <select
                      value={selectedVoice?.name || ''}
                      onChange={(e) => {
                        const voice = voices.find(v => v.name === e.target.value)
                        if (voice) onVoiceChange(voice)
                      }}
                      className="w-full mt-1 px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:outline-none"
                    >
                      {englishVoices.map((voice) => (
                        <option key={voice.name} value={voice.name}>
                          {voice.name} ({voice.lang})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Speed Control */}
                  <div>
                    <Label>Speed: {rate.toFixed(1)}x</Label>
                    <Slider
                      value={[rate]}
                      onValueChange={([value]) => onRateChange(value)}
                      min={0.5}
                      max={2}
                      step={0.1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Slower</span>
                      <span>Faster</span>
                    </div>
                  </div>

                  {/* Pitch Control */}
                  <div>
                    <Label>Pitch: {pitch.toFixed(1)}</Label>
                    <Slider
                      value={[pitch]}
                      onValueChange={([value]) => onPitchChange(value)}
                      min={0.5}
                      max={2}
                      step={0.1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Lower</span>
                      <span>Higher</span>
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
                    Test Voice Settings
                  </Button>

                  {/* Info */}
                  <p className="text-xs text-gray-500 text-center">
                    Settings are saved automatically
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
