'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react'

const PROMPTS = [
  {
    id: 1,
    question: 'Pick words that describe you',
    subtitle: 'Select at least 3, as many as feel right',
    minSelections: 3,
    options: [
      'Creative', 'Analytical', 'Social', 'Independent', 
      'Leader', 'Helper', 'Thinker', 'Doer', 
      'Curious', 'Organized', 'Adventurous', 'Caring',
      'Ambitious', 'Empathetic', 'Innovative', 'Reliable'
    ]
  },
  {
    id: 2,
    question: 'When do you lose track of time?',
    subtitle: 'Select all that apply',
    minSelections: 1,
    options: [
      'Creating art or music',
      'Playing sports or exercising',
      'Reading or learning new things',
      'Helping or teaching others',
      'Building or making things',
      'Solving complex problems',
      'Spending time with friends',
      'Writing or journaling',
      'Playing games or competitions',
      'Planning or organizing'
    ]
  },
  {
    id: 3,
    question: 'Your friends come to you when they need...',
    subtitle: 'Select all that apply',
    minSelections: 1,
    options: [
      'Honest advice',
      'Someone to have fun with',
      'Help with schoolwork',
      'Motivation and encouragement',
      'A good listener',
      'Creative ideas',
      'Problem-solving help',
      'Emotional support',
      'Organization tips',
      'A different perspective'
    ]
  },
  {
    id: 4,
    question: 'What energizes you most?',
    subtitle: 'Select all that resonate',
    minSelections: 1,
    options: [
      'Learning something new',
      'Creating something original',
      'Helping someone succeed',
      'Winning or achieving goals',
      'Deep, meaningful conversations',
      'Physical activity',
      'Solving challenging puzzles',
      'Making people laugh',
      'Seeing my plans come together',
      'Discovering new places or ideas'
    ]
  },
  {
    id: 5,
    question: 'In group projects, you usually...',
    subtitle: 'Select all your typical roles',
    minSelections: 1,
    options: [
      'Take the lead and delegate',
      'Generate creative ideas',
      'Organize tasks and timelines',
      'Support and encourage teammates',
      'Do deep research',
      'Handle design or presentation',
      'Keep everyone motivated',
      'Ask critical questions',
      'Mediate conflicts',
      'Make sure details are perfect'
    ]
  }
]

interface WhoAmIProps {
  activityId: string
  onComplete?: () => void
}

export function WhoAmI({ activityId, onComplete }: WhoAmIProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string[]>>({})
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [aiInsight, setAiInsight] = useState<string | null>(null)

  const prompt = PROMPTS[currentPrompt]
  const selectedOptions = answers[prompt.id] || []

  const handleToggle = (option: string) => {
    const current = selectedOptions
    const newSelection = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option]

    setAnswers({ ...answers, [prompt.id]: newSelection })
  }

  const canProceed = () => {
    return selectedOptions.length >= prompt.minSelections
  }

  const handleNext = () => {
    if (currentPrompt < PROMPTS.length - 1) {
      setCurrentPrompt(currentPrompt + 1)
    }
  }

  const handleBack = () => {
    if (currentPrompt > 0) {
      setCurrentPrompt(currentPrompt - 1)
    }
  }

  const analyzeWithAI = async () => {
    setAnalyzing(true)
    
    try {
      // Create a summary of answers
      const summary = PROMPTS.map((p, idx) => {
        const userAnswers = answers[p.id] || []
        return `${p.question}: ${userAnswers.join(', ')}`
      }).join('\n')

      const response = await fetch('/api/analyze-identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: summary })
      })

      if (!response.ok) throw new Error('Failed to analyze')

      const data = await response.json()
      setAiInsight(data.insight)
    } catch (error) {
      console.error('Error analyzing:', error)
      toast({
        title: 'Analysis unavailable',
        description: 'Could not generate AI insights, but your responses were saved.',
        variant: 'destructive'
      })
    } finally {
      setAnalyzing(false)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    
    try {
      // First, analyze with AI
      await analyzeWithAI()

      // Then save to database
      const response = await fetch(`/api/activities/${activityId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: answers,
          timeSpent: 600
        })
      })

      if (!response.ok) throw new Error('Failed to save')

      toast({
        title: 'Activity Complete! 🎉',
        description: 'Your identity snapshot has been saved.',
      })

      // Show AI insights for a few seconds before redirecting
      setTimeout(() => {
        router.push('/module-1')
      }, 8000)
    } catch (error) {
      console.error('Error completing activity:', error)
      toast({
        title: 'Error',
        description: 'Failed to save your responses. Please try again.',
        variant: 'destructive'
      })
      setLoading(false)
    }
  }

  // Show AI Insight Screen
  if (aiInsight) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-600 rounded-full">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Your Identity Snapshot
              </h2>
              <p className="text-sm text-gray-600">AI-powered insights about you</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-line">
              {aiInsight}
            </div>
          </div>

          <div className="mt-8 p-4 bg-white/60 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 text-sm text-purple-700">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-medium">Your responses have been saved</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Redirecting back to module in a moment...
            </p>
          </div>
        </Card>

        <Button 
          onClick={() => router.push('/module-1')}
          className="w-full"
        >
          Back to Module 1
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Question {currentPrompt + 1} of {PROMPTS.length}</span>
          <span className="text-muted-foreground">
            {Math.round(((currentPrompt + 1) / PROMPTS.length) * 100)}% complete
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentPrompt + 1) / PROMPTS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={prompt.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {prompt.question}
              </h2>
              <p className="text-sm text-muted-foreground">
                {prompt.subtitle} ({selectedOptions.length} selected)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {prompt.options.map((option) => (
                <motion.button
                  key={option}
                  onClick={() => handleToggle(option)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedOptions.includes(option)
                      ? 'border-blue-500 bg-blue-50 font-semibold shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedOptions.includes(option)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedOptions.includes(option) && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentPrompt === 0}
        >
          ← Back
        </Button>

        {currentPrompt < PROMPTS.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
          >
            Next →
          </Button>
        ) : (
          <Button
            onClick={handleComplete}
            disabled={!canProceed() || loading || analyzing}
            className="gap-2"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Complete & Get Insights
              </>
            )}
          </Button>
        )}
      </div>

      {/* Helper Text */}
      {!canProceed() && (
        <p className="text-center text-sm text-muted-foreground">
          Please select at least {prompt.minSelections} option{prompt.minSelections > 1 ? 's' : ''} to continue
        </p>
      )}
    </div>
  )
}
