// src/components/activities/WorkPreferences.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { CheckCircle2 } from 'lucide-react'

const PREFERENCE_CATEGORIES = [
  {
    id: 'location',
    title: 'Work Location',
    question: 'Where do you prefer to work?',
    options: [
      { id: 'office', label: 'Office/On-site', icon: '🏢', description: 'Work from a physical workplace' },
      { id: 'remote', label: 'Remote/Home', icon: '🏠', description: 'Work from home or anywhere' },
      { id: 'hybrid', label: 'Hybrid', icon: '🔄', description: 'Mix of office and remote' },
      { id: 'flexible', label: 'Flexible', icon: '✨', description: 'No strong preference' }
    ]
  },
  {
    id: 'schedule',
    title: 'Work Schedule',
    question: 'What schedule appeals to you?',
    options: [
      { id: 'traditional', label: 'Traditional (9-5)', icon: '⏰', description: 'Standard business hours' },
      { id: 'flexible-hours', label: 'Flexible Hours', icon: '🕐', description: 'Choose your own hours' },
      { id: 'early-bird', label: 'Early Start', icon: '🌅', description: 'Start and finish early' },
      { id: 'night-owl', label: 'Late Start', icon: '🌙', description: 'Start later in the day' }
    ]
  },
  {
    id: 'collaboration',
    title: 'Collaboration Style',
    question: 'How do you prefer to work?',
    options: [
      { id: 'solo', label: 'Independently', icon: '🧘', description: 'Work alone most of the time' },
      { id: 'small-team', label: 'Small Teams', icon: '👥', description: 'Work with 2-5 people' },
      { id: 'large-team', label: 'Large Teams', icon: '👨‍👩‍👧‍👦', description: 'Work with many people' },
      { id: 'mixed', label: 'Mix of Both', icon: '⚖️', description: 'Balance solo and team work' }
    ]
  },
  {
    id: 'pace',
    title: 'Work Pace',
    question: 'What work pace suits you?',
    options: [
      { id: 'fast-paced', label: 'Fast-Paced', icon: '⚡', description: 'High energy, quick turnarounds' },
      { id: 'steady', label: 'Steady', icon: '🎯', description: 'Consistent, predictable pace' },
      { id: 'flexible-pace', label: 'Variable', icon: '🌊', description: 'Pace changes with projects' },
      { id: 'relaxed', label: 'Relaxed', icon: '🌿', description: 'Slower, thoughtful pace' }
    ]
  },
  {
    id: 'structure',
    title: 'Structure Level',
    question: 'How much structure do you need?',
    options: [
      { id: 'high-structure', label: 'High Structure', icon: '📋', description: 'Clear rules and procedures' },
      { id: 'some-structure', label: 'Some Structure', icon: '📝', description: 'General guidelines' },
      { id: 'flexible-structure', label: 'Flexible', icon: '🎨', description: 'Figure it out as you go' },
      { id: 'entrepreneurial', label: 'Entrepreneurial', icon: '🚀', description: 'Create your own path' }
    ]
  },
  {
    id: 'variety',
    title: 'Task Variety',
    question: 'What kind of tasks do you prefer?',
    options: [
      { id: 'specialized', label: 'Specialized', icon: '🎯', description: 'Focus on one thing deeply' },
      { id: 'related-tasks', label: 'Related Tasks', icon: '🔄', description: 'Similar tasks with variation' },
      { id: 'varied', label: 'Highly Varied', icon: '🎪', description: 'Different tasks daily' },
      { id: 'project-based', label: 'Project-Based', icon: '📦', description: 'Complete projects start to finish' }
    ]
  },
  {
    id: 'interaction',
    title: 'People Interaction',
    question: 'How much people interaction do you want?',
    options: [
      { id: 'minimal', label: 'Minimal', icon: '🤫', description: 'Work mostly alone' },
      { id: 'moderate', label: 'Moderate', icon: '💬', description: 'Some daily interaction' },
      { id: 'frequent', label: 'Frequent', icon: '🗣️', description: 'Regular collaboration' },
      { id: 'constant', label: 'Constant', icon: '🎭', description: 'Always with people' }
    ]
  },
  {
    id: 'environment',
    title: 'Physical Environment',
    question: 'What environment do you prefer?',
    options: [
      { id: 'quiet', label: 'Quiet', icon: '🤫', description: 'Minimal noise and distractions' },
      { id: 'moderate-buzz', label: 'Light Activity', icon: '☕', description: 'Some background activity' },
      { id: 'collaborative', label: 'Collaborative', icon: '🎵', description: 'Busy, energetic space' },
      { id: 'outdoors', label: 'Outdoors', icon: '🌳', description: 'Outside or with nature' }
    ]
  }
]

interface WorkPreferencesProps {
  onComplete: (data: { preferences: Record<string, string> }) => void
}

export function WorkPreferences({ onComplete }: WorkPreferencesProps) {
  const { toast } = useToast()
  const [currentCategory, setCurrentCategory] = useState(0)
  const [preferences, setPreferences] = useState<Record<string, string>>({})

  const category = PREFERENCE_CATEGORIES[currentCategory]
  const selectedPreference = preferences[category.id]
  const allCategoriesComplete = PREFERENCE_CATEGORIES.every(cat => preferences[cat.id])

  const handleSelect = (optionId: string) => {
    setPreferences({ ...preferences, [category.id]: optionId })
  }

  const handleNext = () => {
    if (!selectedPreference) {
      toast({
        title: 'Please make a selection',
        description: 'Choose the option that best fits your preferences',
        variant: 'destructive'
      })
      return
    }

    if (currentCategory < PREFERENCE_CATEGORIES.length - 1) {
      setCurrentCategory(currentCategory + 1)
    }
  }

  const handleBack = () => {
    if (currentCategory > 0) {
      setCurrentCategory(currentCategory - 1)
    }
  }

  const handleComplete = () => {
    if (!allCategoriesComplete) {
      toast({
        title: 'Complete all categories',
        description: 'Please answer all preference questions',
        variant: 'destructive'
      })
      return
    }

    onComplete({ preferences })
  }

  if (allCategoriesComplete && currentCategory === PREFERENCE_CATEGORIES.length - 1 && selectedPreference) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Your Work Preferences
            </h2>
            <p className="text-gray-600">
              Here&apos;s what you&apos;ve discovered about your ideal work environment
            </p>
          </div>

          <div className="space-y-4">
            {PREFERENCE_CATEGORIES.map(cat => {
              const selected = cat.options.find(opt => opt.id === preferences[cat.id])
              if (!selected) return null

              return (
                <Card key={cat.id} className="p-6 bg-white">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{selected.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{cat.title}</h3>
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-lg font-medium text-blue-600 mb-1">
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

        <Card className="p-6 bg-blue-50 border-2 border-blue-200">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Using These Insights</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                Understanding your work preferences helps you evaluate career paths and workplaces.
                When researching careers or considering job opportunities, look for environments that
                match these preferences. Remember, preferences can evolve as you gain experience!
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
            Category {currentCategory + 1} of {PREFERENCE_CATEGORIES.length}
          </span>
          <span className="text-gray-600">
            {Math.round(((currentCategory + 1) / PREFERENCE_CATEGORIES.length) * 100)}% complete
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 to-blue-500"
            animate={{ width: `${((currentCategory + 1) / PREFERENCE_CATEGORIES.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Category Progress Indicators */}
      <div className="flex flex-wrap gap-2">
        {PREFERENCE_CATEGORIES.map((cat, idx) => (
          <div
            key={cat.id}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              preferences[cat.id]
                ? 'bg-green-100 text-green-700'
                : idx === currentCategory
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {cat.title}
          </div>
        ))}
      </div>

      {/* Question Card */}
      <motion.div
        key={category.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="p-8">
          <div className="mb-6">
            <div className="text-sm font-medium text-blue-600 mb-2">
              {category.title}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {category.question}
            </h2>
            <p className="text-sm text-gray-600">
              Select the option that best describes your ideal work environment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.options.map((option) => (
              <motion.button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`p-6 rounded-lg border-2 text-left transition-all ${
                  selectedPreference === option.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{option.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{option.label}</h3>
                      {selectedPreference === option.id && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
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
          disabled={currentCategory === 0}
        >
          ← Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={!selectedPreference}
        >
          {currentCategory === PREFERENCE_CATEGORIES.length - 1
            ? 'Review Preferences →'
            : 'Next →'}
        </Button>
      </div>
    </div>
  )
}
