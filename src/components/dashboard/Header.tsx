'use client'

import { useClerk, useUser } from '@clerk/nextjs'
import { Settings, LogOut, User, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { HeaderStats } from '@/components/dashboard/HeaderStats'

interface HeaderProps {
  xp?: number
  level?: number
  currentStreak?: number
  longestStreak?: number
}

export function Header({ xp = 0, level = 1, currentStreak = 0, longestStreak = 0 }: HeaderProps) {
  const { signOut } = useClerk()
  const { user } = useUser()

  const handleSignOut = async () => {
    await signOut({ redirectUrl: '/' })
  }

  const userInitials = user?.fullName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || user?.firstName?.[0]?.toUpperCase() || 'U'

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 md:px-8 py-3">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-lg md:text-xl font-semibold text-gray-900">
            Welcome back, {user?.firstName || 'User'}!
          </h1>
          <p className="text-sm text-gray-500 hidden md:block">
            Continue your learning journey
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Stats Display */}
          <HeaderStats
            xp={xp}
            level={level}
            currentStreak={currentStreak}
            longestStreak={longestStreak}
          />

          {/* Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-auto py-2 px-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.fullName || user?.firstName || 'User'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user?.primaryEmailAddress?.emailAddress}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-600 focus:text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
