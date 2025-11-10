// src/components/activities/EducationPathways.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { CheckCircle2, GraduationCap, ExternalLink } from 'lucide-react'

const PATHWAY_OPTIONS = [
  {
    id: 'four-year-college',
    title: '4-Year College/University',
    icon: '🎓',
    duration: '4 years',
    description: 'Bachelor\'s degree programs at colleges and universities',
    pros: [
      'Comprehensive education with broad exposure',
      'Research opportunities and internships',
      'Traditional college experience',
      'Wide career opportunities'
    ],
    cons: [
      'Highest cost (tuition + living expenses)',
      'Longer time commitment',
      'May include non-major requirements',
      'Not all majors guarantee jobs'
    ],
    bestFor: 'Students seeking careers that require a bachelor\'s degree (engineering, business, healthcare, etc.)',
    examples: ['State Universities', 'Private Colleges', 'Liberal Arts Schools']
  },
  {
    id: 'community-college',
    title: 'Community College',
    icon: '📚',
    duration: '2 years',
    description: 'Associate degree or certificate programs, often transferable',
    pros: [
      'Much lower cost',
      'Flexible schedules (evening, online)',
      'Can transfer to 4-year schools',
      'Smaller class sizes'
    ],
    cons: [
      'Limited on-campus experience',
      'May need to transfer for bachelor\'s',
      'Fewer research opportunities',
      'Variable credit transfer policies'
    ],
    bestFor: 'Students wanting to save money, explore interests, or earn career-ready credentials quickly',
    examples: ['Local Community Colleges', '2+2 Transfer Programs']
  },
  {
    id: 'trade-school',
    title: 'Trade/Technical School',
    icon: '🔧',
    duration: '6 months - 2 years',
    description: 'Focused training for specific skilled trades',
    pros: [
      'Quick entry to workforce',
      'Hands-on practical training',
      'Lower cost than college',
      'High demand for skilled trades'
    ],
    cons: [
      'Specialized to one field',
      'May have limited advancement',
      'Physical demands in some trades',
      'Less academic breadth'
    ],
    bestFor: 'Students interested in skilled trades with hands-on work (electrician, plumber, HVAC, cosmetology)',
    examples: ['Welding Programs', 'Automotive Technology', 'Cosmetology School', 'Electrical Training']
  },
  {
    id: 'apprenticeship',
    title: 'Apprenticeship',
    icon: '👷',
    duration: '1-5 years',
    description: 'Earn while you learn with on-the-job training',
    pros: [
      'Earn money while learning',
      'No student debt',
      'Real work experience',
      'Often leads to union jobs'
    ],
    cons: [
      'Competitive to get accepted',
      'Long hours and physical work',
      'Limited to certain industries',
      'May require relocation'
    ],
    bestFor: 'Students who want to earn while learning practical skills in construction, manufacturing, or skilled trades',
    examples: ['Union Apprenticeships', 'Registered Apprenticeships', 'DOL Programs']
  },
  {
    id: 'bootcamp',
    title: 'Coding Bootcamp/Certificate',
    icon: '💻',
    duration: '3-6 months',
    description: 'Intensive training in tech, business, or creative skills',
    pros: [
      'Fast track to employment',
      'Focused on in-demand skills',
      'Career services included',
      'Lower cost than degree'
    ],
    cons: [
      'Very intensive pace',
      'Not accredited like degrees',
      'Narrow skill focus',
      'Variable quality by program'
    ],
    bestFor: 'Career changers or those seeking specific tech skills (coding, data science, UX design)',
    examples: ['Coding Bootcamps', 'Data Science Programs', 'Digital Marketing Certificates']
  },
  {
    id: 'military',
    title: 'Military Service',
    icon: '🎖️',
    duration: '4+ years',
    description: 'Serve in armed forces with training and education benefits',
    pros: [
      'Full benefits (housing, healthcare)',
      'GI Bill for future education',
      'Leadership training',
      'Job security and structure'
    ],
    cons: [
      'Strict discipline and hierarchy',
      'Deployment risks',
      'Limited personal freedom',
      'Long-term commitment'
    ],
    bestFor: 'Students seeking structure, service, and education benefits while building leadership skills',
    examples: ['Army', 'Navy', 'Air Force', 'Marines', 'Coast Guard', 'National Guard']
  },
  {
    id: 'workforce',
    title: 'Direct to Workforce',
    icon: '💼',
    duration: 'Immediate',
    description: 'Start working right after high school',
    pros: [
      'Immediate income',
      'No education debt',
      'Real-world experience',
      'Can go back to school later'
    ],
    cons: [
      'Lower starting pay typically',
      'Fewer advancement opportunities',
      'May hit career ceiling',
      'Harder to go back to school later'
    ],
    bestFor: 'Students with clear career path not requiring degree, or needing income immediately',
    examples: ['Retail', 'Customer Service', 'Sales', 'Entry-level positions']
  },
  {
    id: 'gap-year',
    title: 'Gap Year',
    icon: '🌍',
    duration: '1 year',
    description: 'Take time to work, volunteer, or explore before committing',
    pros: [
      'Gain life experience and maturity',
      'Clarify goals before investing',
      'Travel or volunteer opportunities',
      'Build work experience'
    ],
    cons: [
      'Delay starting career/education',
      'Need structure and plan',
      'Pressure from peers and family',
      'May lose academic momentum'
    ],
    bestFor: 'Students who need time to explore interests, gain clarity, or save money before making decisions',
    examples: ['Volunteer Programs', 'Work and Travel', 'Internships', 'Language Study']
  }
]

interface EducationPathwaysProps {
  onComplete: (data: { exploredPathways: string[]; topChoices: string[]; notes: Record<string, string> }) => void
}

export function EducationPathways({ onComplete }: EducationPathwaysProps) {
  const { toast } = useToast()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [exploredPathways, setExploredPathways] = useState<string[]>([])
  const [interestedPathways, setInterestedPathways] = useState<string[]>([])
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [showSummary, setShowSummary] = useState(false)

  const pathway = PATHWAY_OPTIONS[currentIndex]
  const hasExplored = exploredPathways.includes(pathway.id)
  const isInterested = interestedPathways.includes(pathway.id)

  const handleMarkExplored = () => {
    if (!hasExplored) {
      setExploredPathways([...exploredPathways, pathway.id])
    }
  }

  const handleToggleInterest = () => {
    if (isInterested) {
      setInterestedPathways(interestedPathways.filter(id => id !== pathway.id))
    } else {
      setInterestedPathways([...interestedPathways, pathway.id])
    }
  }

  const handleNext = () => {
    if (!hasExplored) {
      handleMarkExplored()
    }
    if (currentIndex < PATHWAY_OPTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setShowSummary(true)
    }
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleComplete = () => {
    if (interestedPathways.length === 0) {
      toast({
        title: 'Select at least one pathway',
        description: 'Mark at least one pathway you\'re interested in exploring',
        variant: 'destructive'
      })
      return
    }

    onComplete({
      exploredPathways,
      topChoices: interestedPathways,
      notes
    })
  }

  if (showSummary) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
          <div className="text-center mb-8">
            <GraduationCap className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Your Education Pathways
            </h2>
            <p className="text-gray-600">
              You explored {exploredPathways.length} pathways and marked {interestedPathways.length} as interesting
            </p>
          </div>

          {interestedPathways.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Pathways You're Interested In</h3>
              <div className="space-y-4">
                {interestedPathways.map(pathwayId => {
                  const p = PATHWAY_OPTIONS.find(opt => opt.id === pathwayId)
                  if (!p) return null

                  return (
                    <Card key={p.id} className="p-6 bg-white border-2 border-blue-300">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{p.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">{p.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{p.description}</p>
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            Duration: {p.duration}
                          </div>
                        </div>
                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          <Card className="p-6 bg-blue-50 border-2 border-blue-200">
            <div className="flex gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Research specific programs in your areas of interest</li>
                  <li>• Talk to people who have taken these pathways</li>
                  <li>• Consider cost, time, and career outcomes</li>
                  <li>• Remember: you can combine pathways (e.g., community college → university)</li>
                </ul>
              </div>
            </div>
          </Card>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleComplete} size="lg">
            Complete Activity →
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
          <span className="font-medium">
            Pathway {currentIndex + 1} of {PATHWAY_OPTIONS.length}
          </span>
          <span className="text-gray-600">
            {exploredPathways.length} explored • {interestedPathways.length} interested
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
            animate={{ width: `${((currentIndex + 1) / PATHWAY_OPTIONS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Pathway Card */}
      <motion.div
        key={pathway.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-6xl">{pathway.icon}</div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {pathway.title}
              </h2>
              <p className="text-gray-600 text-lg mb-3">
                {pathway.description}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium">
                Duration: {pathway.duration}
              </div>
            </div>
          </div>

          {/* Pros and Cons */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                <span className="text-xl">✅</span> Advantages
              </h3>
              <ul className="space-y-2">
                {pathway.pros.map((pro, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-orange-700 mb-3 flex items-center gap-2">
                <span className="text-xl">⚠️</span> Considerations
              </h3>
              <ul className="space-y-2">
                {pathway.cons.map((con, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Best For */}
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-gray-900 mb-2">Best For:</h3>
            <p className="text-gray-700">{pathway.bestFor}</p>
          </div>

          {/* Examples */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-2">Examples:</h3>
            <div className="flex flex-wrap gap-2">
              {pathway.examples.map((example, idx) => (
                <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {example}
                </span>
              ))}
            </div>
          </div>

          {/* Interest Toggle */}
          <div className="border-t pt-4">
            <Button
              onClick={handleToggleInterest}
              variant={isInterested ? 'default' : 'outline'}
              className="w-full"
            >
              {isInterested ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Interested in this pathway
                </>
              ) : (
                'Mark as Interested'
              )}
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentIndex === 0}
        >
          ← Back
        </Button>

        <Button onClick={handleNext}>
          {currentIndex === PATHWAY_OPTIONS.length - 1
            ? 'Review Choices →'
            : 'Next Pathway →'}
        </Button>
      </div>
    </div>
  )
}
