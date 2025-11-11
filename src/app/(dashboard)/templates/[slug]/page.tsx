import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Download } from 'lucide-react'
import { MODULE_DELIVERABLES } from '@/lib/config/module-deliverables'

interface TemplatePageProps {
  params: {
    slug: string
  }
}

const TEMPLATE_CONTENT: Record<string, React.ReactNode> = {
  'identity-collage': <IdentityCollageTemplate />,
  'career-portfolio': <CareerPortfolioTemplate />,
  'education-plan': <EducationPlanTemplate />,
  'work-style-profile': <WorkStyleProfileTemplate />,
  'action-plan': <ActionPlanTemplate />,
  'personal-brand': <PersonalBrandTemplate />,
}

export default function TemplatePage({ params }: TemplatePageProps) {
  const template = TEMPLATE_CONTENT[params.slug]

  if (!template) {
    notFound()
  }

  const deliverable = Object.values(MODULE_DELIVERABLES).find(
    d => d.templateSlug === params.slug
  )

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <Card className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {deliverable?.title} Template
          </h1>
          <p className="text-gray-600">
            Use this template as a guide for creating your deliverable.
          </p>
        </div>

        {template}

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">💡 Tips</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Be authentic and personal in your responses</li>
            <li>• Include specific examples and details</li>
            <li>• Make it visually appealing with colors and images</li>
            <li>• Proofread before submitting</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}

function IdentityCollageTemplate() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Structure</h2>
        <div className="space-y-4 text-gray-700">
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-medium">Section 1: Top Values</h3>
            <p className="text-sm text-gray-600">
              List your top 5 values from the Values Card Sort activity. Include a brief explanation
              of why each value is important to you.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-medium">Section 2: Key Strengths</h3>
            <p className="text-sm text-gray-600">
              Highlight 3-5 key strengths you discovered. Provide examples of how you've demonstrated
              these strengths.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-medium">Section 3: Personality Profile</h3>
            <p className="text-sm text-gray-600">
              Include your RIASEC code, DISC type, and key personality traits. Explain what these
              mean for your career path.
            </p>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="font-medium">Section 4: Personal Motto</h3>
            <p className="text-sm text-gray-600">
              Create or choose a personal motto or quote that represents who you are and what you
              stand for.
            </p>
          </div>

          <div className="border-l-4 border-pink-500 pl-4">
            <h3 className="font-medium">Section 5: Visual Elements</h3>
            <p className="text-sm text-gray-600">
              Add images, colors, symbols, or graphics that represent your identity and aspirations.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Format Options</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Digital collage (Canva, PowerPoint, Google Slides)</li>
          <li>• Physical collage (poster board with printed/cut materials)</li>
          <li>• Infographic design</li>
          <li>• Video presentation</li>
        </ul>
      </section>
    </div>
  )
}

function CareerPortfolioTemplate() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Structure</h2>
        <div className="space-y-4 text-gray-700">
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-medium">1. Holland Code Summary</h3>
            <p className="text-sm text-gray-600">
              Explain your Holland Code and the top career matches it suggests.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-medium">2. Career Clusters Explored</h3>
            <p className="text-sm text-gray-600">
              Document at least 3 career clusters and why they interest you.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-medium">3. "Day in the Life" Research</h3>
            <p className="text-sm text-gray-600">
              Provide detailed research for 2-3 specific careers, including typical tasks, work
              environment, and requirements.
            </p>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="font-medium">4. Values Alignment</h3>
            <p className="text-sm text-gray-600">
              Reflect on how these careers align with your personal values and strengths.
            </p>
          </div>

          <div className="border-l-4 border-pink-500 pl-4">
            <h3 className="font-medium">5. Top Career Paths</h3>
            <p className="text-sm text-gray-600">
              Identify your top 3 career paths to explore further and explain your reasoning.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function EducationPlanTemplate() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Structure</h2>
        <div className="space-y-4 text-gray-700">
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-medium">1. Education Requirements</h3>
            <p className="text-sm text-gray-600">
              List education/training needed for your top career choices (degrees, certifications,
              etc.).
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-medium">2. Programs & Institutions</h3>
            <p className="text-sm text-gray-600">
              Research and list relevant colleges, programs, or training options with admission
              requirements.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-medium">3. Alternative Pathways</h3>
            <p className="text-sm text-gray-600">
              Explore alternatives like apprenticeships, boot camps, certifications, or
              self-directed learning.
            </p>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="font-medium">4. Timeline</h3>
            <p className="text-sm text-gray-600">
              Create a timeline from high school through career entry with key milestones.
            </p>
          </div>

          <div className="border-l-4 border-pink-500 pl-4">
            <h3 className="font-medium">5. SMART Goals</h3>
            <p className="text-sm text-gray-600">
              Set specific, measurable goals for your education journey.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function WorkStyleProfileTemplate() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Structure</h2>
        <div className="space-y-4 text-gray-700">
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-medium">1. DISC Profile</h3>
            <p className="text-sm text-gray-600">
              Summarize your DISC type and what it means for your work style.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-medium">2. Work Environment Preferences</h3>
            <p className="text-sm text-gray-600">
              Describe your ideal work environment (remote, office, hybrid, structured vs. flexible,
              etc.).
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-medium">3. Collaboration Style</h3>
            <p className="text-sm text-gray-600">
              Explain how you work best with others and your preferred team roles.
            </p>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="font-medium">4. Time Management</h3>
            <p className="text-sm text-gray-600">
              Share strategies that work for you in managing time and staying productive.
            </p>
          </div>

          <div className="border-l-4 border-pink-500 pl-4">
            <h3 className="font-medium">5. Career Application</h3>
            <p className="text-sm text-gray-600">
              Reflect on how to leverage your work style in your chosen career path.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function ActionPlanTemplate() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Structure</h2>
        <div className="space-y-4 text-gray-700">
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-medium">1. Quarterly Goals</h3>
            <p className="text-sm text-gray-600">
              Set goals for the next 4 quarters with specific objectives for each.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-medium">2. Timeline Builder</h3>
            <p className="text-sm text-gray-600">
              Create a visual timeline with key milestones over the next 1-3 years.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-medium">3. Story Arc</h3>
            <p className="text-sm text-gray-600">
              Write your personal narrative: where you've been, where you are, and where you're
              going.
            </p>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="font-medium">4. Accountability System</h3>
            <p className="text-sm text-gray-600">
              Identify your support network, check-in schedule, and how you'll track progress.
            </p>
          </div>

          <div className="border-l-4 border-pink-500 pl-4">
            <h3 className="font-medium">5. Action Steps</h3>
            <p className="text-sm text-gray-600">
              List concrete, specific action steps with deadlines for the next 90 days.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function PersonalBrandTemplate() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Structure</h2>
        <div className="space-y-4 text-gray-700">
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-medium">1. Elevator Pitch</h3>
            <p className="text-sm text-gray-600">
              Craft a compelling 30-60 second introduction that captures who you are and what you
              offer. Practice and record it.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-medium">2. Digital Presence Strategy</h3>
            <p className="text-sm text-gray-600">
              Plan your online presence (LinkedIn profile, portfolio website, social media strategy).
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-medium">3. Skill Gap Analysis</h3>
            <p className="text-sm text-gray-600">
              Identify current skills vs. needed skills, with a development plan for closing gaps.
            </p>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="font-medium">4. Integration Reflection</h3>
            <p className="text-sm text-gray-600">
              Connect insights from all previous modules into a cohesive personal brand narrative.
            </p>
          </div>

          <div className="border-l-4 border-pink-500 pl-4">
            <h3 className="font-medium">5. Unique Value Proposition</h3>
            <p className="text-sm text-gray-600">
              Articulate what makes you unique and valuable in your chosen field.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
