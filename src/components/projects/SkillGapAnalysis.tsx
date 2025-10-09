'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Plus, X, BookOpen, Code, Palette, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { ProjectWithRelations } from '@/types'

interface SkillGapAnalysisProps {
  project: ProjectWithRelations
  onComplete: () => void
}

interface SkillGap {
  id: string
  skill: string
  category: 'technical' | 'soft' | 'domain'
  currentLevel: 'beginner' | 'intermediate' | 'advanced'
  targetLevel: 'intermediate' | 'advanced' | 'expert'
  learningStrategy: string
  resources: string
  timeline: string
}

export default function SkillGapAnalysis({ project, onComplete }: SkillGapAnalysisProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const existingSkills = (project.resources as any)?.skillGaps || []
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>(existingSkills)

  const addSkill = () => {
    setSkillGaps([...skillGaps, {
      id: `skill_${Date.now()}`,
      skill: '',
      category: 'technical',
      currentLevel: 'beginner',
      targetLevel: 'intermediate',
      learningStrategy: '',
      resources: '',
      timeline: ''
    }])
  }

  const updateSkill = (id: string, field: keyof SkillGap, value: string) => {
    setSkillGaps(skillGaps.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const removeSkill = (id: string) => {
    setSkillGaps(skillGaps.filter(s => s.id !== id))
  }

  const handleSave = async () => {
    setLoading(true)

    try {
      // Get existing resources
      const existingResources = (project.resources as any) || {}

      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resources: {
            ...existingResources,
            skillGaps
          },
          status: 'PLANNING' // Update status to indicate planning is complete
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      toast({
        title: 'Planning Complete! 🎉',
        description: 'Your project plan is ready. Time to start executing!',
      })

      // Redirect to project dashboard
      router.push(`/projects/${project.id}`)
    } catch (error) {
      console.error('Error saving skills:', error)
      toast({
        title: 'Error',
        description: 'Failed to save skill gaps. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const categoryIcons = {
    technical: Code,
    soft: MessageSquare,
    domain: BookOpen
  }

  return (
    <Card className="p-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Skill Gap Analysis
          </h2>
          <p className="text-gray-600">
            Identify skills you need to develop for this project
          </p>
        </div>

        {/* Add Skill Button */}
        <Button onClick={addSkill} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill Gap
        </Button>

        {/* Skill Gaps List */}
        <div className="space-y-4">
          {skillGaps.map((skill) => {
            const Icon = categoryIcons[skill.category]
            return (
              <Card key={skill.id} className="p-4 border-2">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Icon className="w-5 h-5 text-orange-600" />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="grid grid-cols-2 gap-3 flex-1">
                        <div>
                          <Label className="text-sm">Skill Needed</Label>
                          <Input
                            value={skill.skill}
                            onChange={(e) => updateSkill(skill.id, 'skill', e.target.value)}
                            placeholder="Example: Figma for UI Design"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Category</Label>
                          <select
                            value={skill.category}
                            onChange={(e) => updateSkill(skill.id, 'category', e.target.value as SkillGap['category'])}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="technical">Technical (tools, software)</option>
                            <option value="soft">Soft Skills (communication, leadership)</option>
                            <option value="domain">Domain Knowledge (subject expertise)</option>
                          </select>
                        </div>
                      </div>
                      <Button
                        onClick={() => removeSkill(skill.id)}
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-sm">Current Level</Label>
                        <select
                          value={skill.currentLevel}
                          onChange={(e) => updateSkill(skill.id, 'currentLevel', e.target.value as SkillGap['currentLevel'])}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-sm">Target Level</Label>
                        <select
                          value={skill.targetLevel}
                          onChange={(e) => updateSkill(skill.id, 'targetLevel', e.target.value as SkillGap['targetLevel'])}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="expert">Expert</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-sm">Timeline</Label>
                        <Input
                          value={skill.timeline}
                          onChange={(e) => updateSkill(skill.id, 'timeline', e.target.value)}
                          placeholder="2 weeks"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm">Learning Strategy</Label>
                      <Input
                        value={skill.learningStrategy}
                        onChange={(e) => updateSkill(skill.id, 'learningStrategy', e.target.value)}
                        placeholder="Online course, practice, mentorship, etc."
                      />
                    </div>

                    <div>
                      <Label className="text-sm">Resources</Label>
                      <Input
                        value={skill.resources}
                        onChange={(e) => updateSkill(skill.id, 'resources', e.target.value)}
                        placeholder="Coursera, YouTube tutorials, book recommendations"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}

          {skillGaps.length === 0 && (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
              <p className="mb-2">No skill gaps identified yet.</p>
              <p className="text-sm">Think about what you need to learn to complete this project successfully.</p>
            </div>
          )}
        </div>

        {/* Pro Tip */}
        <Card className="bg-amber-50 border-amber-200 p-4">
          <div className="flex gap-3">
            <Palette className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-900 mb-1">Pro Tip</p>
              <p className="text-sm text-amber-800">
                Don't worry if you have skills to learn! Every project is an opportunity to grow. 
                Focus on the most critical skills first and build incrementally.
              </p>
            </div>
          </div>
        </Card>

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
              'Complete Planning →'
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}
