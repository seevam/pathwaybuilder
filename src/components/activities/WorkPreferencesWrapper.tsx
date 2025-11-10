// src/components/activities/WorkPreferencesWrapper.tsx
'use client'

import { WorkPreferences } from './WorkPreferences'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

interface WorkPreferencesWrapperProps {
  activityId: string
}

export function WorkPreferencesWrapper({ activityId }: WorkPreferencesWrapperProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleComplete = async (data: { preferences: Record<string, string> }) => {
    try {
      const response = await fetch(`/api/activities/${activityId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            preferences: data.preferences,
            timestamp: new Date().toISOString()
          },
          timeSpent: 900 // 15 minutes
        })
      })

      if (!response.ok) throw new Error('Failed to save')

      toast({
        title: 'Work Preferences Complete!',
        description: 'Your preferences have been saved.',
      })

      router.push('/module-3')
    } catch (error) {
      console.error('Error saving work preferences:', error)
      toast({
        title: 'Error',
        description: 'Failed to save your preferences. Please try again.',
        variant: 'destructive'
      })
    }
  }

  return <WorkPreferences onComplete={handleComplete} />
}
