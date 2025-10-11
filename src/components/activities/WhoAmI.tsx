'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

const PROMPTS = [
  {
    id: 1,
    question: 'Pick 3 words that describe you',
    type: 'word_select',
    options: [
      'Creative', 'Analytical', 'Social', 'Independent', 
      'Leader', 'Helper', 'Thinker', 'Doer', 
      'Curious', 'Organized', 'Adventurous', 'Caring'
    ]
  },
  {
    id: 2,
    question: 'What do you do when you lose track of time?',
    type: 'multiple_choice',
    options: [
      'Creating art/music',
      'Playing sports',
      'Reading/learning',
      'Helping others',
      'Building things',
      'Solving problems',
      'Spending time with friends'
    ]
  },
  {
    id: 3,
    question: 'Your friends come to you when they need...',
    type: 'multiple_choice',
    options: [
      'Advice',
      'Fun',
      'Help with work',
      'Motivation',
      'A listener',
      'Creative ideas',
      'Problem solving'
    ]
  },
  {
    id: 4,
    question: 'What energizes you most?',
    type: 'multiple_choice',
    options: [
      'Learning new things',
      'Creating something',
      'Helping people',
      'Competing and winning',
      'Deep conversations',
      'Physical activity',
      'Solving puzzles'
    ]
  },
  {
    id: 5,
    question: 'In group projects, you usually...',
    type: 'multiple_choice',
    options: [
      'Take the lead',
      'Generate ideas',
      'Organize the work',
      'Support the team',
      'Do the research',
      'Make it look good',
      'Keep everyone motivated'
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
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({})
  const [loading, setLoading] = useState(false)

  const prompt = PROMPTS[currentPrompt]
  const isWordSelect = prompt.type === 'word_select'
  const selectedWords = (answers[prompt.id] as string[] | undefined) || []

  const handleWordToggle = (word: string) => {
    const current = selectedWords
    const newSelection = current.includes(word)
      ? current.filter(w => w !== word)
      : current.length < 3
      ? [...current, word]
      : current

    setAnswers({ ...answers, [prompt.id]: newSelection })
  }

  const handleMultipleChoice = (option: string) => {
    setAnswers({ ...answers, [prompt.id]: option })
  }

  const canProceed = () => {
    const answer = answers[prompt.id]
    if (isWordSelect) {
      return Array.isArray(answer) && answer.length === 3
    }
    return !!answer
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

  const handleComplete = async () => {
    setLoading(true)
    
    try {
      const response = await fetch(`/api/activities/${activityId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: answers,
          timeSpent: 600 // 10 minutes
        })
      })

      if (!response.ok) throw new Error('Failed to save')

      toast({
        title: 'Activity Complete! 🎉',
        description: 'Your identity snapshot has been saved.',
      })

      // Redirect back to module
      router.push('/module-1')
    } catch (error) {
      console.error('Error completing activity:', error)
      toast({
        title: 'Error',
        description: 'Failed to save your responses. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
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
      <motion.div
        key={prompt.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {prompt.question}
          </h2>

          {isWordSelect ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Select exactly 3 words ({selectedWords.length}/3 selected)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {prompt.options.map((word) => (
                  <button
                    key={word}
                    onClick={() => handleWordToggle(word)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedWords.includes(word)
                        ? 'border-blue-500 bg-blue-50 font-semibold'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              {prompt.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleMultipleChoice(option)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    answers[prompt.id] === option
                      ? 'border-blue-500 bg-blue-50 font-semibold'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

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
            disabled={!canProceed() || loading}
          >
            {loading ? 'Saving...' : 'Complete Activity ✓'}
          </Button>
        )}
      </div>

      {/* Helper Text */}
      {!canProceed() && (
        <p className="text-center text-sm text-muted-foreground">
          {isWordSelect 
            ? 'Please select exactly 3 words to continue'
            : 'Please select an option to continue'
          }
        </p>
      )}
    </div>
  )
}
