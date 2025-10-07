import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              🎓 Pathway Builder
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

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

          {/* Hero Image Placeholder */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 to-green-100 aspect-video flex items-center justify-center">
            <div className="text-gray-400 text-lg">
              [Diverse students working on projects - Hero Image]
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started Free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Watch Demo (2 min)
            </Button>
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
              What You'll Achieve
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
              "This platform helped me find my passion for UX design and build a portfolio 
              that got me into my dream school. I finally understood what makes me unique 
              and how to showcase it."
            </blockquote>
            <div className="text-center">
              <div className="font-bold text-lg">Sarah M.</div>
              <div className="text-gray-600">Grade 11 → UC Berkeley</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🏫</div>
              <span className="font-semibold">Trusted by 50+ schools</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="text-2xl">👥</div>
              <span className="font-semibold">10,000+ students</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="text-2xl">⭐</div>
              <span className="font-semibold">4.8/5 rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8">
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
