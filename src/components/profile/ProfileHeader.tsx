import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Calendar, GraduationCap, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ProfileHeaderProps {
  name: string;
  email: string;
  grade?: number | null;
  createdAt: Date;
  level: number;
  avatar?: string | null;
}

export function ProfileHeader({
  name,
  email,
  grade,
  createdAt,
  level,
  avatar,
}: ProfileHeaderProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="border-2 border-primary-200 bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="relative">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="h-24 w-24 rounded-full border-4 border-white shadow-xl"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-primary-500 to-accent-500 text-3xl font-bold text-white shadow-xl">
                {initials}
              </div>
            )}
            {/* Level Badge */}
            <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-accent-400 to-accent-600 shadow-lg">
              <span className="text-sm font-bold text-white">{level}</span>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
              <Badge className="bg-primary-100 text-primary-700 hover:bg-primary-200">
                <Shield className="mr-1 h-3 w-3" />
                Level {level}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{email}</span>
              </div>

              {grade && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  <span>Grade {grade}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Member for{' '}
                  {formatDistanceToNow(new Date(createdAt), { addSuffix: false })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
