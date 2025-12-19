import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';

export default async function ProfileEditPage() {
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

  // Ensure profile exists
  let profile = user.profile;
  if (!profile) {
    profile = await db.profile.create({
      data: {
        userId: user.id,
      },
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/profile">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-gray-500 mt-1">
              Customize your profile and showcase your skills
            </p>
          </div>

          {/* Edit Form */}
          <ProfileEditForm
            user={user}
            profile={profile}
          />
        </div>
      </div>
    </div>
  );
}
