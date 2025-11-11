// src/components/activities/CollaborationStyle.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { CheckCircle2, Users } from 'lucide-react'

const COLLABORATION_SCENARIOS = [
  {
    id: 'project-role',
    title: 'Team Project Roles',
    question: 'In group projects, you naturally tend to...',
    options: [
      { id: 'leader', label: 'Lead the Team', icon: '👑', description: 'Take charge and coordinate everyone' },
      { id: 'organizer', label: 'Organize & Plan', icon: '📋', description: 'Create structure and timelines' },
      { id: 'ideas', label: 'Generate Ideas', icon: '💡', description: 'Brainstorm creative solutions' },
      { id: 'executor', label: 'Execute Tasks', icon: '⚙️', description: 'Get work done efficiently' },
      { id: 'supporter', label: 'Support Others', icon: '🤝', description: 'Help teammates succeed' },
      { id: 'analyzer', label: 'Analyze & Critique', icon: '🔍', description: 'Evaluate and improve ideas' }
    ]
  },
  {
    id: 'communication',
    title: 'Communication Style',
    question: 'When working with others, you prefer to...',
    options: [
      { id: 'face-to-face', label: 'Face-to-Face', icon: '👥', description: 'In-person meetings and discussions' },
      { id: 'video-calls', label: 'Video Calls', icon: '💻', description: 'Virtual face-to-face meetings' },
      { id: 'messaging', label: 'Messaging', icon: '💬', description: 'Quick chat and text updates' },
      { id: 'email', label: 'Email/Docs', icon: '📧', description: 'Written, detailed communication' },
      { id: 'mix', label: 'Mix of All', icon: '🔄', description: 'Use different methods as needed' }
    ]
  },
  {
    id: 'decision-making',
    title: 'Decision Making',
    question: 'When the team needs to make a decision, you...',
    options: [
      { id: 'decide', label: 'Take the Lead', icon: '🎯', description: 'Make the decision confidently' },
      { id: 'consult', label: 'Seek Input', icon: '🗣️', description: 'Gather opinions before deciding' },
      { id: 'consensus', label: 'Build Consensus', icon: '🤲', description: 'Ensure everyone agrees' },
      { id: 'defer', label: 'Support Others', icon: '👍', description: 'Let others decide' },
      { id: 'analyze', label: 'Analyze Options', icon: '📊', description: 'Research and present data' }
    ]
  },
  {
    id: 'conflict',
    title: 'Handling Conflicts',
    question: 'When team conflicts arise, you typically...',
    options: [
      { id: 'address', label: 'Address Directly', icon: '⚔️', description: 'Confront issues head-on' },
      { id: 'mediate', label: 'Mediate', icon: '⚖️', description: 'Help both sides find middle ground' },
      { id: 'problem-solve', label: 'Problem-Solve', icon: '🧩', description: 'Focus on solutions, not blame' },
      { id: 'listen', label: 'Listen & Support', icon: '👂', description: 'Provide emotional support' },
      { id: 'avoid', label: 'Step Back', icon: '🚶', description: 'Let others handle it' }
    ]
  },
  {
    id: 'feedback',
    title: 'Giving Feedback',
    question: 'When giving feedback to teammates, you...',
    options: [
      { id: 'direct', label: 'Be Direct', icon: '🎯', description: 'Say it straight, no sugar-coating' },
      { id: 'balanced', label: 'Balance Praise & Critique', icon: '⚖️', description: 'Mix positive and constructive' },
      { id: 'encouraging', label: 'Focus on Strengths', icon: '🌟', description: 'Emphasize what is working' },
      { id: 'thoughtful', label: 'Be Very Tactful', icon: '🤔', description: 'Choose words carefully' },
      { id: 'avoid-giving', label: 'Avoid Giving', icon: '🤐', description: 'Prefer not to critique' }
    ]
  },
  {
    id: 'energy',
    title: 'Team Energy',
    question: 'You bring this energy to teams:',
    options: [
      { id: 'motivator', label: 'Motivator', icon: '🔥', description: 'Inspire and energize others' },
      { id: 'stabilizer', label: 'Stabilizer', icon: '⚓', description: 'Provide calm and consistency' },
      { id: 'innovator', label: 'Innovator', icon: '🚀', description: 'Push boundaries and try new things' },
      { id: 'harmonizer', label: 'Harmonizer', icon: '🎵', description: 'Create positive team culture' },
      { id: 'realist', label: 'Realist', icon: '🎭', description: 'Keep team grounded and practical' }
    ]
  }
]

interface CollaborationStyleProps {
  onComplete: (data: { responses: Record<string, string> }) => void
}

export function CollaborationStyle({ onComplete }: CollaborationStyleProps) {
  const { toast } = useToast()
  const [currentScenario, setCurrentScenario] = useState(0)
  const [responses, setResponses] = useState<Record<string, string>>({})

  const scenario = COLLABORATION_SCENARIOS[currentScenario]
  const selectedResponse = responses[scenario.id]
  const allScenariosComplete = COLLABORATION_SCENARIOS.every(s => responses[s.id])

  const handleSelect = (optionId: string) => {
    setResponses({ ...responses, [scenario.id]: optionId })
  }

  const handleNext = () => {
    if (!selectedResponse) {
      toast({
        title: 'Please make a selection',
        description: 'Choose the option that best describes you',
        variant: 'destructive'
      })
      return
    }

    if (currentScenario < COLLABORATION_SCENARIOS.length - 1) {
      setCurrentScenario(currentScenario + 1)
    }
  }

  const handleBack = () => {
    if (currentScenario > 0) {
      setCurrentScenario(currentScenario - 1)
    }
  }

  const handleComplete = () => {
    if (!allScenariosComplete) {
      toast({
        title: 'Complete all scenarios',
        description: 'Please answer all questions',
        variant: 'destructive'
      })
      return
    }

    onComplete({ responses })
  }

  // Results view
  if (allScenariosComplete && currentScenario === COLLABORATION_SCENARIOS.length - 1 && selectedResponse) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-600 rounded-full mb-4">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Your Collaboration Style
            </h2>
            <p className="text-gray-600">
              Here&apos;s how you work best with others
            </p>
          </div>

          <div className="space-y-4">
            {COLLABORATION_SCENARIOS.map(scenario => {
              const selected = scenario.options.find(opt => opt.id === responses[scenario.id])
              if (!selected) return null

              return (
                <Card key={scenario.id} className="p-6 bg-white">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{selected.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{scenario.title}</h3>
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-lg font-medium text-purple-600 mb-1">
                        {selected.label}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selected.description}
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </Card>

        <Card className="p-6 bg-purple-50 border-2 border-purple-200">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h4 className="font-semibold text-purple-900 mb-2">What This Means</h4>
              <p className="text-sm text-purple-800 leading-relaxed">
                Your collaboration style reflects how you naturally interact in teams. Understanding this helps you:
                communicate your needs to teammates, identify roles where you&apos;ll excel, and recognize when to
                stretch outside your comfort zone. Remember, effective collaborators can adapt their style
                to different situations and team needs.
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleComplete} size="lg">
            Complete Activity →
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
            Scenario {currentScenario + 1} of {COLLABORATION_SCENARIOS.length}
          </span>
          <span className="text-gray-600">
            {Math.round(((currentScenario + 1) / COLLABORATION_SCENARIOS.length) * 100)}% complete
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            animate={{ width: `${((currentScenario + 1) / COLLABORATION_SCENARIOS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="flex flex-wrap gap-2">
        {COLLABORATION_SCENARIOS.map((s, idx) => (
          <div
            key={s.id}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              responses[s.id]
                ? 'bg-green-500 text-white'
                : idx === currentScenario
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {idx + 1}
          </div>
        ))}
      </div>

      {/* Scenario Card */}
      <motion.div
        key={scenario.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="p-8">
          <div className="mb-6">
            <div className="text-sm font-medium text-purple-600 mb-2">
              {scenario.title}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {scenario.question}
            </h2>
            <p className="text-sm text-gray-600">
              Select the option that best describes your natural tendency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenario.options.map((option) => (
              <motion.button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`p-5 rounded-lg border-2 text-left transition-all ${
                  selectedResponse === option.id
                    ? 'border-purple-500 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{option.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{option.label}</h3>
                      {selectedResponse === option.id && (
                        <CheckCircle2 className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentScenario === 0}
        >
          ← Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={!selectedResponse}
        >
          {currentScenario === COLLABORATION_SCENARIOS.length - 1
            ? 'Review Results →'
            : 'Next →'}
        </Button>
      </div>
    </div>
  )
}
