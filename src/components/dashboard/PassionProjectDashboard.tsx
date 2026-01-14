import { PassionProjectCard } from '@/components/dashboard/PassionProjectCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, CheckCircle, Clock, TrendingUp, Plus, Users, Target } from 'lucide-react';
import Link from 'next/link';

interface PassionProjectDashboardProps {
  activeProject?: {
    projectTitle: string;
    progress: number;
    milestonesCompleted: number;
    totalMilestones: number;
    streak: number;
    nextActions: Array<{
      id: string;
      title: string;
      completed: boolean;
    }>;
  };
  projectStats: {
    totalProjects: number;
    completedProjects: number;
    activeProjects: number;
    totalHoursLogged: number;
  };
  recentProjects?: Array<{
    id: string;
    title: string;
    category: string;
    status: string;
    updatedAt: Date;
  }>;
}

export function PassionProjectDashboard({
  activeProject,
  projectStats,
  recentProjects = [],
}: PassionProjectDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Project Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={<Rocket className="w-6 h-6 text-purple-600" />}
          title="Active Projects"
          value={`${projectStats.activeProjects}`}
          description="Currently working on"
        />
        <StatsCard
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          title="Completed"
          value={`${projectStats.completedProjects}`}
          description={`of ${projectStats.totalProjects} total`}
          progress={projectStats.totalProjects > 0
            ? (projectStats.completedProjects / projectStats.totalProjects) * 100
            : 0}
        />
        <StatsCard
          icon={<Clock className="w-6 h-6 text-blue-600" />}
          title="Hours Logged"
          value={`${projectStats.totalHoursLogged}`}
          description="Time invested"
          unit="hours"
        />
        <StatsCard
          icon={<TrendingUp className="w-6 h-6 text-orange-500" />}
          title="Project Health"
          value={activeProject ? `${activeProject.progress}%` : 'N/A'}
          description="Current project"
          circularProgress={activeProject?.progress || 0}
        />
      </div>

      {/* Active Project */}
      {activeProject ? (
        <PassionProjectCard {...activeProject} />
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Rocket className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Start Your Passion Project</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Build something meaningful that showcases your talents and makes an impact
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/projects/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Project
                </Button>
              </Link>
              <Link href="/ideas">
                <Button variant="outline">
                  <Target className="w-4 h-4 mr-2" />
                  Browse Ideas
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Your latest work</CardDescription>
          </CardHeader>
          <CardContent>
            {recentProjects.length > 0 ? (
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{project.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                            {project.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(project.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          project.status === 'IN_PROGRESS'
                            ? 'bg-green-100 text-green-700'
                            : project.status === 'PLANNING'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-gray-600">No projects yet</p>
              </div>
            )}
            <Link href="/projects">
              <Button variant="outline" className="w-full mt-4">
                View All Projects
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Collaboration Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Collaboration
            </CardTitle>
            <CardDescription>Find teammates or join projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-1">Find Collaborators</h4>
                <p className="text-sm text-purple-700 mb-3">
                  Looking for teammates with specific skills?
                </p>
                <Link href="/discover">
                  <Button variant="outline" size="sm" className="w-full">
                    Browse Available Students
                  </Button>
                </Link>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-1">Join a Project</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Contribute your skills to existing projects
                </p>
                <Link href="/discover?tab=projects">
                  <Button variant="outline" size="sm" className="w-full">
                    Explore Open Projects
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
