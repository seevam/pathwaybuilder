// src/components/activities/CareerClustersExplorationWrapper.tsx
'use client'

import { CareerClustersExploration } from './CareerClustersExploration'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'

interface CareerClustersExplorationWrapperProps {
  activityId: string
}

export function CareerClustersExplorationWrapper({ activityId }: CareerClustersExplorationWrapperProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [riasecCode, setRiasecCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user's RIASEC code from previous assessment
  useEffect(() => {
    const fetchRIASECCode = async () => {
      try {
        // Fetch the RIASEC assessment completion
        const response = await fetch('/api/activities/riasec-code')
        const data = await response.json()
        
        if (data.success && data.riasecCode) {
          setRiasecCode(data.riasecCode)
        }
      } catch (error) {
        console.error('Error fetching RIASEC code:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRIASECCode()
  }, [])

  const handleComplete = async (data: {
    exploredClusters: string[]
    quizScores: Record<string, number>
    dayInLifeResults: Record<string, number>
    interestedClusters: string[]
  }) => {
    try {
      // Calculate average quiz score for interested clusters
      const interestedScores = data.interestedClusters
        .map(id => data.quizScores[id])
        .filter(score => score !== undefined)
      
      const avgQuizScore = interestedScores.length > 0
        ? Math.round(interestedScores.reduce((a, b) => a + b, 0) / interestedScores.length)
        : 0

      // Structure data for storage
      const structuredData = {
        exploredClusters: data.exploredClusters,
        interestedClusters: data.interestedClusters,
        quizScores: data.quizScores,
        dayInLifeResults: data.dayInLifeResults,
        riasecCodeUsed: riasecCode,
        avgQuizScore,
        exploredCount: data.exploredClusters.length,
        timestamp: new Date().toISOString()
      }

      // Save to database
      const response = await fetch(`/api/activities/${activityId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: structuredData,
          timeSpent: 1500 // Approximate 25 minutes
        })
      })

      if (!response.ok) throw new Error('Failed to save')

      toast({
        title: '✅ Career Clusters Explored!',
        description: `You explored ${data.exploredClusters.length} clusters and marked ${data.interestedClusters.length} as interesting.`,
      })

      router.push('/module-2')
      router.refresh()
    } catch (error) {
      console.error('Error saving career clusters exploration:', error)
      toast({
        title: 'Error',
        description: 'Failed to save your exploration. Please try again.',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading career clusters...</p>
        </div>
      </div>
    )
  }

  return (
    <CareerClustersExploration 
      riasecCode={riasecCode}
      onComplete={handleComplete}
    />
  )
}
