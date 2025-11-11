// src/components/activities/SMARTGoalsWrapper.tsx
'use client'

import { SMARTGoals } from './SMARTGoals'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

interface SMARTGoalsWrapperProps {
  activityId: string
}

export function SMARTGoalsWrapper({ activityId }: SMARTGoalsWrapperProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleComplete = async (data: { goals: any[] }) => {
    try {
      const response = await fetch(`/api/activities/${activityId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            goals: data.goals,
            timestamp: new Date().toISOString()
          },
          timeSpent: 1200 // 20 minutes
        })
      })

      if (!response.ok) throw new Error('Failed to save')

      toast({
        title: 'SMART Goals Complete!',
        description: 'Your goals have been saved.',
      })

      router.push('/module-5')
    } catch (error) {
      console.error('Error saving SMART goals:', error)
      toast({
        title: 'Error',
        description: 'Failed to save your goals. Please try again.',
        variant: 'destructive'
      })
    }
  }

  return <SMARTGoals onComplete={handleComplete} />
}
