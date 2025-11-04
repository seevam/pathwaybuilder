// src/components/activities/DayInLifeResearchWrapper.tsx
'use client'

import { DayInLifeResearch } from './DayInLifeResearch'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'

interface DayInLifeResearchWrapperProps {
  activityId: string
}

export function DayInLifeResearchWrapper({ activityId }: DayInLifeResearchWrapperProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [riasecCode, setRiasecCode] = useState<string | null>(null)
  const [exploredClusters, setExploredClusters] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch user's RIASEC code and explored clusters
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch RIASEC code
        const riasecResponse = await fetch('/api/activities/riasec-code')
        const riasecData = await riasecResponse.json()
        
        if (riasecData.success && riasecData.riasecCode) {
          setRiasecCode(riasecData.riasecCode)
        }

        // Fetch career clusters exploration data
        const clustersResponse = await fetch('/api/activities/explored-clusters')
        const clustersData = await clustersResponse.json()
        
        if (clustersData.success && clustersData.exploredClusters) {
          setExploredClusters(clustersData.exploredClusters)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleComplete = async (data: {
    selectedCareers: string[]
    researchData: Record<string, any>
    shortlist: string[]
  }) => {
    try {
      // Structure data for storage
      const structuredData = {
        selectedCareers: data.selectedCareers,
        researchData: data.researchData,
        shortlist: data.shortlist,
        riasecCodeUsed: riasecCode,
        clustersContext: exploredClusters,
        totalCareersResearched: data.selectedCareers.length,
        averageInterestLevel: Object.values(data.researchData).reduce(
          (sum: number, r: any) => sum + r.interestLevel, 
          0
        ) / data.selectedCareers.length,
        timestamp: new Date().toISOString()
      }

      // Save to database
      const response = await fetch(`/api/activities/${activityId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: structuredData,
          timeSpent: 1200 // Approximate 20 minutes
        })
      })

      if (!response.ok) throw new Error('Failed to save')

      // Update user profile with career shortlist
      if (data.shortlist.length > 0) {
        await fetch('/api/profile/career-shortlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shortlist: data.shortlist,
            researchedCareers: data.selectedCareers
          })
        })
      }

      toast({
        title: '✅ Career Research Complete!',
        description: `You researched ${data.selectedCareers.length} careers and added ${data.shortlist.length} to your shortlist.`,
      })

      router.push('/module-2')
      router.refresh()
    } catch (error) {
      console.error('Error saving career research:', error)
      toast({
        title: 'Error',
        description: 'Failed to save your research. Please try again.',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading career research...</p>
        </div>
      </div>
    )
  }

  return (
    <DayInLifeResearch 
      riasecCode={riasecCode}
      exploredClusters={exploredClusters}
      onComplete={handleComplete}
    />
  )
}
