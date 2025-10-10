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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <LandingHeader isSignedIn={isSignedIn} />

      {/* Hero Section - Enhanced with gradient background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Pathway to College Distinction
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
                Discover Who You Are.
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Build What Matters.
                </span>
                <br />
                Own Your Story.
              </h1>
              <p className="text-xl md:text-2xl text-indigo-200 max-w-3xl mx-auto font-light">
                Transform the overwhelming college preparation process into an engaging, 
                structured journey of self-discovery and meaningful achievement.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              {isSignedIn ? (
                <>
                  <Link href="/dashboard">
                    <Button size="lg" className="text-lg px-10 py-7 bg-white text-indigo-900 hover:bg-gray-100 transition-all shadow-2xl shadow-white/20 font-semibold">
                      Go to Dashboard →
                    </Button>
                  </Link>
                  <Link href="/projects">
                    <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2 border-white/50 text-white hover:bg-white/10 transition-all backdrop-blur-sm">
                      My Projects
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/sign-up">
                    <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white transition-all shadow-2xl shadow-purple-500/40 font-semibold">
                      Start Your Journey Free
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2 border-white/50 text-white hover:bg-white/10 transition-all backdrop-blur-sm">
                    Watch Demo (2 min)
                  </Button>
                </>
              )}
            </div>

            {/* Hero Image */}
            <div className="pt-12">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 backdrop-blur-sm">
                <Image 
                  src="/hero.jpg" 
                  alt="Diverse students collaborating on creative projects"
                  width={1200}
                  height={675}
                  className="w-full h-full object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators - Enhanced */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 border-b">
        <div className="container mx-auto px-4">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">50+</div>
              <div className="text-gray-600 font-medium">Partner Schools</div>
              <div className="text-sm text-gray-500">Nationwide</div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">10,000+</div>
              <div className="text-gray-600 font-medium">Active Students</div>
              <div className="text-sm text-gray-500">Building futures</div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">4.8/5</div>
              <div className="text-gray-600 font-medium">Average Rating</div>
              <div className="flex items-center justify-center gap-1 text-amber-400 mt-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>

          {/* Institution Logos */}
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8">
              Built by minds from leading institutions
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="text-2xl md:text-3xl font-extrabold text-gray-600">Stanford</div>
              <div className="text-2xl md:text-3xl font-extrabold text-gray-600">MIT</div>
              <div className="text-2xl md:text-3xl font-extrabold text-gray-600">Caltech</div>
              <div className="text-2xl md:text-3xl font-extrabold text-gray-600">Northwestern</div>
              <div className="text-2xl md:text-3xl font-extrabold text-gray-600">Princeton</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Modern Cards */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
            The AI-Powered Path
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            A Structured Journey, Smartly Guided
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to discover yourself and build your future
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature Card 1 */}
          <div className="group bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-blue-100 hover:border-blue-300 hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
              🎯
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">6 Modules of Self-Discovery</h3>
            <p className="text-gray-600 leading-relaxed">
              Discover your strengths, values, and personality through proven assessments 
              and interactive activities.
            </p>
            <div className="mt-6 pt-6 border-t border-blue-200">
              <span className="text-sm font-semibold text-blue-600">2-3 weeks per module</span>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="group bg-gradient-to-br from-white to-purple-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-purple-100 hover:border-purple-300 hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
              📊
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">3 Core Career Assessments</h3>
            <p className="text-gray-600 leading-relaxed">
              Take RIASEC, DISC, and TypeFinder assessments to understand your ideal 
              career paths and work styles.
            </p>
            <div className="mt-6 pt-6 border-t border-purple-200">
              <span className="text-sm font-semibold text-purple-600">45 minutes total</span>
            </div>
          </div>

          {/* Feature Card 3 */}
          <div className="group bg-gradient-to-br from-white to-green-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-green-100 hover:border-green-300 hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-2xl flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
              🚀
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Build Your Signature Project</h3>
            <p className="text-gray-600 leading-relaxed">
              Create a meaningful passion project that showcases your unique interests 
              and stands out in college applications.
            </p>
            <div className="mt-6 pt-6 border-t border-green-200">
              <span className="text-sm font-semibold text-green-600">3-6 months guided</span>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Achieve Section */}
      <section className="bg-gradient-to-br from-indigo-950 to-purple-900 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                Your AI-Guided Outcomes
              </h2>
              <p className="text-xl text-indigo-200">
                Real deliverables for your college applications and future success
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
              {[
                {
                  title: "Self-Clarity",
                  description: "Deep understanding of personality, strengths, values, and interests through validated assessments"
                },
                {
                  title: "Career Direction",
                  description: "2-3 validated career pathways with clear educational roadmaps"
                },
                {
                  title: "Digital Presence",
                  description: "Professional LinkedIn profile and personal portfolio ready for opportunities"
                },
                {
                  title: "Signature Project",
                  description: "A meaningful passion project that differentiates your college applications"
                },
                {
                  title: "Compelling Narrative",
                  description: "A polished career story ready for college essays and interviews"
                },
                {
                  title: "Action Plan",
                  description: "Clear roadmap from high school to career with specific steps and milestones"
                }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start group">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-white">{item.title}</h3>
                    <p className="text-indigo-200 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-10 md:p-16 shadow-xl border-2 border-purple-100 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
            
            <div className="relative">
              <div className="text-7xl mb-6 text-center text-purple-600 font-serif leading-none">"</div>
              <blockquote className="text-xl md:text-2xl text-gray-800 font-medium italic text-center mb-8 leading-relaxed">
                This platform helped me find my passion for UX design and build a portfolio
                that got me into my dream school. I finally understood what makes me unique
                and how to showcase it.
              </blockquote>
              <div className="text-center">
                <div className="font-extrabold text-xl text-gray-900">Sarah M.</div>
                <div className="text-purple-600 font-semibold mt-2 text-lg">Grade 11 → UC Berkeley</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8 text-white">
            {isSignedIn ? (
              <>
                <h2 className="text-4xl md:text-5xl font-extrabold">
                  Welcome Back! 👋
                </h2>
                <p className="text-xl font-light opacity-90">
                  Continue your journey and keep building your future.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link href="/dashboard">
                    <Button size="lg" className="text-lg px-12 py-7 bg-white text-indigo-600 hover:bg-gray-100 transition-all shadow-2xl font-semibold">
                      Go to Dashboard →
                    </Button>
                  </Link>
                  <Link href="/module-1">
                    <Button size="lg" variant="outline" className="text-lg px-12 py-7 border-2 border-white text-white hover:bg-white/20 transition-all backdrop-blur-sm">
                      Continue Learning
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-4xl md:text-5xl font-extrabold">
                  Ready to Build Your Future?
                </h2>
                <p className="text-xl font-light opacity-90 leading-relaxed">
                  Join thousands of students who are discovering their path and building
                  compelling profiles for college success.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link href="/sign-up">
                    <Button size="lg" className="text-lg px-12 py-7 bg-white text-indigo-600 hover:bg-gray-100 transition-all shadow-2xl font-bold">
                      Start Your Journey Free
                    </Button>
                  </Link>
                </div>
                <p className="text-sm opacity-80 pt-4">
                  No credit card required • Complete at your own pace • 3-4 month program
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-extrabold text-lg mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Pathway Builder
              </h4>
              <p className="text-sm text-gray-600">
                Career discovery platform for high school students
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">For Schools</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            © 2025 Pathway Builder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
