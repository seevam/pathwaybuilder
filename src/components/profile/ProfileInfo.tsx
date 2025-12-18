import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Target, Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface ProfileInfoProps {
  bio?: string | null;
  goals?: unknown;
  topValues?: string[];
  topStrengths?: string[];
}

export function ProfileInfo({
  bio,
  goals,
  topValues = [],
  topStrengths = [],
}: ProfileInfoProps) {
  // Type guard for goals
  const goalsList = Array.isArray(goals)
    ? goals.filter((g): g is string => typeof g === 'string')
    : [];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Bio Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary-600" />
            About Me
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bio ? (
            <p className="text-sm text-gray-700">{bio}</p>
          ) : (
            <div className="py-4 text-center">
              <p className="mb-3 text-sm text-muted-foreground">
                No bio added yet
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile/edit">Add Bio</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Goals Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary-600" />
            My Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {goalsList.length > 0 ? (
            <ul className="space-y-2">
              {goalsList.map((goal, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-0.5 text-green-500">✓</span>
                  <span className="text-sm text-gray-700">{goal}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-4 text-center">
              <p className="mb-3 text-sm text-muted-foreground">
                No goals set yet
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/onboarding">Set Goals</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Values */}
      {topValues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary-600" />
              Core Values
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topValues.map((value, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                  {value}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Strengths */}
      {topStrengths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary-600" />
              Top Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topStrengths.map((strength, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="bg-green-100 text-green-700 hover:bg-green-200"
                >
                  {strength}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
