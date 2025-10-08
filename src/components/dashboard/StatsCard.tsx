import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  icon?: React.ReactNode
  title: string
  value: string
  description?: string
  trend?: string
  highlighted?: boolean
}

export function StatsCard({ 
  icon, 
  title, 
  value, 
  description, 
  trend,
  highlighted = false 
}: StatsCardProps) {
  return (
    <Card className={cn(
      "transition-all hover:shadow-lg",
      highlighted && "border-2 border-orange-500 bg-orange-50"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          {icon && (
            <div className="text-gray-400">
              {icon}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          {trend && (
            <span className="text-sm font-medium text-green-600">
              {trend}
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
