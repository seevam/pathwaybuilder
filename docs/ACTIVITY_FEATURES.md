# Activity Features Guide

This guide explains how to use the two key features available for all activities:

1. **AI Support Button** - Provides contextual help to students
2. **Previous Responses** - Access data from previously completed activities

---

## 1. AI Support Button

The AI Support button provides contextual, AI-powered guidance to help students understand and complete activities.

### Features
- Floating button that appears on all activities
- Modal interface with AI-generated guidance
- Context-aware help based on activity type and current progress
- Customizable position

### Usage

```tsx
import { AISupport } from '@/components/activities/AISupport'

export function MyActivity({ activityId }: { activityId: string }) {
  const [answers, setAnswers] = useState({})

  return (
    <div>
      {/* Your activity content */}

      {/* Add AI Support Button */}
      <AISupport
        activityId={activityId}
        activityTitle="My Activity Name"
        activityType="INTERACTIVE" // or "REFLECTION" or "UPLOAD"
        currentProgress={answers} // Optional: pass current state
        position="bottom-right" // Optional: bottom-right, bottom-left, top-right, top-left
      />
    </div>
  )
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `activityId` | `string` | Yes | The ID of the current activity |
| `activityTitle` | `string` | Yes | Display name of the activity |
| `activityType` | `string` | Yes | Type of activity (INTERACTIVE, REFLECTION, UPLOAD) |
| `currentProgress` | `any` | No | Current state/answers to provide contextual help |
| `position` | `string` | No | Button position (default: 'bottom-right') |

### Examples

**Basic Usage:**
```tsx
<AISupport
  activityId={activityId}
  activityTitle="Values Card Sort"
  activityType="INTERACTIVE"
/>
```

**With Current Progress:**
```tsx
const [selectedValues, setSelectedValues] = useState([])

<AISupport
  activityId={activityId}
  activityTitle="Values Card Sort"
  activityType="INTERACTIVE"
  currentProgress={{ selectedValues, step: currentStep }}
/>
```

---

## 2. Previous Responses

Access data from activities the student has already completed. This enables activities to build on previous work and create continuity across the learning journey.

### Method 1: Using the Hook (Recommended)

```tsx
import { usePreviousResponses } from '@/hooks/usePreviousResponses'

export function MyActivity({ activityId }: { activityId: string }) {
  // Automatically fetches responses from the same module
  const { responses, loading, error, getResponseBySlug } = usePreviousResponses({
    activityId: activityId
  })

  // Access a specific activity's response
  const whoAmIData = getResponseBySlug('who-am-i')

  if (loading) return <div>Loading previous responses...</div>

  return (
    <div>
      {responses.map(response => (
        <div key={response.activityId}>
          <h3>{response.activityTitle}</h3>
          <pre>{JSON.stringify(response.data, null, 2)}</pre>
        </div>
      ))}
    </div>
  )
}
```

### Method 2: Using the Context Provider

First, wrap your app or activity section with the provider:

```tsx
// In your layout or page component
import { ActivityResponseProvider } from '@/contexts/ActivityResponseContext'

export default function Layout({ children }) {
  return (
    <ActivityResponseProvider>
      {children}
    </ActivityResponseProvider>
  )
}
```

Then use the context in your activity:

```tsx
import { useActivityResponses } from '@/contexts/ActivityResponseContext'

export function MyActivity() {
  const {
    responses,
    loading,
    getResponseBySlug,
    getResponsesByModule,
    refreshResponses
  } = useActivityResponses()

  const valuesData = getResponseBySlug('values-card-sort')

  return (
    <div>
      {valuesData && (
        <p>Your top values: {valuesData.data.topValues.join(', ')}</p>
      )}
    </div>
  )
}
```

### Method 3: Direct API Call

```tsx
const [previousResponses, setPreviousResponses] = useState([])

useEffect(() => {
  async function fetchResponses() {
    // Get all responses from a specific module
    const res = await fetch('/api/activities/responses?moduleId=module-1')
    const data = await res.json()
    setPreviousResponses(data.responses)
  }
  fetchResponses()
}, [])
```

### Response Structure

Each response object contains:

```typescript
{
  activityId: string           // Unique activity ID
  activitySlug: string         // Activity slug (e.g., 'who-am-i')
  activityTitle: string        // Display name
  activityType: string         // INTERACTIVE, REFLECTION, UPLOAD
  moduleId: string             // Parent module ID
  data: any                    // Activity-specific response data
  completedAt: Date | null     // Completion timestamp
  timeSpent: number | null     // Time spent in seconds
}
```

### Example: Integration Activity

Here's a complete example showing an integration activity that references previous work:

```tsx
import { usePreviousResponses } from '@/hooks/usePreviousResponses'
import { AISupport } from '@/components/activities/AISupport'

export function IntegrationActivity({ activityId }: { activityId: string }) {
  const { responses, loading, getResponseBySlug } = usePreviousResponses({
    activityId: activityId
  })

  const [reflection, setReflection] = useState('')

  // Get specific previous responses
  const valuesResponse = getResponseBySlug('values-card-sort')
  const strengthsResponse = getResponseBySlug('strengths-discovery')

  if (loading) return <div>Loading your progress...</div>

  return (
    <div className="space-y-6">
      {/* Show previous work */}
      <Card>
        <h3>Your Journey So Far</h3>
        {valuesResponse && (
          <div>
            <strong>Top Values:</strong>
            <p>{valuesResponse.data.topValues?.join(', ')}</p>
          </div>
        )}
        {strengthsResponse && (
          <div>
            <strong>Key Strengths:</strong>
            <p>{strengthsResponse.data.selectedStrengths?.join(', ')}</p>
          </div>
        )}
      </Card>

      {/* Reflection based on previous work */}
      <Card>
        <h3>How do your values connect to your strengths?</h3>
        <Textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Reflect on the connections you see..."
        />
      </Card>

      {/* AI Support */}
      <AISupport
        activityId={activityId}
        activityTitle="Integration Reflection"
        activityType="REFLECTION"
        currentProgress={{ reflection, previousResponses: responses }}
      />
    </div>
  )
}
```

---

## API Endpoints

### Get Previous Responses

**Endpoint:** `GET /api/activities/responses`

**Query Parameters:**
- `moduleId` (optional) - Filter by module
- `activityId` (optional) - Get specific activity response

**Response:**
```json
{
  "responses": [
    {
      "activityId": "...",
      "activitySlug": "who-am-i",
      "activityTitle": "Who Am I?",
      "activityType": "INTERACTIVE",
      "moduleId": "...",
      "data": { /* activity-specific data */ },
      "completedAt": "2024-01-15T10:30:00Z",
      "timeSpent": 600
    }
  ]
}
```

### Get AI Guidance

**Endpoint:** `POST /api/activities/ai-guidance`

**Request Body:**
```json
{
  "activityId": "activity-id",
  "activityTitle": "Activity Name",
  "activityType": "INTERACTIVE",
  "currentProgress": { /* optional current state */ }
}
```

**Response:**
```json
{
  "success": true,
  "guidance": "AI-generated guidance text..."
}
```

---

## Best Practices

### AI Support
1. **Always include the AI Support button** in interactive and reflection activities
2. **Pass current progress** when relevant to provide contextual help
3. **Use descriptive activity titles** to help the AI provide better guidance
4. **Position appropriately** - bottom-right is default and works well for most layouts

### Previous Responses
1. **Use the hook** for simpler implementation and better performance
2. **Handle loading states** to provide good user experience
3. **Check for null data** - not all activities may be completed
4. **Parse data carefully** - each activity stores data differently
5. **Provide context** - show students WHY you're referencing previous work
6. **Make it optional** - previous data should enhance, not block progress

### Integration Activities
1. **Start with a summary** of previous responses
2. **Make connections explicit** - help students see relationships
3. **Ask synthesis questions** - encourage deeper thinking
4. **Use AI guidance** to help students understand how to integrate their learning

---

## Complete Example: Module Integration Activity

See `/src/components/activities/IntegrationReflection.tsx` for a complete, production-ready example that:
- Fetches previous responses from the module
- Displays them in a collapsible, user-friendly format
- Includes AI support button
- Uses previous responses to inform reflection prompts
- Generates AI insights based on all responses

---

## Troubleshooting

**AI Support not working:**
- Check that OpenAI API key is set in environment variables
- Verify the activity has the correct ID and type
- Check browser console for errors

**Previous responses not loading:**
- Ensure activities are actually completed (check database)
- Verify moduleId is correct
- Check that the API endpoint is accessible
- Look for errors in server logs

**TypeScript errors:**
- Import types from the hook or context
- Use proper type guards when accessing response data
- Remember that `data` field is `any` type - validate before use
