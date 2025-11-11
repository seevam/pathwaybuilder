'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Sparkles, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface AISupportButtonProps {
  activityId: string
  activityTitle: string
  activityDescription?: string
  userProgress?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

export function AISupportButton({
  activityId,
  activityTitle,
  activityDescription,
  userProgress,
  variant = 'outline',
  size = 'default',
}: AISupportButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [guidance, setGuidance] = useState<string>('')
  const { toast } = useToast()

  const fetchGuidance = async () => {
    if (guidance) return // Already loaded

    setLoading(true)
    try {
      const response = await fetch('/api/activities/ai-support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId,
          activityTitle,
          activityDescription,
          userProgress,
        }),
      })

      if (!response.ok) throw new Error('Failed to fetch guidance')

      const data = await response.json()
      setGuidance(data.guidance)
    } catch (error) {
      console.error('Error fetching AI guidance:', error)
      toast({
        title: 'Error',
        description: 'Failed to load AI guidance. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      fetchGuidance()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Sparkles className="h-4 w-4" />
          Get AI Help
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Guidance: {activityTitle}
          </DialogTitle>
          <DialogDescription>
            Here's some personalized guidance to help you complete this activity successfully.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : guidance ? (
            <div className="prose prose-sm max-w-none">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 whitespace-pre-wrap">
                {guidance}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Click the button above to get AI guidance
            </div>
          )}
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          💡 Tip: Use this guidance as a starting point, but make sure your responses are authentic and personal to you.
        </div>
      </DialogContent>
    </Dialog>
  )
}
