// src/components/activities/DigitalPresenceWrapper.tsx
'use client'

import { DigitalPresence } from './DigitalPresence'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

interface DigitalPresenceWrapperProps {
  activityId: string
}

export function DigitalPresenceWrapper({ activityId }: DigitalPresenceWrapperProps) {
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

      toast({ title: 'Digital Presence Complete!', description: 'Your plan has been saved.' })
      router.push('/module-6')
    } catch (error) {
      console.error('Error:', error)
      toast({ title: 'Error', description: 'Failed to save. Please try again.', variant: 'destructive' })
    }
  }

  return <DigitalPresence onComplete={handleComplete} />
}
