// src/components/activities/FinalReflection.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { ArrowRight, Sparkles } from 'lucide-react'

const REFLECTION_PROMPTS = [
  { id: 'growth', question: 'How have you grown through this journey?', subtitle: 'Think about what you\'ve learned about yourself', placeholder: 'Through this program, I\'ve grown by...' },
  { id: 'surprise', question: 'What surprised you most about yourself?', subtitle: 'What discoveries did you make?', placeholder: 'I was surprised to discover...' },
  { id: 'proud', question: 'What are you most proud of?', subtitle: 'Celebrate your accomplishments', placeholder: 'I\'m most proud of...' },
  { id: 'next-goal', question: 'What\'s your next big goal?', subtitle: 'Where will you go from here?', placeholder: 'My next big goal is...' }
]

interface FinalReflectionProps {
  onComplete: (data: { responses: Record<string, string> }) => void
}

export function FinalReflection({ onComplete }: FinalReflectionProps) {
  const { toast } = useToast()
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [responses, setResponses] = useState<Record<string, string>>({})

  const prompt = REFLECTION_PROMPTS[currentPrompt]
  const currentResponse = responses[prompt.id] || ''
  const allComplete = REFLECTION_PROMPTS.every(p => responses[p.id]?.trim().length > 0)

  const handleNext = () => {
    if (currentResponse.trim().length < 10) {
      toast({ title: 'Response too short', description: 'Please write at least 10 characters', variant: 'destructive' })
      return
    }

    if (currentPrompt < REFLECTION_PROMPTS.length - 1) {
      setCurrentPrompt(currentPrompt + 1)
    }
  }

  const handleComplete = () => {
    if (!allComplete) {
      toast({ title: 'Complete all prompts', variant: 'destructive' })
      return
    }
    onComplete({ responses })
  }

  if (allComplete && currentPrompt === REFLECTION_PROMPTS.length - 1 && currentResponse.length >= 10) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <Card className="p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 border-2 border-purple-200">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Congratulations!</h2>
            <p className="text-xl text-gray-600">You've completed your pathway journey</p>
          </div>

          <div className="space-y-6">
            {REFLECTION_PROMPTS.map((p) => (
              <Card key={p.id} className="p-6 bg-white">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{p.question}</h3>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{responses[p.id]}</p>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        <Card className="p-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div className="flex items-center gap-4 mb-6">
            <Sparkles className="w-12 h-12" />
            <div>
              <h3 className="text-2xl font-bold mb-2">You're Ready!</h3>
              <p className="text-purple-100">
                You've discovered who you are, explored your options, planned your path, and learned to tell your story. The future is yours to create!
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-yellow-50 border-2 border-yellow-200">
          <div className="flex gap-3">
            <div className="text-2xl">🚀</div>
            <div>
              <h4 className="font-semibold text-yellow-900 mb-2">Next Steps</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Review your goals and timeline regularly</li>
                <li>• Update your digital presence and resume</li>
                <li>• Connect with mentors and professionals</li>
                <li>• Take action on your first steps</li>
                <li>• Celebrate your progress along the way!</li>
              </ul>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleComplete} size="lg" className="gap-2">
            Complete Program <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Question {currentPrompt + 1} of {REFLECTION_PROMPTS.length}</span>
          <span className="text-gray-600">{Math.round(((currentPrompt + 1) / REFLECTION_PROMPTS.length) * 100)}% complete</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" animate={{ width: `${((currentPrompt + 1) / REFLECTION_PROMPTS.length) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      <motion.div key={prompt.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <Card className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{prompt.question}</h2>
            <p className="text-gray-600">{prompt.subtitle}</p>
          </div>

          <Textarea
            value={currentResponse}
            onChange={(e) => setResponses({ ...responses, [prompt.id]: e.target.value })}
            placeholder={prompt.placeholder}
            className="min-h-[200px] text-base"
          />

          <div className="mt-2 text-sm text-gray-500">
            {currentResponse.length} characters {currentResponse.length < 10 && '(minimum 10)'}
          </div>
        </Card>
      </motion.div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => currentPrompt > 0 && setCurrentPrompt(currentPrompt - 1)} disabled={currentPrompt === 0}>
          ← Back
        </Button>

        <Button onClick={handleNext} disabled={currentResponse.trim().length < 10}>
          {currentPrompt === REFLECTION_PROMPTS.length - 1 ? 'Complete Journey →' : 'Next →'}
        </Button>
      </div>
    </div>
  )
}
