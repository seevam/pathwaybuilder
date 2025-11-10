// src/components/activities/CareerReflection.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'

const REFLECTION_PROMPTS = [
  {
    id: 'surprises',
    question: 'Which careers surprised you?',
    subtitle: 'What discoveries did you make about career possibilities?',
    placeholder: 'I was surprised to learn that...'
  },
  {
    id: 'common_skills',
    question: 'What skills do these careers have in common?',
    subtitle: 'Look for patterns across the careers that interest you',
    placeholder: 'The common skills I noticed are...'
  },
  {
    id: 'excitement',
    question: 'What excites you most about your top career matches?',
    subtitle: 'Think about the aspects that make you want to learn more',
    placeholder: 'What excites me most is...'
  },
  {
    id: 'concerns',
    question: 'Do you have any concerns or questions about these careers?',
    subtitle: 'What do you want to explore further?',
    placeholder: 'I\'m curious about...'
  }
]

interface CareerReflectionProps {
  onComplete: (data: { responses: Record<string, string>; aiInsight: any }) => void
}

export function CareerReflection({ onComplete }: CareerReflectionProps) {
  const { toast } = useToast()
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [aiInsight, setAiInsight] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showInsight, setShowInsight] = useState(false)

  const prompt = REFLECTION_PROMPTS[currentPrompt]
  const currentResponse = responses[prompt.id] || ''

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
    } else {
      generateInsight()
    }
  }

  const handleBack = () => {
    if (currentPrompt > 0) {
      setCurrentPrompt(currentPrompt - 1)
    }
  }

  const generateInsight = async () => {
    setLoading(true)

    try {
      const responseSummary = REFLECTION_PROMPTS.map(p =>
        `${p.question}\n${responses[p.id]}`
      ).join('\n\n')

      const response = await fetch('/api/career-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: responseSummary })
      })

      if (!response.ok) throw new Error('Failed to generate insight')

      const data = await response.json()
      setAiInsight(data.insight)
      setShowInsight(true)
    } catch (error) {
      console.error('Error generating insight:', error)
      // If AI fails, proceed without insights
      setShowInsight(true)
      setAiInsight({
        summary: 'Thank you for completing your career reflection. Your responses have been saved and will help guide your journey.',
        nextSteps: ['Continue exploring careers that interest you', 'Research the skills needed for your top choices', 'Connect with professionals in these fields']
      })
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = () => {
    onComplete({
      responses,
      aiInsight
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-16 h-16 animate-spin text-blue-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Analyzing your career reflections...
        </h3>
        <p className="text-gray-600 text-center max-w-md">
          Generating personalized insights about your career exploration
        </p>
      </div>
    )
  }

  if (showInsight && aiInsight) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-blue-600 rounded-full">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your Career Exploration Insights
              </h2>
              <p className="text-gray-600">
                Based on your Module 2 journey
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Overall Summary */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-xl">🎯</span>
                Your Career Direction
              </h3>
              <Card className="p-6 bg-white">
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                  {aiInsight.summary}
                </p>
              </Card>
            </div>

            {/* Key Themes */}
            {aiInsight.keyThemes && aiInsight.keyThemes.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">💡</span>
                  Key Insights from Your Exploration
                </h3>
                <div className="space-y-3">
                  {aiInsight.keyThemes.map((theme: any, idx: number) => (
                    <Card key={idx} className="p-4 bg-white">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {theme.theme}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {theme.explanation}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Actions */}
            {aiInsight.nextSteps && aiInsight.nextSteps.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">🚀</span>
                  Recommended Next Steps
                </h3>
                <Card className="p-6 bg-white">
                  <ul className="space-y-2">
                    {aiInsight.nextSteps.map((step: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800">{step}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            )}
          </div>
        </Card>

        {/* Your Responses Summary */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Your Reflection Responses
          </h3>
          <div className="space-y-4">
            {REFLECTION_PROMPTS.map((p) => (
              <div key={p.id} className="border-l-4 border-blue-500 pl-4">
                <p className="font-medium text-gray-900 text-sm mb-1">
                  {p.question}
                </p>
                <p className="text-gray-700 text-sm">
                  {responses[p.id]}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={handleComplete}
            size="lg"
            className="gap-2"
          >
            Complete Module 2
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
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
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
          onClick={handleNext}
          disabled={currentResponse.trim().length < 10}
        >
          {currentPrompt === REFLECTION_PROMPTS.length - 1
            ? 'Generate Insights ✨'
            : 'Next →'}
        </Button>
      </div>
    </div>
  )
}
