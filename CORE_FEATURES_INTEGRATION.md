# Core Features Integration

This document describes the integration of core features from the passion-project into pathwaybuilder.

## Features Integrated

### 1. **Profile System with Deep Assessments**
- Extended UserProfile model with psychological assessment fields
- RIASEC career interest profiles
- Grit & Growth Mindset scores
- Self-Determination Theory metrics
- Quick-start survey data

**New Fields in Profile Model:**
- Quick Start: gradeLevel, collegeTimeline, timeCommitment, workStyle
- Assessments: gritScore, growthMindsetScore, riasecScores
- Career: careerClusters, dreamCareer

**API Endpoint:** `/api/profile`

### 2. **AI-Powered Idea Generation**
- Generate personalized project ideas using OpenAI GPT-4o-mini
- Match ideas to user profile and interests
- Track idea status (suggested, saved, started, rejected)

**New Model:** `ProjectIdea`

**API Endpoints:**
- `GET /api/ideas` - Fetch user's ideas
- `POST /api/ideas` - Generate new ideas
- `PATCH /api/ideas/[id]` - Update idea status

**Page:** `/ideas`

### 3. **Find Collaborations (Discover)**
- Discover projects open for collaboration
- Smart matching based on user profile
- Filter by category, team size, and skills
- Send collaboration requests

**API Endpoint:** `/api/discover`

**Page:** `/discover`

### 4. **Team Collaboration System**
- Send and manage collaboration requests
- Accept/reject requests as project owner
- Track team members and roles (Owner, Co-Lead, Member)
- Assign tasks to team members

**New Models:**
- `ProjectMember` - Track team members
- `CollaborationRequest` - Manage join requests

**API Endpoints:**
- `/api/collaboration-requests` - Create, list requests
- `/api/collaboration-requests/[id]` - Accept/reject/cancel
- `/api/projects/[id]/collaboration-requests` - Get pending requests for a project
- `/api/projects/[id]/members` - Manage team members
- `/api/tasks/[id]/assign` - Assign tasks to members

**Component:** `TeamCollaborationSection` (for project detail page)

### 5. **Leaderboard**
- Global rankings based on XP
- Weekly and monthly leaderboards
- Track projects completed and streaks

**New Model:** `Leaderboard`

**API Endpoint:** `/api/leaderboard?period=all-time|weekly|monthly`

**Page:** `/leaderboard`

### 6. **Gamification System**
- XP points and levels
- Streaks tracking
- Achievements system
- Notifications

**Extended User Model Fields:**
- xp, level
- currentStreak, longestStreak
- lastActiveAt

**New Models:**
- `Achievement`
- `Notification`

**API Endpoint:** `/api/gamification/stats`

## Database Schema Changes

### New Enums
```prisma
enum AchievementType
enum NotificationType
enum TeamSize
enum CollaborationRequestStatus
enum ProjectMemberRole
```

### Extended Models
- **User**: Added gamification fields (xp, level, streaks)
- **Profile**: Added 40+ assessment and profile fields
- **Project**: Added collaboration fields (teamSize, skillsNeeded, etc.)
- **Task**: Added assignment fields (assignedToId, priority)

### New Models
- **ProjectIdea**: AI-generated ideas
- **ProjectMember**: Team membership
- **CollaborationRequest**: Join requests
- **Achievement**: User achievements
- **Leaderboard**: Rankings snapshots
- **Notification**: System notifications

## Library Files Added

### AI Services
- `src/lib/ai/index.ts` - OpenAI client
- `src/lib/ai/idea-generator.ts` - Project idea generation
- `src/lib/ai/milestone-generator.ts` - Milestone/task generation

### Core Services
- `src/lib/auth.ts` - Authentication helpers
- `src/lib/services/gamification.ts` - XP/level calculations
- `src/lib/services/project-matcher.ts` - Project matching algorithm

### Validation Schemas
- `src/lib/validations/profile.ts` - Profile validation
- `src/lib/validations/project.ts` - Project validation

## Navigation Updates

Added new menu items:
- 💡 **Discover Ideas** (`/ideas`)
- 👥 **Find Collaborations** (`/discover`)
- 🏆 **Leaderboard** (`/leaderboard`)

## Dependencies Added

```json
{
  "@tanstack/react-query": "^5.x" // For data fetching and caching
}
```

## Migration Required

⚠️ **IMPORTANT**: Before running the application, you need to:

1. **Set Environment Variables:**
```env
# Add to .env
OPENAI_API_KEY=sk-...  # Required for AI idea generation
```

2. **Run Database Migration:**
```bash
cd /home/user/pathwaybuilder
npx prisma migrate dev --name add_core_features
```

3. **Generate Prisma Client (Already done):**
```bash
npx prisma generate
```

## Usage Examples

### Generate Project Ideas
1. Navigate to `/ideas`
2. Rate 5 sample ideas (1-10 scale)
3. Click "Generate Ideas" - receives 3 personalized ideas
4. Save, Pass, or Start each idea

### Find Collaborations
1. Navigate to `/discover`
2. Filter by category or team size
3. View match scores based on your profile
4. Click "Request to Join" to send a request

### Manage Collaboration Requests (Project Owner)
1. Go to your project detail page
2. Click "Team" tab
3. View pending requests in "Collaboration Requests" card
4. Accept or Decline requests

### View Leaderboard
1. Navigate to `/leaderboard`
2. Toggle between All-Time, This Month, This Week
3. See your rank and compare with others

## XP System

**Actions that Award XP:**
- Create project: +50 XP
- Join project (collaboration accepted): +30 XP
- Complete milestone: Variable XP
- Daily activity: Maintains streak

**Levels:**
- Level 1: 0-100 XP
- Level 2: 100-250 XP
- Level 3: 250-500 XP
- ... (progressive)

## Architecture Notes

### Import Path Convention
All imports use `@/` alias which maps to `src/`:
```typescript
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
```

### API Route Pattern
All API routes follow this structure:
```typescript
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  const user = await requireAuth()
  // ... logic
  return Response.json(data)
}
```

### Component Structure
- **Pages**: `src/app/(dashboard)/[feature]/page.tsx`
- **API Routes**: `src/app/api/[feature]/route.ts`
- **Components**: `src/components/[feature]/ComponentName.tsx`
- **Services**: `src/lib/services/service-name.ts`

## Testing Checklist

After migration, test the following:

- [ ] User can access `/ideas` and generate ideas
- [ ] Ideas page shows personalized suggestions
- [ ] User can navigate to `/discover` and see open projects
- [ ] Collaboration requests can be sent and received
- [ ] Project owners can accept/reject requests
- [ ] Team tab shows members and pending requests
- [ ] Leaderboard displays rankings correctly
- [ ] XP increases after creating a project
- [ ] Profile fields save correctly

## Known Issues & Limitations

1. **AI Features Require OpenAI API Key**: Ideas and milestone generation won't work without it
2. **No Database Migration Run**: You must run `prisma migrate dev` manually
3. **Existing Projects**: Old projects won't have collaboration fields - set manually if needed
4. **Profile Assessment Data**: Existing users will have null values for new profile fields

## Future Enhancements

Consider adding:
1. Real-time notifications (WebSocket/Pusher)
2. Email notifications for collaboration requests
3. Team chat for projects
4. Project templates library
5. Advanced analytics dashboard
6. Achievement unlocking animations
7. Weekly leaderboard snapshots (cron job)

## Support

If you encounter issues:
1. Check that Prisma migration ran successfully
2. Verify OPENAI_API_KEY is set (if using AI features)
3. Check browser console for API errors
4. Verify imports are using `@/` prefix

## Rollback Instructions

To rollback this integration:
1. Checkout previous commit: `git checkout HEAD~1`
2. Run `npm install` to restore previous dependencies
3. Run Prisma migration to revert schema changes

---

**Integration Date:** 2025-12-17
**Source Project:** passion-project
**Target Project:** pathwaybuilder
**Branch:** claude/integrate-core-features
