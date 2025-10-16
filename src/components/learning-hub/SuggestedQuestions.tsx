// src/components/learning-hub/SuggestedQuestions.tsx
'use client'

import { motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'

interface SuggestedQuestionsProps {
  questions: string[]
  onQuestionClick: (question: string) => void
  disabled?: boolean
}

export function SuggestedQuestions({ 
  questions, 
  onQuestionClick, 
  disabled 
}: SuggestedQuestionsProps) {
  if (questions.length === 0) return null

  return (
    <div className="space-y-2 mb-4">
      <p className="text-xs font-semibold text-gray-600 flex items-center gap-1 ml-1">
        <MessageSquare className="w-3 h-3" />
        Suggested questions
      </p>
      <div className="grid gap-2">
        {questions.map((question, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            disabled={disabled}
            onClick={() => onQuestionClick(question)}
            className="text-left p-3 rounded-lg border-2 border-purple-200 bg-white hover:bg-purple-50 hover:border-purple-300 transition-all text-sm text-gray-700 hover:text-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {question}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
