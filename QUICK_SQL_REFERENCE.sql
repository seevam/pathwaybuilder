-- ============================================================================
-- QUICK SQL REFERENCE - Core Features Integration
-- ============================================================================
-- Use this as a quick reference for common database operations
-- For full migration, use: prisma/migrations/add_core_features.sql

-- ============================================================================
-- ESSENTIAL SETUP COMMANDS
-- ============================================================================

-- 1. CHECK IF MIGRATION IS NEEDED
-- Run this first to see what tables already exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. BACKUP YOUR DATABASE (CRITICAL!)
-- Using pg_dump:
-- pg_dump -U your_username pathwaybuilder > backup_$(date +%Y%m%d_%H%M%S).sql

-- ============================================================================
-- CREATE ENUMS (Run these first)
-- ============================================================================

CREATE TYPE "AchievementType" AS ENUM ('BADGE', 'LEVEL_UP', 'STREAK_MILESTONE', 'PROJECT_MILESTONE', 'SPECIAL');

CREATE TYPE "NotificationType" AS ENUM (
  'STREAK_WARNING', 'MILESTONE_COMPLETE', 'ACHIEVEMENT_UNLOCKED', 'WEEKLY_SUMMARY',
  'PROJECT_UPDATE', 'COLLABORATION_REQUEST', 'COLLABORATION_ACCEPTED',
  'COLLABORATION_REJECTED', 'TEAM_MEMBER_JOINED', 'TASK_ASSIGNED'
);

CREATE TYPE "TeamSize" AS ENUM ('SOLO', 'DUO', 'SMALL_TEAM', 'LARGE_TEAM');

CREATE TYPE "CollaborationRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

CREATE TYPE "ProjectMemberRole" AS ENUM ('OWNER', 'CO_LEAD', 'MEMBER');

-- ============================================================================
-- EXTEND EXISTING TABLES
-- ============================================================================

-- Add gamification to User
ALTER TABLE "User"
ADD COLUMN "xp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "level" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "currentStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "longestStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX "User_lastActiveAt_idx" ON "User"("lastActiveAt");

-- Add collaboration to Project
ALTER TABLE "Project"
ADD COLUMN "idealTeamSize" "TeamSize" NOT NULL DEFAULT 'SOLO',
ADD COLUMN "openForCollaboration" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "maxTeamSize" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "currentTeamSize" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "skillsNeeded" TEXT[] DEFAULT ARRAY[]::TEXT[];

CREATE INDEX "Project_openForCollaboration_idx" ON "Project"("openForCollaboration");

-- Add assignment to Task
ALTER TABLE "Task"
ADD COLUMN "assignedToId" TEXT,
ADD COLUMN "priority" TEXT NOT NULL DEFAULT 'medium';

CREATE INDEX "Task_assignedToId_idx" ON "Task"("assignedToId");

-- ============================================================================
-- CREATE NEW TABLES (Core Features)
-- ============================================================================

-- AI-Generated Ideas
CREATE TABLE "ProjectIdea" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ProjectCategory" NOT NULL,
    "feasibilityScore" INTEGER NOT NULL,
    "matchingPercent" INTEGER NOT NULL,
    "timeEstimate" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'suggested',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "ProjectIdea_userId_idx" ON "ProjectIdea"("userId");

-- Team Members
CREATE TABLE "ProjectMember" (
    "id" TEXT PRIMARY KEY,
    "projectId" TEXT NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "role" "ProjectMemberRole" NOT NULL DEFAULT 'MEMBER',
    "tasksCompleted" INTEGER NOT NULL DEFAULT 0,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("projectId", "userId")
);
CREATE INDEX "ProjectMember_projectId_idx" ON "ProjectMember"("projectId");

-- Collaboration Requests
CREATE TABLE "CollaborationRequest" (
    "id" TEXT PRIMARY KEY,
    "projectId" TEXT NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "status" "CollaborationRequestStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("projectId", "userId")
);
CREATE INDEX "CollaborationRequest_status_idx" ON "CollaborationRequest"("status");

-- Achievements
CREATE TABLE "Achievement" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "achievementType" "AchievementType" NOT NULL,
    "achievementId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "xpAwarded" INTEGER NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("userId", "achievementId")
);

-- Leaderboard
CREATE TABLE "Leaderboard" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "xpEarned" INTEGER NOT NULL,
    "projectsCompleted" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("userId", "period")
);
CREATE INDEX "Leaderboard_period_rank_idx" ON "Leaderboard"("period", "rank");

-- Notifications
CREATE TABLE "Notification" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Notification_userId_read_idx" ON "Notification"("userId", "read");

-- ============================================================================
-- USEFUL QUERIES
-- ============================================================================

-- Get user's XP and level
SELECT name, xp, level, currentStreak FROM "User" WHERE id = 'user_id';

-- Get projects open for collaboration
SELECT * FROM "Project" WHERE "openForCollaboration" = true;

-- Get pending collaboration requests for a project
SELECT cr.*, u.name as requester_name
FROM "CollaborationRequest" cr
JOIN "User" u ON cr."userId" = u.id
WHERE cr."projectId" = 'project_id' AND cr.status = 'PENDING';

-- Get leaderboard (all-time top 10)
SELECT u.name, u.xp, u.level, u.currentStreak
FROM "User" u
ORDER BY u.xp DESC
LIMIT 10;

-- Get user's achievements
SELECT * FROM "Achievement" WHERE "userId" = 'user_id' ORDER BY "unlockedAt" DESC;

-- Get unread notifications
SELECT * FROM "Notification" WHERE "userId" = 'user_id' AND read = false;

-- ============================================================================
-- ADMIN QUERIES
-- ============================================================================

-- Count records in new tables
SELECT
  (SELECT COUNT(*) FROM "ProjectIdea") as ideas,
  (SELECT COUNT(*) FROM "ProjectMember") as members,
  (SELECT COUNT(*) FROM "CollaborationRequest") as requests,
  (SELECT COUNT(*) FROM "Achievement") as achievements,
  (SELECT COUNT(*) FROM "Notification") as notifications;

-- Find users without gamification data (if migration didn't apply)
SELECT id, name, xp FROM "User" WHERE xp IS NULL;

-- Find projects without collaboration fields
SELECT id, title FROM "Project" WHERE "openForCollaboration" IS NULL;

-- ============================================================================
-- SAMPLE DATA (for testing)
-- ============================================================================

-- Give a user some XP and level up
UPDATE "User" SET xp = 500, level = 5 WHERE id = 'user_123';

-- Make a project open for collaboration
UPDATE "Project" SET
  "openForCollaboration" = true,
  "idealTeamSize" = 'SMALL_TEAM',
  "maxTeamSize" = 4,
  "skillsNeeded" = ARRAY['JavaScript', 'Design']
WHERE id = 'project_123';

-- Create a sample achievement
INSERT INTO "Achievement" (id, "userId", "achievementType", "achievementId", name, description, "iconUrl", "xpAwarded")
VALUES ('ach_1', 'user_123', 'PROJECT_MILESTONE', 'first-project', 'First Project', 'Created your first project', '/badges/first.png', 50);

-- Create a leaderboard snapshot
INSERT INTO "Leaderboard" (id, "userId", period, "xpEarned", "projectsCompleted", "streakDays", rank)
VALUES ('lb_1', 'user_123', '2025-W51', 500, 3, 7, 1);

-- ============================================================================
-- MAINTENANCE
-- ============================================================================

-- Reindex tables for performance
REINDEX TABLE "ProjectIdea";
REINDEX TABLE "ProjectMember";
REINDEX TABLE "CollaborationRequest";

-- Analyze tables for query optimization
ANALYZE "User";
ANALYZE "Project";
ANALYZE "ProjectIdea";

-- Check table sizes
SELECT
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ============================================================================
-- CLEANUP / ROLLBACK
-- ============================================================================

-- To remove all core features (DANGEROUS - deletes data!)
-- Uncomment these lines ONLY if you want to rollback:

-- DROP TABLE IF EXISTS "Notification" CASCADE;
-- DROP TABLE IF EXISTS "Leaderboard" CASCADE;
-- DROP TABLE IF EXISTS "Achievement" CASCADE;
-- DROP TABLE IF EXISTS "CollaborationRequest" CASCADE;
-- DROP TABLE IF EXISTS "ProjectMember" CASCADE;
-- DROP TABLE IF EXISTS "ProjectIdea" CASCADE;
-- DROP TYPE IF EXISTS "ProjectMemberRole";
-- DROP TYPE IF EXISTS "CollaborationRequestStatus";
-- DROP TYPE IF EXISTS "TeamSize";
-- DROP TYPE IF EXISTS "NotificationType";
-- DROP TYPE IF EXISTS "AchievementType";
