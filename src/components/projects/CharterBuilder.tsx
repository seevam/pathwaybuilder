'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Plus, X } from 'lucide-react'
import type { ProjectWithRelations } from '@/types'

interface Goal {
  id: string
  text: string
  deadline: string
  successCriteria: string
}

interface CharterBuilderProps {
  project: ProjectWithRelations
  onComplete: () => void
}

export default function CharterBuilder({ project, onComplete }: CharterBuilderProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const existingGoals = project.goals as Goal[] | null
  
  const [mission, setMission] = useState(
    (project.goals as any)?.mission || ''
  )
  const [goals, setGoals] = useState<Goal[]>(
    existingGoals?.filter(g => g.text) || []
  )
  const [targetCompletion, setTargetCompletion] = useState(
    project.targetCompletionAt?.toISOString().split('T')[0] || ''
  )
  const [successMetrics, setSuccessMetrics] = useState(
    (project.metrics as any)?.success || ''
  )

  const addGoal = () => {
    if (goals.length >= 5) {
      toast({
        title: 'Maximum Goals Reached',
        description: 'You can add up to 5 SMART goals',
        variant: 'destructive'
      })
      return
    }
    
    setGoals([...goals, {
      id: `goal_${Date.now()}`,
      text: '',
      deadline: '',
      successCriteria: ''
    }])
  }

  const updateGoal = (id: string, field: keyof Goal, value: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, [field]: value } : g))
  }

  const removeGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id))
  }

  const handleSave = async () => {
    if (!mission.trim()) {
      toast({
        title: 'Mission Required',
        description: 'Please write a mission statement',
        variant: 'destructive'
      })
      return
    }

    if (goals.length === 0) {
      toast({
        title: 'Goals Required',
        description: 'Please add at least one SMART goal',
        variant: 'destructive'
      })
      return
    }

    // Validate goals
    const incompleteGoals = goals.filter(g => !g.text.trim() || !g.successCriteria.trim())
    if (incompleteGoals.length > 0) {
      toast({
        title: 'Incomplete Goals',
        description: 'Please complete all goal fields',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goals: { mission, goals },
          metrics: { success: successMetrics },
          targetCompletionAt: targetCompletion || null,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      toast({
        title: 'Charter Saved',
        description: 'Your project charter has been saved',
      })

      onComplete()
    } catch (error) {
      console.error('Error saving charter:', error)
      toast({
        title: 'Error',
        description: 'Failed to save charter. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Project Charter
          </h2>
          <p className="text-gray-600">
            Define your projects mission and set SMART goals
          </p>
        </div>

        {/* Mission Statement */}
        <div>
          <Label htmlFor="mission" className="text-base font-semibold">
            Mission Statement *
          </Label>
          <p className="text-sm text-gray-500 mb-2">
            What is the core purpose of this project? (max 250 characters)
          </p>
          <Textarea
            id="mission"
            value={mission}
            onChange={(e) => setMission(e.target.value.slice(0, 250))}
            placeholder="Example: Create a mobile app to help students manage their time better and reduce stress through gamified productivity features."
            rows={3}
            maxLength={250}
          />
          <p className="text-xs text-gray-400 mt-1">
            {mission.length}/250 characters
          </p>
        </div>

        {/* SMART Goals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <Label className="text-base font-semibold">
                SMART Goals * (up to 5)
              </Label>
              <p className="text-sm text-gray-500">
                Specific, Measurable, Achievable, Relevant, Time-bound
              </p>
            </div>
            <Button
              onClick={addGoal}
              variant="outline"
              size="sm"
              disabled={goals.length >= 5}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </div>

          <div className="space-y-4">
            {goals.map((goal, index) => (
              <Card key={goal.id} className="p-4 border-2">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold">Goal {index + 1}</h4>
                  <Button
                    onClick={() => removeGoal(goal.id)}
                    variant="ghost"
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm">Goal Description *</Label>
                    <Input
                      value={goal.text}
                      onChange={(e) => updateGoal(goal.id, 'text', e.target.value)}
                      placeholder="Example: Interview 20 students about their time management challenges"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">Target Deadline</Label>
                      <Input
                        type="date"
                        value={goal.deadline}
                        onChange={(e) => updateGoal(goal.id, 'deadline', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Success Criteria *</Label>
                      <Input
                        value={goal.successCriteria}
                        onChange={(e) => updateGoal(goal.id, 'successCriteria', e.target.value)}
                        placeholder="20 completed interviews"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {goals.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No goals added yet. Click Add Goal to create your first SMART goal.</p>
              </div>
            )}
          </div>
        </div>

        {/* Target Completion Date */}
        <div>
          <Label htmlFor="targetCompletion" className="text-base font-semibold">
            Target Completion Date
          </Label>
          <p className="text-sm text-gray-500 mb-2">
            When do you aim to complete this project?
          </p>
          <Input
            id="targetCompletion"
            type="date"
            value={targetCompletion}
            onChange={(e) => setTargetCompletion(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {/* Success Metrics */}
        <div>
          <Label htmlFor="metrics" className="text-base font-semibold">
            How Will You Measure Success?
          </Label>
          <p className="text-sm text-gray-500 mb-2">
            What metrics will show your project was successful?
          </p>
          <Textarea
            id="metrics"
            value={successMetrics}
            onChange={(e) => setSuccessMetrics(e.target.value)}
            placeholder="Example: 50+ students using the app, 80% report reduced stress, positive feedback from 20 user interviews"
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Charter'
            )}
          </Button>
          <Button
            onClick={onComplete}
            variant="outline"
            className="flex-1"
          >
            Continue to Milestones →
          </Button>
        </div>
      </div>
    </Card>
  )
}
