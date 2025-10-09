// src/app/(dashboard)/profile/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserCircle, Mail, Calendar, Target, Award, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export default async function ProfilePage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      profile: true,
      activities: {
        where: { completed: true },
        include: {
          activity: true,
        },
      },
      projects: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!user) {
    redirect('/sign-in')
  }

  const totalActivities = await db.activity.count()
  const completedActivities = user.activities.filter(a => a.completed).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">← Back to Dashboard</Button>
          </Link>
        </div>

        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {user.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                {user.grade && (
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>Grade {user.grade}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {user.profile?.overallProgress || 0}%
                </div>
                <div className="text-sm text-gray-600">Overall Progress</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {completedActivities}/{totalActivities}
                </div>
                <div className="text-sm text-gray-600">Activities Completed</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {user.projects.length}
                </div>
                <div className="text-sm text-gray-600">Projects</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Profile Information */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* About Section */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
            {user.profile?.bio ? (
              <p className="text-gray-600">{user.profile.bio}</p>
            ) : (
              <div className="text-gray-400 italic">
                <p className="mb-2">No bio added yet.</p>
                <Button variant="outline" size="sm">
                  Add Bio
                </Button>
              </div>
            )}
          </Card>

          {/* Goals Section */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Goals</h2>
            {user.profile?.goals && Array.isArray(user.profile.goals) && user.profile.goals.length > 0 ? (
              <ul className="space-y-2">
                {user.profile.goals.map((goal, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-600">{goal}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400 italic">
                <p className="mb-2">No goals set yet.</p>
                <Link href="/onboarding">
                  <Button variant="outline" size="sm">
                    Set Goals
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Top Values */}
          {user.profile?.topValues && user.profile.topValues.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Top Values</h2>
              <div className="flex flex-wrap gap-2">
                {user.profile.topValues.map((value, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Top Strengths */}
          {user.profile?.topStrengths && user.profile.topStrengths.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Top Strengths</h2>
              <div className="flex flex-wrap gap-2">
                {user.profile.topStrengths.map((strength, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                  >
                    {strength}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Recent Projects */}
        {user.projects.length > 0 && (
          <Card className="p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
              <Link href="/projects">
                <Button variant="ghost" size="sm">View All →</Button>
              </Link>
            </div>
            <div className="space-y-3">
              {user.projects.slice(0, 3).map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <div className="p-4 border rounded-lg hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{project.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-1">{project.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                        project.status === 'PLANNING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        )}

        {/* Account Actions */}
        <Card className="p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/profile/edit">
                <UserCircle className="w-4 h-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://accounts.clerk.dev" target="_blank" rel="noopener noreferrer">
                <Mail className="w-4 h-4 mr-2" />
                Manage Account
              </a>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
