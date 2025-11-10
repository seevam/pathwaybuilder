// src/components/activities/ActionPlanReflectionWrapper.tsx
'use client'

import { ActionPlanReflection } from './ActionPlanReflection'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

interface ActionPlanReflectionWrapperProps {
  activityId: string
}

export function ActionPlanReflectionWrapper({ activityId }: ActionPlanReflectionWrapperProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleComplete = async (data: { responses: Record<string, string> }) => {
    try {
      const response = await fetch(`/api/activities/${activityId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { ...data, timestamp: new Date().toISOString() }, timeSpent: 600 })
      })

      if (!response.ok) throw new Error('Failed to save')

      toast({ title: 'Reflection Complete!', description: 'Your action plan is complete.' })
      router.push('/module-5')
    } catch (error) {
      console.error('Error:', error)
      toast({ title: 'Error', description: 'Failed to save. Please try again.', variant: 'destructive' })
    }
  }

  return <ActionPlanReflection onComplete={handleComplete} />
}
