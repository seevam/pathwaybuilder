'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Clock, Target, Users, GraduationCap, Sparkles, Trophy, BookOpen } from 'lucide-react';

// Step 1: Welcome Screen
function WelcomeStep({ onNext, onSkip, userName }: { onNext: () => void; onSkip: () => void; userName: string }) {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">
          👋 Welcome, {userName}!
        </h1>
        <p className="text-xl text-gray-600">
          Let's get to know you so we can personalize your journey through the platform.
        </p>
      </div>

      {/* Video Player */}
      <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-green-50">
        <div className="aspect-video flex items-center justify-center bg-gray-100">
          <div className="text-center space-y-4 p-8">
            <div className="text-6xl">🎬</div>
            <div className="text-gray-600">
              <div className="font-semibold mb-2">What to Expect: Your Career Discovery Journey</div>
              <div className="text-sm">90-second overview video</div>
            </div>
            <Button variant="outline" size="lg">
              ▶ Play Video
            </Button>
          </div>
        </div>
      </Card>

      {/* Key Points */}
      <div className="bg-white rounded-xl p-8 border border-gray-200 space-y-4">
        <h3 className="font-bold text-lg mb-4">In this program, you'll:</h3>
        <div className="space-y-3">
          {[
            { icon: '✨', text: 'Discover your strengths, values, and interests' },
            { icon: '🗺️', text: 'Explore careers that match who you are' },
            { icon: '🚀', text: 'Build a signature project for your college apps' },
            { icon: '💼', text: 'Create your professional digital identity' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-gray-700 pt-1">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-blue-50 rounded-xl p-6 text-center">
        <div className="text-sm text-gray-600 mb-1">Timeline</div>
        <div className="text-2xl font-bold text-blue-600">3-4 months</div>
        <div className="text-sm text-gray-600 mt-1">Most students complete the 6 modules in this timeframe</div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button size="lg" onClick={onNext} className="text-lg px-8">
          Let's Get Started →
        </Button>
        <Button size="lg" variant="ghost" onClick={onSkip}>
          Skip →
        </Button>
      </div>
    </div>
  );
}

// Step 2: Goal Selection
function GoalSelectionStep({ onNext, onBack, selectedGoals, setSelectedGoals }: any) {
  const goals = [
    { id: 'find_passion', icon: '❤️', label: 'Find my passion and interests' },
    { id: 'explore_careers', icon: '🔍', label: 'Explore career options' },
    { id: 'build_profile', icon: '📋', label: 'Build a strong college profile' },
    { id: 'develop_project', icon: '🎨', label: 'Develop a signature project' },
    { id: 'prepare_college', icon: '🎓', label: 'Prepare for college apps' },
    { id: 'stand_out', icon: '⭐', label: 'Stand out in college applications' },
  ];

  const [otherGoal, setOtherGoal] = useState('');

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev: string[]) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleNext = () => {
    if (selectedGoals.length > 0 || otherGoal.trim()) {
      onNext();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">
          What are you hoping to achieve?
        </h2>
        <p className="text-lg text-gray-600">
          Select all that apply - we'll personalize your experience
        </p>
      </div>

      {/* Goal Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            className={`
              p-6 rounded-xl border-2 text-left transition-all
              ${
                selectedGoals.includes(goal.id)
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
              }
            `}
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">{goal.icon}</div>
              <div className="flex-1">
                <div className="font-semibold">{goal.label}</div>
              </div>
              {selectedGoals.includes(goal.id) && (
                <CheckCircle2 className="w-6 h-6 text-blue-500" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Other Option */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl">💡</span>
          <div className="flex-1">
            <label className="font-semibold block mb-2">Other:</label>
            <input
              type="text"
              value={otherGoal}
              onChange={(e) => setOtherGoal(e.target.value)}
              placeholder="Tell us what else you'd like to achieve..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Selection Counter */}
      <div className="text-center text-gray-600">
        {selectedGoals.length > 0 ? (
          <span className="text-blue-600 font-semibold">{selectedGoals.length} goal{selectedGoals.length !== 1 ? 's' : ''} selected</span>
        ) : (
          <span>Select at least one goal to continue</span>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-4 justify-between pt-4">
        <Button size="lg" variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <Button 
          size="lg" 
          onClick={handleNext}
          disabled={selectedGoals.length === 0 && !otherGoal.trim()}
        >
          Continue →
        </Button>
      </div>
    </div>
  );
}

// Step 3: Assessment Assignment
function AssessmentStep({ onNext, onBack, onSkip }: any) {
  const assessments = [
    {
      id: 'riasec',
      title: 'RIASEC Career Interest Test',
      icon: '📊',
      time: '15-20 minutes',
      description: 'Discover which career clusters match your interests',
      status: 'Not Started'
    },
    {
      id: 'disc',
      title: 'DISC Personality Profile',
      icon: '🎯',
      time: '10-15 minutes',
      description: 'Understand your communication and work style',
      status: 'Not Started'
    },
    {
      id: 'typefinder',
      title: 'TypeFinder Workplace',
      icon: '💼',
      time: '12-18 minutes',
      description: 'Learn your 16 personality type for career fit',
      status: 'Not Started'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">
          Before we begin, take 3 quick assessments
        </h2>
        <p className="text-lg text-gray-600">
          These will help us personalize your experience and give you insights into your personality, interests, and strengths.
        </p>
      </div>

      {/* Assessment Cards */}
      <div className="space-y-4">
        {assessments.map((assessment) => (
          <Card key={assessment.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="text-5xl">{assessment.icon}</div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-bold">{assessment.title}</h3>
                <p className="text-gray-600">{assessment.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Time: {assessment.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    {assessment.status}
                  </div>
                </div>
              </div>
              <Button variant="outline">
                Take Assessment →
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Pro Tip */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex gap-3">
          <span className="text-2xl">⚡</span>
          <div>
            <div className="font-semibold mb-1">Pro Tip:</div>
            <div className="text-sm text-gray-700">
              Take these when you're in a good mood and have uninterrupted time. 
              Be honest - there are no wrong answers!
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between pt-4">
        <Button size="lg" variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <div className="flex gap-4">
          <Button size="lg" variant="ghost" onClick={onSkip}>
            I'll Complete These Later
          </Button>
          <Button size="lg" onClick={onNext}>
            Start First Test →
          </Button>
        </div>
      </div>
    </div>
  );
}

// Step 4: Completion
function CompletionStep({ onFinish, userName }: { onFinish: () => void; userName: string }) {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Celebration */}
      <div className="text-center space-y-6">
        <div className="text-7xl animate-bounce">🎉</div>
        <h2 className="text-4xl md:text-5xl font-bold">
          You're All Set!
        </h2>
        <p className="text-xl text-gray-600">
          Your dashboard is ready. Here's what happens next:
        </p>
      </div>

      {/* Next Steps */}
      <div className="space-y-4">
        {[
          {
            number: '1️⃣',
            title: 'Complete Your Assessments',
            description: 'Results unlock personalized recommendations',
            progress: 'Progress: 2/3 Complete',
            color: 'bg-blue-50 border-blue-200'
          },
          {
            number: '2️⃣',
            title: 'Start Module 1: Know Yourself',
            description: 'Explore your strengths, values, and identity',
            time: 'Estimated time: 2-3 weeks',
            color: 'bg-green-50 border-green-200'
          },
          {
            number: '3️⃣',
            title: 'Build Your Profile & Project',
            description: 'Create deliverables for your college apps',
            unlock: 'Unlock: After Module 5',
            color: 'bg-purple-50 border-purple-200'
          }
        ].map((step, idx) => (
          <Card key={idx} className={`p-6 border-2 ${step.color}`}>
            <div className="flex gap-4">
              <span className="text-3xl">{step.number}</span>
              <div className="flex-1 space-y-1">
                <h3 className="font-bold text-lg">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {step.progress && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-600">{step.progress}</span>
                  </div>
                )}
                {step.time && (
                  <div className="text-sm text-gray-600 flex items-center gap-1 mt-2">
                    <Clock className="w-4 h-4" />
                    {step.time}
                  </div>
                )}
                {step.unlock && (
                  <div className="text-sm text-gray-600 mt-2">
                    🔒 {step.unlock}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Help Resources */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="text-center space-y-3">
          <div className="font-semibold">Need help?</div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" size="sm">
              📖 Quick Start Guide
            </Button>
            <Button variant="outline" size="sm">
              💬 Chat with Support
            </Button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Button size="lg" onClick={onFinish} className="text-lg px-8">
          Go to My Dashboard →
        </Button>
      </div>
    </div>
  );
}

// Main Onboarding Component
export default function OnboardingFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const userName = "Sarah"; // This should come from auth context

  const steps = [
    { title: 'Welcome', component: WelcomeStep },
    { title: 'Goals', component: GoalSelectionStep },
    { title: 'Assessments', component: AssessmentStep },
    { title: 'Complete', component: CompletionStep }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setCurrentStep(steps.length - 1);
  };

  const handleFinish = async () => {
    // Save onboarding data to database
    // await saveOnboardingData({ goals: selectedGoals });
    router.push('/dashboard');
  };

  const StepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Progress Bar */}
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </div>
            {currentStep < steps.length - 1 && (
              <button 
                onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Skip →
              </button>
            )}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <StepComponent
          onNext={handleNext}
          onBack={handleBack}
          onSkip={handleSkip}
          onFinish={handleFinish}
          userName={userName}
          selectedGoals={selectedGoals}
          setSelectedGoals={setSelectedGoals}
        />
      </div>
    </div>
  );
}
