// src/components/activities/FinalReflectionWrapper.tsx
'use client'

import { FinalReflection } from './FinalReflection'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

interface FinalReflectionWrapperProps {
  activityId: string
}

export function FinalReflectionWrapper({ activityId }: FinalReflectionWrapperProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleComplete = async (data: { responses: Record<string, string> }) => {
    try {
      const response = await fetch(`/api/activities/${activityId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { ...data, timestamp: new Date().toISOString() }, timeSpent: 900 })
      })

      if (!response.ok) throw new Error('Failed to save')

      toast({ title: 'Congratulations!', description: 'You\'ve completed the entire program!' })
      router.push('/module-6')
    } catch (error) {
      console.error('Error:', error)
      toast({ title: 'Error', description: 'Failed to save. Please try again.', variant: 'destructive' })
    }
  }

  return <FinalReflection onComplete={handleComplete} />
}
