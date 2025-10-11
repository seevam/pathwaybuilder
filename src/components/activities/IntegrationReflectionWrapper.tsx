// src/components/activities/IntegrationReflectionWrapper.tsx
'use client'

import { IntegrationReflection } from './IntegrationReflection'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

interface IntegrationReflectionWrapperProps {
  activityId: string
}

export function IntegrationReflectionWrapper({ activityId }: IntegrationReflectionWrapperProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleComplete = async (data: {
    responses: Record<string, string>
    aiInsight: any
  }) => {
    try {
      // Structure data for storage
      const structuredData = {
        responses: data.responses,
        aiInsight: data.aiInsight,
        timestamp: new Date().toISOString()
      }

      // Save to database
      const response = await fetch(`/api/activities/${activityId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: structuredData,
          timeSpent: 900 // Approximate
        })
      })

      if (!response.ok) throw new Error('Failed to save')

      toast({
        title: 'Reflection Complete! ✨',
        description: 'Your insights have been saved.',
      })

      router.push('/module-1')
    } catch (error) {
      console.error('Error saving reflection:', error)
      toast({
        title: 'Error',
        description: 'Failed to save your reflection. Please try again.',
        variant: 'destructive'
      })
    }
  }

  return <IntegrationReflection onComplete={handleComplete} />
}
