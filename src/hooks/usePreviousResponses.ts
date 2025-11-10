import { useState, useEffect } from 'react'

interface ActivityResponse {
  activityId: string
  activitySlug: string
  activityTitle: string
  activityType: string
  moduleId: string
  data: any
  completedAt: Date | null
  timeSpent: number | null
}

interface UsePreviousResponsesOptions {
  activityId?: string
  moduleId?: string
}

/**
 * Hook to fetch and access previous activity responses
 *
 * @example
 * // Fetch all previous responses from the current activity's module
 * const { responses, loading, error } = usePreviousResponses({ activityId: 'abc123' })
 *
 * @example
 * // Fetch all previous responses from a specific module
 * const { responses, loading, error } = usePreviousResponses({ moduleId: 'module-1' })
 *
 * @example
 * // Access specific response by slug
 * const { responses } = usePreviousResponses({ activityId: 'abc123' })
 * const whoAmIResponse = responses.find(r => r.activitySlug === 'who-am-i')
 */
export function usePreviousResponses(options: UsePreviousResponsesOptions = {}) {
  const [responses, setResponses] = useState<ActivityResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true)
        setError(null)

        let url = '/api/activities/responses'

        // If activityId is provided, first fetch the activity to get its moduleId
        if (options.activityId) {
          const activityResponse = await fetch(`/api/activities/${options.activityId}`)
          if (!activityResponse.ok) throw new Error('Failed to fetch activity')

          const activityData = await activityResponse.json()
          const moduleId = activityData.activity?.moduleId

          if (moduleId) {
            url = `/api/activities/responses?moduleId=${moduleId}`
          }
        } else if (options.moduleId) {
          url = `/api/activities/responses?moduleId=${options.moduleId}`
        }

        const responsesResponse = await fetch(url)
        if (!responsesResponse.ok) throw new Error('Failed to fetch responses')

        const data = await responsesResponse.json()

        // Filter out the current activity if activityId was provided
        const filteredResponses = options.activityId
          ? data.responses?.filter((r: ActivityResponse) => r.activityId !== options.activityId) || []
          : data.responses || []

        setResponses(filteredResponses)
      } catch (err) {
        console.error('Error fetching previous responses:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch responses')
      } finally {
        setLoading(false)
      }
    }

    if (options.activityId || options.moduleId) {
      fetchResponses()
    } else {
      setLoading(false)
    }
  }, [options.activityId, options.moduleId])

  /**
   * Get a specific response by activity slug
   */
  const getResponseBySlug = (slug: string) => {
    return responses.find(r => r.activitySlug === slug)
  }

  /**
   * Get all responses from a specific module
   */
  const getResponsesByModule = (moduleId: string) => {
    return responses.filter(r => r.moduleId === moduleId)
  }

  return {
    responses,
    loading,
    error,
    getResponseBySlug,
    getResponsesByModule,
  }
}
