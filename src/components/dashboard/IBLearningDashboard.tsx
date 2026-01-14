import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, TrendingUp, Flame, Award, GraduationCap, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface IBLearningDashboardProps {
  stats: {
    totalQuestionsAttempted: number;
    totalQuestionsCorrect: number;
    currentStreak: number;
    longestStreak: number;
  };
  subjects: Array<{
    id: string;
    name: string;
    displayName: string;
    icon: string;
    description: string;
    questionCount: number;
  }>;
  recentActivity?: Array<{
    subjectName: string;
    questionTitle: string;
    score: number;
    attemptedAt: Date;
  }>;
}

export function IBLearningDashboard({
  stats,
  subjects,
  recentActivity = [],
}: IBLearningDashboardProps) {
  const accuracy = stats.totalQuestionsAttempted > 0
    ? Math.round((stats.totalQuestionsCorrect / stats.totalQuestionsAttempted) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* IB Learning Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={<BookOpen className="w-6 h-6 text-blue-600" />}
          title="Questions Attempted"
          value={`${stats.totalQuestionsAttempted}`}
          description="Total practice questions"
        />
        <StatsCard
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          title="Accuracy"
          value={`${accuracy}%`}
          description={`${stats.totalQuestionsCorrect} correct`}
          circularProgress={accuracy}
        />
        <StatsCard
          icon={<Flame className="w-6 h-6 text-orange-500" />}
          title="Current Streak"
          value={`${stats.currentStreak}`}
          description="days"
          highlighted={stats.currentStreak >= 7}
        />
        <StatsCard
          icon={<Award className="w-6 h-6 text-yellow-500" />}
          title="Longest Streak"
          value={`${stats.longestStreak}`}
          description="days"
        />
      </div>

      {/* Quick Start Section */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardContent className="py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Continue Your IB Journey</h3>
                <p className="text-gray-600 mt-1">
                  {stats.totalQuestionsAttempted > 0
                    ? `You've practiced ${stats.totalQuestionsAttempted} questions. Keep going!`
                    : 'Start practicing IB questions with AI-powered tutoring'}
                </p>
              </div>
            </div>
            <Link href="/ib-learning">
              <Button size="lg">
                {stats.totalQuestionsAttempted > 0 ? 'Continue Learning' : 'Get Started'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Your Subjects</CardTitle>
            <CardDescription>Track your progress across IB subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subjects.slice(0, 6).map((subject) => (
                <Link
                  key={subject.id}
                  href={`/ib-learning/${subject.name.toLowerCase()}`}
                  className="block p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{subject.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{subject.displayName}</h4>
                        <p className="text-xs text-gray-500">{subject.questionCount} questions</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/ib-learning">
              <Button variant="outline" className="w-full mt-4">
                View All Subjects
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Practice</CardTitle>
            <CardDescription>Your latest question attempts</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{activity.questionTitle}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                            {activity.subjectName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(activity.attemptedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`text-sm font-semibold px-2 py-1 rounded ${
                          activity.score >= 80
                            ? 'bg-green-100 text-green-700'
                            : activity.score >= 60
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {activity.score}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 mb-4">
                  No practice history yet. Start answering questions!
                </p>
                <Link href="/ib-learning">
                  <Button>Start Practicing</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Study Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Study Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold mt-0.5">
              1
            </div>
            <p className="text-sm text-blue-900">
              <strong>Use the AI Tutor:</strong> Don't just get answers - ask questions and let the AI guide you through the problem-solving process
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold mt-0.5">
              2
            </div>
            <p className="text-sm text-blue-900">
              <strong>Build Your Streak:</strong> Practice daily to maintain your streak and reinforce learning
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold mt-0.5">
              3
            </div>
            <p className="text-sm text-blue-900">
              <strong>Mix Difficulty Levels:</strong> Challenge yourself with harder questions, but don't skip the basics
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
