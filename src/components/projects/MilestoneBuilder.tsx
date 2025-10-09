'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Plus, GripVertical, X, Calendar } from 'lucide-react'
import type { ProjectWithRelations } from '@/types'

interface MilestoneBuilderProps {
  project: ProjectWithRelations
  onComplete: () => void
}

interface MilestoneForm {
  id: string
  title: string
  description: string
  targetDate: string
  deliverables: string
}

export default function MilestoneBuilder({ project, onComplete }: MilestoneBuilderProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [milestones, setMilestones] = useState<MilestoneForm[]>(
    project.milestones?.map(m => ({
      id: m.id,
      title: m.title,
      description: m.description || '',
      targetDate: m.targetDate?.toISOString().split('T')[0] || '',
      deliverables: '', // You might want to store this in milestone metadata
    })) || []
  )

  const addMilestone = () => {
    if (milestones.length >= 8) {
      toast({
        title: 'Maximum Milestones Reached',
        description: 'You can add up to 8 milestones',
        variant: 'destructive'
      })
      return
    }

    setMilestones([...milestones, {
      id: `temp_${Date.now()}`,
      title: '',
      description: '',
      targetDate: '',
      deliverables: ''
    }])
  }

  const updateMilestone = (id: string, field: keyof MilestoneForm, value: string) => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id))
  }

  const moveMilestone = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === milestones.length - 1)
    ) {
      return
    }

    const newMilestones = [...milestones]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    ;[newMilestones[index], newMilestones[swapIndex]] = [
      newMilestones[swapIndex],
      newMilestones[index]
    ]
    setMilestones(newMilestones)
  }

  const handleSave = async () => {
    if (milestones.length === 0) {
      toast({
        title: 'Milestones Required',
        description: 'Please add at least one milestone',
        variant: 'destructive'
      })
      return
    }

    const incompleteMilestones = milestones.filter(m => !m.title.trim())
    if (incompleteMilestones.length > 0) {
      toast({
        title: 'Incomplete Milestones',
        description: 'Please add titles to all milestones',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)

    try {
      // Delete existing milestones and create new ones
      const response = await fetch(`/api/projects/${project.id}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          milestones: milestones.map((m, index) => ({
            title: m.title,
            description: m.description,
            targetDate: m.targetDate || null,
            orderIndex: index,
          })),
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      toast({
        title: 'Milestones Saved',
        description: 'Your project milestones have been saved',
      })

      onComplete()
    } catch (error) {
      console.error('Error saving milestones:', error)
      toast({
        title: 'Error',
        description: 'Failed to save milestones. Please try again.',
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
            Milestone Roadmap
          </h2>
          <p className="text-gray-600">
            Break your project into 3-8 major phases or milestones
          </p>
        </div>

        {/* Timeline Visualization */}
        {milestones.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Project Timeline</h3>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <p className="text-xs text-center mt-1 max-w-[100px] truncate">
                      {milestone.title || 'Untitled'}
                    </p>
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-16 h-0.5 bg-blue-300 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Milestone Button */}
        <Button
          onClick={addMilestone}
          variant="outline"
          className="w-full"
          disabled={milestones.length >= 8}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Milestone ({milestones.length}/8)
        </Button>

        {/* Milestones List */}
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <Card key={milestone.id} className="p-4 border-2">
              <div className="flex items-start gap-4">
                {/* Drag Handle */}
                <div className="flex flex-col gap-1 pt-2">
                  <button
                    onClick={() => moveMilestone(index, 'up')}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <GripVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <h4 className="font-semibold">Milestone {index + 1}</h4>
                    </div>
                    <Button
                      onClick={() => removeMilestone(milestone.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div>
                    <Label className="text-sm">Title *</Label>
                    <Input
                      value={milestone.title}
                      onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                      placeholder="Example: Complete User Research Phase"
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Description</Label>
                    <Textarea
                      value={milestone.description}
                      onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                      placeholder="What needs to happen in this phase?"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">Target Date</Label>
                      <Input
                        type="date"
                        value={milestone.targetDate}
                        onChange={(e) => updateMilestone(milestone.id, 'targetDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Key Deliverables</Label>
                      <Input
                        value={milestone.deliverables}
                        onChange={(e) => updateMilestone(milestone.id, 'deliverables', e.target.value)}
                        placeholder="Research report, designs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {milestones.length === 0 && (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
              <p>No milestones added yet. Click "Add Milestone" to create your roadmap.</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t">
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
              'Save Milestones'
            )}
          </Button>
          <Button
            onClick={onComplete}
            variant="outline"
            className="flex-1"
          >
            Continue to Resources →
          </Button>
        </div>
      </div>
    </Card>
  )
}
