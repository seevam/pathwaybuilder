// src/components/projects/ProjectIdeasSkeleton.tsx
import { Card } from '@/components/ui/card'

export function ProjectIdeasSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-4">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Impact Metrics */}
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-1">
                  <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>

              {/* Button */}
              <div className="pt-2 border-t">
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
