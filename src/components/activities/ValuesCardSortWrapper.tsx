'use client'

import { ValuesCardSort } from './ValuesCardSort'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

export function ValuesCardSortWrapper() {
  const router = useRouter()
  const { toast } = useToast()

  const handleComplete = async (values: any) => {
    try {
      // You can add API call here later to save the values
      console.log('Values selected:', values)
      
      toast({
        title: 'Success! 🎉',
        description: 'Your values have been saved.',
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
