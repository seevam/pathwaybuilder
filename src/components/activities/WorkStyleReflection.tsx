// src/components/activities/WorkStyleReflection.tsx
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
    id: 'environment',
    question: 'What work environments bring out your best?',
    subtitle: 'Think about settings, culture, and conditions where you thrive',
    placeholder: 'I work best when...'
  },
  {
    id: 'values-connection',
    question: 'How does your work style connect to your values?',
    subtitle: 'Connect what you learned about your style to what matters most to you',
    placeholder: 'My work style reflects my values by...'
  },
  {
    id: 'team-fit',
    question: 'What type of teams do you thrive in?',
    subtitle: 'Consider team size, dynamics, and collaboration approaches',
    placeholder: 'I thrive in teams that...'
  }
]

interface WorkStyleReflectionProps {
  onComplete: (data: { responses: Record<string, string> }) => void
}

export function WorkStyleReflection({ onComplete }: WorkStyleReflectionProps) {
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
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">✨</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Your Work Style Insights
            </h2>
            <p className="text-gray-600">
              Review your reflections on how you work best
            </p>
          </div>

          <div className="space-y-6">
            {REFLECTION_PROMPTS.map((p) => (
              <Card key={p.id} className="p-6 bg-white">
                <div className="border-l-4 border-blue-500 pl-4">
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

        <Card className="p-6 bg-green-50 border-2 border-green-200">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h4 className="font-semibold text-green-900 mb-2">Moving Forward</h4>
              <p className="text-sm text-green-800 leading-relaxed">
                Understanding your work style is key to finding careers and workplaces where you&apos;ll thrive.
                Use these insights when researching career paths, evaluating job opportunities, and
                communicating your needs to future employers or teammates.
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleComplete} size="lg" className="gap-2">
            Complete Module 3
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
            className="h-full bg-gradient-to-r from-blue-500 to-green-500"
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
