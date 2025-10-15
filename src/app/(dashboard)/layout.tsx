'use client'

import { SidebarProvider } from '@/contexts/SidebarContext'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  )
}
