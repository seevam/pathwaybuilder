// src/components/activities/CareerClustersExploration.tsx
'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CAREER_CLUSTERS, CareerCluster, getRecommendedClusters } from '@/lib/data/career-clusters-data'
import { 
  ArrowLeft, 
  Check, 
  Lock, 
  Sparkles, 
  Play, 
  Award,
  TrendingUp,
  DollarSign,
  GraduationCap,
  Users,
  MapPin
} from 'lucide-react'

interface CareerClustersExplorationProps {
  riasecCode: string | null
  onComplete: (data: {
    exploredClusters: string[]
    quizScores: Record<string, number>
    dayInLifeResults: Record<string, number>
    interestedClusters: string[]
  }) => void
}

type View = 'map' | 'detail' | 'quiz' | 'day-in-life' | 'complete'

export function CareerClustersExploration({ 
  riasecCode, 
  onComplete 
}: CareerClustersExplorationProps) {
  // State
  const [view, setView] = useState<View>('map')
  const [selectedCluster, setSelectedCluster] = useState<CareerCluster | null>(null)
  const [exploredClusters, setExploredClusters] = useState<Set<string>>(new Set())
  const [quizScores, setQuizScores] = useState<Record<string, number>>({})
  const [dayInLifeResults, setDayInLifeResults] = useState<Record<string, number>>({})
  const [interestedClusters, setInterestedClusters] = useState<Set<string>>(new Set())
  
  // Get recommended clusters based on RIASEC
  const recommendedClusterIds = useMemo(() => {
    return riasecCode ? getRecommendedClusters(riasecCode) : []
  }, [riasecCode])

  const progress = (exploredClusters.size / CAREER_CLUSTERS.length) * 100
  const canComplete = exploredClusters.size >= 5

  const handleExploreCluster = (cluster: CareerCluster) => {
    setSelectedCluster(cluster)
    setView('detail')
    setExploredClusters(prev => new Set([...prev, cluster.id]))
  }

  const handleSurpriseMe = () => {
    const unexplored = CAREER_CLUSTERS.filter(c => !exploredClusters.has(c.id))
    if (unexplored.length > 0) {
      const random = unexplored[Math.floor(Math.random() * unexplored.length)]
      handleExploreCluster(random)
    }
  }

  const handleComplete = () => {
    onComplete({
      exploredClusters: Array.from(exploredClusters),
      quizScores,
      dayInLifeResults,
      interestedClusters: Array.from(interestedClusters)
    })
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Career Territory Explorer
            </h2>
            <p className="text-gray-600 mt-1">
              Discover at least 5 clusters to unlock completion
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              {exploredClusters.size}/{CAREER_CLUSTERS.length}
            </div>
            <div className="text-sm text-gray-600">Clusters Explored</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Badges Earned */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700">Badges:</span>
          {[1, 3, 5, 8, 12, 16].map(threshold => (
            <div
              key={threshold}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                exploredClusters.size >= threshold
                  ? 'bg-yellow-400 text-yellow-900'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {exploredClusters.size >= threshold ? (
                <Award className="w-5 h-5" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {view === 'map' && (
          <MapView
            key="map"
            recommendedClusterIds={recommendedClusterIds}
            exploredClusters={exploredClusters}
            onExploreCluster={handleExploreCluster}
            onSurpriseMe={handleSurpriseMe}
            canComplete={canComplete}
            onComplete={handleComplete}
          />
        )}

        {view === 'detail' && selectedCluster && (
          <DetailView
            key="detail"
            cluster={selectedCluster}
            isExplored={exploredClusters.has(selectedCluster.id)}
            isInterested={interestedClusters.has(selectedCluster.id)}
            onBack={() => setView('map')}
            onStartQuiz={() => setView('quiz')}
            onStartDayInLife={() => setView('day-in-life')}
            onToggleInterest={() => {
              setInterestedClusters(prev => {
                const next = new Set(prev)
                if (next.has(selectedCluster.id)) {
                  next.delete(selectedCluster.id)
                } else {
                  next.add(selectedCluster.id)
                }
                return next
              })
            }}
          />
        )}

        {view === 'quiz' && selectedCluster && (
          <QuizView
            key="quiz"
            cluster={selectedCluster}
            onComplete={(score) => {
              setQuizScores(prev => ({ ...prev, [selectedCluster.id]: score }))
              setView('detail')
            }}
            onBack={() => setView('detail')}
          />
        )}

        {view === 'day-in-life' && selectedCluster && (
          <DayInLifeView
            key="day-in-life"
            cluster={selectedCluster}
            onComplete={(score) => {
              setDayInLifeResults(prev => ({ ...prev, [selectedCluster.id]: score }))
              setView('detail')
            }}
            onBack={() => setView('detail')}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Map View Component
interface MapViewProps {
  recommendedClusterIds: string[]
  exploredClusters: Set<string>
  onExploreCluster: (cluster: CareerCluster) => void
  onSurpriseMe: () => void
  canComplete: boolean
  onComplete: () => void
}

function MapView({
  recommendedClusterIds,
  exploredClusters,
  onExploreCluster,
  onSurpriseMe,
  canComplete,
  onComplete
}: MapViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Recommended Section */}
      {recommendedClusterIds.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h3 className="text-xl font-bold text-gray-900">
              Recommended Based on Your RIASEC Profile
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CAREER_CLUSTERS.filter(c => recommendedClusterIds.includes(c.id))
              .map(cluster => (
                <ClusterCard
                  key={cluster.id}
                  cluster={cluster}
                  isExplored={exploredClusters.has(cluster.id)}
                  isRecommended={true}
                  onClick={() => onExploreCluster(cluster)}
                />
              ))}
          </div>
        </div>
      )}

      {/* All Clusters */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            All Career Clusters
          </h3>
          <Button
            variant="outline"
            onClick={onSurpriseMe}
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Surprise Me!
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CAREER_CLUSTERS.map(cluster => (
            <ClusterCard
              key={cluster.id}
              cluster={cluster}
              isExplored={exploredClusters.has(cluster.id)}
              isRecommended={recommendedClusterIds.includes(cluster.id)}
              onClick={() => onExploreCluster(cluster)}
            />
          ))}
        </div>
      </div>

      {/* Complete Button */}
      {canComplete && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Ready to Continue?
              </h3>
              <p className="text-gray-600">
                You&apos;ve explored {exploredClusters.size} clusters. Great work!
              </p>
            </div>
            <Button
              size="lg"
              onClick={onComplete}
              className="gap-2"
            >
              Complete Activity
              <Check className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      )}
    </motion.div>
  )
}

// Cluster Card Component
interface ClusterCardProps {
  cluster: CareerCluster
  isExplored: boolean
  isRecommended: boolean
  onClick: () => void
}

function ClusterCard({ cluster, isExplored, isRecommended, onClick }: ClusterCardProps) {
  return (
    <Card
      className={`p-4 cursor-pointer hover:shadow-lg transition-all ${
        isRecommended ? 'ring-2 ring-yellow-400' : ''
      }`}
      onClick={onClick}
    >
      {isRecommended && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
          Recommended
        </div>
      )}
      
      <div className="flex items-start gap-3 mb-3">
        <div className={`text-4xl`}>
          {cluster.icon}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 text-sm leading-tight">
            {cluster.name}
          </h4>
        </div>
        {isExplored && (
          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
        )}
      </div>

      <p className="text-xs text-gray-600 line-clamp-2">
        {cluster.description}
      </p>

      <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
        <Users className="w-3 h-3" />
        <span>{cluster.careers.length} careers</span>
      </div>
    </Card>
  )
}

// Detail View Component
interface DetailViewProps {
  cluster: CareerCluster
  isExplored: boolean
  isInterested: boolean
  onBack: () => void
  onStartQuiz: () => void
  onStartDayInLife: () => void
  onToggleInterest: () => void
}

function DetailView({
  cluster,
  isExplored,
  isInterested,
  onBack,
  onStartQuiz,
  onStartDayInLife,
  onToggleInterest
}: DetailViewProps) {
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
          Back to Map
        </Button>
      </div>

      {/* Cluster Overview */}
      <Card className={`p-8 bg-gradient-to-br ${cluster.color}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="text-6xl">{cluster.icon}</span>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {cluster.name}
              </h2>
              <p className="text-white/90 text-lg">
                {cluster.description}
              </p>
            </div>
          </div>
          <Button
            variant={isInterested ? "default" : "outline"}
            onClick={onToggleInterest}
            className="gap-2"
          >
            {isInterested ? "★ Interested" : "☆ Mark Interest"}
          </Button>
        </div>

        <div className="flex items-center gap-6 text-white/90">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">
              RIASEC: {cluster.riasecAlignment.join(', ')}
            </span>
          </div>
        </div>
      </Card>

      {/* Video Section */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Play className="w-5 h-5 text-blue-600" />
          Introduction Video (3 min)
        </h3>
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Play className="w-16 h-16 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">Video placeholder</p>
            <p className="text-xs mt-1">URL: {cluster.videoUrl}</p>
          </div>
        </div>
      </Card>

      {/* Example Careers */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Example Careers ({cluster.careers.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cluster.careers.map((career, idx) => (
            <div
              key={idx}
              className="p-4 border rounded-lg hover:border-blue-300 transition-colors"
            >
              <h4 className="font-semibold text-gray-900 mb-2">
                {career.title}
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {career.description}
              </p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <DollarSign className="w-3 h-3" />
                  <span>{career.salaryRange}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <GraduationCap className="w-3 h-3" />
                  <span>{career.educationRequired}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Student Profile */}
      <Card className="p-6 bg-purple-50 border-purple-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          Student Spotlight
        </h3>
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-gray-900">
              {cluster.studentProfile.name}, {cluster.studentProfile.age}
            </p>
            <p className="text-sm text-gray-600">{cluster.studentProfile.school}</p>
          </div>
          <p className="text-gray-700 italic">
            &quot;{cluster.studentProfile.story}&quot;
          </p>
          <div className="pt-3 border-t border-purple-200">
            <p className="text-sm font-medium text-purple-900">
              Favorite Part:
            </p>
            <p className="text-sm text-gray-700">
              {cluster.studentProfile.favoritePart}
            </p>
          </div>
        </div>
      </Card>

      {/* Interactive Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={onStartQuiz}>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-2">
                Would You Thrive Here?
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Take a quick quiz to see how well this cluster fits you
              </p>
              <Button className="w-full">
                Take Quiz
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={onStartDayInLife}>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Play className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-2">
                A Day in the Life
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Experience realistic scenarios from this career path
              </p>
              <Button variant="outline" className="w-full">
                Play Scenario
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}

// Quiz View Component  
interface QuizViewProps {
  cluster: CareerCluster
  onComplete: (score: number) => void
  onBack: () => void
}

function QuizView({ cluster, onComplete, onBack }: QuizViewProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  
  const question = cluster.quiz[currentQuestion]
  const isLastQuestion = currentQuestion === cluster.quiz.length - 1

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, question.scores[optionIndex]]
    setAnswers(newAnswers)

    if (isLastQuestion) {
      const totalScore = newAnswers.reduce((a, b) => a + b, 0)
      const maxScore = cluster.quiz.reduce((sum, q) => sum + Math.max(...q.scores), 0)
      const percentage = Math.round((totalScore / maxScore) * 100)
      onComplete(percentage)
    } else {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="p-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{cluster.icon}</span>
            <h2 className="text-2xl font-bold text-gray-900">
              Would You Thrive in {cluster.name}?
            </h2>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span>Question {currentQuestion + 1} of {cluster.quiz.length}</span>
              <span className="text-gray-600">
                {Math.round(((currentQuestion + 1) / cluster.quiz.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / cluster.quiz.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {question.question}
          </h3>

          <div className="grid gap-3">
            {question.options.map((option, idx) => (
              <Button
                key={idx}
                variant="outline"
                className="h-auto py-4 px-6 text-left justify-start hover:bg-blue-50 hover:border-blue-300"
                onClick={() => handleAnswer(idx)}
              >
                <span className="text-base">{option}</span>
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// Day in Life View Component
interface DayInLifeViewProps {
  cluster: CareerCluster
  onComplete: (score: number) => void
  onBack: () => void
}

function DayInLifeView({ cluster, onComplete, onBack }: DayInLifeViewProps) {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [showOutcome, setShowOutcome] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState<{
    text: string
    outcome: string
    score: number
  } | null>(null)

  const scenario = cluster.dayInLife[currentScenario]
  const isLastScenario = currentScenario === cluster.dayInLife.length - 1

  const handleChoice = (choice: typeof scenario.choices[0]) => {
    setSelectedChoice(choice)
    setShowOutcome(true)
    setTotalScore(totalScore + choice.score)
  }

  const handleNext = () => {
    if (isLastScenario) {
      const maxScore = cluster.dayInLife.reduce(
        (sum, s) => sum + Math.max(...s.choices.map(c => c.score)), 
        0
      )
      const percentage = Math.round((totalScore / maxScore) * 100)
      onComplete(percentage)
    } else {
      setCurrentScenario(currentScenario + 1)
      setShowOutcome(false)
      setSelectedChoice(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="p-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{cluster.icon}</span>
            <h2 className="text-2xl font-bold text-gray-900">
              A Day in the Life: {cluster.name}
            </h2>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span>Scenario {currentScenario + 1} of {cluster.dayInLife.length}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-600"
                initial={{ width: 0 }}
                animate={{ width: `${((currentScenario + 1) / cluster.dayInLife.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Scenario:
            </h3>
            <p className="text-gray-700">
              {scenario.scenario}
            </p>
          </div>

          {!showOutcome ? (
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">
                What would you do?
              </h4>
              <div className="grid gap-3">
                {scenario.choices.map((choice, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="h-auto py-4 px-6 text-left justify-start hover:bg-green-50 hover:border-green-300"
                    onClick={() => handleChoice(choice)}
                  >
                    <span className="text-base">{choice.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">
                  Your Choice:
                </h4>
                <p className="text-gray-700 mb-4">
                  {selectedChoice?.text}
                </p>
                <div className="border-t border-green-200 pt-4">
                  <h4 className="font-semibold text-green-900 mb-2">
                    Outcome:
                  </h4>
                  <p className="text-gray-700">
                    {selectedChoice?.outcome}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${
                          i <= (selectedChoice?.score || 0)
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {selectedChoice?.score === 3 && 'Excellent choice!'}
                    {selectedChoice?.score === 2 && 'Good approach!'}
                    {selectedChoice?.score === 1 && 'Could be improved'}
                    {selectedChoice?.score === 0 && 'Not ideal'}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleNext}
                className="w-full"
                size="lg"
              >
                {isLastScenario ? 'See Results' : 'Next Scenario →'}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
