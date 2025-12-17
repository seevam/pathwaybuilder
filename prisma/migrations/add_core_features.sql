-- Core Features Integration Migration
-- This migration adds all tables and fields for the integrated features
-- Generated: 2025-12-17

-- ============================================================================
-- CREATE NEW ENUMS
-- ============================================================================

-- Achievement Types
CREATE TYPE "AchievementType" AS ENUM ('BADGE', 'LEVEL_UP', 'STREAK_MILESTONE', 'PROJECT_MILESTONE', 'SPECIAL');

-- Notification Types
CREATE TYPE "NotificationType" AS ENUM (
  'STREAK_WARNING',
  'MILESTONE_COMPLETE',
  'ACHIEVEMENT_UNLOCKED',
  'WEEKLY_SUMMARY',
  'PROJECT_UPDATE',
  'COLLABORATION_REQUEST',
  'COLLABORATION_ACCEPTED',
  'COLLABORATION_REJECTED',
  'TEAM_MEMBER_JOINED',
  'TASK_ASSIGNED'
);

-- Team Size
CREATE TYPE "TeamSize" AS ENUM ('SOLO', 'DUO', 'SMALL_TEAM', 'LARGE_TEAM');

-- Collaboration Request Status
CREATE TYPE "CollaborationRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- Project Member Role
CREATE TYPE "ProjectMemberRole" AS ENUM ('OWNER', 'CO_LEAD', 'MEMBER');

-- ============================================================================
-- ALTER EXISTING TABLES
-- ============================================================================

-- Add gamification fields to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatar" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "xp" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "level" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "currentStreak" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "longestStreak" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailOptIn" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "pushOptIn" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "publicProfile" BOOLEAN NOT NULL DEFAULT false;

-- Create index on User.lastActiveAt
CREATE INDEX IF NOT EXISTS "User_lastActiveAt_idx" ON "User"("lastActiveAt");

-- Add profile assessment fields to Profile table
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "gradeLevel" INTEGER;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "collegeTimeline" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "timeCommitment" INTEGER;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "currentActivities" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "favoriteSubjects" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "skillsConfidence" JSONB;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "workStyle" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "impactPreference" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "challengeLevel" INTEGER;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "learningStyle" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "strengthsRadar" JSONB;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "interestClusters" JSONB;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "problemFocus" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "dreamCareer" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "autonomyScore" INTEGER;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "competenceScore" INTEGER;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "relatednessScore" INTEGER;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "motivationProfile" JSONB;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "interestDepth" JSONB;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "passionIndicators" JSONB;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "passionType" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "flowFrequency" INTEGER;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "gritScore" INTEGER;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "perseveranceScore" INTEGER;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "consistencyScore" INTEGER;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "pastCompletions" JSONB;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "growthMindsetScore" INTEGER;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "challengeResponse" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "failureAttribution" JSONB;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "riasecScores" JSONB;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "careerClusters" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "projectDNA" JSONB;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "approachStyle" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "activityChoices" JSONB;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "completionPercent" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "completedAt" TIMESTAMP(3);

-- Update Profile array fields to have defaults
UPDATE "Profile" SET "topValues" = ARRAY[]::TEXT[] WHERE "topValues" IS NULL;
UPDATE "Profile" SET "topStrengths" = ARRAY[]::TEXT[] WHERE "topStrengths" IS NULL;

-- Create index on Profile.userId
CREATE INDEX IF NOT EXISTS "Profile_userId_idx" ON "Profile"("userId");

-- Add collaboration fields to Project table
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "ideaSourceId" TEXT;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "feasibilityScore" INTEGER;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "matchingPercent" INTEGER;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "charter" JSONB;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "skillGaps" JSONB;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "hoursLogged" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "currentStreak" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "lastWorkedAt" TIMESTAMP(3);
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "archivedAt" TIMESTAMP(3);
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "portfolioPublished" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "portfolioUrl" TEXT;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "showcaseInGallery" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "idealTeamSize" "TeamSize" NOT NULL DEFAULT 'SOLO';
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "openForCollaboration" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "maxTeamSize" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "currentTeamSize" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "skillsNeeded" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "collaborationDesc" TEXT;

-- Create indexes on Project
CREATE INDEX IF NOT EXISTS "Project_showcaseInGallery_idx" ON "Project"("showcaseInGallery");
CREATE INDEX IF NOT EXISTS "Project_openForCollaboration_idx" ON "Project"("openForCollaboration");
CREATE UNIQUE INDEX IF NOT EXISTS "Project_portfolioUrl_key" ON "Project"("portfolioUrl");

-- Add assignment fields to Task table
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "milestoneId" TEXT;
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "orderIndex" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "assignedToId" TEXT;
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "assignedAt" TIMESTAMP(3);
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "priority" TEXT NOT NULL DEFAULT 'medium';

-- Create indexes on Task
CREATE INDEX IF NOT EXISTS "Task_milestoneId_idx" ON "Task"("milestoneId");
CREATE INDEX IF NOT EXISTS "Task_assignedToId_idx" ON "Task"("assignedToId");

-- ============================================================================
-- CREATE NEW TABLES
-- ============================================================================

-- ProjectIdea: AI-generated project ideas
CREATE TABLE IF NOT EXISTS "ProjectIdea" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ProjectCategory" NOT NULL,
    "feasibilityScore" INTEGER NOT NULL,
    "matchingPercent" INTEGER NOT NULL,
    "timeEstimate" TEXT NOT NULL,
    "uniqueness" TEXT NOT NULL,
    "impactMetrics" TEXT[],
    "generationPrompt" TEXT NOT NULL,
    "profileSnapshot" JSONB NOT NULL,
    "activitySnapshot" JSONB,
    "status" TEXT NOT NULL DEFAULT 'suggested',
    "selectedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectIdea_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ProjectIdea_userId_idx" ON "ProjectIdea"("userId");
CREATE INDEX IF NOT EXISTS "ProjectIdea_status_idx" ON "ProjectIdea"("status");

-- ProjectMember: Team membership tracking
CREATE TABLE IF NOT EXISTS "ProjectMember" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ProjectMemberRole" NOT NULL DEFAULT 'MEMBER',
    "tasksCompleted" INTEGER NOT NULL DEFAULT 0,
    "hoursContributed" INTEGER NOT NULL DEFAULT 0,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "ProjectMember_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ProjectMember_projectId_userId_key" ON "ProjectMember"("projectId", "userId");
CREATE INDEX IF NOT EXISTS "ProjectMember_projectId_idx" ON "ProjectMember"("projectId");
CREATE INDEX IF NOT EXISTS "ProjectMember_userId_idx" ON "ProjectMember"("userId");

-- CollaborationRequest: Join requests for projects
CREATE TABLE IF NOT EXISTS "CollaborationRequest" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "CollaborationRequestStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "responseMessage" TEXT,
    "respondedAt" TIMESTAMP(3),
    "respondedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollaborationRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "CollaborationRequest_projectId_userId_key" ON "CollaborationRequest"("projectId", "userId");
CREATE INDEX IF NOT EXISTS "CollaborationRequest_projectId_idx" ON "CollaborationRequest"("projectId");
CREATE INDEX IF NOT EXISTS "CollaborationRequest_userId_idx" ON "CollaborationRequest"("userId");
CREATE INDEX IF NOT EXISTS "CollaborationRequest_status_idx" ON "CollaborationRequest"("status");

-- Achievement: User achievements and badges
CREATE TABLE IF NOT EXISTS "Achievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementType" "AchievementType" NOT NULL,
    "achievementId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconUrl" TEXT NOT NULL,
    "xpAwarded" INTEGER NOT NULL,
    "metadata" JSONB,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Achievement_userId_achievementId_key" ON "Achievement"("userId", "achievementId");
CREATE INDEX IF NOT EXISTS "Achievement_userId_idx" ON "Achievement"("userId");
CREATE INDEX IF NOT EXISTS "Achievement_achievementType_idx" ON "Achievement"("achievementType");

-- Leaderboard: Rankings snapshots
CREATE TABLE IF NOT EXISTS "Leaderboard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "xpEarned" INTEGER NOT NULL,
    "projectsCompleted" INTEGER NOT NULL,
    "streakDays" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Leaderboard_userId_period_key" ON "Leaderboard"("userId", "period");
CREATE INDEX IF NOT EXISTS "Leaderboard_period_rank_idx" ON "Leaderboard"("period", "rank");

-- Notification: System notifications
CREATE TABLE IF NOT EXISTS "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "actionUrl" TEXT,
    "metadata" JSONB,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Notification_userId_read_idx" ON "Notification"("userId", "read");
CREATE INDEX IF NOT EXISTS "Notification_createdAt_idx" ON "Notification"("createdAt");

-- ============================================================================
-- ADD FOREIGN KEY CONSTRAINTS
-- ============================================================================

-- ProjectIdea foreign keys
ALTER TABLE "ProjectIdea" ADD CONSTRAINT IF NOT EXISTS "ProjectIdea_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ProjectMember foreign keys
ALTER TABLE "ProjectMember" ADD CONSTRAINT IF NOT EXISTS "ProjectMember_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProjectMember" ADD CONSTRAINT IF NOT EXISTS "ProjectMember_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CollaborationRequest foreign keys
ALTER TABLE "CollaborationRequest" ADD CONSTRAINT IF NOT EXISTS "CollaborationRequest_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CollaborationRequest" ADD CONSTRAINT IF NOT EXISTS "CollaborationRequest_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Achievement foreign keys
ALTER TABLE "Achievement" ADD CONSTRAINT IF NOT EXISTS "Achievement_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Notification foreign keys
ALTER TABLE "Notification" ADD CONSTRAINT IF NOT EXISTS "Notification_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Task assignedTo foreign key
ALTER TABLE "Task" ADD CONSTRAINT IF NOT EXISTS "Task_assignedToId_fkey"
  FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================================================
-- DATA MIGRATION (Optional - Run if needed)
-- ============================================================================

-- Set default values for existing projects
UPDATE "Project" SET
  "hoursLogged" = 0,
  "currentStreak" = 0,
  "portfolioPublished" = false,
  "showcaseInGallery" = false,
  "idealTeamSize" = 'SOLO',
  "openForCollaboration" = false,
  "maxTeamSize" = 1,
  "currentTeamSize" = 1,
  "skillsNeeded" = ARRAY[]::TEXT[]
WHERE "hoursLogged" IS NULL;

-- Set default values for existing users
UPDATE "User" SET
  "xp" = 0,
  "level" = 1,
  "currentStreak" = 0,
  "longestStreak" = 0,
  "lastActiveAt" = CURRENT_TIMESTAMP,
  "emailOptIn" = true,
  "pushOptIn" = true,
  "publicProfile" = false
WHERE "xp" IS NULL;

-- Set default priority for existing tasks
UPDATE "Task" SET
  "priority" = 'medium',
  "orderIndex" = 0
WHERE "priority" IS NULL;

-- ============================================================================
-- VERIFICATION QUERIES (Run these to verify the migration)
-- ============================================================================

-- Check all new enums were created
-- SELECT enumlabel FROM pg_enum WHERE enumtypid = 'AchievementType'::regtype;
-- SELECT enumlabel FROM pg_enum WHERE enumtypid = 'NotificationType'::regtype;
-- SELECT enumlabel FROM pg_enum WHERE enumtypid = 'TeamSize'::regtype;
-- SELECT enumlabel FROM pg_enum WHERE enumtypid = 'CollaborationRequestStatus'::regtype;
-- SELECT enumlabel FROM pg_enum WHERE enumtypid = 'ProjectMemberRole'::regtype;

-- Check all new tables exist
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name IN ('ProjectIdea', 'ProjectMember', 'CollaborationRequest', 'Achievement', 'Leaderboard', 'Notification');

-- Check new columns were added to User
-- SELECT column_name FROM information_schema.columns
-- WHERE table_name = 'User'
-- AND column_name IN ('xp', 'level', 'currentStreak', 'avatar');

-- Check new columns were added to Project
-- SELECT column_name FROM information_schema.columns
-- WHERE table_name = 'Project'
-- AND column_name IN ('idealTeamSize', 'openForCollaboration', 'skillsNeeded');

-- ============================================================================
-- ROLLBACK SCRIPT (Use if you need to undo this migration)
-- ============================================================================
-- WARNING: This will delete all data in the new tables!
--
-- DROP TABLE IF EXISTS "Notification" CASCADE;
-- DROP TABLE IF EXISTS "Leaderboard" CASCADE;
-- DROP TABLE IF EXISTS "Achievement" CASCADE;
-- DROP TABLE IF EXISTS "CollaborationRequest" CASCADE;
-- DROP TABLE IF EXISTS "ProjectMember" CASCADE;
-- DROP TABLE IF EXISTS "ProjectIdea" CASCADE;
--
-- DROP TYPE IF EXISTS "ProjectMemberRole";
-- DROP TYPE IF EXISTS "CollaborationRequestStatus";
-- DROP TYPE IF EXISTS "TeamSize";
-- DROP TYPE IF EXISTS "NotificationType";
-- DROP TYPE IF EXISTS "AchievementType";
--
-- ALTER TABLE "Task" DROP CONSTRAINT IF EXISTS "Task_assignedToId_fkey";
-- ALTER TABLE "Task" DROP COLUMN IF EXISTS "assignedToId";
-- ALTER TABLE "Task" DROP COLUMN IF EXISTS "assignedAt";
-- ALTER TABLE "Task" DROP COLUMN IF EXISTS "priority";
-- ALTER TABLE "Task" DROP COLUMN IF EXISTS "milestoneId";
-- ALTER TABLE "Task" DROP COLUMN IF EXISTS "orderIndex";
--
-- (Continue with other ALTER TABLE DROP COLUMN statements for User, Profile, Project...)

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Summary:
-- - Created 5 new enums
-- - Created 6 new tables (ProjectIdea, ProjectMember, CollaborationRequest, Achievement, Leaderboard, Notification)
-- - Extended User table with 9 new fields (gamification)
-- - Extended Profile table with 35+ new fields (assessments)
-- - Extended Project table with 15+ new fields (collaboration)
-- - Extended Task table with 5 new fields (assignment)
-- - Added all necessary foreign key constraints
-- - Added all necessary indexes for performance
--
-- Next steps:
-- 1. Verify migration with the verification queries above
-- 2. Test the application with new features
-- 3. Set OPENAI_API_KEY in .env for AI features
