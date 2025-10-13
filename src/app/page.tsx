// src/app/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Star, Zap, Trophy, Users, TrendingUp, Sparkles, Target, Award, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth, useClerk } from '@clerk/nextjs';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userId } = useAuth();
  const { signOut } = useClerk();
  const isSignedIn = !!userId;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
                ? 'bg-white/90 border-white/50 shadow-2xl shadow-indigo-500/10' 
                : 'bg-white/70 border-white/40 shadow-xl'
              }
            `}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 blur-md opacity-40 -z-10" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
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
                  <Link href="/projects">
                    <Button 
                      variant="ghost"
                      className="rounded-full text-sm font-semibold text-gray-700 hover:bg-white/60"
                    >
                      Projects
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
                  <Button 
                    variant="ghost"
                    className="rounded-full text-sm font-semibold text-gray-700 hover:bg-white/60"
                  >
                    Features
                  </Button>
                  <Button 
                    variant="ghost"
                    className="rounded-full text-sm font-semibold text-gray-700 hover:bg-white/60"
                  >
                    About
                  </Button>
                  <div className="w-px h-6 bg-gray-300 mx-2" />
                  <Link href="/sign-in">
                    <Button 
                      variant="ghost"
                      className="rounded-full text-sm font-semibold text-gray-700 hover:bg-white/60"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button className="rounded-full text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                      Get Started
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
                  <Link href="/projects" className="block">
                    <Button 
                      variant="ghost"
                      className="w-full justify-start rounded-2xl text-sm font-semibold text-gray-700 hover:bg-white/60"
                    >
                      Projects
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
                  <Button 
                    variant="ghost"
                    className="w-full justify-start rounded-2xl text-sm font-semibold text-gray-700 hover:bg-white/60"
                  >
                    Features
                  </Button>
                  <Button 
                    variant="ghost"
                    className="w-full justify-start rounded-2xl text-sm font-semibold text-gray-700 hover:bg-white/60"
                  >
                    About
                  </Button>
                  <div className="h-px bg-gray-300 my-2" />
                  <Link href="/sign-in" className="block">
                    <Button 
                      variant="ghost"
                      className="w-full justify-start rounded-2xl text-sm font-semibold text-gray-700 hover:bg-white/60"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up" className="block">
                    <Button className="w-full rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section - Duolingo Style */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white pt-28">
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold text-sm">
                <Star className="h-4 w-4 fill-current" />
                Over 10,000 students building their future
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-tight">
                The proven, fun way to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  discover yourself
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed">
                Learn who you are, build what matters, and own your college story. 
                Just 15 minutes a day.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sign-up" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="w-full rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all"
                  >
                    GET STARTED
                  </Button>
                </Link>
                <Link href="/sign-in" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full rounded-2xl border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold text-lg px-8 py-6"
                  >
                    I HAVE AN ACCOUNT
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 border-2 border-white" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">10,000+ students</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-sm font-semibold text-gray-700 ml-1">4.8/5</span>
                </div>
              </div>
            </div>

                   {/* Right Column - Visual Element (MODIFIED to contain outer box) */}
            <div className="relative lg:block hidden">
              <div className="relative">
                {/* Outer container acts as the frame for the image */}
                <div className="relative w-full aspect-square max-w-md mx-auto rounded-3xl border-4 border-white shadow-2xl overflow-hidden">
                  
                  {/* Image that fills the entire container, including the area for the previous gradient */}
                  <Image
                    src="/heroimagev1.png"
                    alt="Pathway mascot illustration representing a student building their future"
                    layout="fill"
                    objectFit="cover" // 'cover' or 'contain' depending on desired cropping
                    className="z-0" // Ensure image is behind the text overlay
                  />

                  {/* Optional: Add a subtle overlay directly over the image for better text contrast if needed */}
                  {/* <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/30 via-purple-100/30 to-pink-100/30 z-0"></div> */}


                  {/* Text Overlay positioned at the bottom, directly over the image */}
                  <div className="absolute inset-x-0 bottom-0 p-8 text-center">
                    {/* <div className="text-8xl text-white opacity-90 mb-2">🎯</div> */}
                    <div className="space-y-1">
                      {/* <div className="text-2xl font-bold text-black">Your Journey Starts Here</div> */}
                    
                  </div>  
                  </div>
                </div>
                
                {/* Floating Cards */}
                <div className="absolute -left-8 top-1/4 bg-white rounded-2xl shadow-xl p-4 border-2 border-green-200 transform rotate-[-5deg] transition-all hover:rotate-0 hover:scale-105">
                  <div className="flex items-center gap-3">
                    <Zap className="h-8 w-8 text-amber-500 fill-current" />
                    <div>
                      <div className="font-bold text-gray-900">7 day streak</div>
                      <div className="text-sm text-gray-500">Keep it up!</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-8 top-1/2 bg-white rounded-2xl shadow-xl p-4 border-2 border-indigo-200 transform rotate-[5deg] transition-all hover:rotate-0 hover:scale-105">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-8 w-8 text-indigo-600" />
                    <div>
                      <div className="font-bold text-gray-900">Achievement</div>
                      <div className="text-sm text-gray-500">Module complete!</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Gamified */}
      <section className="py-12 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-white mb-2">10K+</div>
              <div className="text-indigo-100 font-semibold">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-white mb-2">50+</div>
              <div className="text-indigo-100 font-semibold">Partner Schools</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-white mb-2">95%</div>
              <div className="text-indigo-100 font-semibold">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-white mb-2">4.8★</div>
              <div className="text-indigo-100 font-semibold">Student Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Fun & Simple */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Your journey in 3 simple steps
            </h2>
            <p className="text-xl text-gray-600">It&aposs engaging, fun, and actually works</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Target,
                color: 'from-green-400 to-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                step: '1',
                title: 'Discover Yourself',
                description: 'Take fun assessments and activities to uncover your strengths, values, and passions'
              },
              {
                icon: Zap,
                color: 'from-amber-400 to-orange-600',
                bgColor: 'bg-amber-50',
                borderColor: 'border-amber-200',
                step: '2',
                title: 'Build Your Project',
                description: 'Create a meaningful passion project that showcases your unique story'
              },
              {
                icon: Trophy,
                color: 'from-indigo-400 to-purple-600',
                bgColor: 'bg-indigo-50',
                borderColor: 'border-indigo-200',
                step: '3',
                title: 'Own Your Story',
                description: 'Stand out with a compelling narrative for college applications'
              }
            ].map((item, idx) => (
              <div key={idx} className={`${item.bgColor} ${item.borderColor} border-4 rounded-3xl p-8 text-center hover:scale-105 transition-transform cursor-pointer`}>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} text-white font-black text-2xl mb-6`}>
                  {item.step}
                </div>
                <item.icon className={`h-12 w-12 mx-auto mb-4 bg-gradient-to-br ${item.color} text-transparent bg-clip-text`} strokeWidth={2.5} />
                <h3 className="text-2xl font-black text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Colorful Cards */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Why students love Pathway
            </h2>
            <p className="text-xl text-gray-600">Built with love, backed by science</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: '🎮', title: 'Gamified Learning', description: 'Earn streaks, badges, and achievements as you progress', color: 'from-pink-400 to-rose-500' },
              { icon: '⚡', title: 'Just 15 Minutes', description: 'Quick daily activities that fit your busy schedule', color: 'from-amber-400 to-orange-500' },
              { icon: '🎯', title: 'Personalized Path', description: 'AI-guided journey tailored to your interests', color: 'from-cyan-400 to-blue-500' },
              { icon: '🏆', title: 'Real Results', description: '95% of students complete their projects', color: 'from-purple-400 to-indigo-500' },
              { icon: '👥', title: 'Community Support', description: 'Connect with peers on the same journey', color: 'from-green-400 to-teal-500' },
              { icon: '📱', title: 'Works Everywhere', description: 'Access on phone, tablet, or computer', color: 'from-violet-400 to-purple-500' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border-2 border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all cursor-pointer">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial - Simple & Bold */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-8 w-8 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-8 leading-relaxed">
              This platform helped me discover my passion for UX design. I built an amazing portfolio and got into my dream school!
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600" />
              <div className="text-left">
                <div className="font-bold text-white text-lg">Sarah Martinez</div>
                <div className="text-indigo-200">UC Berkeley • Class of 2025</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Bold & Simple */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900">
              Start your journey today
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of students discovering their path to college success
            </p>
            <Link href="/sign-up">
              <Button 
                size="lg" 
                className="rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-xl px-12 py-8 shadow-2xl hover:shadow-3xl transition-all"
              >
                GET STARTED FOR FREE
              </Button>
            </Link>
            <p className="text-sm text-gray-500">No credit card required • Free forever</p>
          </div>
        </div>
      </section>

      {/* Footer - Clean & Minimal */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Pathway</span>
              </div>
              <p className="text-gray-400 text-sm">The free, fun way to discover yourself and build your college story.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">For Schools</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © 2025 Pathway Builder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
