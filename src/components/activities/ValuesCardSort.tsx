'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

const VALUES = [
  { id: 'creativity', label: 'Creativity', icon: '🎨', description: 'Original thinking and artistic expression' },
  { id: 'impact', label: 'Making an Impact', icon: '🌍', description: 'Positive change in the world' },
  { id: 'innovation', label: 'Innovation', icon: '💡', description: 'Developing new ideas and solutions' },
  { id: 'helping', label: 'Helping Others', icon: '🤝', description: 'Supporting and assisting people' },
  { id: 'independence', label: 'Independence', icon: '🦅', description: 'Autonomy and self-direction' },
  { id: 'teamwork', label: 'Teamwork', icon: '👥', description: 'Collaboration and group success' },
  { id: 'learning', label: 'Learning & Growth', icon: '📚', description: 'Continuous development' },
  { id: 'financial', label: 'Financial Security', icon: '💰', description: 'Economic stability' },
  { id: 'achievement', label: 'Achievement', icon: '🏆', description: 'Reaching goals and recognition' },
  { id: 'stability', label: 'Stability', icon: '📍', description: 'Consistency and predictability' },
  { id: 'adventure', label: 'Adventure', icon: '🚀', description: 'Excitement and new experiences' },
  { id: 'balance', label: 'Work-Life Balance', icon: '⚖️', description: 'Time for personal life' },
  { id: 'leadership', label: 'Leadership', icon: '👑', description: 'Guiding and inspiring others' },
  { id: 'expertise', label: 'Expertise', icon: '🎯', description: 'Deep knowledge in a field' },
  { id: 'flexibility', label: 'Flexibility', icon: '🌊', description: 'Adaptable schedule and approach' },
]

type Category = 'remaining' | 'alwaysTrue' | 'sometimes' | 'notPriority'

export function ValuesCardSort({ onComplete }: { onComplete: (values: any) => void }) {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Record<Category, typeof VALUES>>({
    remaining: VALUES,
    alwaysTrue: [],
    sometimes: [],
    notPriority: [],
  })
  const [draggedItem, setDraggedItem] = useState<typeof VALUES[0] | null>(null)

  const handleDragStart = (item: typeof VALUES[0]) => {
    setDraggedItem(item)
  }

  const handleDrop = (targetCategory: Category) => {
    if (!draggedItem) return

    setCategories((prev) => {
      const newCategories = { ...prev }
      
      // Remove from all categories
      Object.keys(newCategories).forEach((key) => {
        newCategories[key as Category] = newCategories[key as Category].filter(
          (item) => item.id !== draggedItem.id
        )
      })

      // Add to target category
      newCategories[targetCategory] = [...newCategories[targetCategory], draggedItem]

      return newCategories
    })

    setDraggedItem(null)
  }

  const handleSubmit = () => {
    if (categories.alwaysTrue.length < 3) {
      toast({
        title: 'Not quite ready',
        description: 'Please select at least 3 values that are "Always True" for you.',
        variant: 'destructive',
      })
      return
    }

    onComplete({
      alwaysTrue: categories.alwaysTrue.map((v) => v.id),
      sometimes: categories.sometimes.map((v) => v.id),
      notPriority: categories.notPriority.map((v) => v.id),
    })
  }

  return (
    <div className="space-y-6">
      <div className="prose prose-sm max-w-none">
        <p>
          Drag each value card into the category that best describes how important it is to you.
          Think about what truly matters in your life and future career.
        </p>
      </div>

      {/* Drop Zones */}
      <div className="grid gap-4">
        <DropZone
          title="Always True for Me"
          subtitle="Top priorities in life and career"
          category="alwaysTrue"
          items={categories.alwaysTrue}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          color="green"
        />

        <DropZone
          title="Sometimes Important"
          subtitle="Nice to have, but not essential"
          category="sometimes"
          items={categories.sometimes}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          color="yellow"
        />

        <DropZone
          title="Not a Priority"
          subtitle="Less important to me right now"
          category="notPriority"
          items={categories.notPriority}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          color="gray"
        />
      </div>

      {/* Remaining Values */}
      {categories.remaining.length > 0 && (
        <div className="border-2 border-dashed rounded-lg p-4">
          <h3 className="font-semibold mb-3">Remaining Values ({categories.remaining.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.remaining.map((value) => (
              <ValueCard
                key={value.id}
                value={value}
                onDragStart={() => handleDragStart(value)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Progress & Submit */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="text-sm text-muted-foreground">
          {categories.alwaysTrue.length} of 3+ values selected
        </div>
        <Button
          onClick={handleSubmit}
          disabled={categories.alwaysTrue.length < 3}
          size="lg"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

function DropZone({
  title,
  subtitle,
  category,
  items,
  onDrop,
  onDragStart,
  color,
}: {
  title: string
  subtitle: string
  category: Category
  items: typeof VALUES
  onDrop: (category: Category) => void
  onDragStart: (item: typeof VALUES[0]) => void
  color: 'green' | 'yellow' | 'gray'
}) {
  const colorClasses = {
    green: 'border-green-200 bg-green-50',
    yellow: 'border-yellow-200 bg-yellow-50',
    gray: 'border-gray-200 bg-gray-50',
  }

  return (
    <div
      className={`border-2 rounded-lg p-4 min-h-[150px] ${colorClasses[color]}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(category)}
    >
      <div className="mb-3">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((value) => (
          <ValueCard
            key={value.id}
            value={value}
            onDragStart={() => onDragStart(value)}
          />
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center text-muted-foreground text-sm py-8">
          Drop values here
        </div>
      )}
    </div>
  )
}

function ValueCard({
  value,
  onDragStart,
}: {
  value: typeof VALUES[0]
  onDragStart: () => void
}) {
  return (
    <motion.div
      draggable
      onDragStart={onDragStart}
      className="bg-white border rounded-lg p-3 cursor-move hover:shadow-md transition-shadow"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="text-2xl mb-1">{value.icon}</div>
      <div className="font-medium text-sm">{value.label}</div>
      <div className="text-xs text-muted-foreground mt-1">{value.description}</div>
    </motion.div>
  )
}
