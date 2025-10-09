'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Circle } from 'lucide-react'
import CharterBuilder from './CharterBuilder'
import MilestoneBuilder from './MilestoneBuilder'
import ResourcePlanner from './ResourcePlanner'
import SkillGapAnalysis from './SkillGapAnalysis'
import type { ProjectWithRelations } from '@/types'

interface ProjectPlanningTabsProps {
  project: ProjectWithRelations
}

const PLANNING_STEPS = [
  { id: 'charter', title: 'Project Charter', description: 'Define mission and goals' },
  { id: 'milestones', title: 'Milestones', description: 'Break into phases' },
  { id: 'resources', title: 'Resources', description: 'Plan what you need' },
  { id: 'skills', title: 'Skill Gaps', description: 'Identify learning needs' },
] as const

type StepId = typeof PLANNING_STEPS[number]['id']

export default function ProjectPlanningTabs({ project }: ProjectPlanningTabsProps) {
  const [currentStep, setCurrentStep] = useState<StepId>('charter')
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set())

  const handleStepComplete = (stepId: StepId) => {
    setCompletedSteps(prev => new Set([...prev, stepId]))
    const currentIndex = PLANNING_STEPS.findIndex(s => s.id === stepId)
    if (currentIndex < PLANNING_STEPS.length - 1) {
      setCurrentStep(PLANNING_STEPS[currentIndex + 1].id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          {PLANNING_STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-2 ${
                  currentStep === step.id ? 'text-purple-600' : 'text-gray-400'
                }`}
              >
                {completedSteps.has(step.id) ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className={`w-6 h-6 ${
                    currentStep === step.id ? 'text-purple-600' : 'text-gray-300'
                  }`} />
                )}
                <div className="text-left">
                  <div className="font-semibold text-sm">{step.title}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
              </button>
              {index < PLANNING_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  completedSteps.has(step.id) ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Current Step Content */}
      {currentStep === 'charter' && (
        <CharterBuilder 
          project={project} 
          onComplete={() => handleStepComplete('charter')}
        />
      )}
      
      {currentStep === 'milestones' && (
        <MilestoneBuilder 
          project={project}
          onComplete={() => handleStepComplete('milestones')}
        />
      )}
      
      {currentStep === 'resources' && (
        <ResourcePlanner 
          project={project}
          onComplete={() => handleStepComplete('resources')}
        />
      )}
      
      {currentStep === 'skills' && (
        <SkillGapAnalysis 
          project={project}
          onComplete={() => handleStepComplete('skills')}
        />
      )}
    </div>
  )
}
