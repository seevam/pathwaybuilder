// src/components/activities/EducationPathwaysWrapper.tsx
'use client'

import { EducationPathways } from './EducationPathways'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

interface EducationPathwaysWrapperProps {
  activityId: string
}

export function EducationPathwaysWrapper({ activityId }: EducationPathwaysWrapperProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleComplete = async (data: {
    exploredPathways: string[]
    topChoices: string[]
    notes: Record<string, string>
  }) => {
    try {
      const response = await fetch(`/api/activities/${activityId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            exploredPathways: data.exploredPathways,
            topChoices: data.topChoices,
            notes: data.notes,
            timestamp: new Date().toISOString()
          },
          timeSpent: 1200 // 20 minutes
        })
      })

      if (!response.ok) throw new Error('Failed to save')

      toast({
        title: 'Education Pathways Complete!',
        description: 'Your pathway exploration has been saved.',
      })

      router.push('/module-4')
    } catch (error) {
      console.error('Error saving education pathways:', error)
      toast({
        title: 'Error',
        description: 'Failed to save your exploration. Please try again.',
        variant: 'destructive'
      })
    }
  }

  return <EducationPathways onComplete={handleComplete} />
}
