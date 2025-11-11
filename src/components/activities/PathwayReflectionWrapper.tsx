// src/components/activities/PathwayReflectionWrapper.tsx
'use client'

import { PathwayReflection } from './PathwayReflection'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

interface PathwayReflectionWrapperProps {
  activityId: string
}

export function PathwayReflectionWrapper({ activityId }: PathwayReflectionWrapperProps) {
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
        description: 'Your pathway insights have been saved.',
      })

      router.push('/module-4')
    } catch (error) {
      console.error('Error saving pathway reflection:', error)
      toast({
        title: 'Error',
        description: 'Failed to save your reflection. Please try again.',
        variant: 'destructive'
      })
    }
  }

  return <PathwayReflection onComplete={handleComplete} />
}
