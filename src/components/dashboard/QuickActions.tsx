import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { BarChart3, Rocket, MessageCircle, Award } from 'lucide-react'

const quickActions = [
  {
    icon: BarChart3,
    title: 'View Assessment Results',
    description: 'Review your personality profiles',
    href: '/assessments',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Rocket,
    title: 'Start Passion Project',
    description: 'Begin building your portfolio',
    href: '/projects/new',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: Award,
    title: 'View Badges',
    description: 'See your achievements',
    href: '/badges',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: MessageCircle,
    title: 'Get Help & Support',
    description: 'Access resources and FAQs',
    href: '/help',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
]

export function QuickActions() {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Link key={action.href} href={action.href}>
              <Card className="h-full transition-all hover:shadow-md hover:scale-105 cursor-pointer">
                <div className="p-6 space-y-3">
                  <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${action.color}`} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
