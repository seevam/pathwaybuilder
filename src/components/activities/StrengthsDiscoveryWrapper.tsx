// src/components/activities/StrengthsDiscoveryWrapper.tsx
'use client'

import { StrengthsDiscovery } from './StrengthsDiscovery'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

// Metadata for all strengths (used for structured storage)
const STRENGTH_CATEGORIES = [
  {
    id: 'academic',
    name: 'Academic',
    strengths: [
      { id: 'math', name: 'Math & Logic', category: 'academic' },
      { id: 'science', name: 'Science & Research', category: 'academic' },
      { id: 'writing', name: 'Writing & Communication', category: 'academic' },
      { id: 'languages', name: 'Languages', category: 'academic' },
      { id: 'analysis', name: 'Critical Analysis', category: 'academic' }
    ]
  },
  {
    id: 'creative',
    name: 'Creative',
    strengths: [
      { id: 'visual-arts', name: 'Visual Arts', category: 'creative' },
      { id: 'music', name: 'Music', category: 'creative' },
      { id: 'design', name: 'Design Thinking', category: 'creative' },
      { id: 'storytelling', name: 'Storytelling', category: 'creative' },
      { id: 'innovation', name: 'Innovation', category: 'creative' }
    ]
  },
  {
    id: 'social',
    name: 'Social',
    strengths: [
      { id: 'leadership', name: 'Leadership', category: 'social' },
      { id: 'empathy', name: 'Empathy', category: 'social' },
      { id: 'communication', name: 'Communication', category: 'social' },
      { id: 'collaboration', name: 'Collaboration', category: 'social' },
      { id: 'public-speaking', name: 'Public Speaking', category: 'social' }
    ]
  },
  {
    id: 'physical-technical',
    name: 'Physical/Technical',
    strengths: [
      { id: 'building', name: 'Building/Making', category: 'physical-technical' },
      { id: 'coding', name: 'Coding/Programming', category: 'physical-technical' },
      { id: 'sports', name: 'Athletic/Sports', category: 'physical-technical' },
      { id: 'hands-on', name: 'Hands-on Work', category: 'physical-technical' },
      { id: 'technical', name: 'Technical Skills', category: 'physical-technical' }
    ]
  }
]

interface StrengthsDiscoveryWrapperProps {
  activityId: string
}

export function StrengthsDiscoveryWrapper({ activityId }: StrengthsDiscoveryWrapperProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleComplete = async (ratings: Record<string, number>) => {
    try {
      // Calculate category scores
      const categoryScores: Record<string, number> = {}
      STRENGTH_CATEGORIES.forEach(cat => {
        const categoryRatings = cat.strengths.map(s => ratings[s.id] || 0)
        const average = categoryRatings.reduce((a, b) => a + b, 0) / categoryRatings.length
        categoryScores[cat.id] = Math.round(average * 20) // Convert 1-5 to 0-100
      })

      // Create strengths metadata lookup
      const strengthsMetadata: Record<string, any> = {}
      STRENGTH_CATEGORIES.forEach(cat => {
        cat.strengths.forEach(strength => {
          strengthsMetadata[strength.id] = {
            name: strength.name,
            category: strength.category
          }
        })
      })

      // Structure data for storage
      const structuredData = {
        ratings,
        categoryScores,
        strengthsMetadata,
        timestamp: new Date().toISOString()
      }

      // Save to database
      const response = await fetch(`/api/activities/${activityId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: structuredData,
          timeSpent: 600 // Approximate
        })
      })

      if (!response.ok) throw new Error('Failed to save')

      // Also update profile with top strengths
      const topStrengths = Object.entries(ratings)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id]) => id)

      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topStrengths
        })
      })

      toast({
        title: 'Strengths Saved! 🎉',
        description: 'Your strength profile has been recorded.',
      })

      router.push('/module-1')
    } catch (error) {
      console.error('Error saving strengths:', error)
      toast({
        title: 'Error',
        description: 'Failed to save your strengths. Please try again.',
        variant: 'destructive'
      })
    }
  }

  return <StrengthsDiscovery onComplete={handleComplete} />
}
