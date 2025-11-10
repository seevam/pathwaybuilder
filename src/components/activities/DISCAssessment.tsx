// src/components/activities/DISCAssessment.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Slider } from '@/components/ui/slider'

type DISCDimension = 'D' | 'I' | 'S' | 'C'

const DISC_STATEMENTS = [
  // Dominance (D) - Direct, decisive, results-oriented
  { id: 'd1', dimension: 'D', text: 'Take charge in group situations' },
  { id: 'd2', dimension: 'D', text: 'Make quick decisions without overthinking' },
  { id: 'd3', dimension: 'D', text: 'Speak up when I disagree with something' },
  { id: 'd4', dimension: 'D', text: 'Focus on results over feelings' },
  { id: 'd5', dimension: 'D', text: 'Prefer to lead rather than follow' },
  { id: 'd6', dimension: 'D', text: 'Challenge the status quo' },
  { id: 'd7', dimension: 'D', text: 'Get straight to the point in conversations' },
  { id: 'd8', dimension: 'D', text: 'Compete to win' },
  { id: 'd9', dimension: 'D', text: 'Take calculated risks' },
  { id: 'd10', dimension: 'D', text: 'Push through obstacles' },

  // Influence (I) - Outgoing, enthusiastic, optimistic
  { id: 'i1', dimension: 'I', text: 'Enjoy meeting new people' },
  { id: 'i2', dimension: 'I', text: 'Express enthusiasm openly' },
  { id: 'i3', dimension: 'I', text: 'Persuade others with passion' },
  { id: 'i4', dimension: 'I', text: 'Enjoy being the center of attention' },
  { id: 'i5', dimension: 'I', text: 'Think out loud and brainstorm with others' },
  { id: 'i6', dimension: 'I', text: 'See the positive in most situations' },
  { id: 'i7', dimension: 'I', text: 'Build relationships easily' },
  { id: 'i8', dimension: 'I', text: 'Get energized by social interactions' },
  { id: 'i9', dimension: 'I', text: 'Share my ideas and feelings openly' },
  { id: 'i10', dimension: 'I', text: 'Create a fun, energetic atmosphere' },

  // Steadiness (S) - Patient, supportive, reliable
  { id: 's1', dimension: 'S', text: 'Listen carefully to others' },
  { id: 's2', dimension: 'S', text: 'Prefer stability over change' },
  { id: 's3', dimension: 'S', text: 'Show patience with others' },
  { id: 's4', dimension: 'S', text: 'Work well in a team' },
  { id: 's5', dimension: 'S', text: 'Support others emotionally' },
  { id: 's6', dimension: 'S', text: 'Avoid conflict when possible' },
  { id: 's7', dimension: 'S', text: 'Take time to build trust' },
  { id: 's8', dimension: 'S', text: 'Prefer a predictable routine' },
  { id: 's9', dimension: 'S', text: 'Put others\' needs before my own' },
  { id: 's10', dimension: 'S', text: 'Create harmony in groups' },

  // Conscientiousness (C) - Analytical, precise, systematic
  { id: 'c1', dimension: 'C', text: 'Pay attention to details' },
  { id: 'c2', dimension: 'C', text: 'Follow rules and procedures' },
  { id: 'c3', dimension: 'C', text: 'Analyze problems thoroughly' },
  { id: 'c4', dimension: 'C', text: 'Strive for accuracy and quality' },
  { id: 'c5', dimension: 'C', text: 'Plan carefully before acting' },
  { id: 'c6', dimension: 'C', text: 'Ask lots of questions' },
  { id: 'c7', dimension: 'C', text: 'Prefer working independently' },
  { id: 'c8', dimension: 'C', text: 'Double-check my work' },
  { id: 'c9', dimension: 'C', text: 'Research before making decisions' },
  { id: 'c10', dimension: 'C', text: 'Organize information systematically' },
]

const DIMENSION_INFO = {
  D: {
    name: 'Dominance',
    description: 'Direct, decisive, and results-oriented',
    icon: '🎯',
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700'
  },
  I: {
    name: 'Influence',
    description: 'Outgoing, enthusiastic, and optimistic',
    icon: '⭐',
    color: 'from-yellow-500 to-amber-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700'
  },
  S: {
    name: 'Steadiness',
    description: 'Patient, supportive, and reliable',
    icon: '🤝',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700'
  },
  C: {
    name: 'Conscientiousness',
    description: 'Analytical, precise, and systematic',
    icon: '🔍',
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  }
}

const RATING_LABELS = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']

interface DISCAssessmentProps {
  onComplete: (data: {
    responses: Record<string, number>
    scores: Record<DISCDimension, number>
    profile: string
  }) => void
}

export function DISCAssessment({ onComplete }: DISCAssessmentProps) {
  const { toast } = useToast()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)

  const statement = DISC_STATEMENTS[currentIndex]
  const progress = Object.keys(responses).length
  const totalStatements = DISC_STATEMENTS.length

  const handleRating = (value: number) => {
    setResponses(prev => ({ ...prev, [statement.id]: value }))
  }

  const handleNext = () => {
    if (!responses[statement.id]) {
      toast({
        title: 'Please rate this statement',
        description: 'Use the slider to indicate how often this describes you',
        variant: 'destructive'
      })
      return
    }

    if (currentIndex < DISC_STATEMENTS.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      calculateResults()
    }
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const calculateResults = () => {
    const scores: Record<DISCDimension, number> = { D: 0, I: 0, S: 0, C: 0 }

    DISC_STATEMENTS.forEach(stmt => {
      const rating = responses[stmt.id] || 3
      scores[stmt.dimension as DISCDimension] += rating
    })

    // Get dominant profile (highest score)
    const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a)
    const profile = sorted[0][0]

    setShowResults(true)
    onComplete({ responses, scores, profile })
  }

  const getCategoryProgress = (dimension: string) => {
    const dimensionStatements = DISC_STATEMENTS.filter(s => s.dimension === dimension)
    const rated = dimensionStatements.filter(s => responses[s.id]).length
    return Math.round((rated / dimensionStatements.length) * 100)
  }

  if (showResults) {
    const scores: Record<DISCDimension, number> = { D: 0, I: 0, S: 0, C: 0 }

    DISC_STATEMENTS.forEach(stmt => {
      const rating = responses[stmt.id] || 3
      scores[stmt.dimension as DISCDimension] += rating
    })

    const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a)
    const profile = sorted[0][0]
    const dominantInfo = DIMENSION_INFO[profile as keyof typeof DIMENSION_INFO]

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your DISC Profile
            </h2>
            <div className="inline-flex items-center gap-4 p-6 bg-white rounded-2xl shadow-lg border-2 border-blue-300">
              <span className="text-6xl">{dominantInfo.icon}</span>
              <div className="text-left">
                <div className="text-4xl font-bold text-gray-900">{dominantInfo.name}</div>
                <p className="text-lg text-gray-600">{dominantInfo.description}</p>
              </div>
            </div>
          </div>

          {/* All Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {(Object.keys(DIMENSION_INFO) as Array<keyof typeof DIMENSION_INFO>).map(dimension => {
              const info = DIMENSION_INFO[dimension]
              const score = scores[dimension]
              const maxScore = 50
              const percentage = (score / maxScore) * 100

              return (
                <Card key={dimension} className={`p-6 ${dimension === profile ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{info.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{info.name}</h4>
                      <p className="text-xs text-gray-600">{score}/{maxScore}</p>
                    </div>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${info.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{info.description}</p>
                </Card>
              )
            })}
          </div>

          {/* Profile Insights */}
          <Card className="p-6 bg-white">
            <h3 className="text-xl font-bold text-gray-900 mb-4">What This Means for Your Work Style</h3>
            {profile === 'D' && (
              <div className="space-y-3 text-gray-700">
                <p><strong>Strengths:</strong> You're results-driven, decisive, and excel at problem-solving. You naturally take charge and aren't afraid of challenges.</p>
                <p><strong>Work Preferences:</strong> You thrive in fast-paced environments with clear goals and the autonomy to make decisions.</p>
                <p><strong>Growth Area:</strong> Consider practicing patience and active listening to build stronger team relationships.</p>
              </div>
            )}
            {profile === 'I' && (
              <div className="space-y-3 text-gray-700">
                <p><strong>Strengths:</strong> You're enthusiastic, persuasive, and excel at building relationships. Your optimism energizes teams.</p>
                <p><strong>Work Preferences:</strong> You thrive in collaborative, social environments where you can interact with others and share ideas.</p>
                <p><strong>Growth Area:</strong> Focus on follow-through and attention to detail to complement your big-picture thinking.</p>
              </div>
            )}
            {profile === 'S' && (
              <div className="space-y-3 text-gray-700">
                <p><strong>Strengths:</strong> You're patient, supportive, and excel at creating harmony. Your reliability makes you a trusted team member.</p>
                <p><strong>Work Preferences:</strong> You thrive in stable, team-oriented environments with clear expectations and minimal conflict.</p>
                <p><strong>Growth Area:</strong> Practice speaking up for your ideas and embracing change as an opportunity for growth.</p>
              </div>
            )}
            {profile === 'C' && (
              <div className="space-y-3 text-gray-700">
                <p><strong>Strengths:</strong> You're analytical, precise, and excel at quality work. Your attention to detail ensures accuracy.</p>
                <p><strong>Work Preferences:</strong> You thrive in structured environments where you can work independently with clear standards.</p>
                <p><strong>Growth Area:</strong> Balance perfectionism with timely decision-making and be open to others' perspectives.</p>
              </div>
            )}
          </Card>
        </Card>

        <Card className="p-6 bg-blue-50 border-2 border-blue-200">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Understanding DISC</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                DISC measures your communication and work style preferences. Most people have a blend of all four traits,
                but your dominant style influences how you approach work, make decisions, and interact with others.
                Understanding your profile helps you find work environments where you'll thrive.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Statement {progress + 1} of {totalStatements}</span>
          <span className="text-gray-600">
            {Math.round(((progress + 1) / totalStatements) * 100)}% complete
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            animate={{ width: `${((progress + 1) / totalStatements) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Category Progress */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(Object.keys(DIMENSION_INFO) as Array<keyof typeof DIMENSION_INFO>).map(dimension => {
          const info = DIMENSION_INFO[dimension]
          const categoryProgress = getCategoryProgress(dimension)

          return (
            <div key={dimension} className={`p-3 rounded-lg ${info.bgColor} text-center`}>
              <div className="text-2xl mb-1">{info.icon}</div>
              <div className="text-xs font-medium text-gray-700">{info.name}</div>
              <div className="text-xs text-gray-600">{categoryProgress}%</div>
            </div>
          )
        })}
      </div>

      {/* Statement Card */}
      <motion.div
        key={statement.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="p-8">
          <div className="mb-6">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${
              DIMENSION_INFO[statement.dimension as keyof typeof DIMENSION_INFO].bgColor
            } ${DIMENSION_INFO[statement.dimension as keyof typeof DIMENSION_INFO].textColor}`}>
              <span className="text-lg">
                {DIMENSION_INFO[statement.dimension as keyof typeof DIMENSION_INFO].icon}
              </span>
              {DIMENSION_INFO[statement.dimension as keyof typeof DIMENSION_INFO].name}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              How often do you...
            </h2>
            <p className="text-xl text-gray-700">
              {statement.text}
            </p>
          </div>

          <div className="space-y-4">
            <Slider
              value={[responses[statement.id] || 3]}
              onValueChange={(value) => handleRating(value[0])}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Never</span>
              <span className="font-bold text-lg text-gray-900">
                {responses[statement.id]
                  ? RATING_LABELS[responses[statement.id] - 1]
                  : 'Move slider to rate'}
              </span>
              <span className="text-gray-500">Always</span>
            </div>

            {responses[statement.id] && (
              <div className="flex justify-center gap-2 pt-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <div
                    key={num}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      num === responses[statement.id]
                        ? 'bg-blue-600 text-white scale-110'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentIndex === 0}
        >
          ← Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={!responses[statement.id]}
        >
          {currentIndex === DISC_STATEMENTS.length - 1
            ? 'See My Results →'
            : 'Next →'}
        </Button>
      </div>
    </div>
  )
}
