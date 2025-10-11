// src/components/activities/RIASECAssessmentWrapper.tsx
'use client'

import { RIASECAssessment } from './RIASECAssessment'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

type RIASECDimension = 'R' | 'I' | 'A' | 'S' | 'E' | 'C'

interface RIASECAssessmentWrapperProps {
  activityId: string
}

export function RIASECAssessmentWrapper({ activityId }: RIASECAssessmentWrapperProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleComplete = async (data: {
    responses: Record<string, number>
    scores: Record<RIASECDimension, number>
    code: string
  }) => {
    try {
      // Structure data for storage
      const structuredData = {
        responses: data.responses,
        scores: data.scores,
        code: data.code,
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

      toast({
        title: '✅ Assessment Complete!',
        description: `Your Holland Code is ${data.code}. This will help us recommend careers for you.`,
      })

      router.push('/module-2')
      router.refresh()
    } catch (error) {
      console.error('Error saving RIASEC assessment:', error)
      toast({
        title: 'Error',
        description: 'Failed to save your assessment. Please try again.',
        variant: 'destructive'
      })
    }
  }

  return <RIASECAssessment onComplete={handleComplete} />
}
