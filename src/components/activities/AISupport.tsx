'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Loader2 } from 'lucide-react'

interface AISupportProps {
  activityId: string
  activityTitle: string
  activityType: string
  currentProgress?: any // Optional: current state/answers of the activity
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

export function AISupport({
  activityId,
  activityTitle,
  activityType,
  currentProgress,
  position = 'bottom-right'
}: AISupportProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [guidance, setGuidance] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  }

  const fetchGuidance = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/activities/ai-guidance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityId,
          activityTitle,
          activityType,
          currentProgress,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI guidance')
      }

      const data = await response.json()
      setGuidance(data.guidance)
    } catch (err) {
      console.error('Error fetching AI guidance:', err)
      setError(err instanceof Error ? err.message : 'Failed to get guidance')
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
    if (!guidance) {
      fetchGuidance()
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating AI Support Button */}
      <motion.button
        onClick={handleOpen}
        className={`fixed ${positionClasses[position]} z-40 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="AI Support"
      >
        <Sparkles className="w-6 h-6" />
        <motion.span
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          ?
        </motion.span>
      </motion.button>

      {/* AI Guidance Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-6 h-6" />
                      <h2 className="text-2xl font-bold">AI Support</h2>
                    </div>
                    <p className="text-purple-100 text-sm">
                      Get help completing this activity
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {loading && (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                    <span className="ml-3 text-gray-600">Getting guidance...</span>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{error}</p>
                    <button
                      onClick={fetchGuidance}
                      className="mt-2 text-red-600 hover:text-red-700 font-medium"
                    >
                      Try again
                    </button>
                  </div>
                )}

                {!loading && !error && guidance && (
                  <div className="prose prose-purple max-w-none">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-600 mb-1">Activity:</p>
                      <p className="font-semibold text-gray-900">{activityTitle}</p>
                    </div>

                    <div className="space-y-4">
                      {guidance.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="text-gray-700 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {!loading && !error && !guidance && (
                  <div className="text-center py-8 text-gray-500">
                    Click the button to get AI guidance for this activity.
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
                  AI-generated guidance to help you understand and complete this activity
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
