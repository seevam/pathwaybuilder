// src/app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { auth } from '@clerk/nextjs/server';
import { LandingHeader } from '@/components/landing/LandingHeader';

export default async function Home() {
  const { userId } = await auth();
  const isSignedIn = !!userId;

import React from 'react';
import { CheckCircle2, ArrowRight, Star, Users, School, Award, Target, TrendingUp, BookOpen, Sparkles } from 'lucide-react';

export default function EnhancedLandingPage() {
  const [activeTestimonial, setActiveTestimonial] = React.useState(0);

  const testimonials = [
    {
      quote: "This platform helped me find my passion for UX design and build a portfolio that got me into my dream school. I finally understood what makes me unique and how to showcase it.",
      author: "Sarah M.",
      school: "Grade 11 → UC Berkeley",
      rating: 5
    },
    {
      quote: "The career assessments gave me clarity I never had before. I discovered my interest in environmental engineering and now I have a clear roadmap to get there.",
      author: "Marcus T.",
      school: "Grade 10 → MIT",
      rating: 5
    },
    {
      quote: "Building my signature project helped me stand out in college applications. The structured approach made it so much easier than I expected.",
      author: "Priya K.",
      school: "Grade 12 → Stanford",
      rating: 5
    }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 opacity-50 -z-10" />
      
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Pathway Builder</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-gray-900 font-medium">
                Sign In
              </button>
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all">
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Enhanced */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              Trusted by 10,000+ Students
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Discover Who You Are.
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 bg-clip-text text-transparent">
                Build What Matters.
              </span>
              <br />
              <span className="text-gray-700">Own Your Story.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Transform overwhelming college prep into an engaging journey of self-discovery and meaningful achievement.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
                Start Your Journey Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-gray-400 hover:shadow-lg transition-all">
                Watch Demo (2 min)
              </button>
            </div>

            <p className="text-sm text-gray-500 pt-2">
              No credit card required • Complete at your own pace • 3-4 month program
            </p>
          </div>

          {/* Hero Image/Visual */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 to-purple-100 aspect-video">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <div className="text-6xl">🎯</div>
                <p className="text-2xl font-bold text-gray-700">Your Future Starts Here</p>
                <p className="text-gray-600">Interactive modules • Career assessments • Portfolio building</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What Makes Us <span className="text-blue-600">Special?</span>
            </h2>
            <p className="text-xl text-gray-600">Everything you need to build a compelling future</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer border border-blue-200">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">6 Self-Discovery Modules</h3>
              <p className="text-gray-700 mb-4">
                Uncover your strengths, values, and personality through proven assessments and interactive activities.
              </p>
              <ul className="space-y-2">
                {['Personality insights', 'Values exploration', 'Strengths mapping', 'Interest discovery'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer border border-purple-200">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">3 Core Career Assessments</h3>
              <p className="text-gray-700 mb-4">
                Understand your ideal career paths and work styles with validated assessments.
              </p>
              <ul className="space-y-2">
                {['RIASEC assessment', 'DISC personality', 'TypeFinder analysis', 'Career matching'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer border border-green-200">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Build Your Signature Project</h3>
              <p className="text-gray-700 mb-4">
                Create a meaningful passion project that showcases your unique interests.
              </p>
              <ul className="space-y-2">
                {['Project ideation', 'Step-by-step guidance', 'Portfolio creation', 'Impact showcase'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-8 hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer border border-amber-200">
              <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Expert Guidance & Support</h3>
              <p className="text-gray-700 mb-4">
                Get personalized feedback and support throughout your journey.
              </p>
              <ul className="space-y-2">
                {['AI-powered insights', 'Expert resources', 'Community support', 'Progress tracking'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-amber-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section - ZuAI Style */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Pathway Builder Saves Your Future
              </h2>
              <p className="text-xl text-gray-300">Say goodbye to college prep stress</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
                <div className="text-5xl mb-4">😰</div>
                <h3 className="text-2xl font-bold mb-3">Stop feeling lost</h3>
                <p className="text-gray-300">
                  Get clear direction with structured modules that guide you from confusion to confidence about your future career path.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
                <div className="text-5xl mb-4">😴</div>
                <h3 className="text-2xl font-bold mb-3">Stop boring applications</h3>
                <p className="text-gray-300">
                  Create a unique signature project that makes your college applications memorable and authentic to who you are.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
                <div className="text-5xl mb-4">⏰</div>
                <h3 className="text-2xl font-bold mb-3">Stop wasting time</h3>
                <p className="text-gray-300">
                  Follow a proven 3-4 month program with clear milestones and deadlines so you know exactly what to do next.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
                <div className="text-5xl mb-4">🤔</div>
                <h3 className="text-2xl font-bold mb-3">Stop guessing careers</h3>
                <p className="text-gray-300">
                  Use validated career assessments from RIASEC, DISC, and TypeFinder to discover paths that truly match your personality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What You'll <span className="text-blue-600">Achieve</span>
            </h2>
            <p className="text-xl text-gray-600">Tangible outcomes that matter</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Self-Clarity",
                description: "Deep understanding of personality, strengths, values, and interests through validated assessments",
                color: "from-blue-100 to-blue-200"
              },
              {
                icon: "🚀",
                title: "Career Direction",
                description: "2-3 validated career pathways with clear educational roadmaps",
                color: "from-purple-100 to-purple-200"
              },
              {
                icon: "💼",
                title: "Digital Presence",
                description: "Professional LinkedIn profile and personal portfolio ready for opportunities",
                color: "from-green-100 to-green-200"
              },
              {
                icon: "⭐",
                title: "Signature Project",
                description: "A meaningful passion project that differentiates your college applications",
                color: "from-amber-100 to-amber-200"
              },
              {
                icon: "📝",
                title: "Compelling Narrative",
                description: "A polished career story ready for college essays and interviews",
                color: "from-pink-100 to-pink-200"
              },
              {
                icon: "🗺️",
                title: "Action Plan",
                description: "Clear roadmap from high school to career with specific steps and milestones",
                color: "from-indigo-100 to-indigo-200"
              }
            ].map((item, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${item.color} rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-1`}>
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                What Students Say
              </h2>
              <p className="text-xl text-gray-600">Real stories from real students</p>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-amber-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-xl md:text-2xl text-gray-700 text-center mb-8">
                  "{testimonials[activeTestimonial].quote}"
                </blockquote>
                
                <div className="text-center">
                  <div className="font-bold text-xl">{testimonials[activeTestimonial].author}</div>
                  <div className="text-gray-600">{testimonials[activeTestimonial].school}</div>
                </div>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === activeTestimonial ? 'bg-blue-600 w-8' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-4">
              Trusted by Students & Schools Nationwide
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group hover:scale-105 transition-transform">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <School className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600 font-medium">Partner Schools</div>
            </div>

            <div className="text-center group hover:scale-105 transition-transform">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">10,000+</div>
              <div className="text-gray-600 font-medium">Active Students</div>
            </div>

            <div className="text-center group hover:scale-105 transition-transform">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Star className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">4.8/5</div>
              <div className="text-gray-600 font-medium">Average Rating</div>
            </div>

            <div className="text-center group hover:scale-105 transition-transform">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600 font-medium">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold">
              Ready to Build Your Future?
            </h2>
            <p className="text-xl md:text-2xl text-blue-100">
              Join thousands of students discovering their path and building compelling profiles for college success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button className="bg-white text-blue-600 px-10 py-5 rounded-xl text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all">
                Start Your Journey Free
              </button>
              <button className="border-2 border-white text-white px-10 py-5 rounded-xl text-lg font-bold hover:bg-white/10 transition-all">
                Schedule a Demo
              </button>
            </div>
            <p className="text-blue-100 pt-2">
              No credit card required • Complete at your own pace • 3-4 month program
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Pathway Builder</span>
              </div>
              <p className="text-gray-400 text-sm">
                Career discovery platform for high school students
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Schools</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            © 2025 Pathway Builder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
