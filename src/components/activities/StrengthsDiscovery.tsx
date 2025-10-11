// src/components/activities/StrengthsDiscovery.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { useToast } from '@/components/ui/use-toast'

const STRENGTH_CATEGORIES = [
  {
    id: 'academic',
    name: 'Academic',
    icon: '📚',
    color: 'from-blue-400 to-blue-600',
    strengths: [
      { id: 'math', name: 'Math & Logic', description: 'Numbers, problem-solving, analytical thinking' },
      { id: 'science', name: 'Science & Research', description: 'Experiments, investigation, discovery' },
      { id: 'writing', name: 'Writing & Communication', description: 'Essays, articles, clear expression' },
      { id: 'languages', name: 'Languages', description: 'Learning new languages, linguistics' },
      { id: 'analysis', name: 'Critical Analysis', description: 'Evaluating arguments, deep thinking' }
    ]
  },
  {
    id: 'creative',
    name: 'Creative',
    icon: '🎨',
    color: 'from-purple-400 to-purple-600',
    strengths: [
      { id: 'visual-arts', name: 'Visual Arts', description: 'Drawing, painting, design' },
      { id: 'music', name: 'Music', description: 'Playing instruments, singing, composition' },
      { id: 'design', name: 'Design Thinking', description: 'Creating solutions, aesthetics' },
      { id: 'storytelling', name: 'Storytelling', description: 'Narratives, creative writing' },
      { id: 'innovation', name: 'Innovation', description: 'New ideas, thinking differently' }
    ]
  },
  {
    id: 'social',
    name: 'Social',
    icon: '🤝',
    color: 'from-green-400 to-green-600',
    strengths: [
      { id: 'leadership', name: 'Leadership', description: 'Guiding teams, taking initiative' },
      { id: 'empathy', name: 'Empathy', description: 'Understanding others, emotional intelligence' },
      { id: 'communication', name: 'Communication', description: 'Clear speaking, active listening' },
      { id: 'collaboration', name: 'Collaboration', description: 'Working with others, teamwork' },
      { id: 'public-speaking', name: 'Public Speaking', description: 'Presenting, performing' }
    ]
  },
  {
    id: 'physical-technical',
    name: 'Physical/Technical',
    icon: '🔧',
    color: 'from-orange-400 to-orange-600',
    strengths: [
      { id: 'building', name: 'Building/Making', description: 'Hands-on creation, craftsmanship' },
      { id: 'coding', name: 'Coding/Programming', description: 'Software development, logic' },
      { id: 'sports', name: 'Athletic/Sports', description: 'Physical activities, coordination' },
      { id: 'hands-on', name: 'Hands-on Work', description: 'Practical tasks, working with tools' },
      { id: 'technical', name: 'Technical Skills', description: 'Machinery, systems, troubleshooting' }
    ]
  }
]

const RATING_LABELS = [
  "I'm not good at this",
  "I'm somewhat capable",
  "I'm moderately skilled",
  "I'm quite strong at this",
  "This is one of my top strengths"
]

interface StrengthsDiscoveryProps {
  onComplete: (ratings: Record<string, number>) => void
}

export function StrengthsDiscovery({ onComplete }: StrengthsDiscoveryProps) {
  const { toast } = useToast()
  const [currentCategory, setCurrentCategory] = useState(0)
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)

  const category = STRENGTH_CATEGORIES[currentCategory]
  const allStrengths = STRENGTH_CATEGORIES.flatMap(c => c.strengths)
  const totalRated = Object.keys(ratings).length
  const totalStrengths = allStrengths.length

  const handleRating = (strengthId: string, value: number) => {
    setRatings(prev => ({ ...prev, [strengthId]: value }))
  }

  const handleNext = () => {
    // Check if all strengths in current category are rated
    const categoryStrengthIds = category.strengths.map(s => s.id)
    const allRated = categoryStrengthIds.every(id => ratings[id] !== undefined)

    if (!allRated) {
      toast({
        title: 'Complete all ratings',
        description: 'Please rate all strengths in this category before continuing.',
        variant: 'destructive'
      })
      return
    }

    if (currentCategory < STRENGTH_CATEGORIES.length - 1) {
      setCurrentCategory(currentCategory + 1)
    } else {
      setShowResults(true)
    }
  }

  const handleBack = () => {
    if (currentCategory > 0) {
      setCurrentCategory(currentCategory - 1)
    }
  }

  const getCategoryScore = (categoryId: string) => {
    const catStrengths = STRENGTH_CATEGORIES.find(c => c.id === categoryId)?.strengths || []
    const categoryRatings = catStrengths.map(s => ratings[s.id] || 0)
    const average = categoryRatings.reduce((a, b) => a + b, 0) / categoryRatings.length
    return Math.round(average * 20) // Convert 1-5 to 0-100
  }

  const getTopStrengths = () => {
    return Object.entries(ratings)
      .map(([id, rating]) => ({
        id,
        rating,
        name: allStrengths.find(s => s.id === id)?.name || id,
        category: STRENGTH_CATEGORIES.find(c => 
          c.strengths.some(s => s.id === id)
        )?.name || 'Unknown'
      }))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5)
  }

  if (showResults) {
    const topStrengths = getTopStrengths()

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Your Strengths Radar 📊
          </h2>

          {/* Category Scores */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {STRENGTH_CATEGORIES.map((cat) => {
              const score = getCategoryScore(cat.id)
              return (
                <Card key={cat.id} className="p-4 bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{cat.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{cat.name}</h4>
                      <p className="text-sm text-gray-600">{score}% strength</p>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${cat.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Top 5 Strengths */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Your Top 5 Strengths
            </h3>
            <div className="space-y-3">
              {topStrengths.map((strength, idx) => (
                <motion.div
                  key={strength.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-white rounded-lg border-2 border-gray-200"
                >
                  <div className="text-2xl font-bold text-blue-600 w-8">
                    #{idx + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{strength.name}</h4>
                    <p className="text-sm text-gray-600">{strength.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {strength.rating}/5
                    </div>
                    <div className="text-xs text-gray-500">
                      {RATING_LABELS[strength.rating - 1]}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={() => onComplete(ratings)}
            size="lg"
            className="gap-2"
          >
            Save My Strengths ✓
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
            Category {currentCategory + 1} of {STRENGTH_CATEGORIES.length}
          </span>
          <span className="text-gray-600">
            {totalRated} of {totalStrengths} strengths rated
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            animate={{ width: `${(totalRated / totalStrengths) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Category Header */}
      <Card className={`p-6 bg-gradient-to-br ${category.color} text-white`}>
        <div className="flex items-center gap-4">
          <span className="text-5xl">{category.icon}</span>
          <div>
            <h2 className="text-2xl font-bold mb-1">{category.name} Strengths</h2>
            <p className="opacity-90">Rate yourself honestly on each strength</p>
          </div>
        </div>
      </Card>

      {/* Strengths List */}
      <div className="space-y-4">
        {category.strengths.map((strength) => (
          <Card key={strength.id} className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {strength.name}
              </h3>
              <p className="text-sm text-gray-600">{strength.description}</p>
            </div>

            <div className="space-y-3">
              <Slider
                value={[ratings[strength.id] || 3]}
                onValueChange={(value) => handleRating(strength.id, value[0])}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Not my strength</span>
                <span className="font-medium text-gray-900">
                  {ratings[strength.id] 
                    ? RATING_LABELS[ratings[strength.id] - 1]
                    : 'Slide to rate'}
                </span>
                <span className="text-gray-500">Top strength</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentCategory === 0}
        >
          ← Back
        </Button>

        <Button onClick={handleNext}>
          {currentCategory === STRENGTH_CATEGORIES.length - 1
            ? 'See My Results →'
            : 'Next Category →'}
        </Button>
      </div>
    </div>
  )
}
