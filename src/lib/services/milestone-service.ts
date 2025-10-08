// src/lib/services/milestone-service.ts
import { db } from '@/lib/db'
import { MilestoneStatus } from '@prisma/client'

export class MilestoneService {
  static async createMilestone(projectId: string, data: {
    title: string
    description?: string
    orderIndex: number
    targetDate?: Date
  }) {
    return db.milestone.create({
      data: {
        projectId,
        ...data,
      },
    })
  }

  static async updateMilestone(milestoneId: string, data: Partial<{
    title: string
    description: string
    status: MilestoneStatus
    targetDate: Date
    completedAt: Date
  }>) {
    return db.milestone.update({
      where: { id: milestoneId },
      data,
    })
  }

  static async deleteMilestone(milestoneId: string) {
    return db.milestone.delete({
      where: { id: milestoneId },
    })
  }

  static async reorderMilestones(projectId: string, milestoneIds: string[]) {
    // Update order indexes based on array position
    const updates = milestoneIds.map((id, index) =>
      db.milestone.update({
        where: { id },
        data: { orderIndex: index },
      })
    )

    return db.$transaction(updates)
  }

  static async completeMilestone(milestoneId: string) {
    return db.milestone.update({
      where: { id: milestoneId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    })
  }
}
