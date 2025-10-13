// src/app/(dashboard)/projects/brainstorm/page.tsx (UPDATED)
'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Lightbulb, Loader2, Sparkles, ArrowRight, TrendingUp, Clock, Wand2, CheckCircle2, Plus, X } from 'lucide-react'
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

interface OptionCard {
  id: string
  label: string
  description: string
  alignment: string
}

export default function ProjectBrainstormPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [ideas, setIdeas] = useState<ProjectIdea[]>([])
  
  // AI-generated options
  const [interestOptions, setInterestOptions] = useState<OptionCard[]>([])
  const [problemOptions, setProblemOptions] = useState<OptionCard[]>([])
  const [loadingInterests, setLoadingInterests] = useState(false)
  const [loadingProblems, setLoadingProblems] = useState(false)
  
  // Selected options
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [selectedProblems, setSelectedProblems] = useState<string[]>([])
  
  // Custom inputs
  const [customInterests, setCustomInterests] = useState<string[]>([])
  const [customProblems, setCustomProblems] = useState<string[]>([])
  const [newInterestInput, setNewInterestInput] = useState('')
  const [newProblemInput, setNewProblemInput] = useState('')
  
  const [formData, setFormData] = useState({
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

  const addCustomInterest = () => {
    if (newInterestInput.trim()) {
      setCustomInterests([...customInterests, newInterestInput.trim()])
      setNewInterestInput('')
    }
  }

  const removeCustomInterest = (index: number) => {
    setCustomInterests(customInterests.filter((_, i) => i !== index))
  }

  const addCustomProblem = () => {
    if (newProblemInput.trim()) {
      setCustomProblems([...customProblems, newProblemInput.trim()])
      setNewProblemInput('')
    }
  }

  const removeCustomProblem = (index: number) => {
    setCustomProblems(customProblems.filter((_, i) => i !== index))
  }

  const generateOptions = async (type: 'interests' | 'problems') => {
    const setLoadingFn = type === 'interests' ? setLoadingInterests : setLoadingProblems
    const setOptionsFn = type === 'interests' ? setInterestOptions : setProblemOptions

    // For problems, check if interests are selected
    if (type === 'problems') {
      const totalInterests = selectedInterests.length + customInterests.length
      if (totalInterests === 0) {
        toast({
          title: 'Select Interests First',
          description: 'Please select or add at least one interest area before generating problems',
          variant: 'destructive'
        })
        return
      }
    }

    setLoadingFn(true)

    try {
      // Get selected interest labels for problem generation
      const selectedInterestLabels = type === 'problems' 
        ? [
            ...interestOptions.filter(opt => selectedInterests.includes(opt.id)).map(opt => opt.label),
            ...customInterests
          ]
        : undefined

      const response = await fetch('/api/projects/generate-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type,
          selectedInterests: selectedInterestLabels 
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate options')
      }

      setOptionsFn(data.options)
      
      toast({
        title: '✨ Options Generated!',
        description: `Found ${data.options.length} personalized ${type === 'interests' ? 'interest areas' : 'problems'} based on your profile`,
      })
    } catch (error) {
      console.error('Error generating options:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate options. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoadingFn(false)
    }
  }

  const toggleOption = (optionId: string, type: 'interests' | 'problems') => {
    if (type === 'interests') {
      const newSelected = selectedInterests.includes(optionId) 
        ? selectedInterests.filter(id => id !== optionId)
        : [...selectedInterests, optionId]
      
      setSelectedInterests(newSelected)
      
      // If deselecting interests and problems are generated, warn user
      if (newSelected.length < selectedInterests.length && problemOptions.length > 0) {
        toast({
          title: 'Interest Changed',
          description: 'You may want to regenerate problems based on your updated interests',
        })
      }
    } else {
      setSelectedProblems(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      )
    }
  }

  const generateIdeas = async () => {
    // Validation
    const totalInterests = selectedInterests.length + customInterests.length
    const totalProblems = selectedProblems.length + customProblems.length

    if (totalInterests === 0) {
      toast({
        title: 'Missing Information',
        description: 'Please select or add at least one interest area',
        variant: 'destructive'
      })
      return
    }

    if (totalProblems === 0) {
      toast({
        title: 'Missing Information',
        description: 'Please select or add at least one problem area',
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
      // Compile all selected interests and problems
      const allInterests = [
        ...interestOptions.filter(opt => selectedInterests.includes(opt.id)).map(opt => opt.label),
        ...customInterests
      ].join(', ')
      
      const allProblems = [
        ...problemOptions.filter(opt => selectedProblems.includes(opt.id)).map(opt => opt.label),
        ...customProblems
      ].join(', ')

      const response = await fetch('/api/projects/brainstorm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interests: allInterests,
          problemArea: allProblems,
          timeCommitment: formData.timeCommitment,
          projectTypes: formData.projectTypes
        })
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

  const totalInterests = selectedInterests.length + customInterests.length
  const totalProblems = selectedProblems.length + customProblems.length

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
            Using insights from your completed modules, we&apos;ll generate personalized project ideas
          </p>
        </div>

        {/* Brainstorming Form */}
        {ideas.length === 0 && !loading && (
          <Card className="p-8 mb-8">
            <div className="space-y-8">
              {/* INTERESTS SECTION */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-1">
                      1. What are your interest areas? 🎯
                    </label>
                    <p className="text-sm text-gray-500">
                      Broad fields, domains, or areas of study that appeal to you
                    </p>
                  </div>
                  <Button
                    onClick={() => generateOptions('interests')}
                    disabled={loadingInterests}
                    className="gap-2"
                    variant="outline"
                  >
                    {loadingInterests ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </div>

                {loadingInterests && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Analyzing your profile...</p>
                    </div>
                  </div>
                )}

                {!loadingInterests && interestOptions.length > 0 && (
                  <div className="space-y-3 mb-4">
                    <p className="text-sm text-gray-600">
                      Select areas that interest you ({selectedInterests.length} selected)
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {interestOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => toggleOption(option.id, 'interests')}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            selectedInterests.includes(option.id)
                              ? 'border-purple-500 bg-purple-50 shadow-md'
                              : 'border-gray-200 hover:border-purple-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{option.label}</h4>
                            {selectedInterests.includes(option.id) && (
                              <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-purple-600">{option.alignment}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Interest Input */}
                <div className="mt-4 space-y-3">
                  <p className="text-sm font-medium text-gray-700">Or add your own:</p>
                  <div className="flex gap-2">
                    <Input
                      value={newInterestInput}
                      onChange={(e) => setNewInterestInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
                      placeholder="e.g., Marine Biology, Artificial Intelligence, Music Production"
                      className="flex-1"
                    />
                    <Button
                      onClick={addCustomInterest}
                      disabled={!newInterestInput.trim()}
                      size="sm"
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                  </div>

                  {customInterests.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {customInterests.map((interest, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-2 bg-purple-100 border-2 border-purple-300 rounded-lg flex items-center gap-2"
                        >
                          <span className="text-sm font-medium text-purple-900">{interest}</span>
                          <button
                            onClick={() => removeCustomInterest(idx)}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Summary */}
                {totalInterests > 0 && (
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-900 font-medium">
                      ✓ {totalInterests} interest area{totalInterests !== 1 ? 's' : ''} selected
                    </p>
                  </div>
                )}
              </div>

              {/* PROBLEMS SECTION */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-1">
                      2. What problems do you care about? 💡
                    </label>
                    <p className="text-sm text-gray-500">
                      {totalInterests > 0 
                        ? 'Problems related to your selected interest areas'
                        : 'Select interest areas first to generate relevant problems'}
                    </p>
                  </div>
                  <Button
                    onClick={() => generateOptions('problems')}
                    disabled={loadingProblems || totalInterests === 0}
                    className="gap-2"
                    variant="outline"
                  >
                    {loadingProblems ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </div>

                {totalInterests === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <Wand2 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Complete step 1 first to generate relevant problems</p>
                  </div>
                )}

                {loadingProblems && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Finding problems you&apos;d care about...</p>
                    </div>
                  </div>
                )}

                {!loadingProblems && problemOptions.length > 0 && (
                  <div className="space-y-3 mb-4">
                    <p className="text-sm text-gray-600">
                      Select problems you&apos;re passionate about ({selectedProblems.length} selected)
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {problemOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => toggleOption(option.id, 'problems')}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            selectedProblems.includes(option.id)
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-blue-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{option.label}</h4>
                            {selectedProblems.includes(option.id) && (
                              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-600">{option.alignment}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Problem Input */}
                {totalInterests > 0 && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm font-medium text-gray-700">Or add your own:</p>
                    <div className="flex gap-2">
                      <Input
                        value={newProblemInput}
                        onChange={(e) => setNewProblemInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addCustomProblem()}
                        placeholder="e.g., Lack of coding education in schools, Food waste in cafeterias"
                        className="flex-1"
                      />
                      <Button
                        onClick={addCustomProblem}
                        disabled={!newProblemInput.trim()}
                        size="sm"
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </Button>
                    </div>

                    {customProblems.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {customProblems.map((problem, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-2 bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center gap-2"
                          >
                            <span className="text-sm font-medium text-blue-900">{problem}</span>
                            <button
                              onClick={() => removeCustomProblem(idx)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Summary */}
                {totalProblems > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900 font-medium">
                      ✓ {totalProblems} problem area{totalProblems !== 1 ? 's' : ''} selected
                    </p>
                  </div>
                )}
              </div>

              {/* Time Commitment */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
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
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  4. What type of project interests you? 🎨
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
                  disabled={loading || totalInterests === 0 || totalProblems === 0 || formData.projectTypes.length === 0}
                  size="lg"
                  className="w-full gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Project Ideas
                </Button>
                {(totalInterests === 0 || totalProblems === 0 || formData.projectTypes.length === 0) && (
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Complete all steps to generate project ideas
                  </p>
                )}
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
                    <li>• Consider what&apos;s realistic given your time commitment</li>
                    <li>• Look for projects that develop skills you want to build</li>
                    <li>• Don&apos;t worry if it&apos;s not perfect - you can adjust as you go!</li>
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
