-- ============================================================================
-- MANUAL MIGRATION: Course Catalog & Learning Platform
-- ============================================================================
-- This migration adds the complete course system to the database
-- Safe to run on existing database - will not affect existing data
-- ============================================================================

-- Step 1: Create new ENUMS
-- ============================================================================

-- Course Category enum
DO $$ BEGIN
    CREATE TYPE "CourseCategory" AS ENUM (
        'LEADERSHIP',
        'TECHNOLOGY',
        'CREATIVE_ARTS',
        'STEM',
        'SOCIAL_IMPACT',
        'ENTREPRENEURSHIP',
        'PERSONAL_DEVELOPMENT',
        'COLLEGE_PREP',
        'RESEARCH',
        'COMMUNICATION'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Course Difficulty enum
DO $$ BEGIN
    CREATE TYPE "CourseDifficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Course Enrollment Status enum
DO $$ BEGIN
    CREATE TYPE "CourseEnrollmentStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'DROPPED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 2: Create Course table
-- ============================================================================

CREATE TABLE IF NOT EXISTS "Course" (
    "id" TEXT NOT NULL,

    -- Basic Info
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT,

    -- Content
    "thumbnailUrl" TEXT,
    "videoPreviewUrl" TEXT,
    "syllabus" JSONB,
    "learningObjectives" TEXT[] DEFAULT ARRAY[]::TEXT[],

    -- Categorization
    "category" "CourseCategory" NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "difficulty" "CourseDifficulty" NOT NULL,

    -- Metadata
    "duration" INTEGER NOT NULL,
    "creditCost" INTEGER NOT NULL DEFAULT 0,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,

    -- Stats
    "enrollmentCount" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,

    -- Instructor
    "instructorName" TEXT,
    "instructorBio" TEXT,
    "instructorAvatar" TEXT,

    -- Recommendation Engine Data
    "recommendedFor" JSONB,
    "skillsGained" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "prerequisites" TEXT[] DEFAULT ARRAY[]::TEXT[],

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- Add unique constraint on slug
DO $$ BEGIN
    ALTER TABLE "Course" ADD CONSTRAINT "Course_slug_key" UNIQUE ("slug");
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS "Course_category_idx" ON "Course"("category");
CREATE INDEX IF NOT EXISTS "Course_difficulty_idx" ON "Course"("difficulty");
CREATE INDEX IF NOT EXISTS "Course_isFeatured_idx" ON "Course"("isFeatured");
CREATE INDEX IF NOT EXISTS "Course_isPublished_idx" ON "Course"("isPublished");
CREATE INDEX IF NOT EXISTS "Course_slug_idx" ON "Course"("slug");

-- Step 3: Create CourseLesson table
-- ============================================================================

CREATE TABLE IF NOT EXISTS "CourseLesson" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    -- Content
    "contentType" TEXT NOT NULL,
    "contentUrl" TEXT,
    "content" JSONB,
    "duration" INTEGER,

    -- Requirements
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "unlockAfter" TEXT,

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseLesson_pkey" PRIMARY KEY ("id")
);

-- Add unique constraint
DO $$ BEGIN
    ALTER TABLE "CourseLesson" ADD CONSTRAINT "CourseLesson_courseId_orderIndex_key" UNIQUE ("courseId", "orderIndex");
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add foreign key constraint
DO $$ BEGIN
    ALTER TABLE "CourseLesson" ADD CONSTRAINT "CourseLesson_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS "CourseLesson_courseId_idx" ON "CourseLesson"("courseId");

-- Step 4: Create CourseEnrollment table
-- ============================================================================

CREATE TABLE IF NOT EXISTS "CourseEnrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "status" "CourseEnrollmentStatus" NOT NULL DEFAULT 'NOT_STARTED',

    -- Progress
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "completedLessons" INTEGER NOT NULL DEFAULT 0,
    "totalLessons" INTEGER NOT NULL DEFAULT 0,

    -- Tracking
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "lastAccessedAt" TIMESTAMP(3),

    -- Engagement
    "timeSpent" INTEGER NOT NULL DEFAULT 0,

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseEnrollment_pkey" PRIMARY KEY ("id")
);

-- Add unique constraint
DO $$ BEGIN
    ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_userId_courseId_key" UNIQUE ("userId", "courseId");
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add foreign key constraints
DO $$ BEGIN
    ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS "CourseEnrollment_userId_idx" ON "CourseEnrollment"("userId");
CREATE INDEX IF NOT EXISTS "CourseEnrollment_courseId_idx" ON "CourseEnrollment"("courseId");
CREATE INDEX IF NOT EXISTS "CourseEnrollment_status_idx" ON "CourseEnrollment"("status");

-- Step 5: Create CourseProgress table
-- ============================================================================

CREATE TABLE IF NOT EXISTS "CourseProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,

    "completed" BOOLEAN NOT NULL DEFAULT false,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,

    -- Quiz/Assessment data
    "score" INTEGER,
    "attempts" INTEGER NOT NULL DEFAULT 0,

    "completedAt" TIMESTAMP(3),
    "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseProgress_pkey" PRIMARY KEY ("id")
);

-- Add unique constraint
DO $$ BEGIN
    ALTER TABLE "CourseProgress" ADD CONSTRAINT "CourseProgress_userId_courseId_lessonId_key" UNIQUE ("userId", "courseId", "lessonId");
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add foreign key constraints
DO $$ BEGIN
    ALTER TABLE "CourseProgress" ADD CONSTRAINT "CourseProgress_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "CourseProgress" ADD CONSTRAINT "CourseProgress_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS "CourseProgress_userId_idx" ON "CourseProgress"("userId");
CREATE INDEX IF NOT EXISTS "CourseProgress_courseId_idx" ON "CourseProgress"("courseId");
CREATE INDEX IF NOT EXISTS "CourseProgress_lessonId_idx" ON "CourseProgress"("lessonId");

-- Step 6: Create CourseReview table
-- ============================================================================

CREATE TABLE IF NOT EXISTS "CourseReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "review" TEXT,

    -- Helpful votes
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,

    -- Moderation
    "isPublished" BOOLEAN NOT NULL DEFAULT true,

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseReview_pkey" PRIMARY KEY ("id")
);

-- Add unique constraint
DO $$ BEGIN
    ALTER TABLE "CourseReview" ADD CONSTRAINT "CourseReview_userId_courseId_key" UNIQUE ("userId", "courseId");
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add foreign key constraints
DO $$ BEGIN
    ALTER TABLE "CourseReview" ADD CONSTRAINT "CourseReview_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "CourseReview" ADD CONSTRAINT "CourseReview_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS "CourseReview_courseId_idx" ON "CourseReview"("courseId");
CREATE INDEX IF NOT EXISTS "CourseReview_rating_idx" ON "CourseReview"("rating");
CREATE INDEX IF NOT EXISTS "CourseReview_isPublished_idx" ON "CourseReview"("isPublished");

-- ============================================================================
-- Optional: Insert sample courses for testing
-- ============================================================================
-- Uncomment to create sample courses

/*
-- Sample Course 1: Introduction to Leadership
INSERT INTO "Course" (
    "id", "title", "slug", "description", "shortDescription",
    "category", "difficulty", "duration", "creditCost", "isPremium", "isFeatured", "isPublished",
    "instructorName", "skillsGained", "learningObjectives"
) VALUES (
    gen_random_uuid()::text,
    'Introduction to Leadership',
    'intro-to-leadership',
    'Develop essential leadership skills to inspire and guide teams effectively. This comprehensive course covers communication, decision-making, and team management.',
    'Master the fundamentals of effective leadership and team management.',
    'LEADERSHIP',
    'BEGINNER',
    480,
    10,
    false,
    true,
    true,
    'Dr. Sarah Johnson',
    ARRAY['Communication', 'Team Building', 'Decision Making', 'Conflict Resolution'],
    ARRAY['Understand core leadership principles', 'Develop effective communication strategies', 'Build and manage high-performing teams']
);

-- Sample Course 2: Web Development Bootcamp
INSERT INTO "Course" (
    "id", "title", "slug", "description", "shortDescription",
    "category", "difficulty", "duration", "creditCost", "isPremium", "isFeatured", "isPublished",
    "instructorName", "skillsGained", "learningObjectives"
) VALUES (
    gen_random_uuid()::text,
    'Full-Stack Web Development',
    'fullstack-web-development',
    'Learn to build modern web applications from scratch using React, Node.js, and PostgreSQL. Perfect for aspiring developers.',
    'Build complete web applications with modern technologies.',
    'TECHNOLOGY',
    'INTERMEDIATE',
    1200,
    25,
    true,
    true,
    true,
    'Michael Chen',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'REST APIs', 'Git'],
    ARRAY['Build full-stack applications', 'Design RESTful APIs', 'Deploy to production']
);

-- Sample Course 3: Creative Writing Workshop
INSERT INTO "Course" (
    "id", "title", "slug", "description", "shortDescription",
    "category", "difficulty", "duration", "creditCost", "isPremium", "isFeatured", "isPublished",
    "instructorName", "skillsGained", "learningObjectives"
) VALUES (
    gen_random_uuid()::text,
    'Creative Writing Workshop',
    'creative-writing-workshop',
    'Unlock your creative potential and learn to craft compelling narratives. Explore various writing techniques and find your unique voice.',
    'Develop your storytelling skills and creative voice.',
    'CREATIVE_ARTS',
    'BEGINNER',
    360,
    5,
    false,
    false,
    true,
    'Emma Thompson',
    ARRAY['Storytelling', 'Character Development', 'Plot Structure', 'Editing'],
    ARRAY['Write compelling narratives', 'Develop unique characters', 'Master story structure']
);
*/

-- ============================================================================
-- Migration Complete!
-- ============================================================================
-- You can verify the migration with:
-- SELECT COUNT(*) FROM "Course";
-- SELECT COUNT(*) FROM "CourseLesson";
-- SELECT COUNT(*) FROM "CourseEnrollment";
-- SELECT COUNT(*) FROM "CourseProgress";
-- SELECT COUNT(*) FROM "CourseReview";
-- ============================================================================
