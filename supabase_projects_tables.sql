-- ============================================================================
-- SUPABASE SUPPLEMENTARY MIGRATION: Projects Core Tables
-- ============================================================================
-- Purpose: Add Milestone, Task, ProjectCheckIn, and ProjectDocument tables
-- These tables are needed for the projects functionality to work properly
-- Safe to run: Uses IF NOT EXISTS to prevent errors
-- ============================================================================

BEGIN;

-- ============================================================================
-- CREATE ENUMS (if they don't exist)
-- ============================================================================

-- Milestone Status Enum
DO $$ BEGIN
  CREATE TYPE "MilestoneStatus" AS ENUM (
    'NOT_STARTED',
    'IN_PROGRESS',
    'COMPLETED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Document Type Enum
DO $$ BEGIN
  CREATE TYPE "DocumentType" AS ENUM (
    'PHOTO',
    'VIDEO',
    'PDF',
    'LINK',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- CREATE CORE TABLES (if they don't exist)
-- ============================================================================

-- Milestone Table
CREATE TABLE IF NOT EXISTS "Milestone" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "MilestoneStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "targetDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Milestone_projectId_idx" ON "Milestone"("projectId");

-- Task Table (with collaboration features)
CREATE TABLE IF NOT EXISTS "Task" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "milestoneId" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "estimatedHours" INTEGER,
    "assignedToId" TEXT,
    "assignedAt" TIMESTAMP(3),
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Task_projectId_idx" ON "Task"("projectId");
CREATE INDEX IF NOT EXISTS "Task_completed_idx" ON "Task"("completed");
CREATE INDEX IF NOT EXISTS "Task_milestoneId_idx" ON "Task"("milestoneId");
CREATE INDEX IF NOT EXISTS "Task_assignedToId_idx" ON "Task"("assignedToId");

-- ProjectCheckIn Table
CREATE TABLE IF NOT EXISTS "ProjectCheckIn" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "accomplishments" TEXT NOT NULL,
    "challenges" TEXT,
    "learnings" TEXT,
    "nextSteps" TEXT,
    "hoursLogged" INTEGER,
    "moodRating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectCheckIn_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ProjectCheckIn_projectId_idx" ON "ProjectCheckIn"("projectId");

-- ProjectDocument Table
CREATE TABLE IF NOT EXISTS "ProjectDocument" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectDocument_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ProjectDocument_projectId_idx" ON "ProjectDocument"("projectId");

-- ============================================================================
-- ADD FOREIGN KEY CONSTRAINTS
-- ============================================================================

-- Milestone foreign keys
DO $$ BEGIN
  ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Task foreign keys
DO $$ BEGIN
  ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedToId_fkey"
    FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ProjectCheckIn foreign keys
DO $$ BEGIN
  ALTER TABLE "ProjectCheckIn" ADD CONSTRAINT "ProjectCheckIn_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ProjectDocument foreign keys
DO $$ BEGIN
  ALTER TABLE "ProjectDocument" ADD CONSTRAINT "ProjectDocument_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

COMMIT;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check all project-related tables exist (should return 4 rows)
-- SELECT table_name
-- FROM information_schema.tables
-- WHERE table_schema = 'public'
--   AND table_name IN ('Milestone', 'Task', 'ProjectCheckIn', 'ProjectDocument')
-- ORDER BY table_name;

-- Check enums were created (should return 2 rows)
-- SELECT t.typname AS enum_name,
--        array_agg(e.enumlabel ORDER BY e.enumsortorder) AS enum_values
-- FROM pg_type t
-- JOIN pg_enum e ON t.oid = e.enumtypid
-- WHERE t.typname IN ('MilestoneStatus', 'DocumentType')
-- GROUP BY t.typname
-- ORDER BY t.typname;

-- ============================================================================
-- MIGRATION COMPLETE! 🎉
-- ============================================================================
--
-- Summary of what was added:
-- ✓ 2 new enum types (MilestoneStatus, DocumentType)
-- ✓ 4 new tables (Milestone, Task, ProjectCheckIn, ProjectDocument)
-- ✓ All foreign key constraints
-- ✓ All indexes for performance
--
-- These tables are now ready for the projects functionality!
-- ============================================================================
