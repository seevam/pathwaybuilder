import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FolderKanban, Clock, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  hoursLogged: number;
  healthScore: number;
  createdAt: Date;
}

interface ProfileProjectsProps {
  projects: Project[];
}

const STATUS_CONFIG: Record<
  string,
  { color: string; label: string }
> = {
  IDEATION: { color: 'bg-purple-100 text-purple-700', label: 'Ideation' },
  PLANNING: { color: 'bg-blue-100 text-blue-700', label: 'Planning' },
  IN_PROGRESS: { color: 'bg-primary-100 text-primary-700', label: 'In Progress' },
  PAUSED: { color: 'bg-yellow-100 text-yellow-700', label: 'Paused' },
  COMPLETED: { color: 'bg-green-100 text-green-700', label: 'Completed' },
  ABANDONED: { color: 'bg-gray-100 text-gray-700', label: 'Abandoned' },
};

const CATEGORY_ICONS: Record<string, string> = {
  CREATIVE: '🎨',
  SOCIAL_IMPACT: '🌍',
  ENTREPRENEURIAL: '💼',
  RESEARCH: '🔬',
  TECHNICAL: '⚙️',
  LEADERSHIP: '👥',
};

export function ProfileProjects({ projects }: ProfileProjectsProps) {
  if (projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-primary-600" />
            My Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <FolderKanban className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No projects yet
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your first passion project to get started!
            </p>
            <div className="mt-6">
              <Link href="/projects/new">
                <Button>Create Project</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentProjects = projects.slice(0, 3);
  const stats = {
    total: projects.length,
    inProgress: projects.filter((p) => p.status === 'IN_PROGRESS').length,
    completed: projects.filter((p) => p.status === 'COMPLETED').length,
    totalHours: projects.reduce((sum, p) => sum + p.hoursLogged, 0),
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-primary-600" />
            My Projects
            <Badge variant="secondary">{stats.total}</Badge>
          </CardTitle>
          <Link href="/projects">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 rounded-lg bg-gray-50 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {stats.inProgress}
            </div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {stats.totalHours}h
            </div>
            <div className="text-xs text-muted-foreground">Total Hours</div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="space-y-3">
          {recentProjects.map((project) => {
            const statusConfig = STATUS_CONFIG[project.status] || STATUS_CONFIG.IDEATION;
            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <div className="group rounded-lg border-2 border-gray-200 bg-white p-4 transition-all hover:border-primary-300 hover:shadow-duo-hover">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {CATEGORY_ICONS[project.category] || '📁'}
                      </span>
                      <h3 className="font-bold text-gray-900 group-hover:text-primary-600">
                        {project.title}
                      </h3>
                    </div>
                    <Badge className={statusConfig.color}>
                      {statusConfig.label}
                    </Badge>
                  </div>

                  <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      <span>Health: {project.healthScore}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{project.hoursLogged}h logged</span>
                    </div>
                  </div>

                  {/* Health Score Progress */}
                  <div className="mt-3">
                    <Progress value={project.healthScore} className="h-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
