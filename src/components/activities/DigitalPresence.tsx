// src/components/activities/DigitalPresence.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { CheckCircle2, Globe, Linkedin, FileText, Github, Instagram } from 'lucide-react'

const PLATFORMS = [
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, description: 'Professional networking', required: true },
  { id: 'portfolio', name: 'Portfolio Website', icon: Globe, description: 'Showcase your work', required: false },
  { id: 'github', name: 'GitHub', icon: Github, description: 'For tech/coding projects', required: false },
  { id: 'instagram', name: 'Instagram (Professional)', icon: Instagram, description: 'Visual portfolio', required: false }
]

interface DigitalPresenceProps {
  onComplete: (data: { platforms: Record<string, any>, bio: string, goals: string[] }) => void
}

export function DigitalPresence({ onComplete }: DigitalPresenceProps) {
  const { toast } = useToast()
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['linkedin'])
  const [platformDetails, setPlatformDetails] = useState<Record<string, any>>({})
  const [bio, setBio] = useState('')
  const [goals, setGoals] = useState<string[]>([])
  const [newGoal, setNewGoal] = useState('')
  const [step, setStep] = useState<'platforms' | 'bio' | 'goals' | 'summary'>('platforms')

  const handleTogglePlatform = (id: string) => {
    if (id === 'linkedin') return // LinkedIn is required
    setSelectedPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  const handleComplete = () => {
    onComplete({ platforms: platformDetails, bio, goals })
  }

  if (step === 'platforms') {
    return (
      <div className="space-y-6">
        <Card className="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <h2 className="text-3xl font-bold mb-2">Build Your Digital Presence</h2>
          <p className="text-blue-100">Create your professional online profile</p>
        </Card>

        <div className="space-y-4">
          {PLATFORMS.map(platform => {
            const Icon = platform.icon
            const isSelected = selectedPlatforms.includes(platform.id)

            return (
              <button
                key={platform.id}
                onClick={() => handleTogglePlatform(platform.id)}
                disabled={platform.required}
                className={`w-full p-6 rounded-lg border-2 text-left transition-all ${
                  isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                } ${platform.required ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{platform.name}</h3>
                        {platform.required && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Required</span>}
                      </div>
                      <p className="text-sm text-gray-600">{platform.description}</p>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-6 h-6 text-blue-600" />}
                </div>
              </button>
            )
          })}
        </div>

        <Button onClick={() => setStep('bio')} className="w-full" size="lg">
          Next: Create Your Bio →
        </Button>
      </div>
    )
  }

  if (step === 'bio') {
    return (
      <div className="space-y-6">
        <Card className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <FileText className="w-12 h-12 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Professional Bio</h2>
          <p className="text-purple-100">Write a compelling bio for your profiles</p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Your Bio (150-200 words)</h3>
          <p className="text-sm text-gray-600 mb-4">
            Include: Who you are, what you&apos;re passionate about, what you&apos;re working toward, and what makes you unique.
          </p>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="I'm a high school student passionate about..."
            rows={8}
            className="text-base"
          />
          <div className="mt-2 text-sm text-gray-500">
            {bio.split(' ').filter(w => w).length} words
          </div>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep('platforms')}>← Back</Button>
          <Button onClick={() => setStep('goals')} disabled={bio.split(' ').length < 20}>
            Next: Set Goals →
          </Button>
        </div>
      </div>
    )
  }

  if (step === 'goals') {
    return (
      <div className="space-y-6">
        <Card className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <h2 className="text-2xl font-bold mb-2">Digital Presence Goals</h2>
          <p className="text-green-100">What do you want to achieve with your online presence?</p>
        </Card>

        <div className="space-y-3">
          {goals.map((goal, idx) => (
            <Card key={idx} className="p-4 flex justify-between items-center">
              <p className="text-gray-700">{goal}</p>
              <Button variant="ghost" size="sm" onClick={() => setGoals(goals.filter((_, i) => i !== idx))}>
                ×
              </Button>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <Input
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="e.g., Connect with professionals in my field, Build a portfolio of projects..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newGoal.trim()) {
                setGoals([...goals, newGoal])
                setNewGoal('')
              }
            }}
          />
          <Button onClick={() => { if (newGoal.trim()) { setGoals([...goals, newGoal]); setNewGoal('') } }} className="mt-3 w-full">
            Add Goal
          </Button>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep('bio')}>← Back</Button>
          <Button onClick={() => setStep('summary')} disabled={goals.length === 0}>
            Review →
          </Button>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Your Digital Presence Plan</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Selected Platforms</h3>
            <div className="flex flex-wrap gap-2">
              {selectedPlatforms.map(id => {
                const platform = PLATFORMS.find(p => p.id === id)
                if (!platform) return null
                const Icon = platform.icon
                return (
                  <span key={id} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2">
                    <Icon className="w-4 h-4" /> {platform.name}
                  </span>
                )
              })}
            </div>
          </div>

          <Card className="p-6 bg-white">
            <h3 className="font-bold text-gray-900 mb-3">Your Bio</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{bio}</p>
          </Card>

          <Card className="p-6 bg-white">
            <h3 className="font-bold text-gray-900 mb-3">Your Goals</h3>
            <ul className="space-y-2">
              {goals.map((goal, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Card>

      <Card className="p-6 bg-blue-50 border-2 border-blue-200">
        <div className="flex gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
            <p className="text-sm text-blue-800">
              Create/update your profiles on the platforms you selected. Use your bio and keep your content professional. Connect with people in your field and share your journey!
            </p>
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep('goals')}>← Back</Button>
        <Button onClick={handleComplete} size="lg">Complete →</Button>
      </div>
    </motion.div>
  )
}
