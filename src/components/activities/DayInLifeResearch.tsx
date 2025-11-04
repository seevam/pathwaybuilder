// src/components/activities/DayInLifeResearch.tsx
'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CAREERS, type Career } from '@/lib/data/careers-data'
import { 
  Search, 
  ArrowLeft, 
  Check, 
  ExternalLink,
  DollarSign,
  GraduationCap,
  TrendingUp,
  MapPin,
  Clock,
  Users,
  Sparkles,
  PlayCircle,
  FileText,
  Star,
  ArrowRight,
  Columns
} from 'lucide-react'

interface ResearchData {
  careerId: string
  excitement: string
  concerns: string
  questions: string
  interestLevel: number
}

interface DayInLifeResearchProps {
  riasecCode: string | null
  exploredClusters: string[]
  onComplete: (data: {
    selectedCareers: string[]
    researchData: Record<string, ResearchData>
    shortlist: string[]
  }) => void
}

type View = 'selection' | 'research' | 'comparison' | 'complete'

export function DayInLifeResearch({ 
  riasecCode, 
  exploredClusters,
  onComplete 
}: DayInLifeResearchProps) {
  const [view, setView] = useState<View>('selection')
  const [selectedCareers, setSelectedCareers] = useState<string[]>([])
  const [currentResearchIndex, setCurrentResearchIndex] = useState(0)
  const [researchData, setResearchData] = useState<Record<string, ResearchData>>({})
  const [shortlist, setShortlist] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Filter careers based on search
  const filteredCareers = useMemo(() => {
    if (!searchQuery) return CAREERS
    
    const query = searchQuery.toLowerCase()
    return CAREERS.filter(career =>
      career.title.toLowerCase().includes(query) ||
      career.cluster.toLowerCase().includes(query) ||
      career.category.toLowerCase().includes(query) ||
      career.description.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const canProceedToResearch = selectedCareers.length >= 1 && selectedCareers.length <= 3

  const handleSelectCareer = (careerId: string) => {
    if (selectedCareers.includes(careerId)) {
      setSelectedCareers(selectedCareers.filter(id => id !== careerId))
    } else if (selectedCareers.length < 3) {
      setSelectedCareers([...selectedCareers, careerId])
    }
  }

  const handleStartResearch = () => {
    setView('research')
    setCurrentResearchIndex(0)
  }

  const handleSaveResearch = (data: ResearchData) => {
    setResearchData(prev => ({
      ...prev,
      [selectedCareers[currentResearchIndex]]: data
    }))

    if (currentResearchIndex < selectedCareers.length - 1) {
      setCurrentResearchIndex(currentResearchIndex + 1)
    } else {
      setView('comparison')
    }
  }

  const handleComplete = () => {
    onComplete({
      selectedCareers,
      researchData,
      shortlist
    })
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {view === 'selection' && (
          <SelectionView
            key="selection"
            careers={filteredCareers}
            selectedCareers={selectedCareers}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectCareer={handleSelectCareer}
            onProceed={handleStartResearch}
            canProceed={canProceedToResearch}
          />
        )}

        {view === 'research' && (
          <ResearchView
            key="research"
            career={CAREERS.find(c => c.id === selectedCareers[currentResearchIndex])!}
            currentIndex={currentResearchIndex}
            totalCareers={selectedCareers.length}
            existingData={researchData[selectedCareers[currentResearchIndex]]}
            onSave={handleSaveResearch}
            onBack={() => setView('selection')}
          />
        )}

        {view === 'comparison' && (
          <ComparisonView
            key="comparison"
            careers={CAREERS.filter(c => selectedCareers.includes(c.id))}
            researchData={researchData}
            shortlist={shortlist}
            onToggleShortlist={(careerId) => {
              if (shortlist.includes(careerId)) {
                setShortlist(shortlist.filter(id => id !== careerId))
              } else {
                setShortlist([...shortlist, careerId])
              }
            }}
            onComplete={handleComplete}
            onBack={() => setView('research')}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Selection View Component
interface SelectionViewProps {
  careers: Career[]
  selectedCareers: string[]
  searchQuery: string
  onSearchChange: (query: string) => void
  onSelectCareer: (careerId: string) => void
  onProceed: () => void
  canProceed: boolean
}

function SelectionView({
  careers,
  selectedCareers,
  searchQuery,
  onSearchChange,
  onSelectCareer,
  onProceed,
  canProceed
}: SelectionViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Career Deep Research
            </h2>
            <p className="text-gray-600">
              Select 1-3 careers to research in-depth. You&apos;ll explore what professionals actually do, required education, salary, and more.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold text-blue-600">
              {selectedCareers.length}
            </div>
            <div className="text-sm text-gray-600">
              of 3 careers<br />selected
            </div>
          </div>
          <div className="flex-1 flex gap-2">
            {[1, 2, 3].map(num => (
              <div
                key={num}
                className={`flex-1 h-2 rounded-full ${
                  num <= selectedCareers.length
                    ? 'bg-blue-600'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search careers by title, industry, or skills..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Career Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {careers.map(career => (
          <CareerCard
            key={career.id}
            career={career}
            selected={selectedCareers.includes(career.id)}
            onSelect={() => onSelectCareer(career.id)}
            disabled={!selectedCareers.includes(career.id) && selectedCareers.length >= 3}
          />
        ))}
      </div>

      {careers.length === 0 && (
        <Card className="p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No careers found matching &quot;{searchQuery}&quot;</p>
          <Button
            variant="outline"
            onClick={() => onSearchChange('')}
            className="mt-4"
          >
            Clear Search
          </Button>
        </Card>
      )}

      {/* Proceed Button */}
      {canProceed && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Ready to Research?
              </h3>
              <p className="text-gray-600">
                You&apos;ve selected {selectedCareers.length} career{selectedCareers.length > 1 ? 's' : ''} to explore
              </p>
            </div>
            <Button
              size="lg"
              onClick={onProceed}
              className="gap-2"
            >
              Start Research
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      )}
    </motion.div>
  )
}

// Career Card Component
interface CareerCardProps {
  career: Career
  selected: boolean
  onSelect: () => void
  disabled: boolean
}

function CareerCard({ career, selected, onSelect, disabled }: CareerCardProps) {
  return (
    <Card
      className={`p-4 cursor-pointer transition-all ${
        selected
          ? 'ring-2 ring-blue-500 bg-blue-50 shadow-lg'
          : disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:shadow-md hover:scale-[1.02]'
      }`}
      onClick={() => !disabled && onSelect()}
    >
      {selected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      <h3 className="font-bold text-gray-900 mb-1">{career.title}</h3>
      <p className="text-xs text-blue-600 mb-2">{career.cluster}</p>
      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
        {career.description}
      </p>

      <div className="space-y-1 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <DollarSign className="w-3 h-3" />
          <span>{career.salaryRange}</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          <span>{career.jobOutlook}</span>
        </div>
      </div>
    </Card>
  )
}

// Research View Component
interface ResearchViewProps {
  career: Career
  currentIndex: number
  totalCareers: number
  existingData?: ResearchData
  onSave: (data: ResearchData) => void
  onBack: () => void
}

function ResearchView({
  career,
  currentIndex,
  totalCareers,
  existingData,
  onSave,
  onBack
}: ResearchViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'day-in-life' | 'requirements' | 'outlook'>('overview')
  const [excitement, setExcitement] = useState(existingData?.excitement || '')
  const [concerns, setConcerns] = useState(existingData?.concerns || '')
  const [questions, setQuestions] = useState(existingData?.questions || '')
  const [interestLevel, setInterestLevel] = useState(existingData?.interestLevel || 3)

  const handleSave = () => {
    onSave({
      careerId: career.id,
      excitement,
      concerns,
      questions,
      interestLevel
    })
  }

  const canSave = excitement.length >= 10 && interestLevel > 0

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex-1">
          <div className="text-sm text-gray-600 mb-1">
            Career {currentIndex + 1} of {totalCareers}
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / totalCareers) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Career Header */}
      <Card className={`p-8 bg-gradient-to-br from-purple-50 to-blue-50`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {career.title}
            </h2>
            <p className="text-lg text-gray-600">{career.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="font-medium">{career.salaryRange}</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>{career.education}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-600" />
            <span>{career.workEnvironment}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <span>{career.jobOutlook}</span>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b-2 border-gray-200">
        {[
          { id: 'overview', label: 'Overview', icon: FileText },
          { id: 'day-in-life', label: 'Day in the Life', icon: Clock },
          { id: 'requirements', label: 'Requirements', icon: GraduationCap },
          { id: 'outlook', label: 'Resources', icon: ExternalLink }
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {tab.label}
              </div>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Typical Daily Tasks
              </h3>
              <ul className="space-y-2">
                {career.typicalTasks.map((task, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{task}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Key Skills Required
              </h3>
              <div className="flex flex-wrap gap-2">
                {career.requiredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'day-in-life' && (
          <motion.div
            key="day-in-life"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                A Typical Day
              </h3>
              <p className="text-gray-700 leading-relaxed">{career.dayInLife}</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-red-600" />
                Watch Day in the Life Videos
              </h3>
              <a
                href={career.resources.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                <PlayCircle className="w-6 h-6 text-red-600" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">YouTube Videos</div>
                  <div className="text-sm text-gray-600">Watch real professionals describe their day</div>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400" />
              </a>
            </Card>
          </motion.div>
        )}

        {activeTab === 'requirements' && (
          <motion.div
            key="requirements"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Education Requirements
              </h3>
              <p className="text-gray-700 mb-4">{career.education}</p>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tip</h4>
                <p className="text-sm text-blue-800">
                  Many professionals in this field also benefit from internships, certifications, and hands-on projects during their education.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Salary & Compensation
              </h3>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {career.salaryRange}
              </div>
              <p className="text-sm text-gray-600">
                Typical salary range based on experience level and location. Entry-level positions typically start at the lower end.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                Work Environment
              </h3>
              <p className="text-gray-700">{career.workEnvironment}</p>
            </Card>
          </motion.div>
        )}

        {activeTab === 'outlook' && (
          <motion.div
            key="outlook"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                Job Outlook
              </h3>
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {career.jobOutlook}
              </div>
              <p className="text-sm text-gray-600">
                Projected job growth over the next 10 years compared to other occupations.
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-blue-600" />
                Research Resources
              </h3>
              <div className="space-y-3">
                <a
                  href={career.resources.onet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">O*NET Database</div>
                    <div className="text-sm text-gray-600">Detailed occupation information</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>

                <a
                  href={career.resources.bls}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Bureau of Labor Statistics</div>
                    <div className="text-sm text-gray-600">Official salary and outlook data</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>

                <a
                  href={career.resources.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <Users className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">LinkedIn Jobs</div>
                    <div className="text-sm text-gray-600">See real job postings</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reflection Section */}
      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-600" />
          Your Thoughts on This Career
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What excites you about this career? *
            </label>
            <Textarea
              value={excitement}
              onChange={(e) => setExcitement(e.target.value)}
              placeholder="I'm excited about..."
              className="min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Any concerns or challenges you see?
            </label>
            <Textarea
              value={concerns}
              onChange={(e) => setConcerns(e.target.value)}
              placeholder="I'm concerned about..."
              className="min-h-[80px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Questions you still have?
            </label>
            <Textarea
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder="I'd like to know more about..."
              className="min-h-[80px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Interest Level: {interestLevel}/5
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  onClick={() => setInterestLevel(level)}
                  className={`flex-1 h-12 rounded-lg border-2 transition-all ${
                    level <= interestLevel
                      ? 'bg-yellow-500 border-yellow-600 text-white'
                      : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                  }`}
                >
                  <Star className="w-6 h-6 mx-auto" fill={level <= interestLevel ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={!canSave}
          size="lg"
          className="w-full mt-6 gap-2"
        >
          {currentIndex < totalCareers - 1 ? 'Next Career' : 'View Comparison'}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </Card>
    </motion.div>
  )
}

// Comparison View Component
interface ComparisonViewProps {
  careers: Career[]
  researchData: Record<string, ResearchData>
  shortlist: string[]
  onToggleShortlist: (careerId: string) => void
  onComplete: () => void
  onBack: () => void
}

function ComparisonView({
  careers,
  researchData,
  shortlist,
  onToggleShortlist,
  onComplete,
  onBack
}: ComparisonViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Columns className="w-6 h-6 text-blue-600" />
              Career Comparison
            </h2>
            <p className="text-gray-600">
              Compare your researched careers side-by-side and add your favorites to your shortlist
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <div>
            <div className="font-semibold text-gray-900">
              {shortlist.length} Career{shortlist.length !== 1 ? 's' : ''} in Shortlist
            </div>
            <div className="text-sm text-gray-600">
              Add careers you want to explore further
            </div>
          </div>
        </div>
      </Card>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 sticky left-0 bg-gray-50">
                  Criteria
                </th>
                {careers.map(career => (
                  <th key={career.id} className="p-4 border-b-2 border-gray-200 min-w-[250px]">
                    <div className="text-left">
                      <div className="font-bold text-gray-900 mb-1">{career.title}</div>
                      <button
                        onClick={() => onToggleShortlist(career.id)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                          shortlist.includes(career.id)
                            ? 'bg-yellow-500 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-yellow-100'
                        }`}
                      >
                        <Star className="w-3 h-3 inline mr-1" fill={shortlist.includes(career.id) ? 'currentColor' : 'none'} />
                        {shortlist.includes(career.id) ? 'In Shortlist' : 'Add to Shortlist'}
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 font-medium text-gray-700 border-b border-gray-200 sticky left-0 bg-white">
                  Your Interest
                </td>
                {careers.map(career => (
                  <td key={career.id} className="p-4 border-b border-gray-200">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(level => (
                        <Star
                          key={level}
                          className="w-4 h-4 text-yellow-500"
                          fill={level <= (researchData[career.id]?.interestLevel || 0) ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-medium text-gray-700 border-b border-gray-200 sticky left-0 bg-white">
                  Salary Range
                </td>
                {careers.map(career => (
                  <td key={career.id} className="p-4 border-b border-gray-200">
                    {career.salaryRange}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-medium text-gray-700 border-b border-gray-200 sticky left-0 bg-white">
                  Education
                </td>
                {careers.map(career => (
                  <td key={career.id} className="p-4 border-b border-gray-200 text-sm">
                    {career.education}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-medium text-gray-700 border-b border-gray-200 sticky left-0 bg-white">
                  Work Environment
                </td>
                {careers.map(career => (
                  <td key={career.id} className="p-4 border-b border-gray-200">
                    {career.workEnvironment}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-medium text-gray-700 border-b border-gray-200 sticky left-0 bg-white">
                  Job Outlook
                </td>
                {careers.map(career => (
                  <td key={career.id} className="p-4 border-b border-gray-200">
                    {career.jobOutlook}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-medium text-gray-700 border-b border-gray-200 sticky left-0 bg-white">
                  What Excites You
                </td>
                {careers.map(career => (
                  <td key={career.id} className="p-4 border-b border-gray-200 text-sm">
                    <p className="line-clamp-3">{researchData[career.id]?.excitement || '—'}</p>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-medium text-gray-700 sticky left-0 bg-white">
                  Concerns
                </td>
                {careers.map(career => (
                  <td key={career.id} className="p-4 text-sm">
                    <p className="line-clamp-2">{researchData[career.id]?.concerns || '—'}</p>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Research
        </Button>

        <Button
          size="lg"
          onClick={onComplete}
          className="gap-2"
        >
          Complete Activity
          <Check className="w-5 h-5" />
        </Button>
      </div>

      {shortlist.length > 0 && (
        <Card className="p-6 bg-yellow-50 border-2 border-yellow-200">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            Your Career Shortlist
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            These careers will appear on your dashboard for easy reference
          </p>
          <div className="flex flex-wrap gap-2">
            {careers.filter(c => shortlist.includes(c.id)).map(career => (
              <span
                key={career.id}
                className="px-3 py-1 bg-white border-2 border-yellow-300 rounded-full text-sm font-medium text-gray-900"
              >
                {career.title}
              </span>
            ))}
          </div>
        </Card>
      )}
    </motion.div>
  )
}
