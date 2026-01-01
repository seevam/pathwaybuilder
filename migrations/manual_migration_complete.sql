-- ============================================================================
-- COMPLETE MANUAL MIGRATION: Pricing Plans, Credits & Course System
-- ============================================================================
-- This is a combined migration script that applies all changes in the correct order
-- Safe to run on existing database - will not affect existing data
--
-- Run this file with: psql DATABASE_URL -f migrations/manual_migration_complete.sql
-- Or execute sections individually in your database client
-- ============================================================================

BEGIN;

-- ============================================================================
-- PART 1: PRICING PLANS & CREDITS SYSTEM
-- ============================================================================

-- Create Subscription Plan enum
DO $$ BEGIN
    CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'PREMIUM_MONTHLY', 'PREMIUM_ANNUAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Credit Transaction Type enum
DO $$ BEGIN
    CREATE TYPE "CreditTransactionType" AS ENUM (
        'SIGNUP_BONUS',
        'SUBSCRIPTION_RENEWAL',
        'ACTIVITY_COMPLETION',
        'MODULE_COMPLETION',
        'PROJECT_MILESTONE',
        'PURCHASE',
        'USAGE',
        'REFUND',
        'ADMIN_ADJUSTMENT'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add credits column to User table
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "credits" INTEGER NOT NULL DEFAULT 0;

-- Add subscriptionPlan column to User table
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "subscriptionPlan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE';

-- Create UserSubscription table
CREATE TABLE IF NOT EXISTS "UserSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "cancelledAt" TIMESTAMP(3),
    "amount" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserSubscription_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
    ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_userId_key" UNIQUE ("userId");
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_stripeCustomerId_key" UNIQUE ("stripeCustomerId");
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_stripeSubscriptionId_key" UNIQUE ("stripeSubscriptionId");
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE INDEX IF NOT EXISTS "UserSubscription_userId_idx" ON "UserSubscription"("userId");
CREATE INDEX IF NOT EXISTS "UserSubscription_stripeCustomerId_idx" ON "UserSubscription"("stripeCustomerId");
CREATE INDEX IF NOT EXISTS "UserSubscription_stripeSubscriptionId_idx" ON "UserSubscription"("stripeSubscriptionId");

-- Create CreditTransaction table
CREATE TABLE IF NOT EXISTS "CreditTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "CreditTransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "relatedActivityId" TEXT,
    "relatedModuleId" TEXT,
    "relatedProjectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CreditTransaction_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
    ALTER TABLE "CreditTransaction" ADD CONSTRAINT "CreditTransaction_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE INDEX IF NOT EXISTS "CreditTransaction_userId_idx" ON "CreditTransaction"("userId");
CREATE INDEX IF NOT EXISTS "CreditTransaction_type_idx" ON "CreditTransaction"("type");
CREATE INDEX IF NOT EXISTS "CreditTransaction_createdAt_idx" ON "CreditTransaction"("createdAt");

-- ============================================================================
-- PART 2: COURSE CATALOG & LEARNING PLATFORM
-- ============================================================================

-- Create Course Category enum
DO $$ BEGIN
    CREATE TYPE "CourseCategory" AS ENUM (
        'LEADERSHIP', 'TECHNOLOGY', 'CREATIVE_ARTS', 'STEM', 'SOCIAL_IMPACT',
        'ENTREPRENEURSHIP', 'PERSONAL_DEVELOPMENT', 'COLLEGE_PREP', 'RESEARCH', 'COMMUNICATION'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Create Course Difficulty enum
DO $$ BEGIN
    CREATE TYPE "CourseDifficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Create Course Enrollment Status enum
DO $$ BEGIN
    CREATE TYPE "CourseEnrollmentStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'DROPPED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Create Course table
CREATE TABLE IF NOT EXISTS "Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT,
    "thumbnailUrl" TEXT,
    "videoPreviewUrl" TEXT,
    "syllabus" JSONB,
    "learningObjectives" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "category" "CourseCategory" NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "difficulty" "CourseDifficulty" NOT NULL,
    "duration" INTEGER NOT NULL,
    "creditCost" INTEGER NOT NULL DEFAULT 0,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "enrollmentCount" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "instructorName" TEXT,
    "instructorBio" TEXT,
    "instructorAvatar" TEXT,
    "recommendedFor" JSONB,
    "skillsGained" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "prerequisites" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
    ALTER TABLE "Course" ADD CONSTRAINT "Course_slug_key" UNIQUE ("slug");
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE INDEX IF NOT EXISTS "Course_category_idx" ON "Course"("category");
CREATE INDEX IF NOT EXISTS "Course_difficulty_idx" ON "Course"("difficulty");
CREATE INDEX IF NOT EXISTS "Course_isFeatured_idx" ON "Course"("isFeatured");
CREATE INDEX IF NOT EXISTS "Course_isPublished_idx" ON "Course"("isPublished");
CREATE INDEX IF NOT EXISTS "Course_slug_idx" ON "Course"("slug");

-- Create CourseLesson table
CREATE TABLE IF NOT EXISTS "CourseLesson" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "contentType" TEXT NOT NULL,
    "contentUrl" TEXT,
    "content" JSONB,
    "duration" INTEGER,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "unlockAfter" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CourseLesson_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
    ALTER TABLE "CourseLesson" ADD CONSTRAINT "CourseLesson_courseId_orderIndex_key" UNIQUE ("courseId", "orderIndex");
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "CourseLesson" ADD CONSTRAINT "CourseLesson_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE INDEX IF NOT EXISTS "CourseLesson_courseId_idx" ON "CourseLesson"("courseId");

-- Create CourseEnrollment table
CREATE TABLE IF NOT EXISTS "CourseEnrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "status" "CourseEnrollmentStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "completedLessons" INTEGER NOT NULL DEFAULT 0,
    "totalLessons" INTEGER NOT NULL DEFAULT 0,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "lastAccessedAt" TIMESTAMP(3),
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CourseEnrollment_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
    ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_userId_courseId_key" UNIQUE ("userId", "courseId");
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE INDEX IF NOT EXISTS "CourseEnrollment_userId_idx" ON "CourseEnrollment"("userId");
CREATE INDEX IF NOT EXISTS "CourseEnrollment_courseId_idx" ON "CourseEnrollment"("courseId");
CREATE INDEX IF NOT EXISTS "CourseEnrollment_status_idx" ON "CourseEnrollment"("status");

-- Create CourseProgress table
CREATE TABLE IF NOT EXISTS "CourseProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CourseProgress_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
    ALTER TABLE "CourseProgress" ADD CONSTRAINT "CourseProgress_userId_courseId_lessonId_key" UNIQUE ("userId", "courseId", "lessonId");
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "CourseProgress" ADD CONSTRAINT "CourseProgress_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "CourseProgress" ADD CONSTRAINT "CourseProgress_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE INDEX IF NOT EXISTS "CourseProgress_userId_idx" ON "CourseProgress"("userId");
CREATE INDEX IF NOT EXISTS "CourseProgress_courseId_idx" ON "CourseProgress"("courseId");
CREATE INDEX IF NOT EXISTS "CourseProgress_lessonId_idx" ON "CourseProgress"("lessonId");

-- Create CourseReview table
CREATE TABLE IF NOT EXISTS "CourseReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "review" TEXT,
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CourseReview_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
    ALTER TABLE "CourseReview" ADD CONSTRAINT "CourseReview_userId_courseId_key" UNIQUE ("userId", "courseId");
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "CourseReview" ADD CONSTRAINT "CourseReview_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE "CourseReview" ADD CONSTRAINT "CourseReview_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE INDEX IF NOT EXISTS "CourseReview_courseId_idx" ON "CourseReview"("courseId");
CREATE INDEX IF NOT EXISTS "CourseReview_rating_idx" ON "CourseReview"("rating");
CREATE INDEX IF NOT EXISTS "CourseReview_isPublished_idx" ON "CourseReview"("isPublished");

COMMIT;

-- ============================================================================
-- Migration Complete!
-- ============================================================================
-- All tables and indexes have been created successfully.
-- You can now run Prisma generate to update your Prisma Client:
--   npx prisma generate
-- ============================================================================
