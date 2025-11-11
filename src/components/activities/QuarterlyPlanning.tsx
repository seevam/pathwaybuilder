// src/components/activities/QuarterlyPlanning.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Plus, X, Calendar } from 'lucide-react'

const QUARTERS = ['Q1 (Jan-Mar)', 'Q2 (Apr-Jun)', 'Q3 (Jul-Sep)', 'Q4 (Oct-Dec)']

interface Milestone {
  id: string
  text: string
  completed: boolean
}

interface QuarterlyPlanningProps {
  onComplete: (data: { quarterlyPlans: Record<string, Milestone[]> }) => void
}

export function QuarterlyPlanning({ onComplete }: QuarterlyPlanningProps) {
  const { toast } = useToast()
  const [currentQuarter, setCurrentQuarter] = useState(0)
  const [plans, setPlans] = useState<Record<string, Milestone[]>>({
    'Q1 (Jan-Mar)': [],
    'Q2 (Apr-Jun)': [],
    'Q3 (Jul-Sep)': [],
    'Q4 (Oct-Dec)': []
  })
  const [newMilestone, setNewMilestone] = useState('')
  const [showSummary, setShowSummary] = useState(false)

  const quarter = QUARTERS[currentQuarter]
  const quarterMilestones = plans[quarter]

  const handleAddMilestone = () => {
    if (!newMilestone.trim()) {
      toast({ title: 'Enter a milestone', variant: 'destructive' })
      return
    }

    const milestone: Milestone = {
      id: Date.now().toString(),
      text: newMilestone,
      completed: false
    }

    setPlans({
      ...plans,
      [quarter]: [...quarterMilestones, milestone]
    })
    setNewMilestone('')
  }

  const handleRemove = (id: string) => {
    setPlans({
      ...plans,
      [quarter]: quarterMilestones.filter(m => m.id !== id)
    })
  }

  const handleNext = () => {
    if (currentQuarter < QUARTERS.length - 1) {
      setCurrentQuarter(currentQuarter + 1)
    } else {
      setShowSummary(true)
    }
  }

  const handleComplete = () => {
    const total = Object.values(plans).reduce((sum, arr) => sum + arr.length, 0)
    if (total < 4) {
      toast({ title: 'Add more milestones', description: 'Add at least 1 milestone per quarter', variant: 'destructive' })
      return
    }
    onComplete({ quarterlyPlans: plans })
  }

  if (showSummary) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="text-center mb-8">
            <Calendar className="w-16 h-16 mx-auto text-green-600 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Quarterly Plan</h2>
            <p className="text-gray-600">Milestones for the year ahead</p>
          </div>

          <div className="space-y-6">
            {QUARTERS.map(q => {
              const milestones = plans[q]
              if (!milestones.length) return null

              return (
                <div key={q}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{q}</h3>
                  <div className="space-y-2">
                    {milestones.map(m => (
                      <Card key={m.id} className="p-4 bg-white">
                        <p className="text-gray-700">{m.text}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleComplete} size="lg">Complete Planning →</Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
        <h2 className="text-3xl font-bold mb-2">{quarter}</h2>
        <p className="text-green-100">What will you accomplish this quarter?</p>
      </Card>

      <div className="space-y-3">
        {quarterMilestones.map(milestone => (
          <Card key={milestone.id} className="p-4 flex justify-between items-center">
            <p className="text-gray-700">{milestone.text}</p>
            <Button variant="ghost" size="sm" onClick={() => handleRemove(milestone.id)}>
              <X className="w-4 h-4" />
            </Button>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <Textarea
          value={newMilestone}
          onChange={(e) => setNewMilestone(e.target.value)}
          placeholder="Enter a milestone or action item for this quarter..."
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddMilestone(); } }}
        />
        <Button onClick={handleAddMilestone} className="mt-3 w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Milestone
        </Button>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => currentQuarter > 0 && setCurrentQuarter(currentQuarter - 1)} disabled={currentQuarter === 0}>
          ← Previous Quarter
        </Button>
        <Button onClick={handleNext}>
          {currentQuarter === QUARTERS.length - 1 ? 'Review Plan →' : 'Next Quarter →'}
        </Button>
      </div>
    </div>
  )
}
