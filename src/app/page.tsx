// src/app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { LandingHeader } from "@/components/landing/LandingHeader";

export default async function Home() {
  const { userId } = await auth();
  const isSignedIn = !!userId;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <LandingHeader isSignedIn={isSignedIn} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500/20 rounded-full blur-3xl"></div>

        <div className="relative container mx-auto px-4 py-20 md:py-32 text-center space-y-8">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Pathway to College Distinction
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
            Discover Who You Are. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Build What Matters.
            </span>
            <br />
            Own Your Story.
          </h1>

          <p className="text-xl md:text-2xl text-indigo-200 max-w-3xl mx-auto font-light">
            Transform the overwhelming college preparation process into an engaging, structured journey of self-discovery and meaningful achievement.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {isSignedIn ? (
              <>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="text-lg px-10 py-7 bg-white text-indigo-900 hover:bg-gray-100 transition-all shadow-lg font-semibold"
                  >
                    Go to Dashboard →
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-10 py-7 border-2 border-white/70 text-white hover:bg-white/20 hover:text-white transition-all backdrop-blur-sm"
                  >
                    My Projects
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="text-lg px-10 py-7 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white transition-all shadow-lg font-semibold"
                  >
                    Start Your Journey Free
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-7 border-2 border-white/70 text-white hover:bg-white/20 hover:text-white transition-all backdrop-blur-sm"
                >
                  Watch Demo (2 min)
                </Button>
              </>
            )}
          </div>

          {/* Hero Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video mt-12">
            <Image
              src="/hero.jpg"
              alt="Diverse students collaborating on creative projects"
              width={1100}
              height={675}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="bg-white py-16 border-b">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm uppercase tracking-wide mb-6">
            Trusted by schools and students worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-80">
            <Image src="/logos/harvard.png" alt="Harvard" width={100} height={40} />
            <Image src="/logos/mit.png" alt="MIT" width={100} height={40} />
            <Image src="/logos/stanford.png" alt="Stanford" width={100} height={40} />
            <Image src="/logos/oxford.png" alt="Oxford" width={100} height={40} />
            <Image src="/logos/yale.png" alt="Yale" width={100} height={40} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-indigo-900 mb-12">
            Build a Stronger College Profile
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Discover Your Strengths",
                desc: "Identify your interests, values, and passions through structured reflection exercises.",
                icon: "🧠",
              },
              {
                title: "Design Impact Projects",
                desc: "Turn your passions into real-world projects that demonstrate leadership and creativity.",
                icon: "🚀",
              },
              {
                title: "Craft Your Narrative",
                desc: "Develop essays and portfolios that reflect your authentic journey and purpose.",
                icon: "✍️",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-2xl font-semibold mb-2 text-indigo-900">
                  {f.title}
                </h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12">Students Who Built Their Futures</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                name: "Aanya Sharma",
                story:
                  "Designed a mental health chatbot to support teens. Admitted to Stanford for Computer Science.",
                img: "/students/aanya.jpg",
              },
              {
                name: "Rohit Mehta",
                story:
                  "Built a low-cost water filter prototype for rural areas. Admitted to MIT Mechanical Engineering.",
                img: "/students/rohit.jpg",
              },
              {
                name: "Sofia Tan",
                story:
                  "Led an environmental initiative reducing school plastic waste. Admitted to Yale for Environmental Studies.",
                img: "/students/sofia.jpg",
              },
            ].map((s) => (
              <div
                key={s.name}
                className="bg-white/10 rounded-2xl p-8 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
              >
                <Image
                  src={s.img}
                  alt={s.name}
                  width={80}
                  height={80}
                  className="mx-auto rounded-full mb-4"
                />
                <h3 className="text-xl font-semibold">{s.name}</h3>
                <p className="text-indigo-100 mt-3 text-sm">{s.story}</p>
              </div>
            ))}
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
                    <Button
                      size="lg"
                      className="text-lg px-12 py-7 bg-white text-indigo-600 hover:bg-gray-100 transition-all shadow-lg font-semibold"
                    >
                      Go to Dashboard →
                    </Button>
                  </Link>
                  <Link href="/module-1">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-12 py-7 border-2 border-white/70 text-white hover:bg-white/20 hover:text-white transition-all backdrop-blur-sm"
                    >
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
                  Join thousands of students discovering their path and building impactful profiles for college success.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link href="/sign-up">
                    <Button
                      size="lg"
                      className="text-lg px-12 py-7 bg-white text-indigo-600 hover:bg-gray-100 transition-all shadow-lg font-bold"
                    >
                      Start Your Journey Free
                    </Button>
                  </Link>
                </div>
                <p className="text-sm opacity-80 pt-4">
                  No credit card required • Self-paced • Designed by top educators
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center">
        <p>© {new Date().getFullYear()} GrowWise. All rights reserved.</p>
      </footer>
    </div>
  );
}
