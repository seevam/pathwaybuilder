// src/components/activities/IntegrationReflection.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Sparkles, CheckCircle2, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { AISupport } from './AISupport'

const REFLECTION_PROMPTS = [
  {
    id: 'patterns',
    question: 'What patterns emerged across your assessments?',
    subtitle: 'Think about your values, strengths, and personality results',
    placeholder: 'I noticed that...'
  },
  {
    id: 'surprise',
    question: 'Which result surprised you most?',
    subtitle: 'What did you learn about yourself that you didn\'t expect?',
    placeholder: 'I was surprised to discover...'
  },
  {
    id: 'connections',
    question: 'How do your values connect to your strengths?',
    subtitle: 'Do you see alignment between what matters to you and what you\'re good at?',
    placeholder: 'I see connections between...'
  },
  {
    id: 'identity',
    question: 'What\'s one word that captures who you are right now?',
    subtitle: 'This could be an adjective, a role, or a value',
    placeholder: 'One word that describes me is...'
  }
]

interface IntegrationReflectionProps {
  activityId: string
  onComplete: (data: { responses: Record<string, string>; aiInsight: any }) => void
}

export function IntegrationReflection({ activityId, onComplete }: IntegrationReflectionProps) {
  const { toast } = useToast()
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [aiInsight, setAiInsight] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showInsight, setShowInsight] = useState(false)
  const [previousResponses, setPreviousResponses] = useState<any[]>([])
  const [showPreviousResponses, setShowPreviousResponses] = useState(false)
  const [loadingPrevious, setLoadingPrevious] = useState(true)

  const prompt = REFLECTION_PROMPTS[currentPrompt]
  const currentResponse = responses[prompt.id] || ''
  const allPromptsCompleted = REFLECTION_PROMPTS.every(p => responses[p.id]?.trim().length > 0)

  // Fetch previous activity responses from the same module
  useEffect(() => {
    const fetchPreviousResponses = async () => {
      try {
        setLoadingPrevious(true)

        // First, get the current activity to find its module
        const activityResponse = await fetch(`/api/activities/${activityId}`)
        if (!activityResponse.ok) throw new Error('Failed to fetch activity')

        const activityData = await activityResponse.json()
        const moduleId = activityData.activity?.moduleId

        if (moduleId) {
          // Fetch all completed responses from this module
          const responsesResponse = await fetch(`/api/activities/responses?moduleId=${moduleId}`)
          if (!responsesResponse.ok) throw new Error('Failed to fetch responses')

          const data = await responsesResponse.json()
          // Filter out the current activity from previous responses
          const previous = data.responses?.filter((r: any) => r.activityId !== activityId) || []
          setPreviousResponses(previous)
        }
      } catch (error) {
        console.error('Error fetching previous responses:', error)
      } finally {
        setLoadingPrevious(false)
      }
    }

    fetchPreviousResponses()
  }, [activityId])

  const handleNext = () => {
    if (currentResponse.trim().length < 10) {
      toast({
        title: 'Response too short',
        description: 'Please write at least 10 characters',
        variant: 'destructive'
      })
      return
    }

    if (currentPrompt < REFLECTION_PROMPTS.length - 1) {
      setCurrentPrompt(currentPrompt + 1)
    } else {
      generateInsight()
    }
  }

  const handleBack = () => {
    if (currentPrompt > 0) {
      setCurrentPrompt(currentPrompt - 1)
    }
  }

  const generateInsight = async () => {
    setLoading(true)

    try {
      // Compile all responses into a summary
      const responseSummary = REFLECTION_PROMPTS.map(p => 
        `${p.question}\n${responses[p.id]}`
      ).join('\n\n')

      const response = await fetch('/api/integration-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: responseSummary })
      })

      if (!response.ok) throw new Error('Failed to generate insight')

      const data = await response.json()
      setAiInsight(data.insight)
      setShowInsight(true)
    } catch (error) {
      console.error('Error generating insight:', error)
      toast({
        title: 'Error',
        description: 'Failed to generate insights. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = () => {
    onComplete({
      responses,
      aiInsight
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-16 h-16 animate-spin text-purple-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Analyzing your reflections...
        </h3>
        <p className="text-gray-600 text-center max-w-md">
          Our AI is synthesizing your responses to provide personalized insights about your journey
        </p>
      </div>
    )
  }

  if (showInsight && aiInsight) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-purple-600 rounded-full">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your Integration Insights
              </h2>
              <p className="text-gray-600">
                Based on your Module 1 journey
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Key Themes */}
            {aiInsight.keyThemes && aiInsight.keyThemes.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  Key Themes in Your Profile
                </h3>
                <div className="space-y-3">
                  {aiInsight.keyThemes.map((theme: any, idx: number) => (
                    <Card key={idx} className="p-4 bg-white">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {theme.theme}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {theme.explanation}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Overall Summary */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-xl">✨</span>
                Your Unique Story
              </h3>
              <Card className="p-6 bg-white">
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                  {aiInsight.summary}
                </p>
              </Card>
            </div>

            {/* Strengths & Values Alignment */}
            {aiInsight.alignment && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">🤝</span>
                  How Your Strengths & Values Connect
                </h3>
                <Card className="p-6 bg-white">
                  <p className="text-gray-800 leading-relaxed">
                    {aiInsight.alignment}
                  </p>
                </Card>
              </div>
            )}

            {/* Next Steps */}
            {aiInsight.nextSteps && aiInsight.nextSteps.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">🚀</span>
                  What This Means for Your Journey
                </h3>
                <Card className="p-6 bg-white">
                  <ul className="space-y-2">
                    {aiInsight.nextSteps.map((step: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800">{step}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            )}
          </div>
        </Card>

        {/* Your Responses Summary */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Your Reflection Responses
          </h3>
          <div className="space-y-4">
            {REFLECTION_PROMPTS.map((p, idx) => (
              <div key={p.id} className="border-l-4 border-blue-500 pl-4">
                <p className="font-medium text-gray-900 text-sm mb-1">
                  {p.question}
                </p>
                <p className="text-gray-700 text-sm">
                  {responses[p.id]}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={handleComplete}
            size="lg"
            className="gap-2"
          >
            Complete Module 1
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Previous Responses Section */}
      {!loadingPrevious && previousResponses.length > 0 && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">
                Your Previous Responses ({previousResponses.length} {previousResponses.length === 1 ? 'activity' : 'activities'})
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreviousResponses(!showPreviousResponses)}
            >
              {showPreviousResponses ? (
                <>
                  <EyeOff className="w-4 h-4 mr-1" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </>
              )}
            </Button>
          </div>

          {showPreviousResponses && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 mt-4"
            >
              {previousResponses.map((response, idx) => (
                <Card key={response.activityId} className="p-4 bg-white">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{idx === 0 ? '🎯' : idx === 1 ? '💎' : '💪'}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {response.activityTitle}
                      </h4>
                      <div className="text-sm text-gray-600">
                        {response.activitySlug === 'who-am-i' && response.data && (
                          <div className="space-y-2">
                            {Object.entries(response.data).map(([key, values]: [string, any]) => (
                              <div key={key}>
                                <span className="font-medium">Question {key}: </span>
                                <span>{Array.isArray(values) ? values.join(', ') : JSON.stringify(values)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {response.activitySlug === 'values-card-sort' && response.data && (
                          <div>
                            <span className="font-medium">Top Values: </span>
                            {response.data.topValues ? response.data.topValues.join(', ') : 'Completed'}
                          </div>
                        )}
                        {response.activitySlug === 'strengths-discovery' && response.data && (
                          <div>
                            <span className="font-medium">Top Strengths: </span>
                            {response.data.selectedStrengths ? response.data.selectedStrengths.join(', ') : 'Completed'}
                          </div>
                        )}
                        {!['who-am-i', 'values-card-sort', 'strengths-discovery'].includes(response.activitySlug) && (
                          <span className="italic">Activity completed ✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>
          )}

          <p className="text-xs text-gray-600 mt-2">
            Use these responses to help reflect on patterns and connections in your self-discovery journey
          </p>
        </Card>
      )}

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            Question {currentPrompt + 1} of {REFLECTION_PROMPTS.length}
          </span>
          <span className="text-gray-600">
            {Math.round(((currentPrompt + 1) / REFLECTION_PROMPTS.length) * 100)}% complete
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentPrompt + 1) / REFLECTION_PROMPTS.length) * 100}%` }}
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {prompt.question}
            </h2>
            <p className="text-gray-600">
              {prompt.subtitle}
            </p>
          </div>

          <Textarea
            value={currentResponse}
            onChange={(e) => setResponses({
              ...responses,
              [prompt.id]: e.target.value
            })}
            placeholder={prompt.placeholder}
            className="min-h-[200px] text-base"
          />

          <div className="mt-2 text-sm text-gray-500">
            {currentResponse.length} characters
            {currentResponse.length < 10 && ' (minimum 10)'}
          </div>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentPrompt === 0}
        >
          ← Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={currentResponse.trim().length < 10}
        >
          {currentPrompt === REFLECTION_PROMPTS.length - 1
            ? 'Generate Insights ✨'
            : 'Next →'}
        </Button>
      </div>

      {/* AI Support Button */}
      <AISupport
        activityId={activityId}
        activityTitle="Integration Reflection"
        activityType="REFLECTION"
        currentProgress={{ currentPrompt, responses }}
      />
    </div>
  )
}
