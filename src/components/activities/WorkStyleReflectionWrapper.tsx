// src/components/activities/WorkStyleReflectionWrapper.tsx
'use client'

import { WorkStyleReflection } from './WorkStyleReflection'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

interface WorkStyleReflectionWrapperProps {
  activityId: string
}

export function WorkStyleReflectionWrapper({ activityId }: WorkStyleReflectionWrapperProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleComplete = async (data: { responses: Record<string, string> }) => {
    try {
      const response = await fetch(`/api/activities/${activityId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            responses: data.responses,
            timestamp: new Date().toISOString()
          },
          timeSpent: 600 // 10 minutes
        })
      })

      if (!response.ok) throw new Error('Failed to save')

      toast({
        title: 'Reflection Complete!',
        description: 'Your work style insights have been saved.',
      })

      router.push('/module-3')
    } catch (error) {
      console.error('Error saving work style reflection:', error)
      toast({
        title: 'Error',
        description: 'Failed to save your reflection. Please try again.',
        variant: 'destructive'
      })
    }
  }

  return <WorkStyleReflection onComplete={handleComplete} />
}
