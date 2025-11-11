import { useEffect, useState, useCallback } from 'react'

interface ActivityCompletion {
  id: string
  completed: boolean
  data: any
  completedAt: string
  activity: {
    slug: string
    title: string
    orderIndex: number
  }
}

export function usePreviousResponses(moduleId?: string) {
  const [responses, setResponses] = useState<ActivityCompletion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchResponses = useCallback(async () => {
    try {
      const url = moduleId
        ? `/api/activities/responses?moduleId=${moduleId}`
        : '/api/activities/responses'

      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch responses')

      const data = await response.json()
      setResponses(data.completions || [])
    } catch (err) {
      console.error('Error fetching previous responses:', err)
      setError('Failed to load previous responses')
    } finally {
      setLoading(false)
    }
  }, [moduleId])

  useEffect(() => {
    fetchResponses()
  }, [fetchResponses])

  const getResponseBySlug = (slug: string) => {
    return responses.find(r => r.activity.slug === slug)
  }

  const getResponsesByModule = (moduleId: string) => {
    return responses.filter(r => r.activity.slug.startsWith(moduleId))
  }

  return {
    responses,
    loading,
    error,
    getResponseBySlug,
    getResponsesByModule,
    refetch: fetchResponses,
  }
}
