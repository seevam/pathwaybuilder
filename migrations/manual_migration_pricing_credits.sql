-- ============================================================================
-- MANUAL MIGRATION: Pricing Plans & Credits System
-- ============================================================================
-- This migration adds subscription plans and credit system to the database
-- Safe to run on existing database - will not affect existing data
-- ============================================================================

-- Step 1: Create new ENUMS
-- ============================================================================

-- Subscription Plan enum
DO $$ BEGIN
    CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'PREMIUM_MONTHLY', 'PREMIUM_ANNUAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Credit Transaction Type enum
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

-- Step 2: Modify User table - Add credits and subscription fields
-- ============================================================================

-- Add credits column (default 0 for existing users)
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "credits" INTEGER NOT NULL DEFAULT 0;

-- Add subscriptionPlan column (default FREE for existing users)
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "subscriptionPlan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE';

-- Step 3: Create UserSubscription table
-- ============================================================================

CREATE TABLE IF NOT EXISTS "UserSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',

    -- Billing information
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,

    -- Billing cycle
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "cancelledAt" TIMESTAMP(3),

    -- Pricing
    "amount" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'usd',

    -- Metadata
    "metadata" JSONB,

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSubscription_pkey" PRIMARY KEY ("id")
);

-- Add unique constraint on userId
DO $$ BEGIN
    ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_userId_key" UNIQUE ("userId");
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add unique constraints for Stripe IDs
DO $$ BEGIN
    ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_stripeCustomerId_key" UNIQUE ("stripeCustomerId");
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_stripeSubscriptionId_key" UNIQUE ("stripeSubscriptionId");
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add foreign key constraint
DO $$ BEGIN
    ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS "UserSubscription_userId_idx" ON "UserSubscription"("userId");
CREATE INDEX IF NOT EXISTS "UserSubscription_stripeCustomerId_idx" ON "UserSubscription"("stripeCustomerId");
CREATE INDEX IF NOT EXISTS "UserSubscription_stripeSubscriptionId_idx" ON "UserSubscription"("stripeSubscriptionId");

-- Step 4: Create CreditTransaction table
-- ============================================================================

CREATE TABLE IF NOT EXISTS "CreditTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "CreditTransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,

    -- Context
    "description" TEXT,
    "metadata" JSONB,

    -- Related entities
    "relatedActivityId" TEXT,
    "relatedModuleId" TEXT,
    "relatedProjectId" TEXT,

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditTransaction_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraint
DO $$ BEGIN
    ALTER TABLE "CreditTransaction" ADD CONSTRAINT "CreditTransaction_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS "CreditTransaction_userId_idx" ON "CreditTransaction"("userId");
CREATE INDEX IF NOT EXISTS "CreditTransaction_type_idx" ON "CreditTransaction"("type");
CREATE INDEX IF NOT EXISTS "CreditTransaction_createdAt_idx" ON "CreditTransaction"("createdAt");

-- ============================================================================
-- Optional: Grant 100 credits to all existing users as signup bonus
-- ============================================================================
-- Uncomment the following if you want to grant 100 credits to existing users

/*
-- Update existing users to have 100 credits
UPDATE "User" SET "credits" = 100 WHERE "credits" = 0;

-- Create credit transaction records for existing users
INSERT INTO "CreditTransaction" ("id", "userId", "type", "amount", "balance", "description", "createdAt")
SELECT
    gen_random_uuid()::text,
    "id",
    'SIGNUP_BONUS',
    100,
    100,
    'Retroactive signup bonus - 100 free credits!',
    CURRENT_TIMESTAMP
FROM "User"
WHERE "credits" = 100
AND NOT EXISTS (
    SELECT 1 FROM "CreditTransaction"
    WHERE "CreditTransaction"."userId" = "User"."id"
    AND "CreditTransaction"."type" = 'SIGNUP_BONUS'
);
*/

-- ============================================================================
-- Migration Complete!
-- ============================================================================
-- You can verify the migration with:
-- SELECT COUNT(*) FROM "UserSubscription";
-- SELECT COUNT(*) FROM "CreditTransaction";
-- SELECT "credits", "subscriptionPlan" FROM "User" LIMIT 5;
-- ============================================================================
