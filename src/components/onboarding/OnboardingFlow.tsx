'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2, BookOpen, GraduationCap, Rocket, Sparkles,
  Calculator, Binary, Atom, Flask, Dna, BookText, Globe2,
  Landmark, TrendingUp, Brain, Briefcase, Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Feature = 'CAREER_EXPLORATION' | 'IB_LEARNING' | 'PASSION_PROJECT';

interface OnboardingData {
  selectedFeature: Feature | null;
  grade: string;
  careerGoals?: string[];
  weeklyCommitment?: string;
  ibSubjects?: string[];
  examDate?: string;
  studyStyle?: string;
  projectType?: string[];
  projectStage?: string;
  primaryGoal: string;
  xpEarned: number;
}

// XP Counter Component
function XPCounter({ xp, animate }: { xp: number; animate?: boolean }) {
  return (
    <motion.div
      className="fixed top-6 right-6 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-xl font-black text-lg"
      initial={{ scale: 1 }}
      animate={animate ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5" />
        <span>{xp} XP</span>
      </div>
    </motion.div>
  );
}

// Floating XP Animation
function FloatingXP({ amount, onComplete }: { amount: number; onComplete: () => void }) {
  return (
    <motion.div
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-black text-yellow-500 z-50 pointer-events-none"
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={{ opacity: [0, 1, 1, 0], y: -100, scale: [0.5, 1.2, 1] }}
      transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1] }}
      onAnimationComplete={onComplete}
    >
      +{amount} XP
    </motion.div>
  );
}

// Pathway Pat Mascot
function PathwayPat({ mood = 'happy' }: { mood?: 'happy' | 'thinking' | 'celebrating' }) {
  const emojis = {
    happy: '🎓',
    thinking: '🤔',
    celebrating: '🎉'
  };

  return (
    <motion.div
      className="text-8xl"
      animate={{
        rotate: mood === 'celebrating' ? [0, -10, 10, -10, 10, 0] : 0,
        scale: mood === 'celebrating' ? [1, 1.1, 1] : 1
      }}
      transition={{ duration: 0.5 }}
    >
      {emojis[mood]}
    </motion.div>
  );
}

// Step 1: Feature Selection
function FeatureSelectionStep({
  onNext,
  selectedFeature,
  setSelectedFeature
}: {
  onNext: () => void;
  selectedFeature: Feature | null;
  setSelectedFeature: (feature: Feature) => void;
}) {
  const features = [
    {
      id: 'CAREER_EXPLORATION' as Feature,
      icon: BookOpen,
      emoji: '🎯',
      title: 'Career Exploration',
      description: 'Discover your strengths & find your dream career',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverBorder: 'hover:border-blue-500'
    },
    {
      id: 'IB_LEARNING' as Feature,
      icon: GraduationCap,
      emoji: '🎓',
      title: 'Exam Prep',
      description: 'Master IB subjects with AI tutoring and practice',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      hoverBorder: 'hover:border-purple-500'
    },
    {
      id: 'PASSION_PROJECT' as Feature,
      icon: Rocket,
      emoji: '🚀',
      title: 'Passion Projects',
      description: 'Build projects that stand out in applications',
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      hoverBorder: 'hover:border-orange-500'
    }
  ];

  return (
    <motion.div
      className="max-w-6xl mx-auto space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Mascot and Title */}
      <div className="text-center space-y-4">
        <PathwayPat mood="happy" />
        <h1 className="text-4xl md:text-5xl font-black text-gray-900">
          Welcome to Pathway Builder! 👋
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Let&apos;s find your perfect path. Choose what you want to focus on first:
        </p>
        <p className="text-sm text-gray-500">(You can explore the others anytime)</p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isSelected = selectedFeature === feature.id;

          return (
            <motion.button
              key={feature.id}
              onClick={() => setSelectedFeature(feature.id)}
              className={`
                relative p-8 rounded-3xl border-4 text-left transition-all
                ${isSelected
                  ? `${feature.borderColor.replace('border-', 'border-')} ${feature.bgColor} shadow-2xl scale-105`
                  : `border-gray-200 bg-white ${feature.hoverBorder} hover:shadow-xl`
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Emoji Icon */}
              <div className="text-6xl mb-4">{feature.emoji}</div>

              {/* Title */}
              <h3 className="text-2xl font-black text-gray-900 mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-6">
                {feature.description}
              </p>

              {/* Check Mark */}
              {isSelected && (
                <motion.div
                  className="absolute top-6 right-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="text-center pt-4">
        <Button
          size="lg"
          onClick={onNext}
          disabled={!selectedFeature}
          className="text-lg px-12 py-6 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50"
        >
          Continue →
        </Button>
      </div>
    </motion.div>
  );
}

// Step 2: Grade Selection
function GradeSelectionStep({
  onNext,
  onBack,
  grade,
  setGrade
}: {
  onNext: () => void;
  onBack: () => void;
  grade: string;
  setGrade: (grade: string) => void;
}) {
  const grades = [
    { value: '9th', label: '9th Grade', emoji: '📚' },
    { value: '10th', label: '10th Grade', emoji: '📖' },
    { value: '11th', label: '11th Grade', emoji: '📝' },
    { value: '12th', label: '12th Grade', emoji: '🎓' },
    { value: 'gap', label: 'Gap Year', emoji: '🌍' },
    { value: 'other', label: 'Other', emoji: '✨' }
  ];

  return (
    <motion.div
      className="max-w-3xl mx-auto space-y-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="text-6xl">🌟</div>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900">
          Great choice! Now let&apos;s get to know you
        </h2>
        <p className="text-xl text-gray-600">What grade are you in?</p>
      </div>

      {/* Grade Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {grades.map((g) => (
          <button
            key={g.value}
            onClick={() => setGrade(g.value)}
            className={`
              p-6 rounded-2xl border-3 transition-all text-center
              ${grade === g.value
                ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
              }
            `}
          >
            <div className="text-4xl mb-2">{g.emoji}</div>
            <div className="font-bold text-gray-900">{g.label}</div>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-4 justify-between pt-4">
        <Button size="lg" variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <Button
          size="lg"
          onClick={onNext}
          disabled={!grade}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50"
        >
          Continue →
        </Button>
      </div>
    </motion.div>
  );
}

// Step 3A: Career Questions
function CareerQuestionsStep({
  onNext,
  onBack,
  careerGoals,
  setCareerGoals,
  weeklyCommitment,
  setWeeklyCommitment
}: any) {
  const [questionIndex, setQuestionIndex] = useState(0);

  const goals = [
    { id: 'passion', label: 'Discovering my passions and interests', emoji: '💭' },
    { id: 'fit', label: 'Finding careers that fit who I am', emoji: '🎯' },
    { id: 'profile', label: 'Building a strong college profile', emoji: '📋' },
    { id: 'project', label: 'Creating a signature project', emoji: '🎨' }
  ];

  const commitments = [
    { value: '1-2', label: '1-2 hours', subtitle: 'Casual pace', emoji: '🚶' },
    { value: '3-5', label: '3-5 hours', subtitle: 'Balanced', emoji: '🏃' },
    { value: '5+', label: '5+ hours', subtitle: 'Full commitment', emoji: '🚀' }
  ];

  const toggleGoal = (goalId: string) => {
    setCareerGoals((prev: string[]) =>
      prev.includes(goalId) ? prev.filter(id => id !== goalId) : [...prev, goalId]
    );
  };

  if (questionIndex === 0) {
    return (
      <motion.div
        className="max-w-3xl mx-auto space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center space-y-4">
          <div className="text-6xl">💭</div>
          <h2 className="text-3xl font-black text-gray-900">
            What excites you most about career exploration?
          </h2>
          <p className="text-gray-600">Pick all that apply!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`
                p-6 rounded-2xl border-3 text-left transition-all
                ${careerGoals.includes(goal.id)
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                }
              `}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{goal.emoji}</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{goal.label}</div>
                </div>
                {careerGoals.includes(goal.id) && (
                  <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-4 justify-between pt-4">
          <Button size="lg" variant="outline" onClick={onBack}>
            ← Back
          </Button>
          <Button
            size="lg"
            onClick={() => setQuestionIndex(1)}
            disabled={careerGoals.length === 0}
            className="bg-gradient-to-r from-blue-500 to-blue-600"
          >
            Next Question →
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-center space-y-4">
        <div className="text-6xl">⏰</div>
        <h2 className="text-3xl font-black text-gray-900">
          How much time can you dedicate per week?
        </h2>
      </div>

      <div className="space-y-4">
        {commitments.map((c) => (
          <button
            key={c.value}
            onClick={() => setWeeklyCommitment(c.value)}
            className={`
              w-full p-6 rounded-2xl border-3 text-left transition-all
              ${weeklyCommitment === c.value
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{c.emoji}</span>
              <div className="flex-1">
                <div className="font-bold text-xl text-gray-900">{c.label}</div>
                <div className="text-gray-600">{c.subtitle}</div>
              </div>
              {weeklyCommitment === c.value && (
                <CheckCircle2 className="w-6 h-6 text-blue-500" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-4 justify-between pt-4">
        <Button size="lg" variant="outline" onClick={() => setQuestionIndex(0)}>
          ← Back
        </Button>
        <Button
          size="lg"
          onClick={onNext}
          disabled={!weeklyCommitment}
          className="bg-gradient-to-r from-blue-500 to-blue-600"
        >
          Continue →
        </Button>
      </div>
    </motion.div>
  );
}

// Step 3B: Exam Prep Questions
function ExamPrepQuestionsStep({
  onNext,
  onBack,
  ibSubjects,
  setIbSubjects,
  examDate,
  setExamDate,
  studyStyle,
  setStudyStyle
}: any) {
  const [questionIndex, setQuestionIndex] = useState(0);

  const subjects = [
    { id: 'math-aa', label: 'Math AA', icon: Calculator, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { id: 'math-ai', label: 'Math AI', icon: Binary, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { id: 'physics', label: 'Physics', icon: Atom, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { id: 'chemistry', label: 'Chemistry', icon: Flask, color: 'text-green-600', bgColor: 'bg-green-50' },
    { id: 'biology', label: 'Biology', icon: Dna, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { id: 'english-a', label: 'English A', icon: BookText, color: 'text-red-600', bgColor: 'bg-red-50' },
    { id: 'english-b', label: 'English B', icon: BookOpen, color: 'text-pink-600', bgColor: 'bg-pink-50' },
    { id: 'history', label: 'History', icon: Landmark, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    { id: 'economics', label: 'Economics', icon: TrendingUp, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { id: 'psychology', label: 'Psychology', icon: Brain, color: 'text-violet-600', bgColor: 'bg-violet-50' },
    { id: 'business', label: 'Business', icon: Briefcase, color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
    { id: 'cs', label: 'Computer Science', icon: Code, color: 'text-slate-600', bgColor: 'bg-slate-50' }
  ];

  const examDates = [
    { value: 'may-2025', label: 'May 2025', emoji: '🌸' },
    { value: 'nov-2025', label: 'November 2025', emoji: '🍂' },
    { value: 'may-2026', label: 'May 2026', emoji: '🌺' },
    { value: 'nov-2026', label: 'November 2026', emoji: '🍁' },
    { value: 'exploring', label: 'Just exploring', emoji: '🔍' }
  ];

  const studyStyles = [
    { value: 'daily', label: 'Consistent daily practice', subtitle: 'Recommended', emoji: '📅' },
    { value: 'weekend', label: 'Weekend warrior', subtitle: 'Study in batches', emoji: '📆' },
    { value: 'sprint', label: 'Last-minute sprint', subtitle: 'We\'ve all been there!', emoji: '⏱️' },
    { value: 'figuring', label: 'Still figuring it out', subtitle: 'No worries!', emoji: '🤔' }
  ];

  const toggleSubject = (subjectId: string) => {
    setIbSubjects((prev: string[]) =>
      prev.includes(subjectId) ? prev.filter(id => id !== subjectId) : [...prev, subjectId]
    );
  };

  if (questionIndex === 0) {
    return (
      <motion.div className="max-w-4xl mx-auto space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-center space-y-4">
          <div className="text-6xl">📚</div>
          <h2 className="text-3xl font-black text-gray-900">Which IB subjects are you taking?</h2>
          <p className="text-gray-600">Select all that apply</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {subjects.map((subject) => {
            const Icon = subject.icon;
            return (
              <button
                key={subject.id}
                onClick={() => toggleSubject(subject.id)}
                className={`
                  p-4 rounded-xl border-3 text-center transition-all relative
                  ${ibSubjects.includes(subject.id)
                    ? `border-purple-500 ${subject.bgColor} shadow-lg`
                    : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                  }
                `}
              >
                <div className={`flex justify-center mb-2 ${ibSubjects.includes(subject.id) ? 'text-purple-600' : subject.color}`}>
                  <Icon className="w-8 h-8" strokeWidth={2.5} />
                </div>
                <div className="text-sm font-semibold text-gray-900">{subject.label}</div>
                {ibSubjects.includes(subject.id) && (
                  <CheckCircle2 className="w-4 h-4 text-purple-500 mx-auto mt-1" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex gap-4 justify-between pt-4">
          <Button size="lg" variant="outline" onClick={onBack}>← Back</Button>
          <Button
            size="lg"
            onClick={() => setQuestionIndex(1)}
            disabled={ibSubjects.length === 0}
            className="bg-gradient-to-r from-purple-500 to-purple-600"
          >
            Next Question →
          </Button>
        </div>
      </motion.div>
    );
  }

  if (questionIndex === 1) {
    return (
      <motion.div className="max-w-3xl mx-auto space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-center space-y-4">
          <div className="text-6xl">🗓️</div>
          <h2 className="text-3xl font-black text-gray-900">When&#39;s your IB exam?</h2>
        </div>

        <div className="space-y-3">
          {examDates.map((date) => (
            <button
              key={date.value}
              onClick={() => setExamDate(date.value)}
              className={`
                w-full p-5 rounded-xl border-3 text-left transition-all
                ${examDate === date.value
                  ? 'border-purple-500 bg-purple-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-purple-300'
                }
              `}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{date.emoji}</span>
                <div className="flex-1 font-bold text-lg text-gray-900">{date.label}</div>
                {examDate === date.value && <CheckCircle2 className="w-6 h-6 text-purple-500" />}
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-4 justify-between pt-4">
          <Button size="lg" variant="outline" onClick={() => setQuestionIndex(0)}>← Back</Button>
          <Button
            size="lg"
            onClick={() => setQuestionIndex(2)}
            disabled={!examDate}
            className="bg-gradient-to-r from-purple-500 to-purple-600"
          >
            Next Question →
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="max-w-3xl mx-auto space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="text-center space-y-4">
        <div className="text-6xl">🧠</div>
        <h2 className="text-3xl font-black text-gray-900">What&#39;s your study style?</h2>
      </div>

      <div className="space-y-3">
        {studyStyles.map((style) => (
          <button
            key={style.value}
            onClick={() => setStudyStyle(style.value)}
            className={`
              w-full p-5 rounded-xl border-3 text-left transition-all
              ${studyStyle === style.value
                ? 'border-purple-500 bg-purple-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-purple-300'
              }
            `}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{style.emoji}</span>
              <div className="flex-1">
                <div className="font-bold text-lg text-gray-900">{style.label}</div>
                <div className="text-sm text-gray-600">{style.subtitle}</div>
              </div>
              {studyStyle === style.value && <CheckCircle2 className="w-6 h-6 text-purple-500" />}
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-4 justify-between pt-4">
        <Button size="lg" variant="outline" onClick={() => setQuestionIndex(1)}>← Back</Button>
        <Button
          size="lg"
          onClick={onNext}
          disabled={!studyStyle}
          className="bg-gradient-to-r from-purple-500 to-purple-600"
        >
          Continue →
        </Button>
      </div>
    </motion.div>
  );
}

// Step 3C: Passion Projects Questions
function PassionProjectsQuestionsStep({
  onNext,
  onBack,
  projectType,
  setProjectType,
  projectStage,
  setProjectStage
}: any) {
  const [questionIndex, setQuestionIndex] = useState(0);

  const types = [
    { id: 'creative', label: 'Creative', description: 'Art, Design, Writing', emoji: '🎨' },
    { id: 'tech', label: 'Technology', description: 'Apps, Websites, Coding', emoji: '💻' },
    { id: 'social', label: 'Social Impact', description: 'Community, Nonprofit', emoji: '🌍' },
    { id: 'research', label: 'Research', description: 'Science, Analysis', emoji: '🔬' },
    { id: 'business', label: 'Business', description: 'Entrepreneurship, Startup', emoji: '💼' },
    { id: 'other', label: 'Other', description: 'Something unique', emoji: '✨' }
  ];

  const stages = [
    { value: 'brainstorm', label: 'Just brainstorming ideas', emoji: '💭' },
    { value: 'planning', label: 'Planning my project', emoji: '📝' },
    { value: 'building', label: 'Building it now', emoji: '🔨' },
    { value: 'finishing', label: 'Almost finished', emoji: '🎯' },
    { value: 'first', label: 'Looking for my first project', emoji: '🚀' }
  ];

  const toggleType = (typeId: string) => {
    setProjectType((prev: string[]) =>
      prev.includes(typeId) ? prev.filter(id => id !== typeId) : [...prev, typeId]
    );
  };

  if (questionIndex === 0) {
    return (
      <motion.div className="max-w-3xl mx-auto space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-center space-y-4">
          <div className="text-6xl">🎨</div>
          <h2 className="text-3xl font-black text-gray-900">What type of project interests you?</h2>
          <p className="text-gray-600">Pick all that apply!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {types.map((type) => (
            <button
              key={type.id}
              onClick={() => toggleType(type.id)}
              className={`
                p-6 rounded-2xl border-3 text-left transition-all
                ${projectType.includes(type.id)
                  ? 'border-orange-500 bg-orange-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-orange-300'
                }
              `}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{type.emoji}</span>
                <div className="flex-1">
                  <div className="font-bold text-lg text-gray-900">{type.label}</div>
                  <div className="text-sm text-gray-600">{type.description}</div>
                </div>
                {projectType.includes(type.id) && (
                  <CheckCircle2 className="w-6 h-6 text-orange-500 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-4 justify-between pt-4">
          <Button size="lg" variant="outline" onClick={onBack}>← Back</Button>
          <Button
            size="lg"
            onClick={() => setQuestionIndex(1)}
            disabled={projectType.length === 0}
            className="bg-gradient-to-r from-orange-500 to-orange-600"
          >
            Next Question →
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="max-w-3xl mx-auto space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="text-center space-y-4">
        <div className="text-6xl">🚀</div>
        <h2 className="text-3xl font-black text-gray-900">Where are you in your project journey?</h2>
      </div>

      <div className="space-y-3">
        {stages.map((stage) => (
          <button
            key={stage.value}
            onClick={() => setProjectStage(stage.value)}
            className={`
              w-full p-5 rounded-xl border-3 text-left transition-all
              ${projectStage === stage.value
                ? 'border-orange-500 bg-orange-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-orange-300'
              }
            `}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{stage.emoji}</span>
              <div className="flex-1 font-bold text-lg text-gray-900">{stage.label}</div>
              {projectStage === stage.value && <CheckCircle2 className="w-6 h-6 text-orange-500" />}
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-4 justify-between pt-4">
        <Button size="lg" variant="outline" onClick={() => setQuestionIndex(0)}>← Back</Button>
        <Button
          size="lg"
          onClick={onNext}
          disabled={!projectStage}
          className="bg-gradient-to-r from-orange-500 to-orange-600"
        >
          Continue →
        </Button>
      </div>
    </motion.div>
  );
}

// Step 4: Universal Goal
function UniversalGoalStep({ onNext, onBack, primaryGoal, setPrimaryGoal }: any) {
  const goals = [
    { value: 'college', label: 'Get into my dream college', emoji: '🎓' },
    { value: 'grades', label: 'Improve my grades significantly', emoji: '📈' },
    { value: 'portfolio', label: 'Build an impressive portfolio', emoji: '📂' },
    { value: 'passion', label: 'Discover what I\'m passionate about', emoji: '💡' },
    { value: 'standout', label: 'Stand out in college applications', emoji: '⭐' },
    { value: 'career', label: 'Prepare for my future career', emoji: '🚀' }
  ];

  return (
    <motion.div
      className="max-w-3xl mx-auto space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-center space-y-4">
        <div className="text-6xl">🎯</div>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900">
          One last thing! What&#39;s your biggest goal?
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <button
            key={goal.value}
            onClick={() => setPrimaryGoal(goal.value)}
            className={`
              p-6 rounded-2xl border-3 text-left transition-all
              ${primaryGoal === goal.value
                ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{goal.emoji}</span>
              <div className="flex-1 font-bold text-lg text-gray-900">{goal.label}</div>
              {primaryGoal === goal.value && <CheckCircle2 className="w-6 h-6 text-green-500" />}
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-4 justify-between pt-4">
        <Button size="lg" variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <Button
          size="lg"
          onClick={onNext}
          disabled={!primaryGoal}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          Continue →
        </Button>
      </div>
    </motion.div>
  );
}

// Step 5: Celebration
function CelebrationStep({ onFinish, totalXP, selectedFeature }: any) {
  const featureMessages = {
    CAREER_EXPLORATION: 'Career discovery modules',
    IB_LEARNING: 'Exam prep materials',
    PASSION_PROJECT: 'Project building tools'
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto space-y-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Celebration */}
      <div className="text-center space-y-6">
        <PathwayPat mood="celebrating" />
        <motion.h2
          className="text-4xl md:text-5xl font-black text-gray-900"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.5, repeat: 2 }}
        >
          You&#39;re All Set! 🎉
        </motion.h2>
        <p className="text-xl text-gray-600">Your personalized dashboard is ready</p>
      </div>

      {/* XP Summary */}
      <Card className="p-8 bg-gradient-to-br from-yellow-50 to-orange-50 border-3 border-yellow-300">
        <div className="text-center space-y-4">
          <div className="text-6xl">🏆</div>
          <div>
            <div className="text-5xl font-black text-gray-900 mb-2">{totalXP} XP</div>
            <div className="text-lg text-gray-600">You earned during onboarding!</div>
          </div>
          <div className="bg-gray-200 h-4 rounded-full overflow-hidden max-w-md mx-auto">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${(totalXP / 100) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <div className="text-sm font-semibold text-gray-600">Level 1 - {totalXP}/100 XP</div>
        </div>
      </Card>

      {/* What's Next */}
      <Card className="p-6 border-2 border-gray-200">
        <h3 className="font-black text-xl text-gray-900 mb-4">✨ What&#39;s waiting for you:</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">✓</span>
            </div>
            <div>
              <div className="font-semibold text-gray-900">{featureMessages[selectedFeature as keyof typeof featureMessages]}</div>
              <div className="text-sm text-gray-600">Ready to explore</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">✓</span>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Pathway Pat AI Tutor</div>
              <div className="text-sm text-gray-600">Available 24/7 to help</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">✓</span>
            </div>
            <div>
              <div className="font-semibold text-gray-900">XP & Achievement System</div>
              <div className="text-sm text-gray-600">Earn rewards as you learn</div>
            </div>
          </div>
        </div>
      </Card>

      {/* CTA */}
      <div className="text-center pt-4">
        <Button
          size="lg"
          onClick={onFinish}
          className="text-lg px-12 py-6 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-xl hover:shadow-2xl"
        >
          Go to My Dashboard →
        </Button>
      </div>
    </motion.div>
  );
}

// Main Onboarding Component
export default function OnboardingFlow({ userName = 'there' }: { userName?: string }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [lastXPGain, setLastXPGain] = useState(0);
  const [animateXPCounter, setAnimateXPCounter] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const [data, setData] = useState<OnboardingData>({
    selectedFeature: null,
    grade: '',
    careerGoals: [],
    weeklyCommitment: '',
    ibSubjects: [],
    examDate: '',
    studyStyle: '',
    projectType: [],
    projectStage: '',
    primaryGoal: '',
    xpEarned: 0
  });

  const awardXP = (amount: number) => {
    setLastXPGain(amount);
    setShowXPAnimation(true);
    setData(prev => ({ ...prev, xpEarned: prev.xpEarned + amount }));
    setAnimateXPCounter(true);
    setTimeout(() => setAnimateXPCounter(false), 300);
  };

  const handleNext = (xpAmount: number) => {
    // Only award XP if this step hasn't been completed before
    if (!completedSteps.has(currentStep)) {
      awardXP(xpAmount);
      setCompletedSteps(prev => new Set(prev).add(currentStep));
    }
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, 1000);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const totalSteps = 5; // 5 steps total

  const handleFinish = async () => {
    try {
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedFeature: data.selectedFeature,
          grade: data.grade,
          careerGoals: data.careerGoals,
          weeklyCommitment: data.weeklyCommitment,
          ibSubjects: data.ibSubjects,
          examDate: data.examDate,
          studyStyle: data.studyStyle,
          projectType: data.projectType,
          projectStage: data.projectStage,
          primaryGoal: data.primaryGoal,
          xpEarned: data.xpEarned
        })
      });

      if (!response.ok) throw new Error('Failed to save onboarding data');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('Failed to save your progress. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-blue-50 to-purple-50">
      {/* XP Counter */}
      <XPCounter xp={data.xpEarned} animate={animateXPCounter} />

      {/* Floating XP */}
      <AnimatePresence>
        {showXPAnimation && (
          <FloatingXP
            amount={lastXPGain}
            onComplete={() => setShowXPAnimation(false)}
          />
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-gray-600">
              Step {currentStep + 1} of {totalSteps}
            </div>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Feature Selection */}
          {currentStep === 0 && (
            <FeatureSelectionStep
              key="feature"
              onNext={() => handleNext(10)}
              selectedFeature={data.selectedFeature}
              setSelectedFeature={(feature) => setData(prev => ({ ...prev, selectedFeature: feature }))}
            />
          )}

          {/* Step 2: Grade Selection */}
          {currentStep === 1 && (
            <GradeSelectionStep
              key="grade"
              onNext={() => handleNext(15)}
              onBack={handleBack}
              grade={data.grade}
              setGrade={(grade) => setData(prev => ({ ...prev, grade }))}
            />
          )}

          {/* Step 3: Feature-Specific Questions */}
          {currentStep === 2 && data.selectedFeature === 'CAREER_EXPLORATION' && (
            <CareerQuestionsStep
              key="career"
              onNext={() => handleNext(20)}
              onBack={handleBack}
              careerGoals={data.careerGoals}
              setCareerGoals={(fn: any) => setData(prev => ({ ...prev, careerGoals: fn(prev.careerGoals) }))}
              weeklyCommitment={data.weeklyCommitment}
              setWeeklyCommitment={(wc: string) => setData(prev => ({ ...prev, weeklyCommitment: wc }))}
            />
          )}

          {currentStep === 2 && data.selectedFeature === 'IB_LEARNING' && (
            <ExamPrepQuestionsStep
              key="exam"
              onNext={() => handleNext(20)}
              onBack={handleBack}
              ibSubjects={data.ibSubjects}
              setIbSubjects={(fn: any) => setData(prev => ({ ...prev, ibSubjects: fn(prev.ibSubjects) }))}
              examDate={data.examDate}
              setExamDate={(date: string) => setData(prev => ({ ...prev, examDate: date }))}
              studyStyle={data.studyStyle}
              setStudyStyle={(style: string) => setData(prev => ({ ...prev, studyStyle: style }))}
            />
          )}

          {currentStep === 2 && data.selectedFeature === 'PASSION_PROJECT' && (
            <PassionProjectsQuestionsStep
              key="projects"
              onNext={() => handleNext(20)}
              onBack={handleBack}
              projectType={data.projectType}
              setProjectType={(fn: any) => setData(prev => ({ ...prev, projectType: fn(prev.projectType) }))}
              projectStage={data.projectStage}
              setProjectStage={(stage: string) => setData(prev => ({ ...prev, projectStage: stage }))}
            />
          )}

          {/* Step 4: Universal Goal */}
          {currentStep === 3 && (
            <UniversalGoalStep
              key="goal"
              onNext={() => handleNext(25)}
              onBack={handleBack}
              primaryGoal={data.primaryGoal}
              setPrimaryGoal={(goal: string) => setData(prev => ({ ...prev, primaryGoal: goal }))}
            />
          )}

          {/* Step 5: Celebration */}
          {currentStep === 4 && (
            <CelebrationStep
              key="celebration"
              onFinish={handleFinish}
              totalXP={data.xpEarned}
              selectedFeature={data.selectedFeature}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
