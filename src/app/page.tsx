// src/app/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Star, Zap, Trophy, Users, TrendingUp, Sparkles, Target, Award, Menu, X, GraduationCap, Rocket, BookOpen, Brain, Flame } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useAuth, useClerk } from '@clerk/nextjs';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const howItWorksRef = useRef<HTMLElement>(null);
  const { userId } = useAuth();
  const { signOut } = useClerk();
  const isSignedIn = !!userId;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Calculate scroll progress for "How It Works" section
      if (howItWorksRef.current) {
        const rect = howItWorksRef.current.getBoundingClientRect();
        const sectionHeight = howItWorksRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;

        // Calculate progress from 0 to 1 as user scrolls through the section
        const scrolled = -rect.top;
        const total = sectionHeight - viewportHeight;
        const progress = Math.max(0, Math.min(1, scrolled / total));

        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine active step based on scroll progress
  const activeStep = scrollProgress < 0.33 ? 1 : scrollProgress < 0.66 ? 2 : 3;

  // Dynamic content for each step
  const stepVisuals = {
    1: { emoji: '🎯', color: 'green' },
    2: { emoji: '🚀', color: 'blue' },
    3: { emoji: '🎓', color: 'purple' }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Glassmorphic Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="flex justify-center pt-4 px-4">
          <nav
            className={`
              flex h-16 w-full max-w-6xl items-center justify-between
              rounded-full border backdrop-blur-2xl
              px-6 transition-all duration-300
              ${isScrolled
                ? 'bg-white/90 border-white/50 shadow-2xl shadow-green-500/10'
                : 'bg-white/70 border-white/40 shadow-xl'
              }
            `}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🎓</span>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 blur-md opacity-40 -z-10" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent hidden sm:block">
                Pathway Builder
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {isSignedIn ? (
                <>
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      className="rounded-full text-sm font-semibold text-gray-700 hover:bg-white/60"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <div className="w-px h-6 bg-gray-300 mx-2" />
                  <Button
                    onClick={() => signOut()}
                    variant="ghost"
                    className="rounded-full text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button
                      variant="ghost"
                      className="rounded-full text-sm font-semibold text-gray-700 hover:bg-white/60"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button className="rounded-full text-sm font-bold text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                      Start Free
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-white/60 transition-all"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 px-4">
            <div className="bg-white/90 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl p-4 space-y-2">
              {isSignedIn ? (
                <>
                  <Link href="/dashboard" className="block">
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-2xl text-sm font-semibold text-gray-700 hover:bg-white/60"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <div className="h-px bg-gray-300 my-2" />
                  <Button
                    onClick={() => signOut()}
                    variant="ghost"
                    className="w-full justify-start rounded-2xl text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/sign-in" className="block">
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-2xl text-sm font-semibold text-gray-700 hover:bg-white/60"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up" className="block">
                    <Button className="w-full rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg">
                      Start Free
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section - Revised */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-50 via-blue-50 to-white pt-28">
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              {/* Social Proof Badge */}
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold text-sm border-2 border-green-200">
                <Users className="h-4 w-4" />
                Choice of 400,000+ students from 180+ countries
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-tight">
                All-in-One Platform for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-600 to-purple-600">
                  Student Success
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed">
                Career exploration, IB exam prep, and passion projects — everything you need to stand out and succeed. <strong>All in one place.</strong>
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">Career Discovery</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full border border-purple-200">
                  <GraduationCap className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-700">IB Learning</span>
                </div>
                <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-200">
                  <Rocket className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-700">Passion Projects</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sign-up" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                  >
                    Start Free Today
                  </Button>
                </Link>
                <Link href="/sign-in" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full rounded-2xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-lg px-8 py-6"
                  >
                    I Have an Account
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-sm font-semibold text-gray-700 ml-2">4.9/5 from students</span>
                </div>
                <div className="text-sm font-semibold text-gray-700">
                  ✓ Zero boredom guaranteed
                </div>
              </div>
            </div>

            {/* Right Column - Visual with Pathway Pat */}
            <div className="relative lg:block hidden">
              <div className="relative">
                {/* Main Visual Card */}
                <div className="relative w-full aspect-square max-w-md mx-auto rounded-3xl border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
                  {/* Mascot */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-9xl">🎓</div>
                  </div>

                  {/* Text Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-8 text-center bg-gradient-to-t from-white/90 to-transparent">
                    <div className="text-2xl font-bold text-gray-900">Meet Pathway Pat</div>
                    <div className="text-gray-600">Your AI learning companion</div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -left-8 top-1/4 bg-white rounded-2xl shadow-xl p-4 border-2 border-orange-200 transform rotate-[-5deg] transition-all hover:rotate-0 hover:scale-105">
                  <div className="flex items-center gap-3">
                    <Flame className="h-8 w-8 text-orange-500 fill-current" />
                    <div>
                      <div className="font-bold text-gray-900">14 day streak</div>
                      <div className="text-sm text-gray-500">Keep going!</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-8 top-1/2 bg-white rounded-2xl shadow-xl p-4 border-2 border-green-200 transform rotate-[5deg] transition-all hover:rotate-0 hover:scale-105">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="font-bold text-gray-900">Level Up!</div>
                      <div className="text-sm text-gray-500">Module complete</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Revision Dojo Style */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-black text-gray-900 mb-3">400K+</div>
              <div className="text-sm text-gray-600 font-medium">Active students using Pathway Builder</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-black text-gray-900 mb-3">180+</div>
              <div className="text-sm text-gray-600 font-medium">Countries represented worldwide</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-black text-gray-900 mb-3">1M+</div>
              <div className="text-sm text-gray-600 font-medium">Practice questions available</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-black text-gray-900 mb-3">24/7</div>
              <div className="text-sm text-gray-600 font-medium">AI tutor support always on</div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Main Features - Bite-Sized Cards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Three Pathways to Success
            </h2>
            <p className="text-xl text-gray-600">Choose your journey — or explore them all</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Career Exploration */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-200 rounded-3xl p-8 hover:scale-105 transition-transform cursor-pointer">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Career Exploration</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Discover your strengths, values, and passions through interactive modules. Build your unique profile and find your perfect career path.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Self-discovery assessments</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Career matching AI</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Personalized insights</span>
                </li>
              </ul>
              <Button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Explore Careers
              </Button>
            </div>

            {/* IB Learning */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-4 border-purple-200 rounded-3xl p-8 hover:scale-105 transition-transform cursor-pointer">
              <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">IB Exam Prep</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Master IB curriculum with expert-written questions, AI grading, and 24/7 tutoring. Practice smarter, score higher.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Real exam questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">AI tutor (never judges)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Detailed rubric breakdown</span>
                </li>
              </ul>
              <Button className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold">
                Start Practicing
              </Button>
            </div>

            {/* Passion Projects */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-4 border-orange-200 rounded-3xl p-8 hover:scale-105 transition-transform cursor-pointer">
              <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Passion Projects</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Build meaningful projects that showcase your unique story. Stand out in college applications with authentic work.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Project ideation tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Step-by-step guidance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Collaboration network</span>
                </li>
              </ul>
              <Button className="w-full rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold">
                Build a Project
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Methodology - 4 Pillars */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Our Methodology
            </h2>
            <p className="text-xl text-gray-600">Built on 4 pillars of student success</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Joy */}
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-green-300 hover:shadow-2xl transition-all group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-3xl">
                    😊
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-gray-900 mb-3">Joy</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Reduce stress & anxiety for all. Learning should be enjoyable, not overwhelming. We design every experience to bring joy to your educational journey.
                  </p>
                </div>
              </div>
            </div>

            {/* Outcomes */}
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-3xl">
                    🎯
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-gray-900 mb-3">Outcomes</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Improve academic outcomes for every student. Real results matter. Our methods are proven to boost performance and help you achieve your goals.
                  </p>
                </div>
              </div>
            </div>

            {/* Journey */}
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-purple-300 hover:shadow-2xl transition-all group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-3xl">
                    🚀
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-gray-900 mb-3">Journey</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Make every student&#39;s learning journey engaging and enjoyable. Progress through gamification, streaks, and rewards that keep you motivated.
                  </p>
                </div>
              </div>
            </div>

            {/* Opportunity */}
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-orange-300 hover:shadow-2xl transition-all group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-3xl">
                    💡
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-gray-900 mb-3">Opportunity</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Create innovative opportunities as the universally best IBDP study platform. Access world-class resources and tools to unlock your potential.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Scrollytelling */}
      <section ref={howItWorksRef} className="relative bg-white">
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          {/* Background decoration */}
          <div className={`absolute inset-0 transition-all duration-700 ${
            activeStep === 1 ? 'bg-gradient-to-b from-green-50/30 to-green-50/10' :
            activeStep === 2 ? 'bg-gradient-to-b from-blue-50/30 to-blue-50/10' :
            'bg-gradient-to-b from-purple-50/30 to-purple-50/10'
          }`} />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              {/* Left side - Dynamic visual */}
              <div className="relative">
                <div className="text-center">
                  <div className="text-8xl mb-8 transition-all duration-500 transform hover:scale-110" style={{
                    animation: activeStep === 1 ? 'bounce 1s infinite' :
                               activeStep === 2 ? 'pulse 2s infinite' :
                               'none'
                  }}>
                    {stepVisuals[activeStep as keyof typeof stepVisuals].emoji}
                  </div>
                  <div className="space-y-4">
                    <div className={`h-2 rounded-full transition-all duration-700 ${
                      activeStep === 1 ? 'w-full bg-gradient-to-r from-green-400 to-green-600' :
                      activeStep === 2 ? 'w-full bg-gradient-to-r from-blue-400 to-blue-600' :
                      'w-full bg-gradient-to-r from-purple-400 to-purple-600'
                    }`}></div>
                    <div className={`mx-auto h-2 rounded-full transition-all duration-700 ${
                      activeStep >= 2 ? 'w-4/5 bg-gradient-to-r from-blue-400 to-blue-600' : 'w-4/5 bg-gray-200'
                    }`}></div>
                    <div className={`mx-auto h-2 rounded-full transition-all duration-700 ${
                      activeStep >= 3 ? 'w-3/5 bg-gradient-to-r from-purple-400 to-purple-600' : 'w-3/5 bg-gray-200'
                    }`}></div>
                  </div>
                </div>
              </div>

              {/* Right side - Dynamic content */}
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                  How it works
                </h2>
                <p className="text-xl text-gray-600 mb-8">Start achieving your goals in 3 simple steps</p>

                {/* Step indicators */}
                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className={`bg-white rounded-3xl p-6 border-4 shadow-xl transition-all duration-700 ${
                    activeStep === 1
                      ? 'border-green-400 shadow-green-200/50 opacity-100 scale-105'
                      : 'border-green-200 opacity-60 scale-100'
                  }`}>
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg transition-all duration-700 ${
                        activeStep === 1
                          ? 'bg-gradient-to-br from-green-500 to-green-600 scale-110'
                          : 'bg-gradient-to-br from-green-400 to-green-500'
                      }`}>
                        1
                      </div>
                      <h3 className="text-xl font-black text-gray-900">Sign up for free</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-3">
                      Create your account in under 60 seconds. No credit card required.
                    </p>
                    {activeStep === 1 && (
                      <div className="flex flex-wrap gap-2 animate-fadeIn">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Free forever</span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">No commitment</span>
                      </div>
                    )}
                  </div>

                  {/* Step 2 */}
                  <div className={`bg-white rounded-3xl p-6 border-4 shadow-xl transition-all duration-700 ${
                    activeStep === 2
                      ? 'border-blue-400 shadow-blue-200/50 opacity-100 scale-105'
                      : 'border-blue-200 opacity-60 scale-100'
                  }`}>
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg transition-all duration-700 ${
                        activeStep === 2
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 scale-110'
                          : 'bg-gradient-to-br from-blue-400 to-blue-500'
                      }`}>
                        2
                      </div>
                      <h3 className="text-xl font-black text-gray-900">Choose your path</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Pick from Career Exploration, IB Learning, or Passion Projects.
                    </p>
                    {activeStep === 2 && (
                      <div className="flex flex-wrap gap-2 mt-3 animate-fadeIn">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">3 unique pathways</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Customize anytime</span>
                      </div>
                    )}
                  </div>

                  {/* Step 3 */}
                  <div className={`bg-white rounded-3xl p-6 border-4 shadow-xl transition-all duration-700 ${
                    activeStep === 3
                      ? 'border-purple-400 shadow-purple-200/50 opacity-100 scale-105'
                      : 'border-purple-200 opacity-60 scale-100'
                  }`}>
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg transition-all duration-700 ${
                        activeStep === 3
                          ? 'bg-gradient-to-br from-purple-500 to-purple-600 scale-110'
                          : 'bg-gradient-to-br from-purple-400 to-purple-500'
                      }`}>
                        3
                      </div>
                      <h3 className="text-xl font-black text-gray-900">Start learning</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Earn XP, build streaks, and achieve your goals.
                    </p>
                    {activeStep === 3 && (
                      <div className="flex flex-wrap gap-2 mt-3 animate-fadeIn">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">Gamified rewards</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">Track progress</span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="mt-8 text-sm text-gray-500 italic">
                  {activeStep === 1 && '👇 Scroll down to see step 2'}
                  {activeStep === 2 && '👇 Keep scrolling to see step 3'}
                  {activeStep === 3 && '✨ You\'ve completed all steps!'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll spacers for each step */}
        <div className="h-screen"></div>
        <div className="h-screen"></div>
      </section>

      {/* All Features - Revision Dojo Style */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              All Features
            </h2>
            <p className="text-xl text-gray-600">Everything you need to succeed</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Gamified Learning */}
            <div className="group bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-green-300 hover:shadow-2xl transition-all cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <div className="text-4xl">🎮</div>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Gamified Learning</h3>
              <p className="text-gray-600 leading-relaxed">
                Earn XP, build streaks, and unlock achievements as you learn. Stay motivated with rewards that make studying fun.
              </p>
            </div>

            {/* AI Chat */}
            <div className="group bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-purple-300 hover:shadow-2xl transition-all cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <div className="text-4xl">🤖</div>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Pathway Pat AI</h3>
              <p className="text-gray-600 leading-relaxed">
                AI tutor that never gets tired of your questions. Available 24/7 to help you understand any concept.
              </p>
            </div>

            {/* Question Bank */}
            <div className="group bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <div className="text-4xl">📚</div>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Question Bank</h3>
              <p className="text-gray-600 leading-relaxed">
                Thousands of real exam questions that actually prepare you. Filter by topic and difficulty level.
              </p>
            </div>

            {/* Smart Flashcards */}
            <div className="group bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-orange-300 hover:shadow-2xl transition-all cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <div className="text-4xl">💡</div>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Smart Flashcards</h3>
              <p className="text-gray-600 leading-relaxed">
                Flashcards that know when you&#39;re forgetting. Spaced repetition helps you retain information longer.
              </p>
            </div>

            {/* Progress Tracking */}
            <div className="group bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-green-300 hover:shadow-2xl transition-all cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <div className="text-4xl">📊</div>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Track Progress</h3>
              <p className="text-gray-600 leading-relaxed">
                Visual dashboards show your growth across all pathways. See exactly where you stand.
              </p>
            </div>

            {/* Mock Exams */}
            <div className="group bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-purple-300 hover:shadow-2xl transition-all cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <div className="text-4xl">📝</div>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Mock Exams</h3>
              <p className="text-gray-600 leading-relaxed">
                Custom exams that target your weak spots. Practice under real exam conditions.
              </p>
            </div>

            {/* Career Tools */}
            <div className="group bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <div className="text-4xl">🎯</div>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Career Discovery</h3>
              <p className="text-gray-600 leading-relaxed">
                Self-discovery tools and career matching AI to find your perfect path forward.
              </p>
            </div>

            {/* Project Builder */}
            <div className="group bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-orange-300 hover:shadow-2xl transition-all cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <div className="text-4xl">🚀</div>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Project Builder</h3>
              <p className="text-gray-600 leading-relaxed">
                Tools and templates to create passion projects that stand out in college applications.
              </p>
            </div>

            {/* Community */}
            <div className="group bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-green-300 hover:shadow-2xl transition-all cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <div className="text-4xl">🌍</div>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Global Community</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with 400,000+ students from 180+ countries on the same journey as you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-gradient-to-br from-green-600 via-blue-600 to-purple-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-8 w-8 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-8 leading-relaxed">
              &quot;Pathway Builder helped me ace my IB exams AND discover my passion for environmental science. The AI tutor is like having a teacher available 24/7!&quot;
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-600" />
              <div className="text-left">
                <div className="font-bold text-white text-lg">Emma Chen</div>
                <div className="text-green-100">Stanford University • IB Score: 43</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900">
              Start your journey free today
            </h2>
            <p className="text-xl text-gray-600">
              Join 400,000+ students discovering their path to success
            </p>
            <Link href="/sign-up">
              <Button
                size="lg"
                className="rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-xl px-12 py-8 shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
              >
                START FREE — NO CREDIT CARD
              </Button>
            </Link>
            <p className="text-sm text-gray-500">Trusted by students in 180+ countries</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🎓</span>
                <span className="text-xl font-bold">Pathway Builder</span>
              </div>
              <p className="text-gray-400 text-sm">All-in-one platform for student success. Career exploration, IB prep, and passion projects.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Career Exploration</a></li>
                <li><a href="#" className="hover:text-white">IB Learning</a></li>
                <li><a href="#" className="hover:text-white">Passion Projects</a></li>
                <li><a href="#" className="hover:text-white">AI Tutor</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Success Stories</a></li>
                <li><a href="#" className="hover:text-white">For Teachers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © 2025 Pathway Builder. Empowering 400,000+ students worldwide.
          </div>
        </div>
      </footer>
    </div>
  );
}
