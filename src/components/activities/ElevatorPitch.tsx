// src/components/activities/ElevatorPitch.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Clock, Mic } from 'lucide-react'

const PITCH_COMPONENTS = [
  { id: 'who', label: 'Who You Are', icon: '👤', prompt: 'Introduce yourself in one sentence', example: 'I\'m a high school senior passionate about environmental science' },
  { id: 'what', label: 'What You Do/Study', icon: '💡', prompt: 'What are you working on or interested in?', example: 'I\'m researching sustainable agriculture methods for my community' },
  { id: 'why', label: 'Why It Matters', icon: '❤️', prompt: 'Why is this important to you?', example: 'I want to help solve food insecurity while protecting our planet' },
  { id: 'goal', label: 'Your Goal/Ask', icon: '🎯', prompt: 'What are you hoping to achieve or what do you need?', example: 'I\'m looking for internship opportunities in environmental organizations' }
]

interface ElevatorPitchProps {
  onComplete: (data: { components: Record<string, string>, fullPitch: string }) => void
}

export function ElevatorPitch({ onComplete }: ElevatorPitchProps) {
  const { toast } = useToast()
  const [components, setComponents] = useState<Record<string, string>>({})
  const [step, setStep] = useState(0)
  const [showPreview, setShowPreview] = useState(false)

  const component = PITCH_COMPONENTS[step]
  const currentText = components[component.id] || ''
  const allComplete = PITCH_COMPONENTS.every(c => components[c.id]?.trim())

  const handleNext = () => {
    if (!currentText.trim()) {
      toast({ title: 'Write something', description: 'Please complete this section', variant: 'destructive' })
      return
    }

    if (step < PITCH_COMPONENTS.length - 1) {
      setStep(step + 1)
    } else {
      setShowPreview(true)
    }
  }

  const handleComplete = () => {
    const fullPitch = PITCH_COMPONENTS.map(c => components[c.id]).filter(Boolean).join('. ') + '.'
    onComplete({ components, fullPitch })
  }

  if (showPreview) {
    const fullPitch = PITCH_COMPONENTS.map(c => components[c.id]).filter(Boolean).join('. ') + '.'

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
          <div className="text-center mb-8">
            <Mic className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Elevator Pitch</h2>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>30-second introduction</span>
            </div>
          </div>

          <Card className="p-8 bg-white border-2 border-blue-300 mb-6">
            <p className="text-lg text-gray-800 leading-relaxed">{fullPitch}</p>
          </Card>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {PITCH_COMPONENTS.map(c => (
              <Card key={c.id} className="p-4 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{c.icon}</span>
                  <h4 className="font-semibold text-gray-900">{c.label}</h4>
                </div>
                <p className="text-sm text-gray-600">{components[c.id]}</p>
              </Card>
            ))}
          </div>

          <Card className="p-6 bg-blue-50 border-2 border-blue-200">
            <div className="flex gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Practice Makes Perfect</h4>
                <p className="text-sm text-blue-800">
                  Practice your pitch out loud. Aim for 30 seconds or less. Adjust it for different audiences - college interviews, networking events, or meeting professionals in your field.
                </p>
              </div>
            </div>
          </Card>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setShowPreview(false)}>← Edit</Button>
          <Button onClick={handleComplete} size="lg">Save Pitch →</Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
        <h2 className="text-3xl font-bold mb-2">Build Your Elevator Pitch</h2>
        <p className="text-blue-100">Create a compelling 30-second introduction</p>
      </Card>

      <div className="flex gap-2">
        {PITCH_COMPONENTS.map((c, idx) => (
          <div key={c.id} className={`flex-1 h-2 rounded-full ${idx <= step ? 'bg-blue-600' : 'bg-gray-200'}`} />
        ))}
      </div>

      <motion.div key={component.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <Card className="p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{component.icon}</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{component.label}</h3>
            <p className="text-gray-600 mb-4">{component.prompt}</p>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700"><strong>Example:</strong> {component.example}</p>
            </div>
          </div>

          <Textarea
            value={currentText}
            onChange={(e) => setComponents({ ...components, [component.id]: e.target.value })}
            placeholder="Write your response..."
            className="min-h-[120px] text-base"
          />
        </Card>
      </motion.div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0}>
          ← Back
        </Button>
        <Button onClick={handleNext} disabled={!currentText.trim()}>
          {step === PITCH_COMPONENTS.length - 1 ? 'Preview Pitch →' : 'Next →'}
        </Button>
      </div>
    </div>
  )
}
