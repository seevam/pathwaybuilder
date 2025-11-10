// src/components/activities/StoryArcWrapper.tsx
'use client'

import { StoryArc } from './StoryArc'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

interface StoryArcWrapperProps {
  activityId: string
}

export function StoryArcWrapper({ activityId }: StoryArcWrapperProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleComplete = async (data: any) => {
    try {
      const response = await fetch(`/api/activities/${activityId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { ...data, timestamp: new Date().toISOString() }, timeSpent: 1200 })
      })

      if (!response.ok) throw new Error('Failed to save')

      toast({ title: 'Story Arc Complete!', description: 'Your narrative has been saved.' })
      router.push('/module-6')
    } catch (error) {
      console.error('Error:', error)
      toast({ title: 'Error', description: 'Failed to save. Please try again.', variant: 'destructive' })
    }
  }

  return <StoryArc onComplete={handleComplete} />
}
