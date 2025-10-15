// src/components/dashboard/ProfileSnapshot.tsx
import { AlertCircle, TrendingUp, Award } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface ProfileSnapshotProps {
  overallProgress: number
  completedActivities: number
  totalActivities: number
}

export function ProfileSnapshot({ 
  overallProgress, 
  completedActivities, 
  totalActivities 
}: ProfileSnapshotProps) {
  return (
    <Card className="p-6 h-full bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-blue-600" />
        Quick Stats
      </h3>
      <div className="space-y-3">
        {/* Overall Progress */}
        <div className="p-4 bg-white rounded-xl border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-blue-700">Overall Progress</p>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-600">{overallProgress}%</span>
            <span className="text-sm text-gray-500">complete</span>
          </div>
        </div>

        {/* Activities */}
        <div className="p-4 bg-white rounded-xl border border-green-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-green-700">Activities</p>
            <AlertCircle className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-green-600">{completedActivities}</span>
            <span className="text-sm text-gray-500">of {totalActivities}</span>
          </div>
          <div className="mt-2 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700"
              style={{ width: `${(completedActivities / totalActivities) * 100}%` }}
            />
          </div>
        </div>

        {/* Status Message */}
        <div className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl border border-purple-200">
          <p className="text-sm font-semibold text-purple-900">
            {overallProgress < 25 && "Just getting started! Keep going!"}
            {overallProgress >= 25 && overallProgress < 50 && "Great progress! You're doing amazing!"}
            {overallProgress >= 50 && overallProgress < 75 && "Halfway there! Keep up the momentum!"}
            {overallProgress >= 75 && "Almost complete! Finish strong!"}
          </p>
        </div>
      </div>
    </Card>
  )
}
