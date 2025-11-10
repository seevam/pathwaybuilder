'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

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

interface ActivityResponseContextType {
  responses: ActivityResponse[]
  loading: boolean
  error: string | null
  refreshResponses: () => Promise<void>
  getResponseBySlug: (slug: string) => ActivityResponse | undefined
  getResponsesByModule: (moduleId: string) => ActivityResponse[]
  getAllResponses: () => ActivityResponse[]
}

const ActivityResponseContext = createContext<ActivityResponseContextType | undefined>(undefined)

export function ActivityResponseProvider({ children }: { children: React.ReactNode }) {
  const [responses, setResponses] = useState<ActivityResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchResponses = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/activities/responses')

      if (!response.ok) {
        throw new Error('Failed to fetch responses')
      }

      const data = await response.json()
      setResponses(data.responses || [])
    } catch (err) {
      console.error('Error fetching responses:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResponses()
  }, [])

  const refreshResponses = async () => {
    await fetchResponses()
  }

  const getResponseBySlug = (slug: string) => {
    return responses.find(r => r.activitySlug === slug)
  }

  const getResponsesByModule = (moduleId: string) => {
    return responses.filter(r => r.moduleId === moduleId)
  }

  const getAllResponses = () => {
    return responses
  }

  const value: ActivityResponseContextType = {
    responses,
    loading,
    error,
    refreshResponses,
    getResponseBySlug,
    getResponsesByModule,
    getAllResponses,
  }

  return (
    <ActivityResponseContext.Provider value={value}>
      {children}
    </ActivityResponseContext.Provider>
  )
}

export function useActivityResponses() {
  const context = useContext(ActivityResponseContext)
  if (context === undefined) {
    throw new Error('useActivityResponses must be used within an ActivityResponseProvider')
  }
  return context
}
