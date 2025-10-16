'use client'

import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { MobileNav } from '@/components/dashboard/MobileNav'
import { useAuth } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()
  const { userId } = useAuth()
  const [userName, setUserName] = useState('User')

  useEffect(() => {
    // Fetch user data for sidebar
    if (userId) {
      fetch('/api/dashboard')
        .then(res => res.json())
        .then(data => setUserName(data.userName))
        .catch(() => {})
    }
  }, [userId])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar
          userName={userName}
          completedModules={0}
          currentStreak={0}
          totalAchievements={0}
        />
      </div>

      {/* Mobile Navigation - Visible only on mobile */}
      <div className="md:hidden">
        <MobileNav userName={userName} />
      </div>

      {/* Main Content - Responsive to sidebar state */}
      <main
        className={`
          transition-all duration-300
          md:pt-0 pt-16
          ${isCollapsed ? 'md:ml-20' : 'md:ml-56'}
          px-4 md:px-8 py-8
        `}
      >
        {children}
      </main>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  )
}
