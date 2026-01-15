import { ModuleTracker } from '@/components/dashboard/ModuleTracker';
import { StrengthsCard } from '@/components/dashboard/StrengthsCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Target, Flame, Award, Clock, Compass, Briefcase, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CareerExplorationDashboardProps {
  modules: any[];
  traits?: any[];
  stats: {
    overallProgress: number;
    currentStreak: number;
    completedActivities: number;
    totalActivities: number;
    hoursInvested: number;
  };
  careerClusters?: string[];
  topValues?: string[];
}

export function CareerExplorationDashboard({
  modules,
  traits,
  stats,
  careerClusters = [],
  topValues = [],
}: CareerExplorationDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <StatsCard
          icon={<Target className="w-6 h-6 text-blue-600" />}
          title="Overall Progress"
          value={`${stats.overallProgress}%`}
          description="Across all modules"
          circularProgress={stats.overallProgress}
        />
        <StatsCard
          icon={<Award className="w-6 h-6 text-green-600" />}
          title="Activities"
          value={`${stats.completedActivities}`}
          description={`of ${stats.totalActivities} total`}
          progress={(stats.completedActivities / stats.totalActivities) * 100}
        />
        <StatsCard
          icon={<Clock className="w-6 h-6 text-purple-600" />}
          title="Time Invested"
          value={`${stats.hoursInvested}`}
          description="Hours learning"
          unit="hours"
        />
      </div>

      {/* Module Tracker */}
      <ModuleTracker modules={modules} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths Card */}
        <StrengthsCard traits={traits} />

        {/* Career Insights */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <CardTitle>Career Insights</CardTitle>
            </div>
            <CardDescription>Based on your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {careerClusters.length > 0 ? (
              <>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Matched Career Clusters</h4>
                  <div className="flex flex-wrap gap-2">
                    {careerClusters.map((cluster, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {cluster}
                      </span>
                    ))}
                  </div>
                </div>

                {topValues.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Your Top Values</h4>
                    <div className="flex flex-wrap gap-2">
                      {topValues.slice(0, 5).map((value, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                        >
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Link href="/profile">
                  <Button variant="outline" className="w-full">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Full Profile
                  </Button>
                </Link>
              </>
            ) : (
              <div className="text-center py-6">
                <Compass className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 mb-4">
                  Complete self-discovery modules to unlock career insights
                </p>
                <Link href="/module-1">
                  <Button>Start Discovery Journey</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}
