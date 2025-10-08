// src/app/(dashboard)/projects/brainstorm/page.tsx
'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Lightbulb, Loader2, Sparkles, ArrowRight, TrendingUp, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ProjectIdeasSkeleton } from '@/components/projects/ProjectIdeasSkeleton'

interface ProjectIdea {
  id: string
  title: string
  description: string
  category: string
  feasibilityScore: number
  timeEstimate: string
  uniqueness: 'HIGH' | 'MEDIUM' | 'LOW'
  impactMetrics?: string[]
}

export default function ProjectBrainstormPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [ideas, setIdeas] = useState<ProjectIdea[]>([])
  const [formData, setFormData] = useState({
    interests: '',
    problemArea: '',
    timeCommitment: '4-6',
    projectTypes: [] as string[]
  })

  const projectTypes = [
    { id: 'creative', label: 'Creative (design, art, media)', icon: '🎨' },
    { id: 'social', label: 'Social Impact (help others, community)', icon: '🤝' },
    { id: 'entrepreneurial', label: 'Entrepreneurial (startup, business)', icon: '💼' },
    { id: 'research', label: 'Research (study, analyze, publish)', icon: '🔬' },
    { id: 'technical', label: 'Technical (build app, tool, website)', icon: '💻' },
    { id: 'leadership', label: 'Leadership (club, conference, mentorship)', icon: '👥' }
  ]

  const toggleProjectType = (typeId: string) => {
    setFormData(prev => ({
      ...prev,
      projectTypes: prev.projectTypes.includes(typeId)
        ? prev.projectTypes.filter(t => t !== typeId)
        : [...prev.projectTypes, typeId]
    }))
  }

  const generateIdeas = async () => {
    // Validation
    if (!formData.interests.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please tell us about your interests',
        variant: 'destructive'
      })
      return
    }

    if (!formData.problemArea.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please describe a problem area you care about',
        variant: 'destructive'
      })
      return
    }

    if (formData.projectTypes.length === 0) {
      toast({
        title: 'Missing Information',
        description: 'Please select at least one project type',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/projects/brainstorm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate ideas')
      }

      setIdeas(data.ideas)
      
      toast({
        title: 'Ideas Generated!',
        description: `Found ${data.ideas.length} project ideas for you`,
      })
    } catch (error) {
      console.error('Error generating ideas:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate ideas. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const selectIdea = (idea: ProjectIdea) => {
    const params = new URLSearchParams({
      title: idea.title,
      description: idea.description,
      category: idea.category,
      ideaData: JSON.stringify(idea)
    })
    router.push(`/projects/new?${params.toString()}`)
  }

  const getUniquenessColor = (uniqueness: string) => {
    switch (uniqueness) {
      case 'HIGH':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'LOW':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Project Brainstorming
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Let&apos;s Find Your Perfect Project
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Answer a few questions and our AI will generate personalized project ideas 
            that match your interests, skills, and time commitment.
          </p>
        </div>

        {/* Brainstorming Form */}
        {ideas.length === 0 && !loading && (
          <Card className="p-8 mb-8">
            <div className="space-y-6">
              {/* Interests */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  1. What are your top interests or passions? 🎯
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  E.g., UX design, psychology, helping students, environmental issues
                </p>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter your interests..."
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                />
              </div>

              {/* Problem Area */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  2. What problem or topic do you care about? 💡
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  E.g., Students struggle with time management, lack of mental health resources
                </p>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe a problem you'd like to address..."
                  value={formData.problemArea}
                  onChange={(e) => setFormData({ ...formData, problemArea: e.target.value })}
                />
              </div>

              {/* Time Commitment */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  3. How much time can you commit per week? ⏰
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['2-3', '4-6', '7-10', '10+'].map((hours) => (
                    <button
                      key={hours}
                      onClick={() => setFormData({ ...formData, timeCommitment: hours })}
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        formData.timeCommitment === hours
                          ? 'border-purple-500 bg-purple-50 text-purple-700 font-semibold'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {hours} hours
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Types */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  4. What type of project interests you? (Select all that apply) 🎨
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {projectTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => toggleProjectType(type.id)}
                      className={`px-4 py-3 rounded-lg border-2 text-left transition-all ${
                        formData.projectTypes.includes(type.id)
                          ? 'border-purple-500 bg-purple-50 text-purple-700 font-semibold'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <span className="mr-2">{type.icon}</span>
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <div className="pt-4">
                <Button
                  onClick={generateIdeas}
                  disabled={loading}
                  size="lg"
                  className="w-full gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Project Ideas
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {loading && <ProjectIdeasSkeleton />}

        {/* Generated Ideas */}
        {ideas.length > 0 && !loading && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                ✨ Your Personalized Project Ideas
              </h2>
              <Button
                variant="outline"
                onClick={() => setIdeas([])}
                size="sm"
              >
                🔄 Generate New Ideas
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {ideas.map((idea) => (
                <Card key={idea.id} className="p-6 hover:shadow-lg transition-all">
                  <div className="space-y-4">
                    {/* Header */}
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 flex-1">
                          {idea.title}
                        </h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded border ${getUniquenessColor(idea.uniqueness)}`}>
                          {idea.uniqueness}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{idea.description}</p>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {idea.feasibilityScore}/100
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {idea.timeEstimate}
                      </span>
                    </div>

                    {/* Impact Metrics */}
                    {idea.impactMetrics && idea.impactMetrics.length > 0 && (
                      <div className="text-sm">
                        <p className="font-semibold text-gray-700 mb-1">Potential Impact:</p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {idea.impactMetrics.slice(0, 3).map((metric, idx) => (
                            <li key={idx}>{metric}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-2 border-t">
                      <Button
                        onClick={() => selectIdea(idea)}
                        className="w-full gap-2"
                        variant="outline"
                      >
                        Select This Idea
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Tips */}
            <Card className="p-6 bg-amber-50 border-amber-200">
              <div className="flex gap-3">
                <Lightbulb className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">Pro Tips</h4>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>• Choose a project that genuinely excites you</li>
                    <li>• Consider what's realistic given your time commitment</li>
                    <li>• Look for projects that develop skills you want to build</li>
                    <li>• Don't worry if it's not perfect - you can adjust as you go!</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
