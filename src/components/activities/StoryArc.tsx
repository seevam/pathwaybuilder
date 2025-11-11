// src/components/activities/StoryArc.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Book } from 'lucide-react'

const STORY_SECTIONS = [
  { id: 'beginning', title: 'The Beginning', subtitle: 'Where you started', icon: '🌱', question: 'What shaped who you are today? What early experiences, challenges, or passions defined you?', placeholder: 'I grew up...' },
  { id: 'turning-point', title: 'The Turning Point', subtitle: 'When things changed', icon: '⚡', question: 'What moment, realization, or experience shifted your perspective or direction?', placeholder: 'Everything changed when...' },
  { id: 'journey', title: 'The Journey', subtitle: 'What you discovered', icon: '🗺️', question: 'What have you learned about yourself? What strengths have you discovered? What challenges have you overcome?', placeholder: 'Through this program, I discovered...' },
  { id: 'vision', title: 'The Vision', subtitle: 'Where you\'re headed', icon: '🚀', question: 'What future are you creating? What impact do you want to make? Who are you becoming?', placeholder: 'I\'m working toward...' }
]

interface StoryArcProps {
  onComplete: (data: { story: Record<string, string>, fullNarrative: string }) => void
}

export function StoryArc({ onComplete }: StoryArcProps) {
  const { toast } = useToast()
  const [currentSection, setCurrentSection] = useState(0)
  const [story, setStory] = useState<Record<string, string>>({})
  const [showSummary, setShowSummary] = useState(false)

  const section = STORY_SECTIONS[currentSection]
  const currentText = story[section.id] || ''
  const allComplete = STORY_SECTIONS.every(s => story[s.id]?.trim().length > 0)

  const handleNext = () => {
    if (currentText.trim().length < 20) {
      toast({ title: 'Write more', description: 'Please write at least 20 characters', variant: 'destructive' })
      return
    }

    if (currentSection < STORY_SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1)
    } else {
      setShowSummary(true)
    }
  }

  const handleComplete = () => {
    const fullNarrative = STORY_SECTIONS.map(s => `${s.title}\n\n${story[s.id]}`).join('\n\n---\n\n')
    onComplete({ story, fullNarrative })
  }

  if (showSummary) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
          <div className="text-center mb-8">
            <Book className="w-16 h-16 mx-auto text-purple-600 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Story</h2>
            <p className="text-gray-600">The narrative of your journey</p>
          </div>

          <div className="space-y-6">
            {STORY_SECTIONS.map(s => (
              <Card key={s.id} className="p-6 bg-white">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{s.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900">{s.title}</h3>
                    <p className="text-sm text-gray-600">{s.subtitle}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{story[s.id]}</p>
              </Card>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-purple-50 border-2 border-purple-200">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h4 className="font-semibold text-purple-900 mb-2">Your Story Matters</h4>
              <p className="text-sm text-purple-800">
                This narrative is uniquely yours. Use it in college essays, job interviews, and whenever you need to share who you are and where you&apos;re going.
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleComplete} size="lg">Continue →</Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Section {currentSection + 1} of {STORY_SECTIONS.length}</span>
          <span className="text-gray-600">{Math.round(((currentSection + 1) / STORY_SECTIONS.length) * 100)}% complete</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-purple-500 to-blue-500" animate={{ width: `${((currentSection + 1) / STORY_SECTIONS.length) * 100}%` }} />
        </div>
      </div>

      <motion.div key={section.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <Card className="p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{section.icon}</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{section.title}</h2>
            <p className="text-lg text-gray-600 mb-4">{section.subtitle}</p>
            <p className="text-gray-700">{section.question}</p>
          </div>

          <Textarea
            value={currentText}
            onChange={(e) => setStory({ ...story, [section.id]: e.target.value })}
            placeholder={section.placeholder}
            className="min-h-[250px] text-base"
          />

          <div className="mt-2 text-sm text-gray-500">
            {currentText.length} characters {currentText.length < 20 && '(minimum 20)'}
          </div>
        </Card>
      </motion.div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => currentSection > 0 && setCurrentSection(currentSection - 1)} disabled={currentSection === 0}>
          ← Back
        </Button>
        <Button onClick={handleNext} disabled={currentText.trim().length < 20}>
          {currentSection === STORY_SECTIONS.length - 1 ? 'Review Story →' : 'Next Section →'}
        </Button>
      </div>
    </div>
  )
}
