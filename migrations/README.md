# Database Migrations - Pricing Plans, Credits & Courses

This directory contains SQL migration scripts to add the new features without affecting existing data.

## 📁 Migration Files

1. **`manual_migration_pricing_credits.sql`** - Adds pricing plans and credit system
2. **`manual_migration_courses.sql`** - Adds course catalog and learning platform
3. **`manual_migration_complete.sql`** - Combined script that applies both migrations

## 🚀 How to Run Migrations

### Option 1: Using PostgreSQL Command Line (Recommended)

```bash
# Navigate to your project directory
cd /home/user/pathwaybuilder

# Run the complete migration (includes both features)
psql $POSTGRES_URL_NON_POOLING -f migrations/manual_migration_complete.sql

# Or run individual migrations
psql $POSTGRES_URL_NON_POOLING -f migrations/manual_migration_pricing_credits.sql
psql $POSTGRES_URL_NON_POOLING -f migrations/manual_migration_courses.sql
```

### Option 2: Using Database Client (e.g., pgAdmin, TablePlus, DBeaver)

1. Open your database client
2. Connect to your PostgreSQL database
3. Copy the contents of `manual_migration_complete.sql`
4. Execute the SQL script

### Option 3: Using Vercel/Supabase Dashboard

1. Go to your database dashboard
2. Navigate to the SQL editor
3. Copy and paste the contents of `manual_migration_complete.sql`
4. Execute the query

## 🔍 What Gets Created/Modified

### Pricing & Credits System

**Modified Tables:**
- `User` - Adds `credits` (default: 0) and `subscriptionPlan` (default: FREE)

**New Tables:**
- `UserSubscription` - Subscription details with Stripe integration
- `CreditTransaction` - Complete history of all credit transactions

**New Enums:**
- `SubscriptionPlan` (FREE, PREMIUM_MONTHLY, PREMIUM_ANNUAL)
- `CreditTransactionType` (SIGNUP_BONUS, SUBSCRIPTION_RENEWAL, etc.)

### Course System

**New Tables:**
- `Course` - Course catalog with all metadata
- `CourseLesson` - Individual lessons within courses
- `CourseEnrollment` - User enrollment tracking
- `CourseProgress` - Per-lesson progress tracking
- `CourseReview` - Rating and review system

**New Enums:**
- `CourseCategory` (LEADERSHIP, TECHNOLOGY, etc.)
- `CourseDifficulty` (BEGINNER, INTERMEDIATE, ADVANCED)
- `CourseEnrollmentStatus` (NOT_STARTED, IN_PROGRESS, COMPLETED, DROPPED)

## ✅ Verification Queries

After running the migration, verify everything was created successfully:

```sql
-- Check User table modifications
SELECT
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE table_name = 'User'
AND column_name IN ('credits', 'subscriptionPlan');

-- Verify all new tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
    'UserSubscription',
    'CreditTransaction',
    'Course',
    'CourseLesson',
    'CourseEnrollment',
    'CourseProgress',
    'CourseReview'
)
ORDER BY table_name;

-- Check all enums were created
SELECT
    t.typname as enum_name,
    string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) as enum_values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname IN (
    'SubscriptionPlan',
    'CreditTransactionType',
    'CourseCategory',
    'CourseDifficulty',
    'CourseEnrollmentStatus'
)
GROUP BY t.typname
ORDER BY t.typname;

-- Count records in new tables (should be 0 initially)
SELECT
    'UserSubscription' as table_name, COUNT(*) as count FROM "UserSubscription"
UNION ALL
SELECT 'CreditTransaction', COUNT(*) FROM "CreditTransaction"
UNION ALL
SELECT 'Course', COUNT(*) FROM "Course"
UNION ALL
SELECT 'CourseLesson', COUNT(*) FROM "CourseLesson"
UNION ALL
SELECT 'CourseEnrollment', COUNT(*) FROM "CourseEnrollment"
UNION ALL
SELECT 'CourseProgress', COUNT(*) FROM "CourseProgress"
UNION ALL
SELECT 'CourseReview', COUNT(*) FROM "CourseReview";

-- Verify User table credits (all existing users should have 0 credits)
SELECT
    COUNT(*) as total_users,
    SUM(credits) as total_credits,
    AVG(credits) as avg_credits
FROM "User";
```

## 🎯 Post-Migration Steps

### 1. Update Prisma Client

After running the migration, regenerate the Prisma client:

```bash
npx prisma generate
```

### 2. Optional: Grant Retroactive Credits to Existing Users

If you want to give 100 credits to all existing users, run this:

```sql
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
```

### 3. Seed Sample Courses (Optional)

To populate the course catalog with sample data, see the commented section in `manual_migration_courses.sql` or create your own courses:

```sql
INSERT INTO "Course" (
    "id", "title", "slug", "description", "shortDescription",
    "category", "difficulty", "duration", "creditCost",
    "isPremium", "isFeatured", "isPublished",
    "instructorName", "skillsGained"
) VALUES (
    gen_random_uuid()::text,
    'Your Course Title',
    'your-course-slug',
    'Full course description...',
    'Short description for card display',
    'LEADERSHIP',
    'BEGINNER',
    480,  -- duration in minutes
    10,   -- credit cost
    false, -- isPremium
    true,  -- isFeatured
    true,  -- isPublished
    'Instructor Name',
    ARRAY['Skill 1', 'Skill 2', 'Skill 3']
);
```

## 🔒 Safety Features

These migrations are designed to be **safe and non-destructive**:

- ✅ Uses `IF NOT EXISTS` to prevent errors on re-run
- ✅ Uses `ADD COLUMN IF NOT EXISTS` for table alterations
- ✅ Wraps duplicate constraint errors with exception handling
- ✅ Uses transactions (BEGIN/COMMIT) for atomicity
- ✅ No DROP statements - existing data is preserved
- ✅ Defaults for new columns ensure existing rows work immediately

## 🐛 Troubleshooting

### Error: "type already exists"
This is normal if you're re-running the migration. The script handles this gracefully.

### Error: "relation already exists"
Same as above - the script uses `IF NOT EXISTS` to handle this.

### Error: "permission denied"
Make sure you're using the correct database connection string with proper permissions:
```bash
# Use the non-pooling URL for migrations
export POSTGRES_URL_NON_POOLING="your-connection-string"
```

### Need to rollback?
If you need to remove the changes:

```sql
-- WARNING: This will delete all data in these tables!
-- Only run if you're sure you want to rollback

BEGIN;

-- Drop tables in reverse order (respects foreign keys)
DROP TABLE IF EXISTS "CourseReview" CASCADE;
DROP TABLE IF EXISTS "CourseProgress" CASCADE;
DROP TABLE IF EXISTS "CourseEnrollment" CASCADE;
DROP TABLE IF EXISTS "CourseLesson" CASCADE;
DROP TABLE IF EXISTS "Course" CASCADE;
DROP TABLE IF EXISTS "CreditTransaction" CASCADE;
DROP TABLE IF EXISTS "UserSubscription" CASCADE;

-- Remove columns from User table
ALTER TABLE "User" DROP COLUMN IF EXISTS "credits";
ALTER TABLE "User" DROP COLUMN IF EXISTS "subscriptionPlan";

-- Drop enums
DROP TYPE IF EXISTS "CourseEnrollmentStatus";
DROP TYPE IF EXISTS "CourseDifficulty";
DROP TYPE IF EXISTS "CourseCategory";
DROP TYPE IF EXISTS "CreditTransactionType";
DROP TYPE IF EXISTS "SubscriptionPlan";

COMMIT;
```

## 📚 Additional Resources

- [Prisma Schema Documentation](https://www.prisma.io/docs/concepts/components/prisma-schema)
- [PostgreSQL ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)
- [PostgreSQL Enums](https://www.postgresql.org/docs/current/datatype-enum.html)

## ✨ Next Steps

After migration is complete:

1. ✅ Run `npx prisma generate` to update Prisma Client
2. ✅ Restart your development server
3. ✅ Visit `/pricing` to see the pricing page
4. ✅ Visit `/courses` to see the course catalog
5. ✅ Test user signup to verify 100 credits are granted
6. ✅ Seed some sample courses for testing

---

**Need help?** Check the main README or create an issue in the repository.
