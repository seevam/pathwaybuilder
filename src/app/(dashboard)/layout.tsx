// src/app/(dashboard)/layout.tsx
import { DashboardNav } from '@/components/dashboard/DashboardNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <DashboardNav />
      {children}
    </div>
  )
}
