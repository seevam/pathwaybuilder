import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  SettingsHeader,
  AccountSettings,
  NotificationSettings,
  PrivacySettings,
  DangerZone,
} from '@/components/settings';

export default async function SettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      profile: true,
    },
  });

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          {/* Settings Header */}
          <SettingsHeader />

          {/* Account Settings */}
          <AccountSettings
            name={user.name}
            email={user.email}
            avatar={user.avatar}
          />

          {/* Notification Settings */}
          <NotificationSettings
            emailOptIn={user.emailOptIn}
            pushOptIn={user.pushOptIn}
          />

          {/* Privacy Settings */}
          <PrivacySettings
            publicProfile={user.publicProfile}
          />

          {/* Danger Zone */}
          <DangerZone />
        </div>
      </div>
    </div>
  );
}
