// src/components/dashboard/QuickActions.tsx
'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { BarChart3, Rocket, MessageCircle, Award } from 'lucide-react'

const quickActions = [
  {
    icon: BarChart3,
    title: 'View Insights',
    description: 'See your personalized results',
    href: '/insights',
    gradient: 'from-blue-500 to-blue-600',
    bgGradient: 'from-blue-50 to-blue-100',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: Rocket,
    title: 'Start Project',
    description: 'Build your portfolio',
    href: '/projects/brainstorm',
    gradient: 'from-green-500 to-green-600',
    bgGradient: 'from-green-50 to-green-100',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    icon: Award,
    title: 'View Badges',
    description: 'See achievements',
    href: '/badges',
    gradient: 'from-purple-500 to-purple-600',
    bgGradient: 'from-purple-50 to-purple-100',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    icon: MessageCircle,
    title: 'Get Help',
    description: 'Access support',
    href: '/help',
    gradient: 'from-orange-500 to-orange-600',
    bgGradient: 'from-orange-50 to-orange-100',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
]

export function QuickActions() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Link key={action.href} href={action.href}>
              <Card className={`h-full transition-all hover:shadow-xl hover:scale-105 cursor-pointer border-2 border-transparent hover:border-gray-200 bg-gradient-to-br ${action.bgGradient}`}>
                <div className="p-6 space-y-4">
                  <div className={`w-14 h-14 ${action.iconBg} rounded-2xl flex items-center justify-center shadow-md`}>
                    <Icon className={`w-7 h-7 ${action.iconColor}`} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900 text-lg">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <div className={`h-1 w-16 bg-gradient-to-r ${action.gradient} rounded-full`} />
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
