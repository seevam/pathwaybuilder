import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Star, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Achievement {
  id: string;
  achievementType: string;
  achievementId: string;
  name: string;
  description: string;
  iconUrl: string;
  xpAwarded: number;
  unlockedAt: Date;
}

interface ProfileAchievementsProps {
  achievements: Achievement[];
}

const ACHIEVEMENT_ICONS: Record<string, string> = {
  BADGE: '🏆',
  LEVEL_UP: '⬆️',
  STREAK_MILESTONE: '🔥',
  PROJECT_MILESTONE: '🎯',
  SPECIAL: '⭐',
};

export function ProfileAchievements({ achievements }: ProfileAchievementsProps) {
  if (achievements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary-600" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            <Sparkles className="mx-auto h-12 w-12 opacity-20" />
            <p className="mt-3">No achievements unlocked yet</p>
            <p className="mt-1 text-sm">
              Complete projects and stay active to earn achievements!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentAchievements = achievements
    .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
    .slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary-600" />
            Achievements
            <Badge variant="secondary" className="ml-2">
              {achievements.length}
            </Badge>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className="group relative overflow-hidden rounded-lg border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-white p-4 transition-all hover:shadow-duo-hover"
            >
              {/* Achievement Icon */}
              <div className="mb-3 flex items-center justify-between">
                <div className="text-3xl">
                  {ACHIEVEMENT_ICONS[achievement.achievementType] || '🏅'}
                </div>
                <div className="flex items-center gap-1 text-xs text-accent-600">
                  <Star className="h-3 w-3 fill-current" />
                  <span className="font-semibold">+{achievement.xpAwarded} XP</span>
                </div>
              </div>

              {/* Achievement Details */}
              <h3 className="mb-1 font-bold text-gray-900">{achievement.name}</h3>
              <p className="mb-2 text-sm text-muted-foreground line-clamp-2">
                {achievement.description}
              </p>

              {/* Unlocked Date */}
              <p className="text-xs text-gray-500">
                Unlocked {formatDistanceToNow(new Date(achievement.unlockedAt), { addSuffix: true })}
              </p>
            </div>
          ))}
        </div>

        {achievements.length > 6 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Showing {recentAchievements.length} of {achievements.length} achievements
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
