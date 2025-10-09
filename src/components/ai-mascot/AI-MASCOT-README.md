# AI Mascot Feature - "Pathway Pat" 🎓

## Overview
An interactive AI assistant that helps users navigate Pathway Builder. The mascot appears as a floating button and expands into a chat interface.

## Features

### 🎨 Visual Design
- **Floating Button**: Purple gradient (🎓) with pulse animation
- **Expandable Chat**: 96px width card with purple theme
- **Smooth Animations**: Framer Motion transitions
- **Responsive**: Works on mobile and desktop

### 💬 Chat Capabilities
- Contextual help about app features
- Navigation guidance
- Motivational support
- Real-time responses via OpenAI

### 🧠 AI Context
The AI knows about:
- All 6 modules and their activities
- Project brainstorming and planning
- Assessment types (RIASEC, DISC, TypeFinder)
- Dashboard features and navigation
- Profile and progress tracking

## Files Created

```
src/
├── components/
│   └── ai-mascot/
│       └── AIMascot.tsx          # Main mascot component
└── app/
    └── api/
        └── ai-mascot/
            └── route.ts          # API endpoint
```

## Usage

The mascot is automatically available on all pages. Users can:

1. **Click the floating button** (bottom-right corner)
2. **Ask questions** about the app
3. **Get instant help** with navigation and features
4. **Close** by clicking the X button

## Customization

### Change Mascot Icon
Edit `AIMascot.tsx`:
```tsx
<div className="text-3xl">🦉</div> // Change emoji
```

### Adjust Position
```tsx
className="fixed bottom-6 right-6 z-50" // Modify bottom/right values
```

### Change Colors
Replace purple gradient with your brand colors:
```tsx
className="bg-gradient-to-r from-blue-600 to-green-600"
```

### Modify AI Personality
Edit `APP_CONTEXT` in `api/ai-mascot/route.ts`:
- Tone and language
- Response length
- Emoji usage
- Knowledge base

### Update Greetings
Edit `MASCOT_GREETINGS` array in `AIMascot.tsx`

## Example Interactions

**User**: "How do I start a project?"
**Pat**: "Great question! 🚀 Head to the Projects page and click 'Start New Project'. The AI will help you brainstorm personalized ideas based on your interests! Want to try it now?"

**User**: "What's my health score?"
**Pat**: "Your project health score (shown on project pages) measures your progress! 📊 It goes up when you complete tasks, log check-ins, and hit milestones. Regular updates keep it healthy!"

**User**: "I'm stuck on Module 1"
**Pat**: "No worries! Module 1 has 3 activities: Values Card Sort, Strengths Discovery, and Personal Reflection. Which one would you like help with? 💡"

## Configuration

### Environment Variables
Ensure your `.env.local` has:
```bash
OPENAI_API_KEY=your_key_here
```

### API Rate Limits
- Default: GPT-4 Turbo
- Max tokens: 300 per response
- Conversation history: Last 6 messages

## Performance

- **Lazy Loading**: Component only loads when needed
- **Optimistic Updates**: Messages appear instantly
- **Error Handling**: Graceful fallbacks
- **Mobile Optimized**: Responsive design

## Future Enhancements

Consider adding:
- [ ] Voice input/output
- [ ] Quick action buttons (e.g., "Take me to projects")
- [ ] Personalized tips based on user progress
- [ ] Multiple mascot characters
- [ ] Animation when receiving messages
- [ ] Conversation history persistence
- [ ] Suggested questions/prompts

## Troubleshooting

### Mascot Not Appearing
1. Check browser console for errors
2. Verify OpenAI API key is set
3. Ensure framer-motion is installed: `npm install framer-motion`

### Slow Responses
1. Check OpenAI API status
2. Consider using GPT-3.5-turbo for faster responses
3. Reduce max_tokens in API route

### Context Issues
Update `APP_CONTEXT` in the API route with latest app features

## Analytics (Optional)

Track mascot usage:
```tsx
// Add to handleSend function
analytics.track('AI_Mascot_Message_Sent', {
  message: input,
  timestamp: new Date()
})
```

## Accessibility

- Keyboard navigation supported (Enter to send)
- Screen reader friendly
- High contrast mode compatible
- Focus indicators on interactive elements

---

Built with ❤️ for Pathway Builder students
