// src/components/activities/SMARTGoals.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Plus, X, Target, CheckCircle2 } from 'lucide-react'

const SMART_CRITERIA = [
  {
    letter: 'S',
    word: 'Specific',
    question: 'What exactly will you accomplish?',
    icon: '🎯',
    color: 'red',
    placeholder: 'Example: Improve my public speaking skills by joining debate club'
  },
  {
    letter: 'M',
    word: 'Measurable',
    question: 'How will you measure your progress?',
    icon: '📊',
    color: 'orange',
    placeholder: 'Example: Participate in at least 3 debates this semester'
  },
  {
    letter: 'A',
    word: 'Achievable',
    question: 'Is this realistic given your resources and time?',
    icon: '✅',
    color: 'yellow',
    placeholder: 'Example: Yes, debate club meets twice weekly after school'
  },
  {
    letter: 'R',
    word: 'Relevant',
    question: 'Why does this goal matter to you?',
    icon: '💡',
    color: 'green',
    placeholder: 'Example: I want to be more confident in presentations for my future career'
  },
  {
    letter: 'T',
    word: 'Time-bound',
    question: 'When will you achieve this goal?',
    icon: '⏰',
    color: 'blue',
    placeholder: 'Example: By the end of this school year (June 2024)'
  }
]

interface Goal {
  id: string
  title: string
  specific: string
  measurable: string
  achievable: string
  relevant: string
  timeBound: string
}

interface SMARTGoalsProps {
  onComplete: (data: { goals: Goal[] }) => void
}

export function SMARTGoals({ onComplete }: SMARTGoalsProps) {
  const { toast } = useToast()
  const [goals, setGoals] = useState<Goal[]>([])
  const [creatingGoal, setCreatingGoal] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [newGoal, setNewGoal] = useState({
    title: '',
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timeBound: ''
  })

  const criterion = SMART_CRITERIA[currentStep]

  const handleStartNewGoal = () => {
    setCreatingGoal(true)
    setCurrentStep(0)
    setNewGoal({
      title: '',
      specific: '',
      measurable: '',
      achievable: '',
      relevant: '',
      timeBound: ''
    })
  }

  const handleNextStep = () => {
    const value = currentStep === 0 ? newGoal.title : newGoal[criterion.word.toLowerCase() as keyof typeof newGoal]

    if (!value || value.toString().trim().length < 3) {
      toast({
        title: 'Please provide more detail',
        description: 'Write at least a few words',
        variant: 'destructive'
      })
      return
    }

    if (currentStep < SMART_CRITERIA.length) {
      setCurrentStep(currentStep + 1)
    } else {
      const goal: Goal = {
        id: Date.now().toString(),
        ...newGoal
      }
      setGoals([...goals, goal])
      setCreatingGoal(false)
      toast({
        title: 'Goal created!',
        description: 'Your SMART goal has been added'
      })
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      setCreatingGoal(false)
    }
  }

  const handleRemoveGoal = (goalId: string) => {
    setGoals(goals.filter(g => g.id !== goalId))
  }

  const handleComplete = () => {
    if (goals.length === 0) {
      toast({
        title: 'Create at least one goal',
        description: 'Use the SMART framework to create your first goal',
        variant: 'destructive'
      })
      return
    }
    onComplete({ goals })
  }

  if (creatingGoal) {
    if (currentStep === 0) {
      // Goal Title
      return (
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Create a SMART Goal</h2>
                <p className="text-purple-100">Let&apos;s build a goal that you can actually achieve</p>
              </div>
              <Target className="w-12 h-12 text-purple-200" />
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">What&apos;s your goal?</h3>
            <p className="text-gray-600 mb-4">
              Give your goal a clear, concise title. We&apos;ll make it SMART in the next steps.
            </p>
            <Input
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              placeholder="Example: Improve my public speaking skills"
              className="text-lg"
            />
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCreatingGoal(false)}>
              Cancel
            </Button>
            <Button onClick={handleNextStep} disabled={newGoal.title.length < 3}>
              Start SMART Framework →
            </Button>
          </div>
        </div>
      )
    }

    // SMART Criteria Steps
    const criteriaKey = criterion.word.toLowerCase() as keyof typeof newGoal
    const currentValue = newGoal[criteriaKey] as string

    return (
      <div className="space-y-6">
        {/* Progress */}
        <div className="flex items-center gap-2">
          {SMART_CRITERIA.map((crit, idx) => (
            <div
              key={crit.letter}
              className={`flex-1 h-2 rounded-full ${
                idx < currentStep ? 'bg-green-500' : idx === currentStep ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* SMART Letter Cards */}
        <div className="flex justify-center gap-4 mb-6">
          {SMART_CRITERIA.map((crit, idx) => (
            <div
              key={crit.letter}
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                idx < currentStep
                  ? 'bg-green-500 text-white'
                  : idx === currentStep
                  ? 'bg-blue-500 text-white ring-4 ring-blue-200'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {idx < currentStep ? '✓' : crit.letter}
            </div>
          ))}
        </div>

        <Card className="p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{criterion.icon}</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {criterion.letter} - {criterion.word}
            </h2>
            <p className="text-lg text-gray-600">{criterion.question}</p>
          </div>

          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-gray-900 mb-1">Your Goal:</p>
            <p className="text-gray-700">{newGoal.title}</p>
          </div>

          <Textarea
            value={currentValue}
            onChange={(e) => setNewGoal({ ...newGoal, [criteriaKey]: e.target.value })}
            placeholder={criterion.placeholder}
            className="min-h-[120px] text-base"
          />
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            ← Back
          </Button>
          <Button onClick={handleNextStep} disabled={currentValue.length < 3}>
            {currentStep === SMART_CRITERIA.length - 1 ? 'Complete Goal ✓' : 'Next →'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">SMART Goals Workshop</h2>
            <p className="text-blue-100">
              Create goals that are Specific, Measurable, Achievable, Relevant, and Time-bound
            </p>
          </div>
          <div className="text-4xl font-bold">{goals.length}</div>
        </div>
      </Card>

      {goals.length === 0 && (
        <Card className="p-8 text-center">
          <Target className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No goals yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first SMART goal to start planning your future
          </p>
          <Button onClick={handleStartNewGoal} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Goal
          </Button>
        </Card>
      )}

      {goals.length > 0 && (
        <>
          <div className="space-y-4">
            {goals.map((goal, idx) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{goal.title}</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveGoal(goal.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {SMART_CRITERIA.map((crit) => {
                      const key = crit.word.toLowerCase() as keyof Goal
                      return (
                        <div key={crit.letter} className="border-l-4 border-gray-200 pl-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{crit.icon}</span>
                            <span className="font-semibold text-sm text-gray-700">
                              {crit.letter} - {crit.word}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{goal[key]}</p>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={handleStartNewGoal}
            className="w-full border-2 border-dashed"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Another Goal
          </Button>
        </>
      )}

      {goals.length > 0 && (
        <>
          <Card className="p-6 bg-green-50 border-2 border-green-200">
            <div className="flex gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-green-900 mb-2">Great Progress!</h4>
                <p className="text-sm text-green-800">
                  You&apos;ve created {goals.length} SMART goal{goals.length > 1 ? 's' : ''}.
                  These will be the foundation of your action plan.
                </p>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleComplete} size="lg">
              Continue to Planning →
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
