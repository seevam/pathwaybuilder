// src/components/activities/CareerReflectionWrapper.tsx
'use client'

import { CareerReflection } from './CareerReflection'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

interface CareerReflectionWrapperProps {
  activityId: string
}

export function CareerReflectionWrapper({ activityId }: CareerReflectionWrapperProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleComplete = async (data: {
    responses: Record<string, string>
    aiInsight: any
  }) => {
    try {
      const structuredData = {
        responses: data.responses,
        aiInsight: data.aiInsight,
        timestamp: new Date().toISOString()
      }

      const response = await fetch(`/api/activities/${activityId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: structuredData,
          timeSpent: 900
        })
      })

      if (!response.ok) throw new Error('Failed to save')

      toast({
        title: 'Career Reflection Complete! ✨',
        description: 'Your insights have been saved.',
      })

      router.push('/module-2')
    } catch (error) {
      console.error('Error saving reflection:', error)
      toast({
        title: 'Error',
        description: 'Failed to save your reflection. Please try again.',
        variant: 'destructive'
      })
    }
  }

  return <CareerReflection onComplete={handleComplete} />
}
