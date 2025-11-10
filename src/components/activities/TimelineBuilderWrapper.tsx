// src/components/activities/TimelineBuilderWrapper.tsx
'use client'

import { TimelineBuilder } from './TimelineBuilder'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

interface TimelineBuilderWrapperProps {
  activityId: string
}

export function TimelineBuilderWrapper({ activityId }: TimelineBuilderWrapperProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleComplete = async (data: {
    timeline: Record<string, any[]>
    goals: string
  }) => {
    try {
      const response = await fetch(`/api/activities/${activityId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            timeline: data.timeline,
            goals: data.goals,
            timestamp: new Date().toISOString()
          },
          timeSpent: 1500 // 25 minutes
        })
      })

      if (!response.ok) throw new Error('Failed to save')

      toast({
        title: 'Timeline Complete!',
        description: 'Your high school timeline has been saved.',
      })

      router.push('/module-4')
    } catch (error) {
      console.error('Error saving timeline:', error)
      toast({
        title: 'Error',
        description: 'Failed to save your timeline. Please try again.',
        variant: 'destructive'
      })
    }
  }

  return <TimelineBuilder onComplete={handleComplete} />
}
