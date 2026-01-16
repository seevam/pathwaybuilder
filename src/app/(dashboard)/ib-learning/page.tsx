import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen, TrendingUp, Flame, Award,
  Calculator, Binary, Atom, Beaker, Dna, BookText,
  Landmark, Brain, Briefcase, Code, LucideIcon
} from 'lucide-react';

// Subject icon mapping - matches database subject names
const subjectIcons: Record<string, { icon: LucideIcon; color: string; bgColor: string }> = {
  // Math subjects
  'mathematics': { icon: Calculator, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  'math-aa': { icon: Calculator, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  'math-ai': { icon: Binary, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },

  // Sciences
  'physics': { icon: Atom, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  'chemistry': { icon: Beaker, color: 'text-green-600', bgColor: 'bg-green-50' },
  'biology': { icon: Dna, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },

  // Languages
  'english': { icon: BookText, color: 'text-red-600', bgColor: 'bg-red-50' },
  'english-a': { icon: BookText, color: 'text-red-600', bgColor: 'bg-red-50' },
  'english-b': { icon: BookOpen, color: 'text-pink-600', bgColor: 'bg-pink-50' },

  // Social Sciences
  'history': { icon: Landmark, color: 'text-amber-600', bgColor: 'bg-amber-50' },
  'geography': { icon: Globe2, color: 'text-teal-600', bgColor: 'bg-teal-50' },
  'economics': { icon: TrendingUp, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  'psychology': { icon: Brain, color: 'text-violet-600', bgColor: 'bg-violet-50' },
  'business': { icon: Briefcase, color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
  'business management': { icon: Briefcase, color: 'text-cyan-600', bgColor: 'bg-cyan-50' },

  // Technology
  'computer science': { icon: Code, color: 'text-slate-600', bgColor: 'bg-slate-50' },
  'cs': { icon: Code, color: 'text-slate-600', bgColor: 'bg-slate-50' }
};

export default async function IBLearningPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    redirect('/sign-in');
  }

  // Get or create user stats
  let stats = await db.iBUserStats.findUnique({
    where: { userId: user.id },
  });

  if (!stats) {
    stats = await db.iBUserStats.create({
      data: { userId: user.id },
    });
  }

  // Get all subjects with question counts
  const subjects = await db.iBSubjectModel.findMany({
    include: {
      _count: {
        select: { questions: true },
      },
    },
    orderBy: { displayName: 'asc' },
  });

  const accuracy = stats.totalQuestionsAttempted > 0
    ? Math.round((stats.totalQuestionsCorrect / stats.totalQuestionsAttempted) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Exam Prep Platform</h1>
        <p className="text-muted-foreground mt-2">
          Master IB subjects with AI-powered Socratic tutoring
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions Attempted</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuestionsAttempted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accuracy}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalQuestionsCorrect} correct
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentStreak}</div>
            <p className="text-xs text-muted-foreground">days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.longestStreak}</div>
            <p className="text-xs text-muted-foreground">days</p>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Subjects</h2>
        {subjects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No subjects available yet. Please check back later!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => {
              const iconConfig = subjectIcons[subject.name.toLowerCase()] || {
                icon: BookOpen,
                color: 'text-gray-600',
                bgColor: 'bg-gray-50'
              };
              const Icon = iconConfig.icon;

              return (
                <Link
                  key={subject.id}
                  href={`/ib-learning/${subject.name.toLowerCase()}`}
                >
                  <Card className={`hover:shadow-lg transition-all cursor-pointer h-full border-2 hover:border-gray-300 ${iconConfig.bgColor}`}>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Icon className={`w-10 h-10 ${iconConfig.color}`} strokeWidth={2} />
                        <div className="flex-1">
                          <CardTitle>{subject.displayName}</CardTitle>
                          <CardDescription>
                            {subject._count.questions} questions available
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {subject.description || 'Practice IB-level questions with AI tutoring'}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>Learn with the Socratic method</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold">Choose a Subject</h3>
              <p className="text-sm text-muted-foreground">
                Select from 11 IB subjects to practice
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold">Practice Questions</h3>
              <p className="text-sm text-muted-foreground">
                Answer IB-level questions across different difficulty levels
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold">Get AI Guidance</h3>
              <p className="text-sm text-muted-foreground">
                Chat with an AI tutor that guides you to discover answers using the Socratic method
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="font-semibold">Track Your Progress</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your accuracy, streaks, and improvement over time
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
