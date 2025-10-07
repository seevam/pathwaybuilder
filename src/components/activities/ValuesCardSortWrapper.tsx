'use client'

import { ValuesCardSort } from './ValuesCardSort'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

export function ValuesCardSortWrapper() {
  const router = useRouter()
  const { toast } = useToast()

const handleComplete = async (values: any) => {
  try {
    const response = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topValues: values.alwaysTrue,
      }),
    })
    
    if (!response.ok) throw new Error('Failed to save')
    
    // Also mark activity as complete
    await fetch('/api/activities/[activityId]/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: values }),
    })

      // Redirect back to module page
      router.push('/module-1')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save your values. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return <ValuesCardSort onComplete={handleComplete} />
}
