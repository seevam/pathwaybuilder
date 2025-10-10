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
    // Base container uses a soft white for a clean look
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header with conditional rendering */}
      <LandingHeader isSignedIn={isSignedIn} />

      {/* 1. Hero Section - Bold, High-Impact, with strong contrast */}
      <section className="container mx-auto px-4 pt-32 pb-24 md:pt-48 md:pb-36 text-center">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Subtle tag line, professional and modern pill shape */}
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-50/70 py-1 px-4 inline-block rounded-full border border-indigo-100">
            Path to College Success
          </p>
          
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tighter">
              Unlock Your Potential.
              <br />
              {/* Vibrant, modern gradient for the core value */}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Build a Portfolio That Matters.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto font-normal">
              Transform the overwhelming college preparation process into an engaging, structured journey
              of self-discovery and meaningful achievement.
            </p>
          </div>

          {/* CTA Buttons - Large, centered, and visually strong */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isSignedIn ? (
              <>
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg px-12 py-7 bg-indigo-600 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/40 font-semibold">
                    Go to Dashboard &rarr;
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button size="lg" variant="outline" className="text-lg px-12 py-7 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-all">
                    My Projects
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/sign-up">
                  <Button size="lg" className="text-lg px-12 py-7 bg-indigo-600 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/40 font-semibold">
                    Start Your Journey Free
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg px-12 py-7 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-all">
                  Watch Demo (2 min)
                </Button>
              </>
            )}
          </div>

          {/* Image with a more subtle, high-end design (thicker border for depth) */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-indigo-200/50 border-8 border-gray-100/50 mt-16 aspect-[16/9] md:aspect-[2/1]">
            <Image
              src="/hero.jpg"
              alt="Diverse students collaborating on creative projects"
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
              priority
            />
          </div>
        </div>
      </section>

      {/* 2. Trust Indicators - Moved up and simplified, often seen immediately after the Hero for credibility */}
      <section className="bg-gray-50 py-16 border-t border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto items-center">
            {/* Trust Headline to the left */}
            <div className="md:col-span-1 text-center md:text-left">
              <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">
                Proven Results
              </p>
              <h2 className="text-2xl font-extrabold text-gray-900">
                Trusted by Top Institutions
              </h2>
            </div>
            
            {/* Metrics */}
            <div className="text-center">
              <div className="text-5xl font-extrabold text-indigo-600 mb-1">10k+</div>
              <div className="text-gray-600 font-medium">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-extrabold text-indigo-600 mb-1">50+</div>
              <div className="text-gray-600 font-medium">Partner Schools</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-extrabold text-indigo-600 mb-1">4.8/5</div>
              <div className="text-gray-600 font-medium">Average Rating</div>
            </div>
          </div>
          
          {/* Logos Section */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60">
              <div className="text-3xl font-extrabold text-gray-400">TechCrunch</div>
              <div className="text-3xl font-extrabold text-gray-400">EdSurge</div>
              <div className="text-3xl font-extrabold text-gray-400">Forbes</div>
              <div className="text-3xl font-extrabold text-gray-400">The Chronicle</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section - "How It Works" with numbered steps and strong shadows */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <p className="text-lg font-bold text-blue-600 uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            A Structured Path to Your Future
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature Card 1 (with step number box) */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-indigo-300/50 transition-all duration-500 border border-gray-100 group">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-6 text-2xl font-bold">1</div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">6 Modules of Self-Discovery</h3>
            <p className="text-gray-600">
              Discover your strengths, values, and personality through proven assessments
              and interactive activities.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-indigo-300/50 transition-all duration-500 border border-gray-100 group">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-6 text-2xl font-bold">2</div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">3 Core Career Assessments</h3>
            <p className="text-gray-600">
              Take RIASEC, DISC, and TypeFinder assessments to understand your ideal
              career paths and work styles.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-indigo-300/50 transition-all duration-500 border border-gray-100 group">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-6 text-2xl font-bold">3</div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Build Your Signature Project</h3>
            <p className="text-gray-600">
              Create a meaningful passion project that showcases your unique interests
              and stands out in college applications.
            </p>
          </div>
        </div>
      </section>

      {/* 4. What You'll Achieve Section - Dark, high-contrast block for Outcomes */}
      <section className="bg-indigo-900/95 py-24 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-white">
              Your Transformational Outcomes
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
                <div key={idx} className="flex gap-4 items-start border-l-4 border-indigo-400 pl-4 transition-all hover:border-indigo-200 p-2 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-xl mb-1 text-white">{item.title}</h3>
                    <p className="text-indigo-200">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Testimonial Section - Standalone, premium block with subtle decoration */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-10 md:p-16 shadow-2xl shadow-purple-200/50 border border-purple-100 relative overflow-hidden">
             {/* Decorative element for flair */}
             <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full blur-3xl opacity-50"></div>
             
            <div className="text-6xl mb-6 text-center text-purple-600 font-serif leading-none">“</div>
            <blockquote className="text-xl md:text-2xl text-gray-700 font-medium italic text-center mb-8">
              &quot;This platform helped me find my passion for UX design and build a portfolio
              that got me into my dream school. I finally understood what makes me unique
              and how to showcase it.&quot;
            </blockquote>
            <div className="text-center">
              <div className="font-extrabold text-lg text-gray-900">Sarah M.</div>
              <div className="text-purple-600 font-semibold mt-1">Grade 11 &rarr; UC Berkeley</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Final CTA Section - Big, Unmissable Banner (full width color) */}
      <section className="bg-indigo-600 py-24">
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
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                  <Link href="/dashboard">
                    <Button size="lg" className="text-lg px-10 py-7 bg-white text-indigo-600 hover:bg-gray-100 transition-all shadow-xl font-semibold">
                      Go to Dashboard &rarr;
                    </Button>
                  </Link>
                  <Link href="/module-1">
                    <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2 border-indigo-400 text-white hover:bg-indigo-700 transition-all">
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
                <p className="text-xl font-light opacity-90">
                  Join thousands of students who are discovering their path and building
                  compelling profiles for college success.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                  <Link href="/sign-up">
                    <Button size="lg" className="text-lg px-10 py-7 bg-white text-indigo-600 hover:bg-gray-100 transition-all shadow-xl font-semibold">
                      Start Your Journey Free
                    </Button>
                  </Link>
                </div>
                <p className="text-sm opacity-70 pt-2">
                  No credit card required • Complete at your own pace • 3-4 month program
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 7. Footer - Minimalist and Clean */}
      <footer className="border-t border-gray-100 bg-gray-50">
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
