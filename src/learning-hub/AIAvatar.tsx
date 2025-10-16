// src/components/learning-hub/AIAvatar.tsx
'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface AIAvatarProps {
  isListening?: boolean
  isSpeaking?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function AIAvatar({ isListening, isSpeaking, size = 'md' }: AIAvatarProps) {
  const sizes = {
    sm: { container: 'w-16 h-16', emoji: 'text-3xl', sparkle: 'w-4 h-4' },
    md: { container: 'w-24 h-24', emoji: 'text-5xl', sparkle: 'w-5 h-5' },
    lg: { container: 'w-32 h-32', emoji: 'text-6xl', sparkle: 'w-6 h-6' },
  }

  const isActive = isListening || isSpeaking

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow ring */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: isListening
              ? 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)',
          }}
        />
      )}

      {/* Middle pulse ring */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full border-2"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.3,
          }}
          style={{
            borderColor: isListening ? 'rgb(34, 197, 94)' : 'rgb(147, 51, 234)',
          }}
        />
      )}

      {/* Main avatar container */}
      <motion.div
        className={`${sizes[size].container} rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 flex items-center justify-center relative overflow-hidden shadow-2xl`}
        animate={{
          scale: isActive ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 1,
          repeat: isActive ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-400/50 via-blue-400/50 to-indigo-400/50"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Avatar emoji */}
        <motion.div
          className={`${sizes[size].emoji} relative z-10`}
          animate={{
            rotate: isActive ? [0, -5, 5, -5, 0] : 0,
          }}
          transition={{
            duration: 2,
            repeat: isActive ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          🎓
        </motion.div>

        {/* Sparkle effects when speaking */}
        {isSpeaking && (
          <>
            <motion.div
              className="absolute top-2 right-2"
              initial={{ scale: 0, rotate: 0 }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Sparkles className={`${sizes[size].sparkle} text-yellow-300`} />
            </motion.div>
            <motion.div
              className="absolute bottom-2 left-2"
              initial={{ scale: 0, rotate: 0 }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, -180, -360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
            >
              <Sparkles className={`${sizes[size].sparkle} text-yellow-300`} />
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Status indicator */}
      <motion.div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold shadow-lg"
        style={{
          backgroundColor: isListening ? 'rgb(34, 197, 94)' : isSpeaking ? 'rgb(147, 51, 234)' : 'rgb(156, 163, 175)',
          color: 'white',
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {isListening ? '🎤 Listening' : isSpeaking ? '🗣️ Speaking' : '💤 Idle'}
      </motion.div>
    </div>
  )
}
