// src/app/page.tsx - UPGRADED CODE

import React from 'react';
import Link from 'next/link';
// Assuming Button component is defined elsewhere (e.g., shadcn/ui) - keeping for structure
// import { Button } from '@/components/ui/button'; 
import { CheckCircle2, ArrowRight, Star, Users, School, Award, Target, TrendingUp, BookOpen, Sparkles, Zap } from 'lucide-react';

// You will need to remove the duplicate 'export default async function Home()' 
// in your original file and use this one EnhancedLandingPage component instead.

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

  // --- Custom Component to mimic the ZuAI mascot/logo look ---
  const ZuAICard = ({ className = "" }) => (
    <div className={`p-8 md:p-12 ${className} rounded-[3rem] shadow-2xl relative overflow-hidden text-center`}>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800 to-indigo-900 opacity-90 z-0" />
      <div className="relative z-10 space-y-4">
        {/* Placeholder for the Mascot/Logo in the center */}
        <div className="mx-auto w-24 h-24 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/50">
          <Zap className="w-10 h-10 text-yellow-300" />
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-snug">
          The only future <br/> companion you'll ever need!
        </h2>
      </div>
    </div>
  );
  // ------------------------------------------------------------------


  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Animated Background Gradient - Simplified for a cleaner look */}
      <div className="fixed inset-0 bg-white -z-10" /> 
      
      {/* Header - Styled like ZuAI's clean, white header with purple CTA */}
      <header className="border-b-0 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Logo/App Name */}
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-gray-800">PB</span>
            </div>
            <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
              {/* Navigation links - mimicking ZuAI's simple links */}
              <a href="#" className="hover:text-purple-600 hidden md:inline">Features</a>
              <a href="#" className="hover:text-purple-600 hidden md:inline">Coursework</a>
              <a href="#" className="hover:text-purple-600 hidden md:inline">Cliffs</a>
              <a href="#" className="hover:text-purple-600 hidden md:inline">Blogs</a>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all font-semibold">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - ZuAI Style Grid/Blocks */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Block 1: Unlimited Exam-Style/Discovery */}
            <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100 flex flex-col justify-between h-full hover:shadow-2xl transition-shadow">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Unlimited clarity, <br /> zero guesswork
                </h2>
                <div className="h-32 flex items-center justify-center">
                  <div className="text-6xl">🔍</div> {/* Discovery/Clarity Visual */}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4 text-center">
                Get a clear roadmap, not just random advice.
              </p>
            </div>

            {/* Block 2: Central Mascot/AI Companion */}
            <ZuAICard className="col-span-1 lg:col-span-1" />

            {/* Block 3: Downloads/Stats - Stacked */}
            <div className="space-y-6">
              {/* Top Stat: 10K+ Students */}
              <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100 text-center hover:shadow-2xl transition-shadow">
                <div className="text-5xl font-extrabold text-gray-900 mb-1">10K+</div>
                <p className="text-lg text-gray-600 font-medium">Happy Users</p>
                <div className="flex justify-center mt-2 text-3xl">😀😇🤩</div>
              </div>
              {/* Bottom Stat: Backed by Google for Startups (Placeholder) */}
              <div className="bg-white p-6 rounded-[3rem] shadow-xl border border-gray-100 text-center flex flex-col items-center justify-center hover:shadow-2xl transition-shadow">
                <p className="text-sm text-gray-500 font-medium mb-3">Backed by</p>
                {/* Using an icon placeholder for 'Google' or a strong partner */}
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="text-xl font-bold text-gray-700">Top-Tier Investors</span>
                </div>
              </div>
            </div>

            {/* Bottom Left Block: Prep the Way You Learn Best - Pill Navigation */}
            <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100 flex flex-col justify-center items-center text-center hover:shadow-2xl transition-shadow">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                Build the story you need
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {['Discover', 'Assess', 'Project', 'Narrate', 'Apply'].map((item) => (
                  <span key={item} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium shadow-md">
                    {item}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-6">
                A multi-faceted approach to college readiness.
              </p>
            </div>

            {/* Bottom Center Block: Turn Exam Prep Into a Winning Game */}
            <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100 flex flex-col justify-end text-center col-span-1 lg:col-span-2 relative min-h-[200px] hover:shadow-2xl transition-shadow">
              {/* Adding puzzle pieces visual elements */}
              <div className="absolute top-4 left-4 text-4xl text-purple-200 transform rotate-12">🧩</div>
              <div className="absolute bottom-4 right-4 text-4xl text-green-200 transform -rotate-12">🧩</div>

              <h3 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Turn future planning into a winning game
              </h3>
              <p className="text-xl text-gray-600">Gamified progress and clear achievements.</p>
            </div>

          </div>

          {/* Main CTA below the grid, for higher visibility */}
          <div className="text-center pt-16">
            <button className="bg-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 mx-auto">
              Start Your Journey Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </section>

      ---

      {/* Interactive Features Section - Card Styling Updated */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What Makes Us <span className="text-purple-600">Special?</span>
            </h2>
            <p className="text-xl text-gray-600">Everything you need to build a compelling future</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature Card 1 - Updated to rounded-[2rem] and shadow-xl */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer border border-gray-100">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-white" />
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

            {/* Feature Card 2 - Updated to rounded-[2rem] and shadow-xl */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer border border-gray-100">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-white" />
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

            {/* Feature Card 3 - Updated to rounded-[2rem] and shadow-xl */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer border border-gray-100">
              <div className="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Build Your Signature Project</h3>
              <p className="text-gray-700 mb-4">
                Create a meaningful passion project that showcases your unique interests.
              </p>
              <ul className="space-y-2">
                {['Project ideation', 'Step-by-step guidance', 'Portfolio creation', 'Impact showcase'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-pink-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature Card 4 - Updated to rounded-[2rem] and shadow-xl */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer border border-gray-100">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Expert Guidance & Support</h3>
              <p className="text-gray-700 mb-4">
                Get personalized feedback and support throughout your journey.
              </p>
              <ul className="space-y-2">
                {['AI-powered insights', 'Expert resources', 'Community support', 'Progress tracking'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      ---

      {/* Pain Points Section - Dark Gradient, High Contrast */}
      <section className="bg-gradient-to-br from-indigo-900 to-purple-950 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                From doubts to distinction.
              </h2>
              <p className="text-xl text-purple-200">Get instant answers, practice like it's the real thing, and track your progress.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Pain Point Cards with rounded[2rem] */}
              <div className="bg-white/10 rounded-[2rem] p-8 border border-purple-700 hover:bg-white/15 transition-all shadow-lg">
                <div className="text-5xl mb-4">😰</div>
                <h3 className="text-2xl font-bold mb-3">Stop feeling lost</h3>
                <p className="text-gray-300">
                  Get clear direction with structured modules that guide you from confusion to confidence about your future career path.
                </p>
              </div>

              <div className="bg-white/10 rounded-[2rem] p-8 border border-purple-700 hover:bg-white/15 transition-all shadow-lg">
                <div className="text-5xl mb-4">😴</div>
                <h3 className="text-2xl font-bold mb-3">Stop boring applications</h3>
                <p className="text-gray-300">
                  Create a unique signature project that makes your college applications memorable and authentic to who you are.
                </p>
              </div>

            </div>

            {/* Placeholder for the Screenshot image (like ZuAI's dashboard image) */}
            <div className="mt-12 bg-white rounded-3xl p-4 shadow-2xl border-4 border-purple-500 overflow-hidden">
              <div className="w-full aspect-video bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                              </div>
            </div>
          </div>
        </div>
      </section>

      ---

      {/* Results Section - Updated Card Styling */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What You'll <span className="text-purple-600">Achieve</span>
            </h2>
            <p className="text-xl text-gray-600">Tangible outcomes that matter</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Self-Clarity",
                description: "Deep understanding of personality, strengths, values, and interests through validated assessments",
                color: "bg-white border-blue-200"
              },
              {
                icon: "🚀",
                title: "Career Direction",
                description: "2-3 validated career pathways with clear educational roadmaps",
                color: "bg-white border-purple-200"
              },
              {
                icon: "💼",
                title: "Digital Presence",
                description: "Professional LinkedIn profile and personal portfolio ready for opportunities",
                color: "bg-white border-green-200"
              },
              {
                icon: "⭐",
                title: "Signature Project",
                description: "A meaningful passion project that differentiates your college applications",
                color: "bg-white border-amber-200"
              },
              {
                icon: "📝",
                title: "Compelling Narrative",
                description: "A polished career story ready for college essays and interviews",
                color: "bg-white border-pink-200"
              },
              {
                icon: "🗺️",
                title: "Action Plan",
                description: "Clear roadmap from high school to career with specific steps and milestones",
                color: "bg-white border-indigo-200"
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className={`${item.color} rounded-3xl p-8 shadow-md border hover:shadow-xl transition-all hover:-translate-y-1`}
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      ---

      {/* Testimonials Carousel - Retained but with updated card styling */}
      <section className="bg-gradient-to-br from-gray-50 to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                What Students Say
              </h2>
              <p className="text-xl text-gray-600">Real stories from real students</p>
            </div>

            <div className="relative">
              {/* Testimonial Card updated to rounded-3xl and a softer shadow */}
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-xl md:text-2xl text-gray-800 text-center mb-8 italic">
                  "{testimonials[activeTestimonial].quote}"
                </blockquote>
                
                <div className="text-center">
                  <div className="font-bold text-xl text-gray-900">{testimonials[activeTestimonial].author}</div>
                  <div className="text-purple-600 font-medium">{testimonials[activeTestimonial].school}</div>
                </div>
              </div>

              {/* Dots - Purple primary color */}
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === activeTestimonial ? 'bg-purple-600 w-8' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      ---

      {/* Stats Section - Retained structure but with a cleaner, rounded look */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-4">
              Trusted by Students & Schools Nationwide
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Stat Cards with updated rounded-3xl and strong shadow/gradient */}
            <div className="text-center group p-6 bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <School className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-extrabold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600 font-medium">Partner Schools</div>
            </div>

            <div className="text-center group p-6 bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-extrabold text-gray-900 mb-2">10,000+</div>
              <div className="text-gray-600 font-medium">Active Students</div>
            </div>

            <div className="text-center group p-6 bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-extrabold text-gray-900 mb-2">4.8/5</div>
              <div className="text-gray-600 font-medium">Average Rating</div>
            </div>

            <div className="text-center group p-6 bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-extrabold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600 font-medium">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      ---

      {/* Final CTA - Purple/Indigo Gradient */}
      <section className="bg-gradient-to-br from-purple-700 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold">
              Ready to Build Your Future?
            </h2>
            <p className="text-xl md:text-2xl text-purple-200">
              Join thousands of students discovering their path and building compelling profiles for college success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button className="bg-white text-purple-600 px-10 py-5 rounded-xl text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all">
                Start Your Journey Free
              </button>
              <button className="border-2 border-white text-white px-10 py-5 rounded-xl text-lg font-bold hover:bg-white/10 transition-all">
                Schedule a Demo
              </button>
            </div>
            <p className="text-purple-200 pt-2 text-sm">
              No credit card required • Complete at your own pace • 3-4 month program
            </p>
          </div>
        </div>
      </section>

      ---

      {/* Footer - Dark color retained */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">Pathway Builder</span>
              </div>
              <p className="text-gray-400 text-sm">
                Career discovery platform for high school students
              </p>
            </div>
            {/* Other footer columns remain the same */}
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
