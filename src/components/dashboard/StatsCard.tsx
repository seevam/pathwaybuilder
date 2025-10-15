// src/components/dashboard/StatsCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  icon?: React.ReactNode
  title: string
  value: string
  description?: string
  trend?: string
  highlighted?: boolean
  circularProgress?: number
  progress?: number
  unit?: string
}

export function StatsCard({ 
  icon, 
  title, 
  value, 
  description, 
  trend,
  highlighted = false,
  circularProgress,
  progress,
  unit
}: StatsCardProps) {
  return (
    <Card className={cn(
      "transition-all hover:shadow-xl hover:scale-105 border-2",
      highlighted 
        ? "border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100" 
        : "border-gray-100 bg-white"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            {title}
          </CardTitle>
          {icon && (
            <div className={cn(
              "p-2 rounded-lg",
              highlighted ? "bg-orange-200" : "bg-gray-100"
            )}>
              {icon}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {circularProgress !== undefined ? (
          <div className="flex items-center gap-4">
            {/* Circular Progress */}
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  className="text-gray-200"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  cx="18"
                  cy="18"
                  r="15.9155"
                />
                <circle
                  className="text-blue-500"
                  strokeWidth="3"
                  strokeDasharray={`${circularProgress}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  cx="18"
                  cy="18"
                  r="15.9155"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-900">{value}</span>
              </div>
            </div>
            <div className="flex-1">
              {description && (
                <p className="text-sm text-gray-600">{description}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              {value}
            </div>
            {unit && (
              <span className="text-lg font-medium text-gray-500">{unit}</span>
            )}
            {trend && (
              <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {trend}
              </span>
            )}
          </div>
        )}
        
        {!circularProgress && description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}

        {progress !== undefined && (
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
