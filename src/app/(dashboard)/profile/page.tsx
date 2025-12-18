import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import {
  ProfileHeader,
  ProfileStats,
  ProfileAchievements,
  ProfileProjects,
  ProfileInfo,
} from '@/components/profile';

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      profile: true,
      projects: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      achievements: {
        orderBy: { unlockedAt: 'desc' },
      },
    },
  });

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-accent-50">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/profile/edit">
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          {/* Profile Header */}
          <ProfileHeader
            name={user.name}
            email={user.email}
            grade={user.grade}
            createdAt={user.createdAt}
            level={user.level}
            avatar={user.avatar}
          />

          {/* Gamification Stats */}
          <ProfileStats
            xp={user.xp}
            level={user.level}
            currentStreak={user.currentStreak}
            longestStreak={user.longestStreak}
          />

          {/* Profile Information Grid */}
          <ProfileInfo
            bio={user.profile?.bio}
            goals={user.profile?.goals}
            topValues={user.profile?.topValues || []}
            topStrengths={user.profile?.topStrengths || []}
          />

          {/* Achievements */}
          <ProfileAchievements achievements={user.achievements} />

          {/* Projects */}
          <ProfileProjects projects={user.projects} />

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary-600" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/profile/edit">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <a
                    href="https://accounts.clerk.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Account
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
