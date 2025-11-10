// src/components/activities/TimelineBuilder.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Plus, X, Calendar, Target } from 'lucide-react'

const GRADE_LEVELS = ['9th Grade', '10th Grade', '11th Grade', '12th Grade', 'Post-Graduation']

const ACTIVITY_CATEGORIES = [
  { id: 'academic', label: 'Academic', icon: '📚', color: 'blue' },
  { id: 'extracurricular', label: 'Extracurricular', icon: '🎭', color: 'purple' },
  { id: 'volunteer', label: 'Volunteer/Service', icon: '❤️', color: 'red' },
  { id: 'work', label: 'Work/Internship', icon: '💼', color: 'green' },
  { id: 'personal', label: 'Personal Development', icon: '🌱', color: 'yellow' },
  { id: 'college-prep', label: 'College Prep', icon: '🎓', color: 'indigo' }
]

interface TimelineItem {
  id: string
  category: string
  title: string
  description: string
  quarter?: string
}

interface TimelineBuilderProps {
  onComplete: (data: { timeline: Record<string, TimelineItem[]>; goals: string }) => void
}

export function TimelineBuilder({ onComplete }: TimelineBuilderProps) {
  const { toast } = useToast()
  const [currentGrade, setCurrentGrade] = useState(0)
  const [timeline, setTimeline] = useState<Record<string, TimelineItem[]>>({
    '9th Grade': [],
    '10th Grade': [],
    '11th Grade': [],
    '12th Grade': [],
    'Post-Graduation': []
  })
  const [overallGoals, setOverallGoals] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState({
    category: 'academic',
    title: '',
    description: ''
  })
  const [showSummary, setShowSummary] = useState(false)

  const grade = GRADE_LEVELS[currentGrade]
  const gradeItems = timeline[grade] || []

  const handleAddItem = () => {
    if (!newItem.title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for this activity',
        variant: 'destructive'
      })
      return
    }

    const item: TimelineItem = {
      id: Date.now().toString(),
      category: newItem.category,
      title: newItem.title,
      description: newItem.description
    }

    setTimeline({
      ...timeline,
      [grade]: [...gradeItems, item]
    })

    setNewItem({ category: 'academic', title: '', description: '' })
    setShowAddForm(false)

    toast({
      title: 'Activity added!',
      description: `Added to ${grade}`
    })
  }

  const handleRemoveItem = (itemId: string) => {
    setTimeline({
      ...timeline,
      [grade]: gradeItems.filter(item => item.id !== itemId)
    })
  }

  const handleNext = () => {
    if (currentGrade < GRADE_LEVELS.length - 1) {
      setCurrentGrade(currentGrade + 1)
      setShowAddForm(false)
    } else {
      setShowSummary(true)
    }
  }

  const handleBack = () => {
    if (currentGrade > 0) {
      setCurrentGrade(currentGrade - 1)
      setShowAddForm(false)
    }
  }

  const handleComplete = () => {
    const totalItems = Object.values(timeline).reduce((sum, items) => sum + items.length, 0)

    if (totalItems < 3) {
      toast({
        title: 'Add more activities',
        description: 'Please add at least 3 activities total across your timeline',
        variant: 'destructive'
      })
      return
    }

    onComplete({
      timeline,
      goals: overallGoals
    })
  }

  if (showSummary) {
    const totalItems = Object.values(timeline).reduce((sum, items) => sum + items.length, 0)

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <Card className="p-8 bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200">
          <div className="text-center mb-8">
            <Calendar className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Your High School Timeline
            </h2>
            <p className="text-gray-600">
              {totalItems} activities planned across {GRADE_LEVELS.length} periods
            </p>
          </div>

          {/* Timeline Summary */}
          <div className="space-y-6">
            {GRADE_LEVELS.map(gradeLevel => {
              const items = timeline[gradeLevel] || []
              if (items.length === 0) return null

              return (
                <div key={gradeLevel}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-indigo-600 rounded-full" />
                    <h3 className="text-xl font-bold text-gray-900">{gradeLevel}</h3>
                    <span className="text-sm text-gray-500">({items.length} activities)</span>
                  </div>

                  <div className="ml-6 space-y-3 border-l-2 border-indigo-200 pl-6">
                    {items.map(item => {
                      const category = ACTIVITY_CATEGORIES.find(c => c.id === item.category)

                      return (
                        <Card key={item.id} className="p-4 bg-white">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{category?.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                <span className={`text-xs px-2 py-1 bg-${category?.color}-100 text-${category?.color}-700 rounded-full`}>
                                  {category?.label}
                                </span>
                              </div>
                              {item.description && (
                                <p className="text-sm text-gray-600">{item.description}</p>
                              )}
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Overall Goals */}
          {overallGoals && (
            <Card className="p-6 bg-white mt-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                Your Overall Goals
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">{overallGoals}</p>
            </Card>
          )}
        </Card>

        {/* Goals Input */}
        {!overallGoals && (
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-3">Add Your Overall Goals (Optional)</h3>
            <Textarea
              value={overallGoals}
              onChange={(e) => setOverallGoals(e.target.value)}
              placeholder="What are your main goals for high school? What do you hope to achieve by graduation?"
              className="min-h-[100px]"
            />
          </Card>
        )}

        <Card className="p-6 bg-indigo-50 border-2 border-indigo-200">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h4 className="font-semibold text-indigo-900 mb-2">Next Steps</h4>
              <ul className="text-sm text-indigo-800 space-y-1">
                <li>• Review your timeline quarterly and adjust as needed</li>
                <li>• Share your plan with parents, counselors, or mentors</li>
                <li>• Set specific deadlines for each activity</li>
                <li>• Track your progress and celebrate milestones</li>
              </ul>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleComplete} size="lg">
            Complete Timeline →
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{grade}</span>
          <span className="text-gray-600">
            {gradeItems.length} activities planned
          </span>
        </div>
        <div className="flex gap-2">
          {GRADE_LEVELS.map((g, idx) => (
            <div
              key={g}
              className={`flex-1 h-2 rounded-full ${
                idx === currentGrade
                  ? 'bg-indigo-600'
                  : idx < currentGrade
                  ? 'bg-green-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Grade Header */}
      <Card className="p-6 bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">{grade}</h2>
            <p className="text-indigo-100">
              Plan your activities, goals, and milestones
            </p>
          </div>
          <Calendar className="w-12 h-12 text-indigo-200" />
        </div>
      </Card>

      {/* Activity Categories Guide */}
      {gradeItems.length === 0 && (
        <Card className="p-6 bg-blue-50 border-2 border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-3">Activity Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ACTIVITY_CATEGORIES.map(cat => (
              <div key={cat.id} className="flex items-center gap-2 text-sm">
                <span className="text-xl">{cat.icon}</span>
                <span className="text-gray-700">{cat.label}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Existing Items */}
      {gradeItems.length > 0 && (
        <div className="space-y-3">
          {gradeItems.map(item => {
            const category = ACTIVITY_CATEGORIES.find(c => c.id === item.category)

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{category?.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {category?.label}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-600">{item.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Add Item Form */}
      {showAddForm ? (
        <Card className="p-6 border-2 border-indigo-300">
          <h3 className="font-semibold text-gray-900 mb-4">Add New Activity</h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {ACTIVITY_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setNewItem({ ...newItem, category: cat.id })}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      newItem.category === cat.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cat.icon}</span>
                      <span className="text-sm font-medium">{cat.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Title</label>
              <Input
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="e.g., Join Debate Club, Take AP Biology, Volunteer at Library"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Description (Optional)</label>
              <Textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Add details about this activity..."
                rows={2}
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddItem} className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Button
          variant="outline"
          onClick={() => setShowAddForm(true)}
          className="w-full border-2 border-dashed border-gray-300 hover:border-indigo-400"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Activity to {grade}
        </Button>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentGrade === 0}
        >
          ← Previous Year
        </Button>

        <Button onClick={handleNext}>
          {currentGrade === GRADE_LEVELS.length - 1
            ? 'Review Timeline →'
            : 'Next Year →'}
        </Button>
      </div>

      {gradeItems.length === 0 && (
        <p className="text-center text-sm text-gray-500">
          Add at least one activity before moving to the next year
        </p>
      )}
    </div>
  )
}
