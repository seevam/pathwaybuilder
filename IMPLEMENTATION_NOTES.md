# Activity and Deliverable Enhancements - Implementation Notes

## Overview
This implementation adds four major enhancements to the PathwayBuilder activities and modules:

1. **Context Carryover**: Activities can reference previous responses
2. **AI Support**: Students can get AI-powered guidance on completing activities
3. **Module Deliverables**: Dynamic, module-specific deliverables with working upload functionality
4. **Activity Results**: Display completed activity results within each activity

---

## 1. Context Carryover from Previous Activities

### API Endpoint
**File**: `/src/app/api/activities/responses/route.ts`

Fetches completed activity responses for context carryover between activities.

**Endpoints**:
- `GET /api/activities/responses` - Get all user's completed activities
- `GET /api/activities/responses?moduleId={id}` - Get completions for a specific module
- `GET /api/activities/responses?activityId={id}` - Get a specific activity completion

**Usage Example**:
```typescript
// Fetch all previous responses
const response = await fetch('/api/activities/responses')
const data = await response.json()
// data.completions contains array of ActivityCompletion objects
```

### React Hook
**File**: `/src/hooks/usePreviousResponses.ts`

Custom hook for easy access to previous activity responses in components.

**Usage Example**:
```typescript
import { usePreviousResponses } from '@/hooks/usePreviousResponses'

function MyActivity() {
  const { responses, loading, getResponseBySlug } = usePreviousResponses('module-1-id')

  // Get specific activity data
  const valuesData = getResponseBySlug('values-card-sort')

  if (valuesData) {
    // Use previous values to inform current activity
    console.log('Previous values:', valuesData.data.alwaysTrue)
  }

  return <div>...</div>
}
```

---

## 2. AI Support for Activities

### AI Support API
**File**: `/src/app/api/activities/ai-support/route.ts`

Provides AI-powered, context-aware guidance for completing activities using OpenAI.

**Request Body**:
```json
{
  "activityId": "string",
  "activityTitle": "string",
  "activityDescription": "string (optional)",
  "userProgress": "string (optional)"
}
```

**Response**:
```json
{
  "guidance": "Step-by-step AI-generated guidance..."
}
```

### AI Support Component
**File**: `/src/components/activities/AISupportButton.tsx`

Reusable button component that opens a modal with AI guidance.

**Props**:
```typescript
interface AISupportButtonProps {
  activityId: string
  activityTitle: string
  activityDescription?: string
  userProgress?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}
```

**Usage Example**:
```tsx
import { AISupportButton } from '@/components/activities/AISupportButton'

<AISupportButton
  activityId={activity.id}
  activityTitle="Strengths Discovery"
  activityDescription="Identify your top strengths"
  variant="outline"
/>
```

**Features**:
- Fetches AI guidance on demand
- Shows loading state
- Considers previous completions for context
- Mobile-responsive modal
- Error handling with toast notifications

---

## 3. Module Deliverables

### Deliverable Configuration
**File**: `/src/lib/config/module-deliverables.ts`

Defines unique deliverables for each of the 6 modules.

**Module Deliverables**:
1. **Module 1**: Identity Collage
2. **Module 2**: Career Exploration Portfolio
3. **Module 3**: Education Pathway Plan
4. **Module 4**: Personal Work Style Profile
5. **Module 5**: Action Plan Document
6. **Module 6**: Personal Brand Package

Each deliverable includes:
- Title and description
- Specific requirements (checklist)
- Template slug for viewing examples
- Accepted file types

**Helper Functions**:
```typescript
import { getModuleDeliverable, getModuleDeliverableByModuleId } from '@/lib/config/module-deliverables'

// Get by order index (1-6)
const deliverable = getModuleDeliverable(1)

// Get by module ID
const deliverable = getModuleDeliverableByModuleId('module-1-id')
```

### Upload API
**File**: `/src/app/api/deliverables/upload/route.ts`

Handles deliverable file uploads.

**Endpoints**:
- `POST /api/deliverables/upload` - Upload deliverable file
- `GET /api/deliverables/upload?moduleId={id}` - Get user's deliverable for module
- `GET /api/deliverables/upload` - Get all user's deliverables

**Usage Example**:
```typescript
const formData = new FormData()
formData.append('file', file)
formData.append('moduleId', moduleId)

const response = await fetch('/api/deliverables/upload', {
  method: 'POST',
  body: formData,
})
```

**Note**: Currently stores metadata only. Integrate with cloud storage (Cloudflare R2, AWS S3) for production use.

### Updated Component
**File**: `/src/components/modules/ModuleDeliverable.tsx`

Enhanced to be fully dynamic with:
- Module-specific content
- Working file upload
- Upload progress indication
- Shows existing submissions
- Template viewing links
- File validation (size, type)

**Props**:
```typescript
interface ModuleDeliverableProps {
  moduleId: string
  orderIndex: number
  unlocked: boolean
  progress: number
}
```

### Template Pages
**File**: `/src/app/(dashboard)/templates/[slug]/page.tsx`

Provides detailed templates for each module deliverable with:
- Section-by-section structure
- What to include guidance
- Format options
- Examples and tips

**Template Slugs**:
- `identity-collage`
- `career-portfolio`
- `education-plan`
- `work-style-profile`
- `action-plan`
- `personal-brand`

---

## 4. Activity Results Display

### Component
**File**: `/src/components/activities/ActivityResults.tsx`

Displays completed activity results within the activity page.

**Features**:
- Automatically fetches and displays completed activity data
- Formats different activity types (RIASEC, Values, Goals, etc.)
- Shows completion date and time spent
- Responsive card design
- Only renders if activity is completed

**Usage Example**:
```tsx
import { ActivityResults } from '@/components/activities/ActivityResults'

<ActivityResults
  activityId={activity.id}
  activityTitle={activity.title}
/>
```

**Supported Activity Formats**:
- RIASEC Assessment (shows Holland Code and scores)
- Values Card Sort (shows top values)
- SMART Goals (shows goals list)
- Text-based reflections
- Generic JSON data

---

## Implementation Example

Here's a complete example of an enhanced activity page:

**File**: `/src/app/(dashboard)/module-1/[activity]/page.tsx`

```tsx
import { AISupportButton } from '@/components/activities/AISupportButton'
import { ActivityResults } from '@/components/activities/ActivityResults'

export default async function ActivityPage({ params }: { params: { activity: string } }) {
  // ... auth and data fetching ...

  const isCompleted = completion?.completed || false

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header with AI Support */}
      <div className="flex items-start justify-between">
        <div>
          <h1>{activity.title}</h1>
          <p>{activity.description}</p>
        </div>
        {!isCompleted && (
          <AISupportButton
            activityId={activity.id}
            activityTitle={activity.title}
            activityDescription={activity.description}
          />
        )}
      </div>

      {/* Show Results if Completed */}
      {isCompleted && (
        <ActivityResults
          activityId={activity.id}
          activityTitle={activity.title}
        />
      )}

      {/* Activity Component */}
      <MyActivityWrapper activityId={activity.id} />
    </div>
  )
}
```

---

## Database Schema Changes

### New Model: ModuleDeliverable
**File**: `/prisma/schema.prisma`

```prisma
model ModuleDeliverable {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  moduleId    String

  title       String
  fileUrl     String
  fileName    String
  fileSize    Int
  mimeType    String

  submittedAt DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([userId, moduleId])
  @@index([userId])
  @@index([moduleId])
}
```

**To apply**:
```bash
npx prisma generate
npx prisma db push
```

---

## UI Components Added

### Dialog Component
**File**: `/src/components/ui/dialog.tsx`

Added Radix UI Dialog component for AI Support modal (if not already present).

---

## Next Steps / TODO

1. **Cloud Storage Integration**: Replace placeholder file URLs with actual cloud storage (Cloudflare R2, AWS S3, Vercel Blob)
   - Update `/src/lib/services/upload-service.ts`
   - Modify `/src/app/api/deliverables/upload/route.ts`

2. **Add AI Support to More Activities**: Currently demonstrated in module-1 activities. Apply pattern to all activity pages.

3. **Context Carryover Examples**: Create more examples showing how activities use previous responses.

4. **Template Downloads**: Allow users to download deliverable templates as files (PDF, PPTX).

5. **Deliverable Review**: Add counselor review/feedback system for submitted deliverables.

6. **Enhanced Analytics**: Track AI Support usage, most-viewed templates, etc.

---

## Testing Checklist

- [ ] Upload a deliverable for each module
- [ ] View all 6 template pages
- [ ] Click "Get AI Help" button in activities
- [ ] Complete an activity and verify results display
- [ ] Check that previous responses are available via API
- [ ] Verify deliverable replaces existing submission
- [ ] Test file size validation (>10MB should fail)
- [ ] Verify locked/unlocked states for deliverables
- [ ] Check mobile responsiveness of all new components

---

## Files Modified/Created

### New Files
- `/src/app/api/activities/responses/route.ts`
- `/src/app/api/activities/ai-support/route.ts`
- `/src/app/api/deliverables/upload/route.ts`
- `/src/components/activities/AISupportButton.tsx`
- `/src/components/activities/ActivityResults.tsx`
- `/src/components/ui/dialog.tsx`
- `/src/hooks/usePreviousResponses.ts`
- `/src/lib/config/module-deliverables.ts`
- `/src/app/(dashboard)/templates/[slug]/page.tsx`

### Modified Files
- `/prisma/schema.prisma` - Added ModuleDeliverable model
- `/src/components/modules/ModuleDeliverable.tsx` - Made dynamic with upload
- `/src/app/(dashboard)/module-1/page.tsx` - Added orderIndex prop
- `/src/app/(dashboard)/module-2/page.tsx` - Added orderIndex prop
- `/src/app/(dashboard)/module-3/page.tsx` - Added orderIndex prop
- `/src/app/(dashboard)/module-4/page.tsx` - Added orderIndex prop
- `/src/app/(dashboard)/module-5/page.tsx` - Added orderIndex prop
- `/src/app/(dashboard)/module-6/page.tsx` - Added orderIndex prop
- `/src/app/(dashboard)/[moduleSlug]/page.tsx` - Added orderIndex prop
- `/src/app/(dashboard)/module-1/[activity]/page.tsx` - Added AI Support & Results

---

## Architecture Decisions

1. **API-First Approach**: All features built with dedicated API routes for flexibility
2. **Reusable Components**: AI Support and Results are standalone components
3. **Configuration-Driven**: Deliverables defined in config file for easy maintenance
4. **Progressive Enhancement**: Features don't break existing functionality
5. **Type Safety**: Full TypeScript support with proper interfaces
6. **Error Handling**: Comprehensive error handling with user-friendly messages

---

## Performance Considerations

- AI Support: Lazy loads guidance only when modal opens
- Activity Results: Only fetches when activity is completed
- Previous Responses: Can be filtered by module to reduce payload
- Deliverable Uploads: 10MB file size limit to prevent performance issues

---

## Security Notes

- All API routes protected with Clerk authentication
- File upload validation (size, type)
- User can only access own completions and deliverables
- SQL injection prevented via Prisma ORM
- No sensitive data exposed in client components
