// src/components/activities/ValuesCardSortWrapper.tsx
'use client'

import { ValuesCardSort } from './ValuesCardSort'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

interface ValuesCardSortWrapperProps {
  activityId: string
}

export function ValuesCardSortWrapper({ activityId }: ValuesCardSortWrapperProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleComplete = async (values: any) => {
    try {
      // Structure the data properly
      const structuredData = {
        alwaysTrue: values.alwaysTrue,
        sometimes: values.sometimes,
        notPriority: values.notPriority,
        timestamp: new Date().toISOString()
      }

      // Mark activity as complete and save data
      const response = await fetch(`/api/activities/${activityId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: structuredData,
          timeSpent: 900 // Approximate 15 minutes
        })
      })
      
      if (!response.ok) throw new Error('Failed to save')

      // Also update profile with top values
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topValues: values.alwaysTrue,
        }),
      })

      toast({
        title: '✅ Values Saved!',
        description: 'Your core values have been recorded.',
      })

      // Redirect back to module page
      router.push('/module-1')
      router.refresh()
    } catch (error) {
      console.error('Error saving values:', error)
      toast({
        title: 'Error',
        description: 'Failed to save your values. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return <ValuesCardSort onComplete={handleComplete} />
}
