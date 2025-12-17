# Database Schema Diagram - Core Features Integration

## 📊 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CORE TABLES                                    │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│      User        │◄────────────┐
├──────────────────┤              │
│ id (PK)          │              │
│ clerkId          │              │
│ email            │              │
│ name             │              │
│ ┌──────────────┐ │              │
│ │ NEW FIELDS:  │ │              │
│ │ xp           │ │              │
│ │ level        │ │              │
│ │ currentStreak│ │              │
│ │ longestStreak│ │              │
│ │ lastActiveAt │ │              │
│ └──────────────┘ │              │
└─────────┬────────┘              │
          │                       │
          │ 1:1                   │
          ▼                       │
┌──────────────────┐              │
│     Profile      │              │
├──────────────────┤              │
│ id (PK)          │              │
│ userId (FK)      │              │
│ ┌──────────────┐ │              │
│ │ EXTENDED:    │ │              │
│ │ gradeLevel   │ │              │
│ │ workStyle    │ │              │
│ │ gritScore    │ │              │
│ │ riasecScores │ │              │
│ │ (35+ more)   │ │              │
│ └──────────────┘ │              │
└──────────────────┘              │
                                  │
                                  │
┌─────────────────────────────────────────────────────────────────────────┐
│                      PROJECT ECOSYSTEM                                  │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│   ProjectIdea    │◄──────┐
├──────────────────┤        │
│ id (PK)          │        │
│ userId (FK) ─────┼────────┘
│ title            │
│ description      │         ┌──────────────────┐
│ category         │    ┌───►│     Project      │
│ matchingPercent  │    │    ├──────────────────┤
│ feasibilityScore │    │    │ id (PK)          │
│ status           │    │    │ userId (FK) ─────┼───────┐
└──────────────────┘    │    │ title            │       │
                        │    │ description      │       │
      ┌─────────────────┘    │ category         │       │
      │ ideaSourceId         │ status           │       │
      │ (optional link)      │ ┌──────────────┐ │       │
      │                      │ │ NEW FIELDS:  │ │       │
      │                      │ │ idealTeamSize│ │       │
      │                      │ │ openForCollab│ │       │
      │                      │ │ maxTeamSize  │ │       │
      │                      │ │ skillsNeeded │ │       │
      │                      │ └──────────────┘ │       │
      │                      └─────┬────────────┘       │
      │                            │                    │
      │                            │ 1:N                │
      │                            ▼                    │
      │                      ┌──────────────────┐       │
      │                      │    Milestone     │       │
      │                      ├──────────────────┤       │
      │                      │ id (PK)          │       │
      │                      │ projectId (FK)   │       │
      │                      │ title            │       │
      │                      │ status           │       │
      │                      └──────────────────┘       │
      │                                                 │
      │                            │ 1:N                │
      │                            ▼                    │
      │                      ┌──────────────────┐       │
      │                      │      Task        │       │
      │                      ├──────────────────┤       │
      │                      │ id (PK)          │       │
      │                      │ projectId (FK)   │       │
      │                      │ milestoneId (FK) │       │
      │                      │ title            │       │
      │                      │ ┌──────────────┐ │       │
      │                      │ │ NEW FIELDS:  │ │       │
      │                      │ │ assignedToId │─┼───────┼──┐
      │                      │ │ priority     │ │       │  │
      │                      │ │ orderIndex   │ │       │  │
      │                      │ └──────────────┘ │       │  │
      │                      └──────────────────┘       │  │
      │                                                 │  │
      └─────────────────────────────────────────────────┘  │
                                                           │
                                                           │
┌─────────────────────────────────────────────────────────┼──────────────┐
│                   COLLABORATION SYSTEM                  │              │
└─────────────────────────────────────────────────────────┼──────────────┘
                                                           │
                    ┌──────────────────┐                  │
              ┌────►│  ProjectMember   │◄─────────────────┘
              │     ├──────────────────┤
              │     │ id (PK)          │
              │     │ projectId (FK)   │
              │     │ userId (FK) ─────┼──────┐
              │     │ role             │      │
              │     │ tasksCompleted   │      │
              │     │ hoursContributed │      │
              │     └──────────────────┘      │
              │                               │
              │                               │
              │     ┌──────────────────┐      │
              └─────┤CollaborationReq  │      │
                    ├──────────────────┤      │
                    │ id (PK)          │      │
                    │ projectId (FK)   │      │
                    │ userId (FK) ─────┼──────┘
                    │ status           │
                    │ message          │
                    │ skills           │
                    │ respondedBy      │
                    └──────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                    GAMIFICATION SYSTEM                                  │
└─────────────────────────────────────────────────────────────────────────┘

        ┌──────────────────┐
   ┌───►│   Achievement    │
   │    ├──────────────────┤
   │    │ id (PK)          │
   │    │ userId (FK)      │
   │    │ achievementType  │
   │    │ achievementId    │
   │    │ name             │
   │    │ xpAwarded        │
   │    │ unlockedAt       │
   │    └──────────────────┘
   │
   │    ┌──────────────────┐
   ├───►│   Leaderboard    │
   │    ├──────────────────┤
   │    │ id (PK)          │
   │    │ userId (FK)      │
   │    │ period           │
   │    │ xpEarned         │
   │    │ projectsCompleted│
   │    │ rank             │
   │    └──────────────────┘
   │
   │    ┌──────────────────┐
   └───►│  Notification    │
        ├──────────────────┤
        │ id (PK)          │
        │ userId (FK)      │
        │ type             │
        │ title            │
        │ message          │
        │ read             │
        │ actionUrl        │
        └──────────────────┘
```

## 📋 Table Relationships Summary

### User-Centric Relationships
```
User
 ├─ 1:1  → Profile
 ├─ 1:N  → ProjectIdea (AI generated ideas)
 ├─ 1:N  → Project (owned projects)
 ├─ 1:N  → ProjectMember (team memberships)
 ├─ 1:N  → CollaborationRequest (sent requests)
 ├─ 1:N  → Task (assigned tasks)
 ├─ 1:N  → Achievement (unlocked achievements)
 └─ 1:N  → Notification (received notifications)
```

### Project-Centric Relationships
```
Project
 ├─ N:1  → User (owner)
 ├─ 1:1? → ProjectIdea (optional source)
 ├─ 1:N  → Milestone
 ├─ 1:N  → Task
 ├─ 1:N  → ProjectMember (team)
 └─ 1:N  → CollaborationRequest (pending requests)
```

## 🔑 Key Foreign Key Relationships

| Child Table           | Foreign Key      | Parent Table | On Delete    |
|-----------------------|------------------|--------------|--------------|
| Profile               | userId           | User         | CASCADE      |
| ProjectIdea           | userId           | User         | CASCADE      |
| Project               | userId           | User         | CASCADE      |
| ProjectMember         | userId           | User         | CASCADE      |
| ProjectMember         | projectId        | Project      | CASCADE      |
| CollaborationRequest  | userId           | User         | CASCADE      |
| CollaborationRequest  | projectId        | Project      | CASCADE      |
| Task                  | projectId        | Project      | CASCADE      |
| Task                  | assignedToId     | User         | SET NULL     |
| Achievement           | userId           | User         | CASCADE      |
| Notification          | userId           | User         | CASCADE      |
| Milestone             | projectId        | Project      | CASCADE      |

## 🎯 New Enums

```typescript
enum AchievementType {
  BADGE, LEVEL_UP, STREAK_MILESTONE,
  PROJECT_MILESTONE, SPECIAL
}

enum NotificationType {
  STREAK_WARNING, MILESTONE_COMPLETE,
  ACHIEVEMENT_UNLOCKED, WEEKLY_SUMMARY,
  PROJECT_UPDATE, COLLABORATION_REQUEST,
  COLLABORATION_ACCEPTED, COLLABORATION_REJECTED,
  TEAM_MEMBER_JOINED, TASK_ASSIGNED
}

enum TeamSize {
  SOLO, DUO, SMALL_TEAM, LARGE_TEAM
}

enum CollaborationRequestStatus {
  PENDING, ACCEPTED, REJECTED, CANCELLED
}

enum ProjectMemberRole {
  OWNER, CO_LEAD, MEMBER
}
```

## 📈 Indexes for Performance

### User Table
- ✅ `clerkId` (unique)
- ✅ `email` (unique)
- ✅ `lastActiveAt` (new - for streak calculations)

### Project Table
- ✅ `userId` (owner lookup)
- ✅ `status` (filtering)
- ✅ `showcaseInGallery` (new - gallery page)
- ✅ `openForCollaboration` (new - discover page)

### ProjectIdea Table
- ✅ `userId` (user's ideas)
- ✅ `status` (filtering)

### ProjectMember Table
- ✅ `[projectId, userId]` (unique constraint)
- ✅ `projectId` (team lookup)
- ✅ `userId` (user's memberships)

### CollaborationRequest Table
- ✅ `[projectId, userId]` (unique constraint)
- ✅ `projectId` (requests for project)
- ✅ `userId` (user's requests)
- ✅ `status` (filtering pending)

### Task Table
- ✅ `projectId` (project tasks)
- ✅ `completed` (filtering)
- ✅ `milestoneId` (new - milestone tasks)
- ✅ `assignedToId` (new - user's assigned tasks)

### Leaderboard Table
- ✅ `[userId, period]` (unique constraint)
- ✅ `[period, rank]` (leaderboard queries)

### Notification Table
- ✅ `[userId, read]` (unread notifications)
- ✅ `createdAt` (recent notifications)

## 🔄 Data Flow Examples

### 1. Collaboration Request Flow
```
User A                          System                      User B (Owner)
  │                               │                              │
  │ Browse /discover              │                              │
  │ ─────────────────────────────►│                              │
  │                               │ Query: openForCollaboration  │
  │                               │                              │
  │ Request to Join               │                              │
  │ ─────────────────────────────►│                              │
  │                               │ INSERT CollaborationRequest  │
  │                               │                              │
  │                               │ INSERT Notification ────────►│
  │                               │                              │
  │                               │◄─────────────── Accept ──────│
  │                               │                              │
  │                               │ UPDATE CollaborationRequest  │
  │                               │ INSERT ProjectMember         │
  │                               │ UPDATE Project.currentTeamSize
  │                               │ UPDATE User.xp (+30)         │
  │                               │                              │
  │◄──── Notification ────────────│                              │
```

### 2. XP and Achievement Flow
```
User                            System
  │                               │
  │ Complete Action               │
  │ (create project)              │
  │ ─────────────────────────────►│
  │                               │ UPDATE User.xp (+50)
  │                               │ Check if level up
  │                               │ IF xp threshold reached:
  │                               │   UPDATE User.level
  │                               │   INSERT Achievement
  │                               │   INSERT Notification
  │                               │
  │◄──── Updated Stats ───────────│
```

### 3. Leaderboard Update Flow
```
Cron Job                        System
  │                               │
  │ Weekly Schedule               │
  │ ─────────────────────────────►│
  │                               │ Calculate XP for period
  │                               │ Rank all users
  │                               │ INSERT/UPDATE Leaderboard
  │                               │ (batch operation)
  │                               │
```

## 💾 Storage Estimates

Approximate storage per record:

| Table                | Size/Record | Est. 1000 Users | Est. 10,000 Users |
|----------------------|-------------|-----------------|-------------------|
| User (extended)      | ~300 bytes  | 300 KB          | 3 MB              |
| Profile (extended)   | ~2 KB       | 2 MB            | 20 MB             |
| ProjectIdea          | ~1 KB       | 3 MB*           | 30 MB*            |
| Project (extended)   | ~500 bytes  | 1.5 MB*         | 15 MB*            |
| ProjectMember        | ~150 bytes  | 450 KB*         | 4.5 MB*           |
| CollaborationRequest | ~300 bytes  | 300 KB*         | 3 MB*             |
| Achievement          | ~200 bytes  | 2 MB*           | 20 MB*            |
| Notification         | ~250 bytes  | 2.5 MB*         | 25 MB*            |
| Leaderboard          | ~150 bytes  | 150 KB*         | 1.5 MB*           |

*Assumes average: 3 ideas, 3 projects, 1.5 members/project, etc.

## 🔐 Security Considerations

### Cascade Deletes
- ✅ All user data cascades when user is deleted (GDPR)
- ✅ All project data cascades when project is deleted
- ✅ Orphaned records are prevented

### Data Integrity
- ✅ Foreign key constraints ensure referential integrity
- ✅ Unique constraints prevent duplicates
- ✅ Enums ensure valid status values
- ✅ Default values prevent null issues

### Privacy
- ✅ `User.publicProfile` controls visibility
- ✅ Projects only visible to team members
- ✅ Notifications only visible to recipient
- ✅ No PII in gamification tables

---

**Legend:**
- PK = Primary Key
- FK = Foreign Key
- 1:1 = One-to-one relationship
- 1:N = One-to-many relationship
- N:1 = Many-to-one relationship
