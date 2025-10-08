// src/lib/services/project-service.ts
import { db } from '@/lib/db'
import { ProjectStatus, ProjectCategory } from '@prisma/client'

export class ProjectService {
  static async getUserProjects(userId: string) {
    return db.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            milestones: true,
            tasks: true,
            checkIns: true,
            documents: true,
          },
        },
      },
    })
  }

  static async getProjectById(projectId: string, userId: string) {
    return db.project.findFirst({
      where: { 
        id: projectId,
        userId, // Ensure user owns this project
      },
      include: {
        milestones: {
          orderBy: { orderIndex: 'asc' },
        },
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
        checkIns: {
          orderBy: { createdAt: 'desc' },
          take: 10, // Last 10 check-ins
        },
        documents: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  }

  static async createProject(userId: string, data: {
    title: string
    description: string
    category: ProjectCategory
    status?: ProjectStatus
    ideaSource?: any
  }) {
    return db.project.create({
      data: {
        userId,
        ...data,
      },
    })
  }

  static async updateProject(projectId: string, userId: string, data: Partial<{
    title: string
    description: string
    category: ProjectCategory
    status: ProjectStatus
    healthScore: number
    goals: any
    resources: any
    metrics: any
    startedAt: Date
    targetCompletionAt: Date
    completedAt: Date
  }>) {
    return db.project.updateMany({
      where: { 
        id: projectId,
        userId,
      },
      data,
    })
  }

  static async deleteProject(projectId: string, userId: string) {
    return db.project.deleteMany({
      where: { 
        id: projectId,
        userId,
      },
    })
  }

  static async calculateHealthScore(projectId: string): Promise<number> {
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        milestones: true,
        tasks: true,
        checkIns: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!project) return 0

    let score = 50 // Base score

    // Factor 1: Recent activity (30 points)
    const lastCheckIn = project.checkIns[0]
    if (lastCheckIn) {
      const daysSinceCheckIn = Math.floor(
        (Date.now() - lastCheckIn.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysSinceCheckIn <= 7) score += 30
      else if (daysSinceCheckIn <= 14) score += 15
    }

    // Factor 2: Milestone progress (30 points)
    const totalMilestones = project.milestones.length
    const completedMilestones = project.milestones.filter(
      m => m.status === 'COMPLETED'
    ).length
    if (totalMilestones > 0) {
      score += Math.round((completedMilestones / totalMilestones) * 30)
    }

    // Factor 3: Task completion (20 points)
    const totalTasks = project.tasks.length
    const completedTasks = project.tasks.filter(t => t.completed).length
    if (totalTasks > 0) {
      score += Math.round((completedTasks / totalTasks) * 20)
    }

    return Math.min(100, Math.max(0, score))
  }
}
