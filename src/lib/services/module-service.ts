// src/lib/services/module-service.ts
import { db } from '@/lib/db';
import { ModuleStatus, ProgressStatus } from '@prisma/client';

export class ModuleService {
  /**
   * Get all modules with user progress
   */
  static async getModulesWithProgress(userId: string) {
    const modules = await db.module.findMany({
      where: { status: ModuleStatus.PUBLISHED },
      orderBy: { orderIndex: 'asc' },
      include: {
        activities: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    const modulesWithProgress = await Promise.all(
      modules.map(async (module) => {
        const progress = await this.getModuleProgress(userId, module.id);
        const unlocked = await this.isModuleUnlocked(userId, module.orderIndex);
        
        return {
          ...module,
          progress,
          unlocked,
        };
      })
    );

    return modulesWithProgress;
  }

  /**
   * Get module progress percentage
   */
  static async getModuleProgress(userId: string, moduleId: string): Promise<number> {
    const moduleProgress = await db.moduleProgress.findUnique({
      where: {
        userId_moduleId: { userId, moduleId },
      },
    });

    return moduleProgress?.progressPercent || 0;
  }

  /**
   * Check if module is unlocked for user
   */
  static async isModuleUnlocked(userId: string, moduleOrderIndex: number): Promise<boolean> {
    // Module 1 is always unlocked
    if (moduleOrderIndex === 1) return true;

    // Check if previous module is completed
    const previousModule = await db.module.findFirst({
      where: { orderIndex: moduleOrderIndex - 1 },
    });

    if (!previousModule) return false;

    const previousProgress = await db.moduleProgress.findUnique({
      where: {
        userId_moduleId: { userId, moduleId: previousModule.id },
      },
    });

    return previousProgress?.status === ProgressStatus.COMPLETED;
  }

  /**
   * Start a module for user
   */
  static async startModule(userId: string, moduleId: string) {
    const existing = await db.moduleProgress.findUnique({
      where: { userId_moduleId: { userId, moduleId } },
    });

    if (existing) return existing;

    return db.moduleProgress.create({
      data: {
        userId,
        moduleId,
        status: ProgressStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
    });
  }

  /**
   * Complete an activity and update module progress
   */
  static async completeActivity(userId: string, activityId: string, data?: any) {
    // Mark activity complete
    const completion = await db.activityCompletion.upsert({
      where: {
        userId_activityId: { userId, activityId },
      },
      update: {
        completed: true,
        completedAt: new Date(),
        data,
      },
      create: {
        userId,
        activityId,
        completed: true,
        completedAt: new Date(),
        data,
      },
    });

    // Get activity to find module
    const activity = await db.activity.findUnique({
      where: { id: activityId },
      include: { module: true },
    });

    if (!activity) throw new Error('Activity not found');

    // Recalculate module progress
    await this.updateModuleProgress(userId, activity.moduleId);

    return completion;
  }

  /**
   * Update module progress percentage
   */
  static async updateModuleProgress(userId: string, moduleId: string) {
    // Get all activities in module
    const activities = await db.activity.findMany({
      where: { moduleId, requiredForCompletion: true },
    });

    // Get completed activities
    const completions = await db.activityCompletion.findMany({
      where: {
        userId,
        activityId: { in: activities.map(a => a.id) },
        completed: true,
      },
    });

    // Calculate progress
    const progressPercent = Math.round(
      (completions.length / activities.length) * 100
    );

    const status =
      progressPercent === 0
        ? ProgressStatus.NOT_STARTED
        : progressPercent === 100
        ? ProgressStatus.COMPLETED
        : ProgressStatus.IN_PROGRESS;

    // Update or create progress record
    const progress = await db.moduleProgress.upsert({
      where: { userId_moduleId: { userId, moduleId } },
      update: {
        progressPercent,
        status,
        completedAt: status === ProgressStatus.COMPLETED ? new Date() : null,
      },
      create: {
        userId,
        moduleId,
        progressPercent,
        status,
        startedAt: new Date(),
        completedAt: status === ProgressStatus.COMPLETED ? new Date() : null,
      },
    });

    // Update overall user progress
    await this.updateOverallProgress(userId);

    return progress;
  }

  /**
   * Update user's overall progress across all modules
   */
  static async updateOverallProgress(userId: string) {
    const allProgress = await db.moduleProgress.findMany({
      where: { userId },
    });

    if (allProgress.length === 0) {
      await db.profile.upsert({
        where: { userId },
        update: { overallProgress: 0 },
        create: { userId, overallProgress: 0 },
      });
      return;
    }

    const totalProgress = allProgress.reduce(
      (sum, p) => sum + p.progressPercent,
      0
    );
    const overallProgress = Math.round(totalProgress / 6); // 6 modules

    await db.profile.upsert({
      where: { userId },
      update: { overallProgress },
      create: { userId, overallProgress },
    });
  }

  /**
   * Get next activity for user in a module
   */
  static async getNextActivity(userId: string, moduleId: string) {
    const activities = await db.activity.findMany({
      where: { moduleId },
      orderBy: { orderIndex: 'asc' },
    });

    for (const activity of activities) {
      const completion = await db.activityCompletion.findUnique({
        where: { userId_activityId: { userId, activityId: activity.id } },
      });

      if (!completion || !completion.completed) {
        return activity;
      }
    }

    return null; // All activities completed
  }
}
