'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Map, User, Rocket, Award, Menu, X, Bot, Lightbulb, Users, TrophyIcon, Settings, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/contexts/SidebarContext'
import { AIMascot } from '@/components/ai-mascot/AIMascot'

interface SidebarProps {
  userName: string
  completedModules: number
  currentStreak: number
  totalAchievements: number
}

export function Sidebar({ userName, completedModules, currentStreak, totalAchievements }: SidebarProps) {
  const pathname = usePathname()
  const { isCollapsed, toggleSidebar } = useSidebar()

  const navItems = [
    { href: '/dashboard', label: 'My Journey', icon: Map },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/ideas', label: 'Discover Ideas', icon: Lightbulb },
    { href: '/projects', label: 'Projects', icon: Rocket },
    { href: '/discover', label: 'Find Collaborations', icon: Users },
    { href: '/leaderboard', label: 'Leaderboard', icon: TrophyIcon },
    { href: '/insights', label: 'Insights', icon: Award },
    { href: '/learning-hub', label: 'Yoda AI', icon: Bot },
    { href: '/ib-learning', label: 'IB Learning', icon: GraduationCap },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside
      className={cn(
        'bg-white border-r border-gray-200 fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 z-40',
        isCollapsed ? 'w-20' : 'w-56'
      )}
    >
      {/* Header with Toggle */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="text-2xl">🚀</div>
            <div className="font-bold text-gray-900 text-sm">PathwayBuilder</div>
          </Link>
        )}
        {isCollapsed && (
          <div className="text-2xl mx-auto">🚀</div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className={cn('h-8 w-8 p-0', isCollapsed && 'mx-auto')}
        >
          {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-lg transition-all group relative',
                isActive
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50',
                isCollapsed && 'justify-center'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              
              {/* Tooltip when collapsed */}
              {isCollapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* AI Mascot at bottom */}
      <div className="p-3 border-t border-gray-200">
        <AIMascot inSidebar={true} isCollapsed={isCollapsed} />
      </div>
    </aside>
  )
}
