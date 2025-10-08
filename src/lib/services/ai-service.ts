// src/lib/services/ai-service.ts
import OpenAI from 'openai'
import { BrainstormInput, ProjectIdea } from '@/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export class AIService {
  static async generateProjectIdeas(input: BrainstormInput): Promise<ProjectIdea[]> {
    const prompt = `You are a career counselor helping a high school student brainstorm passion project ideas.

Student Profile:
- Interests: ${input.interests}
- Problem they care about: ${input.problemArea}
- Time commitment: ${input.timeCommitment} hours per week
- Project types they're interested in: ${input.projectTypes.join(', ')}

Generate 8 diverse, creative, and feasible passion project ideas. Each idea should:
1. Align with their interests and the problem area
2. Be achievable with their time commitment
3. Be meaningful and have measurable impact
4. Be unique and stand out in college applications
5. Match at least one of their preferred project types

Return a JSON object with an "ideas" array. Each idea must have:
- id (string)
- title (string)
- description (string)
- category (string: CREATIVE, SOCIAL_IMPACT, ENTREPRENEURIAL, RESEARCH, TECHNICAL, or LEADERSHIP)
- feasibilityScore (number 1-100)
- timeEstimate (string like "4-6 months")
- uniqueness (string: HIGH, MEDIUM, or LOW)
- impactMetrics (array of strings)

Example format:
{
  "ideas": [
    {
      "id": "idea_1",
      "title": "Student Mental Health Podcast Series",
      "description": "Create a 12-episode podcast interviewing students, therapists, and counselors about teen mental health challenges and coping strategies.",
      "category": "SOCIAL_IMPACT",
      "feasibilityScore": 85,
      "timeEstimate": "5-7 months",
      "uniqueness": "HIGH",
      "impactMetrics": ["Students reached", "Episodes published", "Downloads", "Social media engagement"]
    }
  ]
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert career counselor. Always return valid JSON with an "ideas" array.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
    })

    const responseText = completion.choices[0].message.content
    if (!responseText) {
      throw new Error('No response from AI')
    }

    const parsed = JSON.parse(responseText)
    const ideas = parsed.ideas || []
    
    // Ensure all ideas have IDs
    return ideas.map((idea: any, index: number) => ({
      ...idea,
      id: idea.id || `idea_${Date.now()}_${index}`,
    })).slice(0, 8)
  }

  static async generateProjectPlan(projectData: {
    title: string
    description: string
    category: string
  }): Promise<any> {
    // TODO: Implement in Phase 2
    // Will generate SMART goals, milestones, resource needs
    throw new Error('Not implemented yet')
  }

  static async generateReflectionInsights(reflection: string): Promise<string> {
    // TODO: Implement in Phase 3
    // Will provide AI feedback on check-in reflections
    throw new Error('Not implemented yet')
  }
}
