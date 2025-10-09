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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Header with conditional rendering */}
      <LandingHeader isSignedIn={isSignedIn} />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Discover Who You Are.
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                Build What Matters.
              </span>
              <br />
              Own Your Story.
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform the overwhelming college preparation process into an engaging, structured journey 
              of self-discovery and meaningful achievement.
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video">
            <Image 
              src="/hero.jpg" 
              alt="Diverse students collaborating on creative projects"
              width={1200}
              height={675}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          {/* CTA Buttons - Conditional rendering */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isSignedIn ? (
              <>
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg px-8 py-6">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                    My Projects
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/sign-up">
                  <Button size="lg" className="text-lg px-8 py-6">
                    Get Started Free
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Watch Demo (2 min)
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-3">6 Modules of Self-Discovery</h3>
            <p className="text-gray-600">
              Discover your strengths, values, and personality through proven assessments 
              and interactive activities.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-3">3 Core Career Assessments</h3>
            <p className="text-gray-600">
              Take RIASEC, DISC, and TypeFinder assessments to understand your ideal 
              career paths and work styles.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-3">Build Your Signature Project</h3>
            <p className="text-gray-600">
              Create a meaningful passion project that showcases your unique interests 
              and stands out in college applications.
            </p>
          </div>
        </div>
      </section>

      {/* What You'll Achieve Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              What You&apos;ll Achieve
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
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
                <div key={idx} className="flex gap-4 items-start">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 md:p-12 shadow-lg border border-blue-100">
            <div className="text-4xl mb-6 text-center">💬</div>
            <blockquote className="text-xl text-gray-700 italic text-center mb-6">
              &quot;This platform helped me find my passion for UX design and build a portfolio 
              that got me into my dream school. I finally understood what makes me unique 
              and how to showcase it.&quot;
            </blockquote>
            <div className="text-center">
              <div className="font-bold text-lg">Sarah M.</div>
              <div className="text-gray-600">Grade 11 → UC Berkeley</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators - Enhanced */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Trusted by Students & Schools Nationwide
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Schools */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 text-center group hover:-translate-y-1 duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600 font-medium mb-1">Partner Schools</div>
              <div className="text-sm text-gray-500">Across the United States</div>
            </div>

            {/* Students */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 text-center group hover:-translate-y-1 duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">10,000+</div>
              <div className="text-gray-600 font-medium mb-1">Active Students</div>
              <div className="text-sm text-gray-500">Building their futures</div>
            </div>

            {/* Rating */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 text-center group hover:-translate-y-1 duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">4.8/5</div>
              <div className="text-gray-600 font-medium mb-1">Average Rating</div>
              <div className="flex items-center justify-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>

          {/* Logos Section */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 mb-6">Featured in</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold text-gray-400">TechCrunch</div>
              <div className="text-2xl font-bold text-gray-400">EdSurge</div>
              <div className="text-2xl font-bold text-gray-400">Forbes</div>
              <div className="text-2xl font-bold text-gray-400">The Chronicle</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Conditional rendering */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {isSignedIn ? (
            <>
              <h2 className="text-4xl md:text-5xl font-bold">
                Welcome Back! 👋
              </h2>
              <p className="text-xl text-gray-600">
                Continue your journey and keep building your future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg px-8 py-6">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/module-1">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                    Continue Learning
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Build Your Future?
              </h2>
              <p className="text-xl text-gray-600">
                Join thousands of students who are discovering their path and building 
                compelling profiles for college success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up">
                  <Button size="lg" className="text-lg px-8 py-6">
                    Start Your Journey Free
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-gray-500">
                No credit card required • Complete at your own pace • 3-4 month program
              </p>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4">Pathway Builder</h4>
              <p className="text-sm text-gray-600">
                Career discovery platform for high school students
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Features</a></li>
                <li><a href="#" className="hover:text-blue-600">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-600">For Schools</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">About</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact</a></li>
                <li><a href="#" className="hover:text-blue-600">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
            © 2025 Pathway Builder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
