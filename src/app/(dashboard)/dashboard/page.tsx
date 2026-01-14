import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { FeatureSelector } from '@/components/dashboard/FeatureSelector';
import { CareerExplorationDashboard } from '@/components/dashboard/CareerExplorationDashboard';
import { PassionProjectDashboard } from '@/components/dashboard/PassionProjectDashboard';
import { IBLearningDashboard } from '@/components/dashboard/IBLearningDashboard';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
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
        orderBy: {
          completedAt: 'desc',
        },
        take: 10,
      },
      projects: {
        where: {
          status: {
            in: ['PLANNING', 'IN_PROGRESS'],
          },
        },
        include: {
          milestones: true,
          tasks: true,
        },
        orderBy: { updatedAt: 'desc' },
      },
      ibUserStats: true,
    },
  });

  if (!user) {
    redirect('/sign-in');
  }

  // Get or create profile with default feature selection
  let profile = user.profile;
  if (!profile) {
    profile = await db.profile.create({
      data: {
        userId: user.id,
        selectedFeature: 'CAREER_EXPLORATION',
      },
    });
  }

  const selectedFeature = profile.selectedFeature || 'CAREER_EXPLORATION';

  // Common stats
  const totalActivities = await db.activity.count();
  const completedActivities = user.activities.filter((a) => a.completed).length;
  const currentStreak = user.currentStreak || 0;
  const totalTimeSeconds = user.activities.reduce((acc, a) => acc + (a.timeSpent || 0), 0);
  const hoursInvested = Math.round(totalTimeSeconds / 3600);

  // Render the appropriate dashboard based on selected feature
  const renderFeatureDashboard = async () => {
    if (selectedFeature === 'CAREER_EXPLORATION') {
      // Fetch career exploration data
      const allModules = await db.module.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { orderIndex: 'asc' },
      });

      const modulesWithProgress = await Promise.all(
        allModules.map(async (module) => {
          const progress = await db.moduleProgress.findUnique({
            where: {
              userId_moduleId: {
                userId: user.id,
                moduleId: module.id,
              },
            },
          });

          let isUnlocked = module.orderIndex === 1;

          if (module.orderIndex > 1) {
            const previousModule = await db.module.findFirst({
              where: { orderIndex: module.orderIndex - 1 },
            });

            if (previousModule) {
              const previousProgress = await db.moduleProgress.findUnique({
                where: {
                  userId_moduleId: {
                    userId: user.id,
                    moduleId: previousModule.id,
                  },
                },
              });

              isUnlocked = previousProgress?.status === 'COMPLETED';
            }
          }

          const progressPercent = progress?.progressPercent ?? 0;

          return {
            ...module,
            icon: module.icon ?? undefined,
            progress: progressPercent,
            status:
              progressPercent === 100
                ? 'completed'
                : progressPercent > 0
                ? 'active'
                : 'pending',
            isUnlocked,
          };
        })
      );

      const strengthsActivity = await db.activityCompletion.findFirst({
        where: {
          userId: user.id,
          activity: { slug: 'strengths-discovery' },
          completed: true,
        },
      });

      const strengthsData = strengthsActivity?.data as any;
      const traits = strengthsData?.categoryScores
        ? Object.entries(strengthsData.categoryScores).map(([name, score]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            score: score as number,
            color: 'bg-blue-100 text-blue-700 border-blue-300',
          }))
        : undefined;

      return (
        <CareerExplorationDashboard
          modules={modulesWithProgress}
          traits={traits}
          stats={{
            overallProgress: profile.overallProgress || 0,
            currentStreak,
            completedActivities,
            totalActivities,
            hoursInvested,
          }}
          careerClusters={profile.careerClusters}
          topValues={profile.topValues}
        />
      );
    } else if (selectedFeature === 'PASSION_PROJECT') {
      // Fetch passion project data
      const allProjects = await db.project.findMany({
        where: { userId: user.id },
        include: {
          milestones: true,
          tasks: true,
        },
        orderBy: { updatedAt: 'desc' },
      });

      const activeProject = user.projects[0];
      const projectData = activeProject
        ? {
            projectTitle: activeProject.title,
            progress: activeProject.healthScore,
            milestonesCompleted: activeProject.milestones.filter(
              (m) => m.status === 'COMPLETED'
            ).length,
            totalMilestones: activeProject.milestones.length,
            streak: activeProject.currentStreak || 0,
            nextActions: activeProject.tasks.slice(0, 3).map((task) => ({
              id: task.id,
              title: task.title,
              completed: task.completed,
            })),
          }
        : undefined;

      const projectStats = {
        totalProjects: allProjects.length,
        completedProjects: allProjects.filter((p) => p.status === 'COMPLETED').length,
        activeProjects: allProjects.filter((p) =>
          ['PLANNING', 'IN_PROGRESS'].includes(p.status)
        ).length,
        totalHoursLogged: allProjects.reduce((acc, p) => acc + (p.hoursLogged || 0), 0),
      };

      const recentProjects = allProjects.slice(0, 5).map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        status: p.status,
        updatedAt: p.updatedAt,
      }));

      return (
        <PassionProjectDashboard
          activeProject={projectData}
          projectStats={projectStats}
          recentProjects={recentProjects}
        />
      );
    } else if (selectedFeature === 'IB_LEARNING') {
      // Fetch IB Learning data
      const ibStats = user.ibUserStats || {
        totalQuestionsAttempted: 0,
        totalQuestionsCorrect: 0,
        currentStreak: 0,
        longestStreak: 0,
      };

      const subjects = await db.iBSubjectModel.findMany({
        include: {
          _count: {
            select: { questions: true },
          },
        },
        orderBy: { displayName: 'asc' },
      });

      const subjectsData = subjects.map((s) => ({
        id: s.id,
        name: s.name,
        displayName: s.displayName,
        icon: s.icon || '📚',
        description: s.description || '',
        questionCount: s._count.questions,
      }));

      // Get recent activity
      const recentProgress = await db.iBUserProgress.findMany({
        where: { userId: user.id },
        include: {
          question: {
            include: {
              subject: true,
            },
          },
        },
        orderBy: { lastAttemptedAt: 'desc' },
        take: 5,
      });

      const recentActivity = recentProgress
        .filter((p) => p.lastAttemptedAt && p.score)
        .map((p) => ({
          subjectName: p.question.subject.displayName,
          questionTitle: p.question.title,
          score: p.score || 0,
          attemptedAt: p.lastAttemptedAt!,
        }));

      return (
        <IBLearningDashboard
          stats={ibStats}
          subjects={subjectsData}
          recentActivity={recentActivity}
        />
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-green-500 bg-clip-text text-transparent">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-base md:text-lg text-gray-600">
          Let&apos;s continue building your pathway to success.
        </p>
      </div>

      {/* Feature Selector */}
      <FeatureSelector currentFeature={selectedFeature as any} />

      {/* Feature-specific Dashboard */}
      {await renderFeatureDashboard()}
    </div>
  );
}
