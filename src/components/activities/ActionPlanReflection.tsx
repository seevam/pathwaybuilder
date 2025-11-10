// src/components/activities/ActionPlanReflection.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { ArrowRight } from 'lucide-react'

const REFLECTION_PROMPTS = [
  { id: 'first-step', question: 'What\'s your first action step?', subtitle: 'What will you do this week to start?', placeholder: 'My first step is...' },
  { id: 'motivation', question: 'How will you stay motivated?', subtitle: 'What keeps you going when things get tough?', placeholder: 'I\'ll stay motivated by...' },
  { id: 'success', question: 'What will success look like in 3 months?', subtitle: 'Paint a picture of your progress', placeholder: 'In 3 months, I will...' }
]

interface ActionPlanReflectionProps {
  onComplete: (data: { responses: Record<string, string> }) => void
}

export function ActionPlanReflection({ onComplete }: ActionPlanReflectionProps) {
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
        <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Action Plan Reflections</h2>
            <p className="text-gray-600">Review your commitment to action</p>
          </div>

          <div className="space-y-6">
            {REFLECTION_PROMPTS.map((p) => (
              <Card key={p.id} className="p-6 bg-white">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{p.question}</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{responses[p.id]}</p>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-green-50 border-2 border-green-200">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h4 className="font-semibold text-green-900 mb-2">You&apos;re Ready!</h4>
              <p className="text-sm text-green-800">
                You&apos;ve created a comprehensive action plan. Now it&apos;s time to execute. Start with your first step and build momentum. Remember: progress, not perfection!
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleComplete} size="lg" className="gap-2">
            Complete Module 5 <ArrowRight className="w-5 h-5" />
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
          <motion.div className="h-full bg-gradient-to-r from-green-500 to-blue-500" animate={{ width: `${((currentPrompt + 1) / REFLECTION_PROMPTS.length) * 100}%` }} transition={{ duration: 0.3 }} />
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
          {currentPrompt === REFLECTION_PROMPTS.length - 1 ? 'Review Responses →' : 'Next →'}
        </Button>
      </div>
    </div>
  )
}
