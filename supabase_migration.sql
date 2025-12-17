-- ============================================================================
-- SUPABASE MIGRATION: Core Features Integration
-- ============================================================================
-- Purpose: Add gamification, collaboration, AI ideas, and leaderboard features
-- Safe to run: Uses IF NOT EXISTS to prevent errors on re-run
-- Impact: Only ADDS new tables/columns, does NOT modify existing data
--
-- What this adds:
-- ✓ 5 new enum types
-- ✓ 6 new tables (ProjectIdea, ProjectMember, CollaborationRequest,
--                 Achievement, Leaderboard, Notification)
-- ✓ Gamification fields to User table (xp, level, streaks)
-- ✓ Assessment fields to Profile table (35+ psychological profile fields)
-- ✓ Collaboration fields to Project table (team size, skills needed)
-- ✓ Assignment fields to Task table (assignedTo, priority)
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: CREATE NEW ENUMS
-- ============================================================================

-- Achievement Types (badges, level-ups, streaks, etc.)
DO $$ BEGIN
  CREATE TYPE "AchievementType" AS ENUM (
    'BADGE',
    'LEVEL_UP',
    'STREAK_MILESTONE',
    'PROJECT_MILESTONE',
    'SPECIAL'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Notification Types (system notifications)
DO $$ BEGIN
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
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Team Size Options
DO $$ BEGIN
  CREATE TYPE "TeamSize" AS ENUM (
    'SOLO',
    'DUO',
    'SMALL_TEAM',  -- 3-4 people
    'LARGE_TEAM'   -- 5+ people
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Collaboration Request Status
DO $$ BEGIN
  CREATE TYPE "CollaborationRequestStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'REJECTED',
    'CANCELLED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Project Member Role
DO $$ BEGIN
  CREATE TYPE "ProjectMemberRole" AS ENUM (
    'OWNER',
    'CO_LEAD',
    'MEMBER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- STEP 2: EXTEND EXISTING TABLES (User, Profile, Project, Task)
-- ============================================================================

-- ------------------------
-- User Table Extensions
-- ------------------------
-- Adding gamification fields: XP, levels, streaks

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatar" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "xp" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "level" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "currentStreak" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "longestStreak" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailOptIn" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "pushOptIn" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "publicProfile" BOOLEAN NOT NULL DEFAULT false;

-- Index for streak tracking and activity queries
CREATE INDEX IF NOT EXISTS "User_lastActiveAt_idx" ON "User"("lastActiveAt");

-- ------------------------
-- Profile Table Extensions
-- ------------------------
-- Adding 35+ psychological assessment fields based on validated frameworks

-- Quick Start Survey Data
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "gradeLevel" INTEGER;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "collegeTimeline" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "timeCommitment" INTEGER; -- hours per week
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "currentActivities" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "favoriteSubjects" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "skillsConfidence" JSONB; -- {coding: 7, writing: 9, ...}
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "workStyle" TEXT; -- "solo", "small-team", "large-team"
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "impactPreference" TEXT; -- "friends", "school", "community", "world"
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "challengeLevel" INTEGER; -- 1-10 scale
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "learningStyle" TEXT;

-- Deep Dive Module Data
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "strengthsRadar" JSONB; -- {creativity: 8, leadership: 6, ...}
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "interestClusters" JSONB;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "problemFocus" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "dreamCareer" TEXT;

-- Self-Determination Theory (Intrinsic Motivation)
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "autonomyScore" INTEGER; -- 1-10
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "competenceScore" INTEGER; -- 1-10
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "relatednessScore" INTEGER; -- 1-10
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "motivationProfile" JSONB;

-- Interest Development & Passion
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "interestDepth" JSONB; -- area-specific depth scores
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "passionIndicators" JSONB;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "passionType" TEXT; -- "harmonious", "obsessive", "emerging"
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "flowFrequency" INTEGER; -- 1-10

-- Grit & Persistence (Duckworth's Grit Scale)
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "gritScore" INTEGER; -- 1-10
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "perseveranceScore" INTEGER; -- 1-10
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "consistencyScore" INTEGER; -- 1-10
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "pastCompletions" JSONB;

-- Growth Mindset (Dweck)
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "growthMindsetScore" INTEGER; -- 1-10
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "challengeResponse" TEXT; -- "embrace", "avoid", "neutral"
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "failureAttribution" JSONB;

-- RIASEC Career Interest Model (Holland)
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "riasecScores" JSONB; -- {realistic, investigative, artistic, social, enterprising, conventional}
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "careerClusters" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Discovery Activity Results
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "projectDNA" JSONB;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "approachStyle" TEXT; -- "build-first", "research-first", etc
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "activityChoices" JSONB;

-- Progress Tracking
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "completionPercent" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "completedAt" TIMESTAMP(3);

-- Index for profile lookups
CREATE INDEX IF NOT EXISTS "Profile_userId_idx" ON "Profile"("userId");

-- ------------------------
-- Project Table Extensions
-- ------------------------
-- Adding collaboration and team features

ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "ideaSourceId" TEXT; -- FK to ProjectIdea
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "feasibilityScore" INTEGER;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "matchingPercent" INTEGER;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "charter" JSONB; -- mission, goals, success criteria
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "skillGaps" JSONB;

-- Tracking Metrics
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "hoursLogged" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "currentStreak" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "lastWorkedAt" TIMESTAMP(3);
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "archivedAt" TIMESTAMP(3);

-- Portfolio Features
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "portfolioPublished" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "portfolioUrl" TEXT;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "showcaseInGallery" BOOLEAN NOT NULL DEFAULT false;

-- Team & Collaboration
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "idealTeamSize" "TeamSize" NOT NULL DEFAULT 'SOLO';
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "openForCollaboration" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "maxTeamSize" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "currentTeamSize" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "skillsNeeded" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "collaborationDesc" TEXT;

-- Indexes for discovery and collaboration queries
CREATE INDEX IF NOT EXISTS "Project_showcaseInGallery_idx" ON "Project"("showcaseInGallery");
CREATE INDEX IF NOT EXISTS "Project_openForCollaboration_idx" ON "Project"("openForCollaboration");
CREATE UNIQUE INDEX IF NOT EXISTS "Project_portfolioUrl_key" ON "Project"("portfolioUrl") WHERE "portfolioUrl" IS NOT NULL;

-- ------------------------
-- Task Table Extensions
-- ------------------------
-- Adding assignment and prioritization

ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "milestoneId" TEXT;
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "orderIndex" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "assignedToId" TEXT; -- FK to User
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "assignedAt" TIMESTAMP(3);
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "priority" TEXT NOT NULL DEFAULT 'medium'; -- "low", "medium", "high"

-- Indexes for task queries
CREATE INDEX IF NOT EXISTS "Task_milestoneId_idx" ON "Task"("milestoneId");
CREATE INDEX IF NOT EXISTS "Task_assignedToId_idx" ON "Task"("assignedToId");

-- ============================================================================
-- STEP 3: CREATE NEW TABLES
-- ============================================================================

-- ------------------------
-- ProjectIdea Table
-- ------------------------
-- Stores AI-generated project ideas personalized to user profiles

CREATE TABLE IF NOT EXISTS "ProjectIdea" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ProjectCategory" NOT NULL,
    "feasibilityScore" INTEGER NOT NULL,
    "matchingPercent" INTEGER NOT NULL,
    "timeEstimate" TEXT NOT NULL,
    "uniqueness" TEXT NOT NULL, -- "HIGH", "MEDIUM", "LOW"
    "impactMetrics" TEXT[],
    "generationPrompt" TEXT NOT NULL,
    "profileSnapshot" JSONB NOT NULL, -- snapshot of profile at generation time
    "activitySnapshot" JSONB, -- quest choices that led to this idea
    "status" TEXT NOT NULL DEFAULT 'suggested', -- "suggested", "saved", "started", "rejected"
    "selectedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectIdea_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ProjectIdea_userId_idx" ON "ProjectIdea"("userId");
CREATE INDEX IF NOT EXISTS "ProjectIdea_status_idx" ON "ProjectIdea"("status");

-- ------------------------
-- ProjectMember Table
-- ------------------------
-- Tracks team membership and contributions

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

-- ------------------------
-- CollaborationRequest Table
-- ------------------------
-- Tracks requests to join projects as collaborators

CREATE TABLE IF NOT EXISTS "CollaborationRequest" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "CollaborationRequestStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT, -- Why they want to join
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[], -- Skills they can contribute
    "responseMessage" TEXT, -- Owner's response
    "respondedAt" TIMESTAMP(3),
    "respondedBy" TEXT, -- userId of who responded
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollaborationRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "CollaborationRequest_projectId_userId_key" ON "CollaborationRequest"("projectId", "userId");
CREATE INDEX IF NOT EXISTS "CollaborationRequest_projectId_idx" ON "CollaborationRequest"("projectId");
CREATE INDEX IF NOT EXISTS "CollaborationRequest_userId_idx" ON "CollaborationRequest"("userId");
CREATE INDEX IF NOT EXISTS "CollaborationRequest_status_idx" ON "CollaborationRequest"("status");

-- ------------------------
-- Achievement Table
-- ------------------------
-- User achievements, badges, and milestones

CREATE TABLE IF NOT EXISTS "Achievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementType" "AchievementType" NOT NULL,
    "achievementId" TEXT NOT NULL, -- "first-project", "level-5", "30-day-streak"
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconUrl" TEXT NOT NULL,
    "xpAwarded" INTEGER NOT NULL,
    "metadata" JSONB, -- related project, milestone, etc
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Achievement_userId_achievementId_key" ON "Achievement"("userId", "achievementId");
CREATE INDEX IF NOT EXISTS "Achievement_userId_idx" ON "Achievement"("userId");
CREATE INDEX IF NOT EXISTS "Achievement_achievementType_idx" ON "Achievement"("achievementType");

-- ------------------------
-- Leaderboard Table
-- ------------------------
-- Stores ranking snapshots for different time periods

CREATE TABLE IF NOT EXISTS "Leaderboard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "period" TEXT NOT NULL, -- "2024-W47", "2024-11", "2024-Q4"
    "xpEarned" INTEGER NOT NULL,
    "projectsCompleted" INTEGER NOT NULL,
    "streakDays" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Leaderboard_userId_period_key" ON "Leaderboard"("userId", "period");
CREATE INDEX IF NOT EXISTS "Leaderboard_period_rank_idx" ON "Leaderboard"("period", "rank");

-- ------------------------
-- Notification Table
-- ------------------------
-- System notifications for users

CREATE TABLE IF NOT EXISTS "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "actionUrl" TEXT, -- Deep link to relevant page
    "metadata" JSONB, -- Additional context
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Notification_userId_read_idx" ON "Notification"("userId", "read");
CREATE INDEX IF NOT EXISTS "Notification_createdAt_idx" ON "Notification"("createdAt");

-- ============================================================================
-- STEP 4: ADD FOREIGN KEY CONSTRAINTS
-- ============================================================================

-- ProjectIdea foreign keys
DO $$ BEGIN
  ALTER TABLE "ProjectIdea" ADD CONSTRAINT "ProjectIdea_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ProjectMember foreign keys
DO $$ BEGIN
  ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- CollaborationRequest foreign keys
DO $$ BEGIN
  ALTER TABLE "CollaborationRequest" ADD CONSTRAINT "CollaborationRequest_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "CollaborationRequest" ADD CONSTRAINT "CollaborationRequest_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Achievement foreign keys
DO $$ BEGIN
  ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Notification foreign keys
DO $$ BEGIN
  ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Task assignedTo foreign key
DO $$ BEGIN
  ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedToId_fkey"
    FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- STEP 5: SET DEFAULT VALUES FOR EXISTING RECORDS
-- ============================================================================

-- Update existing users with default gamification values
UPDATE "User" SET
  "xp" = COALESCE("xp", 0),
  "level" = COALESCE("level", 1),
  "currentStreak" = COALESCE("currentStreak", 0),
  "longestStreak" = COALESCE("longestStreak", 0),
  "lastActiveAt" = COALESCE("lastActiveAt", CURRENT_TIMESTAMP),
  "emailOptIn" = COALESCE("emailOptIn", true),
  "pushOptIn" = COALESCE("pushOptIn", true),
  "publicProfile" = COALESCE("publicProfile", false)
WHERE "xp" IS NULL OR "level" IS NULL;

-- Update existing projects with default collaboration values
UPDATE "Project" SET
  "hoursLogged" = COALESCE("hoursLogged", 0),
  "currentStreak" = COALESCE("currentStreak", 0),
  "portfolioPublished" = COALESCE("portfolioPublished", false),
  "showcaseInGallery" = COALESCE("showcaseInGallery", false),
  "idealTeamSize" = COALESCE("idealTeamSize", 'SOLO'),
  "openForCollaboration" = COALESCE("openForCollaboration", false),
  "maxTeamSize" = COALESCE("maxTeamSize", 1),
  "currentTeamSize" = COALESCE("currentTeamSize", 1),
  "skillsNeeded" = COALESCE("skillsNeeded", ARRAY[]::TEXT[])
WHERE "hoursLogged" IS NULL;

-- Update existing tasks with default values
UPDATE "Task" SET
  "priority" = COALESCE("priority", 'medium'),
  "orderIndex" = COALESCE("orderIndex", 0)
WHERE "priority" IS NULL OR "orderIndex" IS NULL;

-- Update existing profiles with array defaults
UPDATE "Profile" SET
  "currentActivities" = COALESCE("currentActivities", ARRAY[]::TEXT[]),
  "favoriteSubjects" = COALESCE("favoriteSubjects", ARRAY[]::TEXT[]),
  "problemFocus" = COALESCE("problemFocus", ARRAY[]::TEXT[]),
  "careerClusters" = COALESCE("careerClusters", ARRAY[]::TEXT[]),
  "completionPercent" = COALESCE("completionPercent", 0)
WHERE "currentActivities" IS NULL
   OR "favoriteSubjects" IS NULL
   OR "problemFocus" IS NULL
   OR "careerClusters" IS NULL;

COMMIT;

-- ============================================================================
-- MIGRATION COMPLETE! 🎉
-- ============================================================================
--
-- Summary of what was added:
-- ✓ 5 new enum types (AchievementType, NotificationType, TeamSize, etc.)
-- ✓ 6 new tables (ProjectIdea, ProjectMember, CollaborationRequest,
--                 Achievement, Leaderboard, Notification)
-- ✓ 9 new fields to User table (gamification: xp, level, streaks)
-- ✓ 35+ new fields to Profile table (psychological assessments)
-- ✓ 17 new fields to Project table (collaboration & team features)
-- ✓ 5 new fields to Task table (assignment & priority)
-- ✓ All foreign key constraints
-- ✓ All indexes for performance
--
-- Next Steps:
-- 1. Run the verification queries below to confirm migration success
-- 2. Update your .env file with OPENAI_API_KEY for AI features
-- 3. Run: npx prisma generate
-- 4. Run: npx prisma db pull (to sync Prisma schema with database)
-- 5. Deploy your application
--
-- ============================================================================

-- ============================================================================
-- VERIFICATION QUERIES (Run these to verify the migration)
-- ============================================================================

-- Check all new tables exist (should return 6 rows)
-- SELECT table_name
-- FROM information_schema.tables
-- WHERE table_schema = 'public'
--   AND table_name IN ('ProjectIdea', 'ProjectMember', 'CollaborationRequest',
--                      'Achievement', 'Leaderboard', 'Notification')
-- ORDER BY table_name;

-- Check User table has new columns (should return 9 rows)
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'User'
--   AND column_name IN ('xp', 'level', 'currentStreak', 'longestStreak',
--                       'lastActiveAt', 'avatar', 'emailOptIn', 'pushOptIn', 'publicProfile')
-- ORDER BY column_name;

-- Check Project table has collaboration columns (should return 11+ rows)
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'Project'
--   AND column_name IN ('idealTeamSize', 'openForCollaboration', 'skillsNeeded',
--                       'portfolioPublished', 'showcaseInGallery')
-- ORDER BY column_name;

-- Check all enums were created (should return 5 rows)
-- SELECT t.typname AS enum_name,
--        array_agg(e.enumlabel ORDER BY e.enumsortorder) AS enum_values
-- FROM pg_type t
-- JOIN pg_enum e ON t.oid = e.enumtypid
-- WHERE t.typname IN ('AchievementType', 'NotificationType', 'TeamSize',
--                     'CollaborationRequestStatus', 'ProjectMemberRole')
-- GROUP BY t.typname
-- ORDER BY t.typname;

-- Count records in each new table (should all be 0 initially)
-- SELECT
--   (SELECT COUNT(*) FROM "ProjectIdea") as project_ideas,
--   (SELECT COUNT(*) FROM "ProjectMember") as project_members,
--   (SELECT COUNT(*) FROM "CollaborationRequest") as collaboration_requests,
--   (SELECT COUNT(*) FROM "Achievement") as achievements,
--   (SELECT COUNT(*) FROM "Leaderboard") as leaderboard_entries,
--   (SELECT COUNT(*) FROM "Notification") as notifications;
