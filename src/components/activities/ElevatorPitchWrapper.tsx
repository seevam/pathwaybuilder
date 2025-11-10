// src/components/activities/ElevatorPitchWrapper.tsx
'use client'

import { ElevatorPitch } from './ElevatorPitch'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

interface ElevatorPitchWrapperProps {
  activityId: string
}

export function ElevatorPitchWrapper({ activityId }: ElevatorPitchWrapperProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleComplete = async (data: any) => {
    try {
      const response = await fetch(`/api/activities/${activityId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { ...data, timestamp: new Date().toISOString() }, timeSpent: 900 })
      })

      if (!response.ok) throw new Error('Failed to save')

      toast({ title: 'Elevator Pitch Complete!', description: 'Your pitch has been saved.' })
      router.push('/module-6')
    } catch (error) {
      console.error('Error:', error)
      toast({ title: 'Error', description: 'Failed to save. Please try again.', variant: 'destructive' })
    }
  }

  return <ElevatorPitch onComplete={handleComplete} />
}
