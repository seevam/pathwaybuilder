# Database Migration Guide - Core Features Integration

## Overview
This guide walks you through applying the database migration for the core features integration.

## 📋 Prerequisites

1. **Backup your database** (CRITICAL!)
2. PostgreSQL database running and accessible
3. Environment variables set in `.env`

## 🔧 Option 1: Using Prisma Migrate (Recommended)

This is the easiest and safest method:

### Step 1: Set Environment Variables

Create or update `/home/user/pathwaybuilder/.env`:

```env
# Database URLs
POSTGRES_PRISMA_URL="postgresql://user:password@localhost:5432/pathwaybuilder?pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgresql://user:password@localhost:5432/pathwaybuilder"

# Or for Vercel Postgres:
POSTGRES_PRISMA_URL="your-postgres-url-from-vercel"
POSTGRES_URL_NON_POOLING="your-direct-url-from-vercel"

# Clerk (if not already set)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# OpenAI (required for AI features)
OPENAI_API_KEY=sk-...
```

### Step 2: Run Prisma Migration

```bash
cd /home/user/pathwaybuilder

# Generate migration
npx prisma migrate dev --name add_core_features

# This will:
# 1. Compare your schema with the database
# 2. Generate migration SQL
# 3. Apply it to the database
# 4. Regenerate Prisma Client
```

### Step 3: Verify Migration

```bash
# Check migration status
npx prisma migrate status

# You should see:
# "Database schema is up to date!"
```

## 🔧 Option 2: Manual SQL Execution

If you prefer to run SQL manually or Prisma migrate fails:

### Step 1: Connect to Your Database

```bash
# Using psql
psql -U your_username -d pathwaybuilder

# Or using a GUI tool like pgAdmin, TablePlus, DBeaver, etc.
```

### Step 2: Run the Migration SQL

Execute the SQL file created at:
`/home/user/pathwaybuilder/prisma/migrations/add_core_features.sql`

```sql
-- Copy and paste the entire file into your SQL client
-- OR run via psql:
\i /home/user/pathwaybuilder/prisma/migrations/add_core_features.sql
```

### Step 3: Regenerate Prisma Client

```bash
cd /home/user/pathwaybuilder
npx prisma generate
```

## 📊 What Gets Created

### New Tables (6):
- ✅ **ProjectIdea** - AI-generated project ideas
- ✅ **ProjectMember** - Team membership tracking
- ✅ **CollaborationRequest** - Join requests
- ✅ **Achievement** - User achievements/badges
- ✅ **Leaderboard** - Rankings snapshots
- ✅ **Notification** - System notifications

### New Enums (5):
- ✅ **AchievementType** - Badge types
- ✅ **NotificationType** - Notification categories
- ✅ **TeamSize** - Solo, Duo, Small Team, Large Team
- ✅ **CollaborationRequestStatus** - Pending, Accepted, Rejected, Cancelled
- ✅ **ProjectMemberRole** - Owner, Co-Lead, Member

### Extended Tables:
- ✅ **User** - Added gamification (xp, level, streaks)
- ✅ **Profile** - Added 35+ assessment fields
- ✅ **Project** - Added collaboration fields
- ✅ **Task** - Added assignment fields

## ✅ Verification Checklist

After running the migration, verify:

```sql
-- Check new tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('ProjectIdea', 'ProjectMember', 'CollaborationRequest', 'Achievement', 'Leaderboard', 'Notification');
-- Should return 6 rows

-- Check User table has new columns
SELECT column_name FROM information_schema.columns
WHERE table_name = 'User'
AND column_name IN ('xp', 'level', 'currentStreak', 'longestStreak');
-- Should return 4 rows

-- Check Project table has collaboration fields
SELECT column_name FROM information_schema.columns
WHERE table_name = 'Project'
AND column_name IN ('idealTeamSize', 'openForCollaboration', 'skillsNeeded');
-- Should return 3 rows

-- Check enums were created
SELECT enumlabel FROM pg_enum WHERE enumtypid = 'TeamSize'::regtype;
-- Should return: SOLO, DUO, SMALL_TEAM, LARGE_TEAM
```

## 🧪 Test the Migration

After migration completes:

```bash
cd /home/user/pathwaybuilder

# Start dev server
npm run dev

# Test these endpoints (in browser):
# 1. http://localhost:3000/ideas
# 2. http://localhost:3000/discover
# 3. http://localhost:3000/leaderboard
# 4. http://localhost:3000/profile
```

## 🚨 Troubleshooting

### Problem: "Environment variable not found"

**Solution:** Set environment variables in `.env` file

```bash
cd /home/user/pathwaybuilder
cp .env.example .env
# Then edit .env with your database credentials
```

### Problem: "Relation already exists"

**Solution:** Table already exists. Check if migration was partially applied:

```bash
npx prisma migrate resolve --applied add_core_features
```

### Problem: "Type already exists"

**Solution:** Enum already exists. This is usually safe to ignore, or use:

```sql
CREATE TYPE IF NOT EXISTS "TeamSize" AS ENUM (...);
```

### Problem: "Foreign key constraint violation"

**Solution:** Ensure related tables exist first. Migration should handle this automatically.

### Problem: Prisma Client errors after migration

**Solution:** Regenerate Prisma Client:

```bash
npx prisma generate
rm -rf node_modules/.prisma
npm install
```

## 🔄 Rollback Instructions

⚠️ **WARNING:** This will delete all data in new tables!

```sql
-- Run this SQL to undo the migration:

DROP TABLE IF EXISTS "Notification" CASCADE;
DROP TABLE IF EXISTS "Leaderboard" CASCADE;
DROP TABLE IF EXISTS "Achievement" CASCADE;
DROP TABLE IF EXISTS "CollaborationRequest" CASCADE;
DROP TABLE IF EXISTS "ProjectMember" CASCADE;
DROP TABLE IF EXISTS "ProjectIdea" CASCADE;

DROP TYPE IF EXISTS "ProjectMemberRole";
DROP TYPE IF EXISTS "CollaborationRequestStatus";
DROP TYPE IF EXISTS "TeamSize";
DROP TYPE IF EXISTS "NotificationType";
DROP TYPE IF EXISTS "AchievementType";

-- Remove columns from existing tables
ALTER TABLE "Task" DROP COLUMN IF EXISTS "assignedToId";
ALTER TABLE "Task" DROP COLUMN IF EXISTS "assignedAt";
ALTER TABLE "Task" DROP COLUMN IF EXISTS "priority";
ALTER TABLE "Task" DROP COLUMN IF EXISTS "milestoneId";
ALTER TABLE "Task" DROP COLUMN IF EXISTS "orderIndex";

-- (Continue for User, Profile, Project columns...)
```

Then restore from backup if needed.

## 📈 Performance Notes

The migration includes indexes on:
- User.lastActiveAt (for streak calculations)
- Project.showcaseInGallery (for gallery queries)
- Project.openForCollaboration (for discover page)
- CollaborationRequest.status (for filtering)
- All foreign keys (automatic)

These ensure fast queries even with many users.

## 🔐 Security Notes

- All user data cascades on delete (GDPR compliance)
- Foreign key constraints ensure data integrity
- Indexes prevent slow queries on large tables
- No raw passwords or sensitive data in new fields

## 📚 Related Documentation

- Main Integration Guide: `CORE_FEATURES_INTEGRATION.md`
- Prisma Schema: `prisma/schema.prisma`
- API Documentation: See API route files in `src/app/api/`

## 🎯 Next Steps After Migration

1. ✅ Verify all tables created successfully
2. ✅ Test API endpoints work
3. ✅ Test UI pages load correctly
4. ✅ Set OPENAI_API_KEY for AI features
5. ✅ Create first project idea to test generation
6. ✅ Test collaboration request flow
7. ✅ Check leaderboard displays correctly

## 💡 Tips

- **Development:** Use `npx prisma migrate dev`
- **Production:** Use `npx prisma migrate deploy`
- **Reset DB:** Use `npx prisma migrate reset` (deletes all data!)
- **Prisma Studio:** Use `npx prisma studio` to view data visually

---

**Need Help?**
- Check Prisma docs: https://www.prisma.io/docs/concepts/components/prisma-migrate
- Review migration SQL: `prisma/migrations/add_core_features.sql`
- Check application logs for errors
