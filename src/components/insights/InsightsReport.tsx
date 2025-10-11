'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Loader2, Sparkles, TrendingUp, Target, Award, Lightbulb } from 'lucide-react'

interface InsightsReportProps {
  user: any
}

interface InsightData {
  personality: {
    traits: Array<{ name: string; score: number }>
    summary: string
  }
  strengths: Array<{ name: string; description: string; icon: string }>
  interests: Array<{ category: string; score: number }>
  careerPaths: Array<{ title: string; match: number; description: string }>
  recommendations: string[]
  overallInsight: string
}

export function InsightsReport({ user }: InsightsReportProps) {
  const [insights, setInsights] = useState<InsightData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInsights()
  }, [])

  const fetchInsights = async () => {
    try {
      const response = await fetch('/api/insights')
      const data = await response.json()
      
      if (data.success) {
        setInsights(data.insights)
      }
    } catch (error) {
      console.error('Error fetching insights:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Analyzing your responses...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
        </div>
      </div>
    )
  }

  if (!insights) {
    return (
      <Card className="p-12 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Complete Activities to See Insights
        </h2>
        <p className="text-gray-600">
          Your personalized report will appear here as you complete activities in Module 1
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Insight Header */}
      <Card className="p-8 bg-gradient-to-br from-purple-500 to-blue-600 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-full">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-3">Your Unique Profile</h2>
            <p className="text-lg leading-relaxed opacity-95">
              {insights.overallInsight}
            </p>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Activities Completed</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{user.activities.length}</p>
          <p className="text-sm text-gray-600 mt-1">Keep exploring!</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-gray-900">Strengths Identified</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{insights.strengths.length}</p>
          <p className="text-sm text-gray-600 mt-1">Your superpowers</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Career Matches</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">{insights.careerPaths.length}</p>
          <p className="text-sm text-gray-600 mt-1">Paths to explore</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personality Traits */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              🎯
            </div>
            Personality Profile
          </h3>
          <div className="space-y-4">
            {insights.personality.traits.map((trait, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{trait.name}</span>
                  <span className="text-gray-600">{trait.score}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                    style={{ width: `${trait.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-6 leading-relaxed">
            {insights.personality.summary}
          </p>
        </Card>

        {/* Interest Areas */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              💚
            </div>
            Interest Areas
          </h3>
          <div className="space-y-4">
            {insights.interests.map((interest, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{interest.category}</span>
                  <span className="text-gray-600">{interest.score}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full transition-all"
                    style={{ width: `${interest.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-6">
            Your strongest interests based on activity responses
          </p>
        </Card>
      </div>

      {/* Top Strengths */}
      <Card className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Award className="w-7 h-7 text-yellow-600" />
          Your Top Strengths
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.strengths.map((strength, idx) => (
            <div key={idx} className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{strength.icon}</span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{strength.name}</h4>
                  <p className="text-sm text-gray-700">{strength.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Career Paths */}
      <Card className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-blue-600" />
          Potential Career Paths
        </h3>
        <div className="space-y-4">
          {insights.careerPaths.map((career, idx) => (
            <div key={idx} className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-lg font-bold text-gray-900">{career.title}</h4>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold">
                    {career.match}% Match
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{career.description}</p>
              
              {/* Visual match indicator */}
              <div className="mt-3 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                  style={{ width: `${career.match}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-8 bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Lightbulb className="w-7 h-7 text-yellow-600" />
          Next Steps & Recommendations
        </h3>
        <ul className="space-y-3">
          {insights.recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">✨</span>
              <p className="text-gray-800 leading-relaxed">{rec}</p>
            </li>
          ))}
        </ul>
      </Card>

      {/* Update Notice */}
      <Card className="p-6 bg-purple-50 border-2 border-purple-200">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <div>
            <p className="font-semibold text-purple-900">This report evolves with you!</p>
            <p className="text-sm text-purple-700">
              Complete more activities to unlock deeper insights and more personalized recommendations.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
