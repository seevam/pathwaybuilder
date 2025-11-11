// src/components/activities/AccountabilitySystem.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { CheckCircle2, Users, Bell, Target } from 'lucide-react'

const ACCOUNTABILITY_METHODS = [
  { id: 'accountability-partner', label: 'Accountability Partner', icon: '👥', description: 'A friend, family member, or mentor who checks in regularly' },
  { id: 'weekly-reviews', label: 'Weekly Self-Reviews', icon: '📅', description: 'Set aside time each week to review your progress' },
  { id: 'digital-tools', label: 'Digital Tools/Apps', icon: '📱', description: 'Use apps or calendars to track and remind you' },
  { id: 'visual-tracking', label: 'Visual Progress Board', icon: '📊', description: 'Create a physical or digital board to see your progress' },
  { id: 'rewards-system', label: 'Rewards System', icon: '🎁', description: 'Celebrate milestones with rewards' }
]

interface AccountabilitySystemProps {
  onComplete: (data: { methods: string[], accountabilityPartners: string[], trackingPlan: string, checkInSchedule: string }) => void
}

export function AccountabilitySystem({ onComplete }: AccountabilitySystemProps) {
  const { toast } = useToast()
  const [selectedMethods, setSelectedMethods] = useState<string[]>([])
  const [partners, setPartners] = useState('')
  const [trackingPlan, setTrackingPlan] = useState('')
  const [schedule, setSchedule] = useState('')
  const [step, setStep] = useState<'methods' | 'partners' | 'tracking' | 'summary'>('methods')

  const handleToggleMethod = (id: string) => {
    setSelectedMethods(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id])
  }

  const handleComplete = () => {
    if (selectedMethods.length === 0) {
      toast({ title: 'Select at least one method', variant: 'destructive' })
      return
    }

    onComplete({
      methods: selectedMethods,
      accountabilityPartners: partners.split('\n').filter(p => p.trim()),
      trackingPlan,
      checkInSchedule: schedule
    })
  }

  if (step === 'methods') {
    return (
      <div className="space-y-6">
        <Card className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <h2 className="text-3xl font-bold mb-2">Accountability System</h2>
          <p className="text-purple-100">Choose how you&apos;ll stay on track</p>
        </Card>

        <div className="space-y-4">
          {ACCOUNTABILITY_METHODS.map(method => (
            <button
              key={method.id}
              onClick={() => handleToggleMethod(method.id)}
              className={`w-full p-6 rounded-lg border-2 text-left transition-all ${
                selectedMethods.includes(method.id) ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{method.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{method.label}</h3>
                    {selectedMethods.includes(method.id) && <CheckCircle2 className="w-5 h-5 text-purple-600" />}
                  </div>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <Button onClick={() => setStep('partners')} disabled={selectedMethods.length === 0} className="w-full" size="lg">
          Next: Set Up Partners →
        </Button>
      </div>
    )
  }

  if (step === 'partners') {
    return (
      <div className="space-y-6">
        <Card className="p-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
          <Users className="w-12 h-12 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Accountability Partners</h2>
          <p className="text-blue-100">Who will support you on this journey?</p>
        </Card>

        <Card className="p-6">
          <label className="font-semibold text-gray-900 mb-2 block">List your accountability partners (one per line)</label>
          <Textarea
            value={partners}
            onChange={(e) => setPartners(e.target.value)}
            placeholder="Parent/Guardian&#10;Teacher/Counselor&#10;Mentor&#10;Friend"
            rows={6}
          />
          <p className="text-sm text-gray-600 mt-2">These people will help keep you motivated and on track</p>
        </Card>

        <Card className="p-6">
          <label className="font-semibold text-gray-900 mb-2 block">Check-in Schedule</label>
          <Input
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            placeholder="e.g., Weekly Sunday evening review, Monthly check-in with mentor"
          />
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep('methods')}>← Back</Button>
          <Button onClick={() => setStep('tracking')}>Next: Tracking Plan →</Button>
        </div>
      </div>
    )
  }

  if (step === 'tracking') {
    return (
      <div className="space-y-6">
        <Card className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <Target className="w-12 h-12 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Tracking Your Progress</h2>
          <p className="text-green-100">How will you measure and track your goals?</p>
        </Card>

        <Card className="p-6">
          <label className="font-semibold text-gray-900 mb-2 block">Your Tracking Plan</label>
          <Textarea
            value={trackingPlan}
            onChange={(e) => setTrackingPlan(e.target.value)}
            placeholder="Describe how you'll track your progress... Example: I'll use a planner to check off daily tasks, review my goals every Sunday, and meet with my mentor monthly to discuss progress."
            rows={8}
          />
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep('partners')}>← Back</Button>
          <Button onClick={() => setStep('summary')}>Review System →</Button>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Your Accountability System</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Your Methods</h3>
            <div className="flex flex-wrap gap-2">
              {selectedMethods.map(id => {
                const method = ACCOUNTABILITY_METHODS.find(m => m.id === id)
                return method ? (
                  <span key={id} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-2">
                    {method.icon} {method.label}
                  </span>
                ) : null
              })}
            </div>
          </div>

          {partners && (
            <Card className="p-6 bg-white">
              <h3 className="font-bold text-gray-900 mb-3">Accountability Partners</h3>
              <div className="space-y-1">
                {partners.split('\n').filter(p => p.trim()).map((partner, idx) => (
                  <p key={idx} className="text-gray-700">• {partner}</p>
                ))}
              </div>
            </Card>
          )}

          {schedule && (
            <Card className="p-6 bg-white">
              <h3 className="font-bold text-gray-900 mb-2">Check-in Schedule</h3>
              <p className="text-gray-700">{schedule}</p>
            </Card>
          )}

          {trackingPlan && (
            <Card className="p-6 bg-white">
              <h3 className="font-bold text-gray-900 mb-2">Tracking Plan</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{trackingPlan}</p>
            </Card>
          )}
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep('tracking')}>← Back</Button>
        <Button onClick={handleComplete} size="lg">Complete System →</Button>
      </div>
    </motion.div>
  )
}
