// src/components/activities/PathwayReflection.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { ArrowRight } from 'lucide-react'

const REFLECTION_PROMPTS = [
  {
    id: 'excitement',
    question: 'What excites you most about your plan?',
    subtitle: 'Think about your timeline, education pathways, and skill development',
    placeholder: 'I\'m most excited about...'
  },
  {
    id: 'challenges',
    question: 'What challenges do you anticipate?',
    subtitle: 'Be honest about potential obstacles or concerns',
    placeholder: 'I think the biggest challenges will be...'
  },
  {
    id: 'support',
    question: 'Who can support you on this journey?',
    subtitle: 'Consider family, teachers, mentors, friends, or professionals',
    placeholder: 'The people who can help me include...'
  }
]

interface PathwayReflectionProps {
  onComplete: (data: { responses: Record<string, string> }) => void
}

export function PathwayReflection({ onComplete }: PathwayReflectionProps) {
  const { toast } = useToast()
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [responses, setResponses] = useState<Record<string, string>>({})

  const prompt = REFLECTION_PROMPTS[currentPrompt]
  const currentResponse = responses[prompt.id] || ''
  const allPromptsCompleted = REFLECTION_PROMPTS.every(p => responses[p.id]?.trim().length > 0)

  const handleNext = () => {
    if (currentResponse.trim().length < 10) {
      toast({
        title: 'Response too short',
        description: 'Please write at least 10 characters',
        variant: 'destructive'
      })
      return
    }

    if (currentPrompt < REFLECTION_PROMPTS.length - 1) {
      setCurrentPrompt(currentPrompt + 1)
    }
  }

  const handleBack = () => {
    if (currentPrompt > 0) {
      setCurrentPrompt(currentPrompt - 1)
    }
  }

  const handleComplete = () => {
    if (!allPromptsCompleted) {
      toast({
        title: 'Complete all prompts',
        description: 'Please answer all reflection questions',
        variant: 'destructive'
      })
      return
    }

    onComplete({ responses })
  }

  // Summary view
  if (allPromptsCompleted && currentPrompt === REFLECTION_PROMPTS.length - 1 && currentResponse.length >= 10) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <Card className="p-8 bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🧭</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Your Pathway Reflections
            </h2>
            <p className="text-gray-600">
              Review your thoughts about your journey ahead
            </p>
          </div>

          <div className="space-y-6">
            {REFLECTION_PROMPTS.map((p) => (
              <Card key={p.id} className="p-6 bg-white">
                <div className="border-l-4 border-indigo-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {p.question}
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {responses[p.id]}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-indigo-50 border-2 border-indigo-200">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h4 className="font-semibold text-indigo-900 mb-2">Keep Moving Forward</h4>
              <p className="text-sm text-indigo-800 leading-relaxed">
                Your pathway is a living plan that will evolve as you grow and learn.
                Revisit your timeline and goals regularly, adjust as needed, and celebrate
                your progress along the way. You've got this!
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleComplete} size="lg" className="gap-2">
            Complete Module 4
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            Question {currentPrompt + 1} of {REFLECTION_PROMPTS.length}
          </span>
          <span className="text-gray-600">
            {Math.round(((currentPrompt + 1) / REFLECTION_PROMPTS.length) * 100)}% complete
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentPrompt + 1) / REFLECTION_PROMPTS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={prompt.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        <Card className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {prompt.question}
            </h2>
            <p className="text-gray-600">
              {prompt.subtitle}
            </p>
          </div>

          <Textarea
            value={currentResponse}
            onChange={(e) => setResponses({
              ...responses,
              [prompt.id]: e.target.value
            })}
            placeholder={prompt.placeholder}
            className="min-h-[200px] text-base"
          />

          <div className="mt-2 text-sm text-gray-500">
            {currentResponse.length} characters
            {currentResponse.length < 10 && ' (minimum 10)'}
          </div>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentPrompt === 0}
        >
          ← Back
        </Button>

        <Button
          onClick={currentPrompt === REFLECTION_PROMPTS.length - 1 ? handleNext : handleNext}
          disabled={currentResponse.trim().length < 10}
        >
          {currentPrompt === REFLECTION_PROMPTS.length - 1
            ? 'Review Responses →'
            : 'Next →'}
        </Button>
      </div>
    </div>
  )
}
