// src/components/activities/DISCAssessmentWrapper.tsx
'use client'

import { DISCAssessment } from './DISCAssessment'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

interface DISCAssessmentWrapperProps {
  activityId: string
}

export function DISCAssessmentWrapper({ activityId }: DISCAssessmentWrapperProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleComplete = async (data: {
    responses: Record<string, number>
    scores: Record<string, number>
    profile: string
  }) => {
    try {
      const response = await fetch(`/api/activities/${activityId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            responses: data.responses,
            scores: data.scores,
            profile: data.profile,
            timestamp: new Date().toISOString()
          },
          timeSpent: 900 // 15 minutes
        })
      })

      if (!response.ok) throw new Error('Failed to save')

      toast({
        title: 'DISC Assessment Complete!',
        description: 'Your work style profile has been saved.',
      })

      router.push('/module-3')
    } catch (error) {
      console.error('Error saving DISC assessment:', error)
      toast({
        title: 'Error',
        description: 'Failed to save your assessment. Please try again.',
        variant: 'destructive'
      })
    }
  }

  return <DISCAssessment onComplete={handleComplete} />
}
