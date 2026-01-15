'use client'

import { Zap, Flame, Award, TrendingUp } from 'lucide-react'

interface HeaderStatsProps {
  xp: number
  level: number
  currentStreak: number
  longestStreak: number
}

export function HeaderStats({ xp, level, currentStreak, longestStreak }: HeaderStatsProps) {
  return (
    <div className="flex items-center gap-3">
      {/* XP Display */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg hover:shadow-md transition-shadow">
        <div className="p-1 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-md">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-yellow-700">{xp.toLocaleString()}</span>
          <span className="text-[10px] text-yellow-600">XP</span>
        </div>
      </div>

      {/* Current Streak */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg hover:shadow-md transition-shadow">
        <div className="p-1 bg-gradient-to-br from-orange-400 to-red-500 rounded-md">
          <Flame className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-orange-700">{currentStreak}</span>
          <span className="text-[10px] text-orange-600">Day Streak</span>
        </div>
      </div>

      {/* Best Streak */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg hover:shadow-md transition-shadow">
        <div className="p-1 bg-gradient-to-br from-purple-400 to-pink-500 rounded-md">
          <Award className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-purple-700">{longestStreak}</span>
          <span className="text-[10px] text-purple-600">Best Streak</span>
        </div>
      </div>
    </div>
  )
}
