# Supabase Migration Guide

## Quick Start

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New query**

### Step 2: Run the Migration
1. Open the file `supabase_migration.sql` in this repository
2. Copy **ALL** the contents
3. Paste into the Supabase SQL Editor
4. Click **RUN** (or press Cmd/Ctrl + Enter)

**Important:** This migration is **100% safe** to run. It:
- ✅ Only **adds** new tables and columns
- ✅ Does **NOT** modify or delete existing data
- ✅ Uses `IF NOT EXISTS` checks (can be run multiple times)
- ✅ Wrapped in a transaction (rolls back if any error occurs)

### Step 3: Verify Migration Success

After running the migration, run these verification queries to confirm everything was created:

```sql
-- Check all new tables exist (should return 6 rows)
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('ProjectIdea', 'ProjectMember', 'CollaborationRequest',
                     'Achievement', 'Leaderboard', 'Notification')
ORDER BY table_name;
```

Expected output:
```
Achievement
CollaborationRequest
Leaderboard
Notification
ProjectIdea
ProjectMember
```

### Step 4: Sync Prisma Schema

After the database migration, you need to sync your Prisma schema:

```bash
# Pull the database schema into Prisma
npx prisma db pull

# Generate Prisma Client
npx prisma generate
```

### Step 5: Set Environment Variables

Make sure you have the following environment variables set in Vercel:

```env
# Required for AI-powered idea generation
OPENAI_API_KEY=sk-your-openai-api-key-here

# Your Supabase connection strings (should already exist)
POSTGRES_PRISMA_URL=your-connection-pooling-url
POSTGRES_URL_NON_POOLING=your-direct-connection-url
```

## What This Migration Adds

### 5 New Enum Types
- `AchievementType` - Badge categories
- `NotificationType` - System notification types
- `TeamSize` - Project team size options
- `CollaborationRequestStatus` - Request workflow states
- `ProjectMemberRole` - Team member roles

### 6 New Tables

#### 1. **ProjectIdea**
Stores AI-generated project ideas personalized to each user's profile.
- Includes feasibility score, matching percentage, time estimates
- Tracks idea status: suggested → saved → started or rejected

#### 2. **ProjectMember**
Tracks team membership and individual contributions.
- Role-based permissions (Owner, Co-Lead, Member)
- Contribution tracking (tasks completed, hours contributed)

#### 3. **CollaborationRequest**
Manages requests to join projects as collaborators.
- Request workflow: Pending → Accepted/Rejected/Cancelled
- Includes skills offered and join reasons

#### 4. **Achievement**
User achievements, badges, and milestones.
- Multiple achievement types (badges, level-ups, streaks, etc.)
- XP rewards for gamification

#### 5. **Leaderboard**
Stores ranking snapshots for different time periods.
- Weekly, monthly, and quarterly rankings
- Tracks XP, projects completed, and streak days

#### 6. **Notification**
System notifications for users.
- 10 different notification types
- Read/unread tracking with timestamps

### Extended Existing Tables

#### User Table (9 new fields)
**Gamification:**
- `xp` - Experience points
- `level` - User level (starts at 1)
- `currentStreak` - Current daily activity streak
- `longestStreak` - Longest streak achieved
- `lastActiveAt` - Last activity timestamp

**Settings:**
- `avatar` - Avatar URL
- `emailOptIn` - Email notification preference
- `pushOptIn` - Push notification preference
- `publicProfile` - Public profile visibility

#### Profile Table (35+ new fields)
**Quick Start Survey:**
- Basic info: grade level, college timeline, time commitment
- Preferences: work style, impact preference, challenge level
- Skills: favorite subjects, skills confidence

**Psychological Assessments:**
- **Self-Determination Theory**: autonomy, competence, relatedness scores
- **Interest Depth**: passion indicators, flow frequency, passion type
- **Grit Scale**: perseverance, consistency, past completions
- **Growth Mindset**: challenge response, failure attribution
- **RIASEC Model**: career interest profile, career clusters
- **Project DNA**: approach style, activity choices

#### Project Table (17 new fields)
**AI Integration:**
- `ideaSourceId` - Link to original AI-generated idea
- `feasibilityScore` - Project feasibility (0-100)
- `matchingPercent` - Profile match percentage

**Tracking:**
- `hoursLogged` - Total hours worked
- `currentStreak` - Daily work streak
- `lastWorkedAt` - Last activity timestamp

**Portfolio:**
- `portfolioPublished` - Public portfolio flag
- `portfolioUrl` - Unique portfolio URL
- `showcaseInGallery` - Featured in gallery

**Collaboration:**
- `idealTeamSize` - Solo/Duo/Small Team/Large Team
- `openForCollaboration` - Accepting collaborators
- `maxTeamSize` - Maximum team size
- `currentTeamSize` - Current team size
- `skillsNeeded` - Array of skills looking for
- `collaborationDesc` - Collaboration description

#### Task Table (5 new fields)
- `milestoneId` - Optional grouping by milestone
- `orderIndex` - Order within project
- `assignedToId` - Assigned team member (FK to User)
- `assignedAt` - Assignment timestamp
- `priority` - "low", "medium", or "high"

## Features Enabled

After running this migration, you'll have:

### 🤖 AI-Powered Idea Generation
- Generate personalized project ideas based on user profiles
- Feasibility scoring and time estimates
- Match projects to interests and skills

### 👥 Team Collaboration
- Multi-member project teams
- Role-based permissions (Owner, Co-Lead, Member)
- Collaboration requests and approvals
- Task assignment to team members

### 🏆 Gamification
- XP and leveling system
- Daily activity streaks
- Achievement badges
- Weekly/monthly leaderboards

### 🔔 Notifications
- In-app notification system
- 10 different notification types
- Read/unread tracking

### 🔍 Project Discovery
- Find projects looking for collaborators
- Filter by skills needed
- Match projects to your profile

## Troubleshooting

### Migration Fails
If the migration fails:
1. Check the error message in Supabase SQL Editor
2. The transaction will automatically rollback (no partial changes)
3. Common issues:
   - Enum already exists → Safe to ignore, already handled
   - Table already exists → Safe to ignore, already handled
   - Foreign key constraint → Ensure User/Project tables exist

### Column Already Exists
If you see "column already exists" errors, it's safe - the migration uses `IF NOT EXISTS` checks.

### Prisma Sync Issues
If `npx prisma db pull` fails:
1. Ensure your database connection strings are correct
2. Try running `npx prisma db push` instead (syncs schema to DB)
3. Check that you're using the `NON_POOLING` connection for migrations

## Need Help?

If you run into issues:
1. Check the Supabase logs in the dashboard
2. Verify your database connection strings
3. Ensure you're on a Supabase plan that supports the number of tables/columns
4. Check the verification queries at the bottom of `supabase_migration.sql`

## Rollback (Emergency Only)

If you need to completely undo this migration:

```sql
-- ⚠️ WARNING: This will DELETE ALL DATA in the new tables!
BEGIN;

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

-- Note: Column removals not included to preserve existing data
-- If you need to remove columns, contact support

COMMIT;
```

**Note:** This only removes the new tables, not the new columns added to existing tables. Column removal requires careful planning to avoid data loss.
