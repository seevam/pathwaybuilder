'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Map, User, Rocket, Menu, Lightbulb, Users, TrophyIcon, Settings, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface MobileNavProps {
  userName: string
}

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/ideas', label: 'Discover Ideas', icon: Lightbulb },
  { href: '/projects', label: 'Projects', icon: Rocket },
  { href: '/discover', label: 'Find Collaborations', icon: Users },
  { href: '/leaderboard', label: 'Leaderboard', icon: TrophyIcon },
  { href: '/ib-learning', label: 'Exam Prep', icon: GraduationCap },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function MobileNav({ userName }: MobileNavProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="text-2xl">🚀</div>
            <span className="font-bold text-gray-900 text-sm">PathwayBuilder</span>
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="py-6">
                <div className="mb-6 px-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Welcome
                  </div>
                  <div className="text-lg font-bold text-gray-900 truncate">
                    {userName}
                  </div>
                </div>

                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-3 rounded-lg transition-all',
                          isActive
                            ? 'bg-blue-50 text-blue-600 font-semibold'
                            : 'text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-2 py-2 safe-area-inset-bottom">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all flex-1',
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-500'
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
