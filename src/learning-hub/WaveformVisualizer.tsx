// src/components/learning-hub/WaveformVisualizer.tsx
'use client'

import { motion } from 'framer-motion'

interface WaveformVisualizerProps {
  isActive: boolean
  barCount?: number
  color?: string
}

export function WaveformVisualizer({ 
  isActive, 
  barCount = 20,
  color = 'bg-green-500'
}: WaveformVisualizerProps) {
  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {Array.from({ length: barCount }).map((_, index) => (
        <motion.div
          key={index}
          className={`w-1 rounded-full ${color}`}
          initial={{ height: 4 }}
          animate={
            isActive
              ? {
                  height: [4, Math.random() * 40 + 10, 4],
                }
              : { height: 4 }
          }
          transition={{
            duration: 0.5 + Math.random() * 0.5,
            repeat: isActive ? Infinity : 0,
            ease: 'easeInOut',
            delay: index * 0.05,
          }}
        />
      ))}
    </div>
  )
}
