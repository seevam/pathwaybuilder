'use client'

import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { MobileNav } from '@/components/dashboard/MobileNav'
import { Header } from '@/components/dashboard/Header'
import { useAuth } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()
  const { userId } = useAuth()
  const [userName, setUserName] = useState('User')
  const [stats, setStats] = useState({
    completedModules: 0,
    currentStreak: 0,
    totalAchievements: 0
  })
  const [gamificationStats, setGamificationStats] = useState({
    xp: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0
  })

  useEffect(() => {
    // Fetch user data for sidebar
    if (userId) {
      fetch('/api/dashboard')
        .then(res => res.json())
        .then(data => {
          setUserName(data.userName || 'User')
          setStats({
            completedModules: data.completedModules || 0,
            currentStreak: data.currentStreak || 0,
            totalAchievements: data.totalAchievements || 0
          })
        })
        .catch(() => {})

      // Fetch gamification stats and profile to determine which stats to show
      Promise.all([
        fetch('/api/gamification/stats').then(res => res.json()),
        fetch('/api/profile').then(res => res.json())
      ])
        .then(([gamificationData, profileData]) => {
          const selectedFeature = profileData.selectedFeature || 'CAREER_EXPLORATION'

          // If IB Learning is selected and user has IB stats, use those
          if (selectedFeature === 'IB_LEARNING' && profileData.ibUserStats) {
            setGamificationStats({
              xp: gamificationData.stats?.xp || 0,
              level: gamificationData.stats?.level || 1,
              currentStreak: profileData.ibUserStats.currentStreak || 0,
              longestStreak: profileData.ibUserStats.longestStreak || 0
            })
          } else {
            // Otherwise use global gamification stats
            setGamificationStats({
              xp: gamificationData.stats?.xp || 0,
              level: gamificationData.stats?.level || 1,
              currentStreak: gamificationData.stats?.currentStreak || 0,
              longestStreak: gamificationData.stats?.longestStreak || 0
            })
          }
        })
        .catch(() => {
          // Fallback to just gamification stats if profile fetch fails
          fetch('/api/gamification/stats')
            .then(res => res.json())
            .then(data => {
              setGamificationStats({
                xp: data.stats?.xp || 0,
                level: data.stats?.level || 1,
                currentStreak: data.stats?.currentStreak || 0,
                longestStreak: data.stats?.longestStreak || 0
              })
            })
            .catch(() => {})
        })
    }
  }, [userId])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden md:block">
        <Sidebar
          userName={userName}
          completedModules={stats.completedModules}
          currentStreak={stats.currentStreak}
          totalAchievements={stats.totalAchievements}
        />
      </aside>

      {/* Mobile Navigation - Visible only on mobile */}
      <div className="md:hidden">
        <MobileNav userName={userName} />
      </div>

      {/* Main Content - Responsive to sidebar state with smooth transition */}
      <main
        className={cn(
          'min-h-screen transition-all duration-300 ease-in-out',
          'pt-16 md:pt-0 pb-20 md:pb-0',
          isCollapsed ? 'md:ml-20' : 'md:ml-56'
        )}
      >
        {/* Header - Visible on desktop */}
        <div className="hidden md:block">
          <Header
            xp={gamificationStats.xp}
            level={gamificationStats.level}
            currentStreak={gamificationStats.currentStreak}
            longestStreak={gamificationStats.longestStreak}
          />
        </div>
        <div className="px-4 md:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}

// Add cn utility import
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
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
