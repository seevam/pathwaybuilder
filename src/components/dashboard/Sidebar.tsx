'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Map, User, Rocket, Award, Star, Flame, Trophy, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/contexts/SidebarContext'

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
    { href: '/projects', label: 'Projects', icon: Rocket },
    { href: '/insights', label: 'Insights', icon: Award },
    { href: '/learning-hub', label: 'Yoda AI', icon: Robot },

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

      {/* My Status Section */}
      <div className="p-3 border-t border-gray-200">
        {!isCollapsed ? (
          <>
            <div className="mb-3 px-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                My Status
              </div>
              <div className="text-sm text-gray-700 truncate">
                <span className="font-semibold">{userName}</span>
              </div>
            </div>

            {/* Achievement Icons - Expanded */}
            <div className="flex items-center justify-around gap-2 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                </div>
                <div className="text-xs font-semibold text-gray-600 mt-1">{completedModules}</div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-600 fill-orange-600" />
                </div>
                <div className="text-xs font-semibold text-gray-600 mt-1">{currentStreak}</div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-purple-600 fill-purple-600" />
                </div>
                <div className="text-xs font-semibold text-gray-600 mt-1">{totalAchievements}</div>
              </div>
            </div>
          </>
        ) : (
          /* Achievement Icons - Collapsed (stacked vertically) */
          <div className="space-y-3">
            <div className="flex flex-col items-center group relative">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
              </div>
              <div className="text-xs font-semibold text-gray-600 mt-1">{completedModules}</div>
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                Modules Completed
              </span>
            </div>
            
            <div className="flex flex-col items-center group relative">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600 fill-orange-600" />
              </div>
              <div className="text-xs font-semibold text-gray-600 mt-1">{currentStreak}</div>
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                Day Streak
              </span>
            </div>
            
            <div className="flex flex-col items-center group relative">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-purple-600 fill-purple-600" />
              </div>
              <div className="text-xs font-semibold text-gray-600 mt-1">{totalAchievements}</div>
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                Achievements
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
