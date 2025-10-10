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
    // Updated background to a softer, more modern gradient
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header with conditional rendering */}
      <LandingHeader isSignedIn={isSignedIn} />

      {/* Hero Section - Elevated and more impactful */}
      <section className="container mx-auto px-4 py-28 md:py-36 text-center">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tighter">
              Discover Who You Are.
              <br />
              {/* Vibrant gradient for key phrase */}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Build What Matters.
              </span>
              <br />
              Own Your Story.
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto font-light">
              Transform the overwhelming college preparation process into an engaging, structured journey
              of self-discovery and meaningful achievement.
            </p>
          </div>

          {/* Image with elevated, modern border and subtle shadow */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-200/50 border-4 border-white aspect-[16/9] md:aspect-[2/1] transition-transform hover:scale-[1.01] duration-500">
            <Image
              src="/hero.jpg"
              alt="Diverse students collaborating on creative projects"
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
              priority
            />
          </div>

          {/* CTA Buttons - Larger and bolder presence */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            {isSignedIn ? (
              <>
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg px-10 py-7 bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/50">
                    Go to Dashboard &rarr;
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2 border-gray-300 hover:bg-gray-50 transition-all">
                    My Projects
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/sign-up">
                  <Button size="lg" className="text-lg px-10 py-7 bg-blue-600 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/50 font-semibold">
                    Get Started Free
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2 border-gray-300 hover:bg-gray-50 transition-all font-semibold">
                  Watch Demo (2 min)
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section - Cleaner, Card-Based Design */}
      <section className="container mx-auto px-4 py-20 bg-gray-50 border-t border-b border-gray-100">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-blue-500 hover:border-blue-600 group">
            <div className="text-4xl mb-4 group-hover:scale-105 transition-transform">🎯</div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">6 Modules of Self-Discovery</h3>
            <p className="text-gray-600">
              Discover your strengths, values, and personality through proven assessments
              and interactive activities.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-purple-500 hover:border-purple-600 group">
            <div className="text-4xl mb-4 group-hover:scale-105 transition-transform">📊</div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">3 Core Career Assessments</h3>
            <p className="text-gray-600">
              Take RIASEC, DISC, and TypeFinder assessments to understand your ideal
              career paths and work styles.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-pink-500 hover:border-pink-600 group">
            <div className="text-4xl mb-4 group-hover:scale-105 transition-transform">🚀</div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Build Your Signature Project</h3>
            <p className="text-gray-600">
              Create a meaningful passion project that showcases your unique interests
              and stands out in college applications.
            </p>
          </div>
        </div>
      </section>

      {/* What You'll Achieve Section - Enhanced Clarity and Visuals */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-gray-900">
              What You&apos;ll Achieve
            </h2>

            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
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
                <div key={idx} className="flex gap-4 items-start border-l-4 border-blue-300 pl-4 transition-all hover:border-blue-600 hover:bg-blue-50/50 p-2 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-xl mb-1 text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section - More prominent and styled like a quote block */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 md:p-14 shadow-2xl shadow-blue-200 border border-blue-200">
            <div className="text-5xl mb-6 text-center text-blue-500 font-serif leading-none">“</div>
            <blockquote className="text-xl md:text-2xl text-gray-700 font-medium italic text-center mb-8">
              &quot;This platform helped me find my passion for UX design and build a portfolio
              that got me into my dream school. I finally understood what makes me unique
              and how to showcase it.&quot;
            </blockquote>
            <div className="text-center">
              <div className="font-extrabold text-lg text-gray-900">Sarah M.</div>
              <div className="text-blue-600 font-semibold mt-1">Grade 11 &rarr; UC Berkeley</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators - Elevated, cleaner, and better separation */}
      <section className="bg-gray-50 py-20 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-lg font-bold text-blue-600 uppercase tracking-widest">
              Trusted Success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Schools */}
            <div className="bg-white rounded-2xl p-8 shadow-xl transition-all duration-300 border-b-4 border-blue-500 text-center group">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-5xl font-extrabold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600 font-semibold mb-1">Partner Schools</div>
              <div className="text-sm text-gray-500">Across the United States</div>
            </div>

            {/* Students */}
            <div className="bg-white rounded-2xl p-8 shadow-xl transition-all duration-300 border-b-4 border-pink-500 text-center group">
              <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-5xl font-extrabold text-gray-900 mb-2">10,000+</div>
              <div className="text-gray-600 font-semibold mb-1">Active Students</div>
              <div className="text-sm text-gray-500">Building their futures</div>
            </div>

            {/* Rating */}
            <div className="bg-white rounded-2xl p-8 shadow-xl transition-all duration-300 border-b-4 border-amber-500 text-center group">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="text-5xl font-extrabold text-gray-900 mb-2">4.8/5</div>
              <div className="text-gray-600 font-semibold mb-1">Average Rating</div>
              <div className="flex items-center justify-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>

          {/* Logos Section - Refined for a cleaner look */}
          <div className="mt-16 text-center">
            <p className="text-lg font-semibold text-gray-500 mb-8">As Featured In</p>
            <div className="flex flex-wrap justify-center items-center gap-10 opacity-70">
              <div className="text-3xl font-extrabold text-gray-400 hover:text-blue-500 transition-colors">TechCrunch</div>
              <div className="text-3xl font-extrabold text-gray-400 hover:text-blue-500 transition-colors">EdSurge</div>
              <div className="text-3xl font-extrabold text-gray-400 hover:text-blue-500 transition-colors">Forbes</div>
              <div className="text-3xl font-extrabold text-gray-400 hover:text-blue-500 transition-colors">The Chronicle</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - More prominent background and shadow */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-white p-10 rounded-2xl shadow-2xl shadow-blue-100 border border-blue-50">
          {isSignedIn ? (
            <>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                Welcome Back! 👋
              </h2>
              <p className="text-xl text-gray-600">
                Continue your journey and keep building your future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg px-10 py-7 bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/50">
                    Go to Dashboard &rarr;
                  </Button>
                </Link>
                <Link href="/module-1">
                  <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2 border-gray-300 hover:bg-gray-50 transition-all">
                    Continue Learning
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                Ready to Build Your Future?
              </h2>
              <p className="text-xl text-gray-600">
                Join thousands of students who are discovering their path and building
                compelling profiles for college success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Link href="/sign-up">
                  <Button size="lg" className="text-lg px-10 py-7 bg-blue-600 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/50 font-semibold">
                    Start Your Journey Free
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-gray-500 pt-2">
                No credit card required • Complete at your own pace • 3-4 month program
              </p>
            </>
          )}
        </div>
      </section>

      {/* Footer - Minimalist and Clean */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-extrabold text-lg mb-4 text-gray-900">Pathway Builder</h4>
              <p className="text-sm text-gray-500">
                Career discovery platform for high school students
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">For Schools</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-100 text-center text-sm text-gray-500">
            © 2025 Pathway Builder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
