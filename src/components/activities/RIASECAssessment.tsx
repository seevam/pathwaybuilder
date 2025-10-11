// src/components/activities/RIASECAssessment.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Slider } from '@/components/ui/slider'

// Type for RIASEC dimensions
type RIASECDimension = 'R' | 'I' | 'A' | 'S' | 'E' | 'C'

// All 60 RIASEC statements (10 per dimension)
const RIASEC_STATEMENTS: Array<{ id: string; dimension: RIASECDimension; text: string }> = [
  // REALISTIC (R) - Hands-on, physical work
  { id: 'r1', dimension: 'R', text: 'Work with your hands building or repairing things' },
  { id: 'r2', dimension: 'R', text: 'Work outdoors in nature' },
  { id: 'r3', dimension: 'R', text: 'Operate machinery or tools' },
  { id: 'r4', dimension: 'R', text: 'Work with plants or animals' },
  { id: 'r5', dimension: 'R', text: 'Do physical work that requires strength or coordination' },
  { id: 'r6', dimension: 'R', text: 'Fix mechanical or electrical equipment' },
  { id: 'r7', dimension: 'R', text: 'Build or construct things' },
  { id: 'r8', dimension: 'R', text: 'Work in agriculture or forestry' },
  { id: 'r9', dimension: 'R', text: 'Drive or operate vehicles' },
  { id: 'r10', dimension: 'R', text: 'Work with concrete, practical problems' },

  // INVESTIGATIVE (I) - Analytical, research-oriented
  { id: 'i1', dimension: 'I', text: 'Solve complex mathematical or scientific problems' },
  { id: 'i2', dimension: 'I', text: 'Conduct scientific experiments or research' },
  { id: 'i3', dimension: 'I', text: 'Analyze data and draw conclusions' },
  { id: 'i4', dimension: 'I', text: 'Study and understand how things work' },
  { id: 'i5', dimension: 'I', text: 'Work independently on research projects' },
  { id: 'i6', dimension: 'I', text: 'Read scientific or technical journals' },
  { id: 'i7', dimension: 'I', text: 'Use logic and reasoning to solve problems' },
  { id: 'i8', dimension: 'I', text: 'Work in a laboratory setting' },
  { id: 'i9', dimension: 'I', text: 'Learn about abstract concepts and theories' },
  { id: 'i10', dimension: 'I', text: 'Investigate and discover new knowledge' },

  // ARTISTIC (A) - Creative, expressive
  { id: 'a1', dimension: 'A', text: 'Create visual art (drawing, painting, design)' },
  { id: 'a2', dimension: 'A', text: 'Write stories, poems, or articles' },
  { id: 'a3', dimension: 'A', text: 'Play a musical instrument or compose music' },
  { id: 'a4', dimension: 'A', text: 'Perform in front of an audience' },
  { id: 'a5', dimension: 'A', text: 'Design websites, graphics, or products' },
  { id: 'a6', dimension: 'A', text: 'Express yourself through creative work' },
  { id: 'a7', dimension: 'A', text: 'Work in an unstructured, flexible environment' },
  { id: 'a8', dimension: 'A', text: 'Come up with original ideas and concepts' },
  { id: 'a9', dimension: 'A', text: 'Create videos, films, or photography' },
  { id: 'a10', dimension: 'A', text: 'Work on creative projects without strict rules' },

  // SOCIAL (S) - Helping, teaching others
  { id: 's1', dimension: 'S', text: 'Help people solve their personal problems' },
  { id: 's2', dimension: 'S', text: 'Teach or train others' },
  { id: 's3', dimension: 'S', text: 'Work closely with people to support them' },
  { id: 's4', dimension: 'S', text: 'Counsel or advise people' },
  { id: 's5', dimension: 'S', text: 'Care for people who are sick or injured' },
  { id: 's6', dimension: 'S', text: 'Help people develop their skills or knowledge' },
  { id: 's7', dimension: 'S', text: 'Work in healthcare or social services' },
  { id: 's8', dimension: 'S', text: 'Organize activities for others' },
  { id: 's9', dimension: 'S', text: 'Be responsible for the welfare of others' },
  { id: 's10', dimension: 'S', text: 'Work in a team to help the community' },

  // ENTERPRISING (E) - Leading, persuading
  { id: 'e1', dimension: 'E', text: 'Lead a team or organization' },
  { id: 'e2', dimension: 'E', text: 'Start your own business' },
  { id: 'e3', dimension: 'E', text: 'Persuade or influence others' },
  { id: 'e4', dimension: 'E', text: 'Sell products or ideas to people' },
  { id: 'e5', dimension: 'E', text: 'Make important decisions that affect others' },
  { id: 'e6', dimension: 'E', text: 'Manage projects and people' },
  { id: 'e7', dimension: 'E', text: 'Take risks to achieve goals' },
  { id: 'e8', dimension: 'E', text: 'Compete to win or be the best' },
  { id: 'e9', dimension: 'E', text: 'Give presentations or speeches' },
  { id: 'e10', dimension: 'E', text: 'Negotiate deals or agreements' },

  // CONVENTIONAL (C) - Organized, detail-oriented
  { id: 'c1', dimension: 'C', text: 'Organize files, records, or information' },
  { id: 'c2', dimension: 'C', text: 'Work with numbers, data, or finances' },
  { id: 'c3', dimension: 'C', text: 'Follow clear rules and procedures' },
  { id: 'c4', dimension: 'C', text: 'Keep accurate records and documentation' },
  { id: 'c5', dimension: 'C', text: 'Work in a structured, orderly environment' },
  { id: 'c6', dimension: 'C', text: 'Manage schedules and appointments' },
  { id: 'c7', dimension: 'C', text: 'Pay close attention to details' },
  { id: 'c8', dimension: 'C', text: 'Use office equipment and software' },
  { id: 'c9', dimension: 'C', text: 'Work with budgets or financial reports' },
  { id: 'c10', dimension: 'C', text: 'Maintain systems and processes' },
]

const DIMENSION_INFO = {
  R: {
    name: 'Realistic',
    description: 'Hands-on, physical work with tools and machines',
    icon: '🔧',
    color: 'from-orange-400 to-red-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700'
  },
  I: {
    name: 'Investigative',
    description: 'Research, analysis, and problem-solving',
    icon: '🔬',
    color: 'from-purple-400 to-indigo-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700'
  },
  A: {
    name: 'Artistic',
    description: 'Creative expression and originality',
    icon: '🎨',
    color: 'from-pink-400 to-purple-500',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700'
  },
  S: {
    name: 'Social',
    description: 'Helping, teaching, and supporting others',
    icon: '🤝',
    color: 'from-green-400 to-teal-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700'
  },
  E: {
    name: 'Enterprising',
    description: 'Leading, persuading, and managing',
    icon: '💼',
    color: 'from-blue-400 to-cyan-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  },
  C: {
    name: 'Conventional',
    description: 'Organization, data, and procedures',
    icon: '📊',
    color: 'from-gray-400 to-slate-500',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700'
  }
}

const RATING_LABELS = [
  'Strongly Dislike',
  'Dislike',
  'Neutral',
  'Like',
  'Strongly Like'
]

interface RIASECAssessmentProps {
  onComplete: (data: {
    responses: Record<string, number>
    scores: Record<RIASECDimension, number>
    code: string
  }) => void
}

export function RIASECAssessment({ onComplete }: RIASECAssessmentProps) {
  const { toast } = useToast()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)

  const statement = RIASEC_STATEMENTS[currentIndex]
  const progress = Object.keys(responses).length
  const totalStatements = RIASEC_STATEMENTS.length

  const handleRating = (value: number) => {
    setResponses(prev => ({ ...prev, [statement.id]: value }))
  }

  const handleNext = () => {
    if (!responses[statement.id]) {
      toast({
        title: 'Please rate this statement',
        description: 'Use the slider to indicate your interest level',
        variant: 'destructive'
      })
      return
    }

    if (currentIndex < RIASEC_STATEMENTS.length - 1) {
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
    // Calculate scores for each dimension
    const scores: Record<RIASECDimension, number> = {
      R: 0, I: 0, A: 0, S: 0, E: 0, C: 0
    }

    RIASEC_STATEMENTS.forEach(stmt => {
      const rating = responses[stmt.id] || 3
      const dimension = stmt.dimension as RIASECDimension
      scores[dimension] += rating
    })

    // Get top 3 dimensions for Holland Code
    const sorted = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
    
    const code = sorted.map(([letter]) => letter).join('')

    setShowResults(true)
    onComplete({ responses, scores, code })
  }

  // Calculate category progress
  const getCategoryProgress = (dimension: string) => {
    const dimensionStatements = RIASEC_STATEMENTS.filter(s => s.dimension === dimension)
    const rated = dimensionStatements.filter(s => responses[s.id]).length
    return Math.round((rated / dimensionStatements.length) * 100)
  }

  if (showResults) {
    const scores: Record<RIASECDimension, number> = {
      R: 0, I: 0, A: 0, S: 0, E: 0, C: 0
    }

    RIASEC_STATEMENTS.forEach(stmt => {
      const rating = responses[stmt.id] || 3
      const dimension = stmt.dimension as RIASECDimension
      scores[dimension] += rating
    })

    const sorted = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
    
    const code = sorted.slice(0, 3).map(([letter]) => letter).join('')
    const topThree = sorted.slice(0, 3)

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Your Holland Code
            </h2>
            <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {code}
            </div>
            <p className="text-lg text-gray-600">
              {topThree.map(([letter], idx) => (
                <span key={letter}>
                  {DIMENSION_INFO[letter as keyof typeof DIMENSION_INFO].name}
                  {idx < 2 && ' • '}
                </span>
              ))}
            </p>
          </div>

          {/* Hexagon Visualization */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {(Object.keys(DIMENSION_INFO) as Array<keyof typeof DIMENSION_INFO>).map(dimension => {
              const info = DIMENSION_INFO[dimension]
              const score = scores[dimension]
              const maxScore = 50 // 10 statements × 5 max rating
              const percentage = (score / maxScore) * 100

              return (
                <Card key={dimension} className="p-6 bg-white">
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
                </Card>
              )
            })}
          </div>

          {/* Top 3 Detailed Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Your Top 3 Interest Areas</h3>
            {topThree.map(([letter, score], idx) => {
              const info = DIMENSION_INFO[letter as keyof typeof DIMENSION_INFO]
              return (
                <motion.div
                  key={letter}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-white rounded-lg border-2 border-gray-200"
                >
                  <div className="text-3xl font-bold text-blue-600 w-8">
                    #{idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{info.icon}</span>
                      <h4 className="font-bold text-gray-900">{info.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{info.description}</p>
                    <div className="text-sm font-medium text-gray-700">
                      Score: {score}/50 ({Math.round((score / 50) * 100)}%)
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Card>

        <Card className="p-6 bg-amber-50 border-2 border-amber-200">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h4 className="font-semibold text-amber-900 mb-2">What Does This Mean?</h4>
              <p className="text-sm text-amber-800 leading-relaxed">
                Your Holland Code represents your top 3 interest areas in order of strength. 
                This code will help us recommend career clusters and specific careers that align 
                with your interests. People with similar codes often enjoy similar types of work!
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
          <span className="font-medium">
            Statement {progress + 1} of {totalStatements}
          </span>
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

      {/* Category Progress Rings */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
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
        exit={{ opacity: 0, x: -20 }}
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
              How much would you like to...
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
              <span className="text-gray-500">Strongly Dislike</span>
              <span className="font-bold text-lg text-gray-900">
                {responses[statement.id] 
                  ? RATING_LABELS[responses[statement.id] - 1]
                  : 'Move slider to rate'}
              </span>
              <span className="text-gray-500">Strongly Like</span>
            </div>

            {/* Rating Indicator */}
            {responses[statement.id] && (
              <div className="flex justify-center gap-2 pt-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <div
                    key={num}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                      num === responses[statement.id]
                        ? 'bg-blue-600 text-white scale-110'
                        : 'bg-gray-200 text-gray-400'
                    } transition-all`}
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
          {currentIndex === RIASEC_STATEMENTS.length - 1
            ? 'See My Results →'
            : 'Next →'}
        </Button>
      </div>
    </div>
  )
}
