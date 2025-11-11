// src/components/activities/SkillGapAnalysis.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { CheckCircle2, Circle, Target, TrendingUp } from 'lucide-react'

const SKILL_CATEGORIES = [
  {
    id: 'technical',
    title: 'Technical Skills',
    icon: '💻',
    skills: [
      'Computer Programming',
      'Data Analysis',
      'Graphic Design',
      'Video Editing',
      'Web Development',
      'Microsoft Office',
      'Social Media Management',
      'CAD/3D Modeling'
    ]
  },
  {
    id: 'communication',
    title: 'Communication',
    icon: '💬',
    skills: [
      'Public Speaking',
      'Written Communication',
      'Active Listening',
      'Presentation Skills',
      'Persuasion',
      'Conflict Resolution',
      'Networking',
      'Storytelling'
    ]
  },
  {
    id: 'leadership',
    title: 'Leadership & Management',
    icon: '👑',
    skills: [
      'Team Leadership',
      'Project Management',
      'Decision Making',
      'Delegation',
      'Mentoring',
      'Strategic Planning',
      'Time Management',
      'Prioritization'
    ]
  },
  {
    id: 'creative',
    title: 'Creative Skills',
    icon: '🎨',
    skills: [
      'Creative Thinking',
      'Problem Solving',
      'Innovation',
      'Design Thinking',
      'Brainstorming',
      'Visual Communication',
      'Writing/Content Creation',
      'Musical Ability'
    ]
  },
  {
    id: 'analytical',
    title: 'Analytical Skills',
    icon: '🔍',
    skills: [
      'Critical Thinking',
      'Research',
      'Data Interpretation',
      'Logical Reasoning',
      'Attention to Detail',
      'Statistical Analysis',
      'Financial Literacy',
      'Scientific Method'
    ]
  },
  {
    id: 'interpersonal',
    title: 'Interpersonal Skills',
    icon: '🤝',
    skills: [
      'Empathy',
      'Collaboration',
      'Cultural Awareness',
      'Emotional Intelligence',
      'Relationship Building',
      'Customer Service',
      'Adaptability',
      'Patience'
    ]
  }
]

interface SkillGapAnalysisProps {
  onComplete: (data: {
    currentSkills: string[]
    neededSkills: string[]
    developmentPlan: Record<string, string>
  }) => void
}

export function SkillGapAnalysis({ onComplete }: SkillGapAnalysisProps) {
  const { toast } = useToast()
  const [step, setStep] = useState<'current' | 'needed' | 'plan'>('current')
  const [currentSkills, setCurrentSkills] = useState<string[]>([])
  const [neededSkills, setNeededSkills] = useState<string[]>([])
  const [developmentPlan, setDevelopmentPlan] = useState<Record<string, string>>({})

  const handleToggleCurrentSkill = (skill: string) => {
    if (currentSkills.includes(skill)) {
      setCurrentSkills(currentSkills.filter(s => s !== skill))
    } else {
      setCurrentSkills([...currentSkills, skill])
    }
  }

  const handleToggleNeededSkill = (skill: string) => {
    if (neededSkills.includes(skill)) {
      setNeededSkills(neededSkills.filter(s => s !== skill))
    } else {
      setNeededSkills([...neededSkills, skill])
    }
  }

  const handleNextStep = () => {
    if (step === 'current') {
      if (currentSkills.length < 3) {
        toast({
          title: 'Select more skills',
          description: 'Please select at least 3 current skills',
          variant: 'destructive'
        })
        return
      }
      setStep('needed')
    } else if (step === 'needed') {
      if (neededSkills.length < 3) {
        toast({
          title: 'Select more skills',
          description: 'Please select at least 3 skills you want to develop',
          variant: 'destructive'
        })
        return
      }
      setStep('plan')
    }
  }

  const handleComplete = () => {
    onComplete({
      currentSkills,
      neededSkills,
      developmentPlan
    })
  }

  const gapSkills = neededSkills.filter(skill => !currentSkills.includes(skill))

  // Current Skills Step
  if (step === 'current') {
    return (
      <div className="space-y-6">
        <Card className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Your Current Skills</h2>
              <p className="text-green-100">Select the skills you already have</p>
            </div>
            <CheckCircle2 className="w-12 h-12 text-green-200" />
          </div>
        </Card>

        <div className="text-sm text-gray-600 mb-4">
          Selected: {currentSkills.length} skills
        </div>

        <div className="space-y-6">
          {SKILL_CATEGORIES.map(category => (
            <Card key={category.id} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{category.icon}</span>
                <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.skills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => handleToggleCurrentSkill(skill)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      currentSkills.includes(skill)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {currentSkills.includes(skill) ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                      <span className="font-medium text-gray-900">{skill}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleNextStep} size="lg" disabled={currentSkills.length < 3}>
            Next: Skills to Develop →
          </Button>
        </div>
      </div>
    )
  }

  // Needed Skills Step
  if (step === 'needed') {
    return (
      <div className="space-y-6">
        <Card className="p-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Skills to Develop</h2>
              <p className="text-blue-100">Select skills you want to build or improve</p>
            </div>
            <Target className="w-12 h-12 text-blue-200" />
          </div>
        </Card>

        <div className="text-sm text-gray-600 mb-4">
          Selected: {neededSkills.length} skills
        </div>

        <div className="space-y-6">
          {SKILL_CATEGORIES.map(category => (
            <Card key={category.id} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{category.icon}</span>
                <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.skills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => handleToggleNeededSkill(skill)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      neededSkills.includes(skill)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {neededSkills.includes(skill) ? (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{skill}</span>
                        {currentSkills.includes(skill) && (
                          <span className="ml-2 text-xs text-green-600">(Already have)</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep('current')}>
            ← Back
          </Button>
          <Button onClick={handleNextStep} size="lg" disabled={neededSkills.length < 3}>
            Review Gap Analysis →
          </Button>
        </div>
      </div>
    )
  }

  // Plan/Summary Step
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <div className="text-center mb-8">
          <TrendingUp className="w-16 h-16 mx-auto text-purple-600 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Your Skill Gap Analysis
          </h2>
          <p className="text-gray-600">
            {currentSkills.length} current skills • {gapSkills.length} skills to develop
          </p>
        </div>

        {/* Current Strengths */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            Your Current Strengths
          </h3>
          <div className="flex flex-wrap gap-2">
            {currentSkills.map(skill => (
              <span key={skill} className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Skills to Develop */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-600" />
            Skills to Develop
          </h3>
          <div className="space-y-3">
            {gapSkills.map(skill => (
              <Card key={skill} className="p-4 bg-white">
                <div className="flex items-start gap-3">
                  <Circle className="w-5 h-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{skill}</h4>
                    <input
                      type="text"
                      placeholder="How will you develop this skill? (e.g., take online course, join club, practice daily)"
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      value={developmentPlan[skill] || ''}
                      onChange={(e) => setDevelopmentPlan({
                        ...developmentPlan,
                        [skill]: e.target.value
                      })}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-purple-50 border-2 border-purple-200">
        <div className="flex gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="font-semibold text-purple-900 mb-2">Closing the Gap</h4>
            <p className="text-sm text-purple-800 leading-relaxed">
              Focus on developing 2-3 priority skills at a time. Use your high school timeline to
              schedule activities that will help you build these skills. Remember: skill development
              takes time and practice!
            </p>
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep('needed')}>
          ← Back
        </Button>
        <Button onClick={handleComplete} size="lg">
          Complete Analysis →
        </Button>
      </div>
    </motion.div>
  )
}
