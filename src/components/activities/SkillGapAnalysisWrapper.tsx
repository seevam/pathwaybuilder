// src/components/activities/SkillGapAnalysisWrapper.tsx
'use client'

import { SkillGapAnalysis } from './SkillGapAnalysis'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

interface SkillGapAnalysisWrapperProps {
  activityId: string
}

export function SkillGapAnalysisWrapper({ activityId }: SkillGapAnalysisWrapperProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleComplete = async (data: {
    currentSkills: string[]
    neededSkills: string[]
    developmentPlan: Record<string, string>
  }) => {
    try {
      const response = await fetch(`/api/activities/${activityId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            currentSkills: data.currentSkills,
            neededSkills: data.neededSkills,
            developmentPlan: data.developmentPlan,
            timestamp: new Date().toISOString()
          },
          timeSpent: 900 // 15 minutes
        })
      })

      if (!response.ok) throw new Error('Failed to save')

      toast({
        title: 'Skill Gap Analysis Complete!',
        description: 'Your skill analysis has been saved.',
      })

      router.push('/module-4')
    } catch (error) {
      console.error('Error saving skill gap analysis:', error)
      toast({
        title: 'Error',
        description: 'Failed to save your analysis. Please try again.',
        variant: 'destructive'
      })
    }
  }

  return <SkillGapAnalysis onComplete={handleComplete} />
}
