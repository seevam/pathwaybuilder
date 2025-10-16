// src/components/learning-hub/ModeSelector.tsx
'use client'

import { Button } from '@/components/ui/button'
import { MessageSquare, Mic } from 'lucide-react'
import { motion } from 'framer-motion'

interface ModeSelectorProps {
  mode: 'text' | 'voice'
  onModeChange: (mode: 'text' | 'voice') => void
  disabled?: boolean
  voiceSupported?: boolean
}

export function ModeSelector({ 
  mode, 
  onModeChange, 
  disabled,
  voiceSupported = true 
}: ModeSelectorProps) {
  return (
    <div className="inline-flex rounded-lg border-2 border-purple-200 bg-white p-1 shadow-sm">
      <Button
        onClick={() => onModeChange('text')}
        disabled={disabled}
        variant={mode === 'text' ? 'default' : 'ghost'}
        size="sm"
        className={`relative ${
          mode === 'text'
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Text
        {mode === 'text' && (
          <motion.div
            layoutId="activeMode"
            className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 -z-10"
          />
        )}
      </Button>

      <Button
        onClick={() => onModeChange('voice')}
        disabled={disabled || !voiceSupported}
        variant={mode === 'voice' ? 'default' : 'ghost'}
        size="sm"
        className={`relative ${
          mode === 'voice'
            ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-md'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Mic className="w-4 h-4 mr-2" />
        Voice
        {mode === 'voice' && (
          <motion.div
            layoutId="activeMode"
            className="absolute inset-0 rounded-md bg-gradient-to-r from-green-500 to-teal-600 -z-10"
          />
        )}
      </Button>

      {!voiceSupported && (
        <p className="ml-2 text-xs text-red-500 self-center">
          Voice not supported
        </p>
      )}
    </div>
  )
}
