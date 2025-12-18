import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Flame, Zap, TrendingUp } from 'lucide-react';

interface ProfileStatsProps {
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
}

export function ProfileStats({ xp, level, currentStreak, longestStreak }: ProfileStatsProps) {
  // Calculate XP needed for next level (example: level * 1000)
  const xpForNextLevel = level * 1000;
  const xpProgress = (xp % 1000) / 10; // Progress as percentage for current level

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Level Card */}
      <Card className="border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-primary-700">
            <Trophy className="h-4 w-4" />
            Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary-900">{level}</div>
          <div className="mt-2">
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>{xp % 1000} XP</span>
              <span>{xpForNextLevel} XP</span>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Total XP Card */}
      <Card className="border-2 border-accent-200 bg-gradient-to-br from-accent-50 to-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-accent-700">
            <Zap className="h-4 w-4" />
            Total XP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-accent-900">
            {xp.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Experience points earned
          </p>
        </CardContent>
      </Card>

      {/* Current Streak Card */}
      <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-orange-700">
            <Flame className="h-4 w-4" />
            Current Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-900">
            {currentStreak}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {currentStreak === 1 ? 'day' : 'days'} in a row
          </p>
        </CardContent>
      </Card>

      {/* Longest Streak Card */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-purple-700">
            <TrendingUp className="h-4 w-4" />
            Best Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-900">
            {longestStreak}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {longestStreak === 1 ? 'day' : 'days'} personal best
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
