'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

interface ActivityResultsProps {
  activityId: string
  activityTitle: string
}

interface ActivityCompletion {
  id: string
  completed: boolean
  data: any
  completedAt: string
  timeSpent?: number
}

export function ActivityResults({ activityId, activityTitle }: ActivityResultsProps) {
  const [completion, setCompletion] = useState<ActivityCompletion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResults()
  }, [activityId])

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/activities/responses?activityId=${activityId}`)
      if (!response.ok) throw new Error('Failed to fetch results')

      const data = await response.json()
      setCompletion(data.completion)
    } catch (error) {
      console.error('Error fetching activity results:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </Card>
    )
  }

  if (!completion || !completion.completed) {
    return null
  }

  return (
    <Card className="p-6 bg-green-50 border-green-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <CheckCircle2 className="h-6 w-6 text-green-500" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Activity Completed
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Completed on {format(new Date(completion.completedAt), 'MMMM d, yyyy')}
            {completion.timeSpent && ` • ${Math.round(completion.timeSpent / 60)} minutes`}
          </p>

          <div className="bg-white rounded-lg p-4 border border-green-200">
            <h4 className="font-medium text-gray-900 mb-3">Your Response:</h4>
            <ActivityData data={completion.data} activityTitle={activityTitle} />
          </div>
        </div>
      </div>
    </Card>
  )
}

function ActivityData({ data, activityTitle }: { data: any; activityTitle: string }) {
  if (!data) {
    return <p className="text-sm text-gray-600">No data available</p>
  }

  // Handle different activity types
  if (typeof data === 'string') {
    return <p className="text-sm text-gray-700 whitespace-pre-wrap">{data}</p>
  }

  // RIASEC Assessment
  if (data.code && data.scores) {
    return (
      <div className="space-y-3">
        <div>
          <span className="font-medium">Holland Code: </span>
          <span className="text-lg font-bold text-purple-600">{data.code}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(data.scores as Record<string, number>).map(([key, value]) => (
            <div key={key}>
              <span className="font-medium">{key}: </span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Values Card Sort
  if (data.alwaysTrue || data.sometimesTrue || data.notPriority) {
    return (
      <div className="space-y-3 text-sm">
        {data.alwaysTrue && data.alwaysTrue.length > 0 && (
          <div>
            <p className="font-medium mb-1">Top Values:</p>
            <ul className="list-disc list-inside text-gray-700">
              {data.alwaysTrue.map((value: string, i: number) => (
                <li key={i}>{value}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  // SMART Goals
  if (data.goals && Array.isArray(data.goals)) {
    return (
      <div className="space-y-3">
        {data.goals.map((goal: any, index: number) => (
          <div key={index} className="border-l-4 border-purple-500 pl-3">
            <p className="font-medium text-gray-900">{goal.specific || goal.goal}</p>
            {goal.deadline && (
              <p className="text-sm text-gray-600">Deadline: {goal.deadline}</p>
            )}
          </div>
        ))}
      </div>
    )
  }

  // Text-based responses
  if (data.text || data.response) {
    return (
      <p className="text-sm text-gray-700 whitespace-pre-wrap">
        {data.text || data.response}
      </p>
    )
  }

  // Reflection responses
  if (data.reflections && Array.isArray(data.reflections)) {
    return (
      <div className="space-y-3">
        {data.reflections.map((reflection: any, index: number) => (
          <div key={index} className="border-b border-gray-200 pb-2 last:border-0">
            {reflection.question && (
              <p className="font-medium text-sm text-gray-900 mb-1">{reflection.question}</p>
            )}
            <p className="text-sm text-gray-700">{reflection.answer || reflection.response}</p>
          </div>
        ))}
      </div>
    )
  }

  // Generic object display
  return (
    <div className="text-sm">
      <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-64">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
