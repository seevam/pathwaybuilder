// src/components/activities/AccountabilitySystemWrapper.tsx
'use client'

import { AccountabilitySystem } from './AccountabilitySystem'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

interface AccountabilitySystemWrapperProps {
  activityId: string
}

export function AccountabilitySystemWrapper({ activityId }: AccountabilitySystemWrapperProps) {
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

      toast({ title: 'Accountability System Complete!', description: 'Your system has been saved.' })
      router.push('/module-5')
    } catch (error) {
      console.error('Error:', error)
      toast({ title: 'Error', description: 'Failed to save. Please try again.', variant: 'destructive' })
    }
  }

  return <AccountabilitySystem onComplete={handleComplete} />
}
