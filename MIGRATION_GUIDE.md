# Quick Migration Guide 🚀

This guide shows you how to apply the new pricing plans and course catalog features to your database.

## ⚡ Quick Start (3 Steps)

### Step 1: Connect to Your Database

Find your database connection string from your environment variables:

```bash
# For Vercel/Vercel Postgres
echo $POSTGRES_URL_NON_POOLING

# For Supabase
echo $DATABASE_URL

# For local PostgreSQL
echo "postgresql://user:password@localhost:5432/pathwaybuilder"
```

### Step 2: Run the Migration

**Option A: Using PostgreSQL CLI (Fastest)**
```bash
psql $POSTGRES_URL_NON_POOLING -f migrations/manual_migration_complete.sql
```

**Option B: Using Database GUI**
1. Open your database client (pgAdmin, TablePlus, DBeaver, etc.)
2. Copy the contents of `migrations/manual_migration_complete.sql`
3. Execute the SQL

**Option C: Using Vercel/Supabase Dashboard**
1. Go to your database dashboard
2. Open the SQL editor
3. Copy and paste `migrations/manual_migration_complete.sql`
4. Click "Run"

### Step 3: Update Prisma Client

```bash
npx prisma generate
```

**Done!** 🎉 Your database is now ready.

## 📋 What Was Added?

### User Table Modifications
- `credits` column (INTEGER, default: 0)
- `subscriptionPlan` column (ENUM, default: FREE)

### New Tables Created
| Table | Purpose |
|-------|---------|
| `UserSubscription` | Tracks user subscription details and Stripe integration |
| `CreditTransaction` | Complete history of all credit transactions |
| `Course` | Course catalog with all metadata |
| `CourseLesson` | Individual lessons within each course |
| `CourseEnrollment` | User enrollment and progress tracking |
| `CourseProgress` | Detailed per-lesson progress tracking |
| `CourseReview` | Rating and review system |

### New Enums
- `SubscriptionPlan` (FREE, PREMIUM_MONTHLY, PREMIUM_ANNUAL)
- `CreditTransactionType` (9 types)
- `CourseCategory` (10 categories)
- `CourseDifficulty` (3 levels)
- `CourseEnrollmentStatus` (4 statuses)

## ✅ Verify Migration Success

Run this query to verify everything was created:

```sql
-- Check if all tables exist
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
```

You should see all 7 tables listed.

## 🎁 Optional: Grant Credits to Existing Users

If you want to give 100 credits to all existing users retroactively:

```sql
-- Grant 100 credits to all existing users
UPDATE "User" SET "credits" = 100 WHERE "credits" = 0;

-- Create transaction records
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

## 📚 Optional: Add Sample Courses

To test the course catalog, add some sample courses:

```sql
-- Sample Course: Introduction to Leadership
INSERT INTO "Course" (
    "id", "title", "slug", "description", "shortDescription",
    "category", "difficulty", "duration", "creditCost",
    "isPremium", "isFeatured", "isPublished",
    "instructorName", "skillsGained", "averageRating", "totalReviews"
) VALUES (
    gen_random_uuid()::text,
    'Introduction to Leadership',
    'intro-to-leadership',
    'Develop essential leadership skills to inspire and guide teams effectively. Learn communication, decision-making, and team management.',
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
    4.7,
    156
);

-- Add more courses following the same pattern...
```

## 🔄 After Migration

### 1. Restart Your Development Server
```bash
npm run dev
```

### 2. Test the New Features
- Visit `/pricing` to see the pricing page
- Visit `/courses` to see the course catalog
- Sign up a new user to verify they receive 100 credits
- Check the courses sidebar navigation

### 3. Monitor for Issues
Check your application logs for any errors related to:
- Credit transactions
- Course enrollment
- Database queries

## 🐛 Troubleshooting

### "psql: command not found"
Install PostgreSQL client:
```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client

# Windows
# Download from https://www.postgresql.org/download/windows/
```

### "permission denied for table"
Make sure you're using the correct connection string with admin privileges.

### Migration takes too long
If you have many existing users, the migration might take a few seconds. This is normal.

### Need to rollback?
See the detailed rollback instructions in `migrations/README.md`

## 📖 Detailed Documentation

For complete documentation including:
- Individual migration files
- Detailed verification queries
- Rollback procedures
- Advanced troubleshooting

See: **[migrations/README.md](./migrations/README.md)**

## 🎯 Next Steps

After successful migration:

1. ✅ Configure Stripe for payment processing (optional)
2. ✅ Populate course catalog with your content
3. ✅ Test credit earning through activities
4. ✅ Test course enrollment flow
5. ✅ Set up premium features

---

**Questions?** Check `migrations/README.md` for detailed documentation.
