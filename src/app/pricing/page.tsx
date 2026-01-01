'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Zap, Crown, Star, TrendingUp, Users, Award } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const { userId } = useAuth();
  const isSignedIn = !!userId;

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for getting started on your journey',
      icon: Sparkles,
      color: 'from-gray-400 to-gray-600',
      borderColor: 'border-gray-300',
      bgColor: 'bg-gray-50',
      popular: false,
      features: [
        { text: '100 credits on signup', included: true },
        { text: 'Access to all core modules', included: true },
        { text: 'Basic project tools', included: true },
        { text: 'Community support', included: true },
        { text: 'AI-powered insights', included: false },
        { text: 'Priority support', included: false },
        { text: 'Advanced analytics', included: false },
        { text: 'Unlimited AI sessions', included: false },
      ],
      cta: isSignedIn ? 'Current Plan' : 'Get Started Free',
      ctaLink: isSignedIn ? '#' : '/sign-up',
    },
    {
      name: 'Premium',
      price: { monthly: 14.99, annual: 119.99 },
      description: 'For students serious about building their future',
      icon: Crown,
      color: 'from-indigo-500 to-purple-600',
      borderColor: 'border-indigo-500',
      bgColor: 'bg-indigo-50',
      popular: true,
      features: [
        { text: '500 credits monthly + bonus credits', included: true },
        { text: 'Everything in Free', included: true },
        { text: 'Unlimited AI-powered sessions', included: true },
        { text: 'Advanced project analytics', included: true },
        { text: 'Priority support (24hr response)', included: true },
        { text: 'Bonus credits for activities', included: true },
        { text: 'Early access to new features', included: true },
        { text: '1-on-1 coaching session (annual)', included: true },
      ],
      cta: 'Start Premium',
      ctaLink: '/sign-up?plan=premium',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="flex justify-center pt-4 px-4">
          <nav className="flex h-16 w-full max-w-6xl items-center justify-between rounded-full border backdrop-blur-2xl px-6 bg-white/90 border-white/50 shadow-2xl shadow-indigo-500/10">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 blur-md opacity-40 -z-10" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
                Pathway Builder
              </span>
            </Link>
            <div className="flex items-center gap-2">
              {isSignedIn ? (
                <Link href="/dashboard">
                  <Button variant="ghost" className="rounded-full text-sm font-semibold text-gray-700 hover:bg-white/60">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button variant="ghost" className="rounded-full text-sm font-semibold text-gray-700 hover:bg-white/60">
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
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-semibold text-sm mb-6">
            <Star className="h-4 w-4 fill-current" />
            Start with 100 free credits
          </div>

          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Choose the plan that{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              fits your journey
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Start free with 100 credits, or go premium for unlimited access to AI-powered guidance and advanced features
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-white rounded-full p-2 shadow-lg border-2 border-gray-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                billingCycle === 'annual'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                Save 33%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative rounded-3xl border-4 ${plan.borderColor} ${plan.bgColor} p-8 hover:scale-105 transition-transform ${
                  plan.popular ? 'shadow-2xl' : 'shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} text-white mb-6`}>
                  <plan.icon className="h-8 w-8" />
                </div>

                {/* Plan Name */}
                <h3 className="text-3xl font-black text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-gray-900">
                      ${billingCycle === 'monthly' ? plan.price.monthly : (plan.price.annual / 12).toFixed(2)}
                    </span>
                    <span className="text-gray-600 font-semibold">/month</span>
                  </div>
                  {billingCycle === 'annual' && plan.price.annual > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Billed ${plan.price.annual}/year
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <Link href={plan.ctaLink}>
                  <Button
                    className={`w-full rounded-2xl font-bold text-lg py-6 mb-8 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl'
                        : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>

                {/* Features */}
                <div className="space-y-4">
                  {plan.features.map((feature, featureIdx) => (
                    <div key={featureIdx} className="flex items-start gap-3">
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                          feature.included
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      >
                        {feature.included ? (
                          <Check className="h-4 w-4 text-white" strokeWidth={3} />
                        ) : (
                          <span className="text-white text-xs">-</span>
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          feature.included ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credit System Explanation */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl font-black text-white mb-6">How Credits Work</h2>
          <p className="text-xl text-indigo-100 mb-12">
            Credits power your journey through Pathway Builder. Use them for AI sessions, assessments, and premium features.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: 'Earn Credits',
                description: 'Complete activities and modules to earn bonus credits',
              },
              {
                icon: TrendingUp,
                title: 'Use Credits',
                description: 'Spend credits on AI coaching, advanced analytics, and premium tools',
              },
              {
                icon: Award,
                title: 'Premium Bonus',
                description: 'Premium members earn 2x credits for every activity',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/20">
                <item.icon className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-indigo-100">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                question: 'Can I start for free?',
                answer: 'Absolutely! Every new user gets 100 credits on signup. You can explore all core modules and features before deciding to upgrade.',
              },
              {
                question: 'What happens when I run out of credits?',
                answer: 'You can still access all your completed work and basic features. Upgrade to Premium for unlimited credits, or earn more by completing activities and modules.',
              },
              {
                question: 'Can I cancel anytime?',
                answer: 'Yes! You can cancel your Premium subscription at any time. You\'ll continue to have access until the end of your billing period.',
              },
              {
                question: 'Do credits roll over?',
                answer: 'Premium members get a fresh credit allocation each month. Earned bonus credits never expire!',
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-b from-white to-indigo-50 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Ready to start your journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
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
          <p className="text-sm text-gray-500 mt-4">100 credits • No credit card required</p>
        </div>
      </section>

      {/* Footer */}
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
              <p className="text-gray-400 text-sm">The proven, fun way to discover yourself and build your college story.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
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
