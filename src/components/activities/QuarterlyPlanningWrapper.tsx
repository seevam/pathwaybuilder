// src/components/activities/QuarterlyPlanningWrapper.tsx
'use client'

import { QuarterlyPlanning } from './QuarterlyPlanning'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

interface QuarterlyPlanningWrapperProps {
  activityId: string
}

export function QuarterlyPlanningWrapper({ activityId }: QuarterlyPlanningWrapperProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleComplete = async (data: { quarterlyPlans: Record<string, any[]> }) => {
    try {
      const response = await fetch(`/api/activities/${activityId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { ...data, timestamp: new Date().toISOString() }, timeSpent: 1200 })
      })

      if (!response.ok) throw new Error('Failed to save')

      toast({ title: 'Quarterly Planning Complete!', description: 'Your plan has been saved.' })
      router.push('/module-5')
    } catch (error) {
      console.error('Error:', error)
      toast({ title: 'Error', description: 'Failed to save. Please try again.', variant: 'destructive' })
    }
  }

  return <QuarterlyPlanning onComplete={handleComplete} />
}
