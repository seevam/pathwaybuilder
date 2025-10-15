'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Map, User, Rocket, Award, Star, Flame, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  userName: string
  completedModules: number
  currentStreak: number
  totalAchievements: number
}

export function Sidebar({ userName, completedModules, currentStreak, totalAchievements }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'My Journey', icon: Map },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/projects', label: 'Projects', icon: Rocket },
    { href: '/insights', label: 'Insights', icon: Award },
  ]

  return (
    <aside className="w-56 bg-white border-r border-gray-200 fixed left-0 top-0 h-screen flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="text-2xl">🚀</div>
          <div className="font-bold text-gray-900">PathwayBuilder</div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                isActive
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* My Status Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="mb-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            My Status
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-semibold">{userName}</span>
          </div>
        </div>

        {/* Achievement Icons */}
        <div className="flex items-center justify-around gap-2 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
            </div>
            <div className="text-xs font-semibold text-gray-600 mt-1">{completedModules}</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-600 fill-orange-600" />
            </div>
            <div className="text-xs font-semibold text-gray-600 mt-1">{currentStreak}</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-purple-600 fill-purple-600" />
            </div>
            <div className="text-xs font-semibold text-gray-600 mt-1">{totalAchievements}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
