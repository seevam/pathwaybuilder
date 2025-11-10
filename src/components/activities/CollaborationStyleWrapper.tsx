// src/components/activities/CollaborationStyleWrapper.tsx
'use client'

import { CollaborationStyle } from './CollaborationStyle'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

interface CollaborationStyleWrapperProps {
  activityId: string
}

export function CollaborationStyleWrapper({ activityId }: CollaborationStyleWrapperProps) {
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
        title: 'Collaboration Style Complete!',
        description: 'Your collaboration preferences have been saved.',
      })

      router.push('/module-3')
    } catch (error) {
      console.error('Error saving collaboration style:', error)
      toast({
        title: 'Error',
        description: 'Failed to save your responses. Please try again.',
        variant: 'destructive'
      })
    }
  }

  return <CollaborationStyle onComplete={handleComplete} />
}
