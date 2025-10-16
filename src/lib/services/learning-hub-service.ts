// src/lib/services/learning-hub-service.ts
import OpenAI from 'openai'
import { db } from '@/lib/db'
import { UserDiscoveryContext } from './discovery-context'
import { MessageRole, QuestionCategory } from '@prisma/client'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface StudentContext {
  name: string
  grade?: number
  topValues: string[]
  topStrengths: string[]
  riasecCode: string | null
  currentModule?: string
  goals?: string[]
}

export class LearningHubService {
  /**
   * Generate AI response with student context
   */
  static async generateResponse(
    message: string,
    conversationHistory: Array<{ role: string; content: string }>,
    studentContext: StudentContext
  ): Promise<{ response: string; category: QuestionCategory }> {
    const systemPrompt = this.buildSystemPrompt(studentContext)

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    })

    const response = completion.choices[0].message.content || 
      "I'm here to help! Could you tell me more about what you need?"

    // Categorize the question
    const category = await this.categorizeQuestion(message)

    return { response, category }
  }

  /**
   * Build personalized system prompt with student context
   */
  private static buildSystemPrompt(context: StudentContext): string {
    return `You are "Sage", an AI mentor for ${context.name}, a ${context.grade ? `grade ${context.grade}` : 'high school'} student using Pathway Builder.

STUDENT PROFILE:
${context.topValues.length > 0 ? `- Top Values: ${context.topValues.join(', ')}` : ''}
${context.topStrengths.length > 0 ? `- Top Strengths: ${context.topStrengths.join(', ')}` : ''}
${context.riasecCode ? `- RIASEC Code: ${context.riasecCode}` : ''}
${context.currentModule ? `- Currently Working On: ${context.currentModule}` : ''}
${context.goals && context.goals.length > 0 ? `- Goals: ${context.goals.join(', ')}` : ''}

YOUR ROLE:
You help students with academic questions, career guidance, and personal development. You are warm, encouraging, patient, and never condescending.

CAPABILITIES:
- Answer academic questions (math, science, English, history, etc.)
- Provide career guidance based on their profile
- Offer study strategies and time management tips
- Support with college application advice
- Provide emotional support and encouragement
- Help with goal-setting and accountability
- Give feedback on resumes and essays

ETHICAL GUARDRAILS:
- NEVER do homework FOR students - teach the method, don't give answers
- Use the Socratic method - ask questions to guide their thinking
- Provide hints and scaffolded learning, not complete solutions
- For serious mental health concerns, acknowledge their feelings and suggest talking to a school counselor or trusted adult
- Don't provide medical or legal advice
- Redirect inappropriate requests politely

PERSONALITY:
- Use a warm, supportive tone like a helpful older sibling
- Ask clarifying questions before giving full answers
- Celebrate their progress and reference their strengths
- Use examples and analogies to explain concepts
- Keep responses conversational and age-appropriate
- Use their values and strengths to motivate and guide

RESPONSE GUIDELINES:
- Keep responses under 200 words unless explaining complex concepts
- Break down complex topics into digestible steps
- Reference their profile when relevant (e.g., "Given your creativity strength...")
- End with encouraging questions or next steps when appropriate
- If they ask for complete answers to homework, explain why learning the process is more valuable

Remember: Your goal is to empower them to learn and grow, not to do the work for them.`
  }

  /**
   * Categorize the question using AI
   */
  static async categorizeQuestion(message: string): Promise<QuestionCategory> {
    try {
      const prompt = `Categorize this student question into ONE of these categories:
- HOMEWORK_HELP: Help with specific homework problems
- CONCEPT_CLARIFICATION: Understanding academic concepts
- CAREER_ADVICE: Career exploration and planning
- STUDY_STRATEGY: Time management, study techniques
- COLLEGE_APPS: College applications, essays, admissions
- EMOTIONAL_SUPPORT: Stress, motivation, confidence
- PLATFORM_HELP: How to use Pathway Builder features
- OTHER: Anything else

Question: "${message}"

Respond with ONLY the category name (e.g., "HOMEWORK_HELP"), nothing else.`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 20,
      })

      const category = completion.choices[0].message.content?.trim() as QuestionCategory
      
      // Validate the category
      const validCategories = [
        'HOMEWORK_HELP',
        'CONCEPT_CLARIFICATION',
        'CAREER_ADVICE',
        'STUDY_STRATEGY',
        'COLLEGE_APPS',
        'EMOTIONAL_SUPPORT',
        'PLATFORM_HELP',
        'OTHER'
      ]

      return validCategories.includes(category) ? category : 'OTHER'
    } catch (error) {
      console.error('Error categorizing question:', error)
      return 'OTHER'
    }
  }

  /**
   * Get student context for personalization
   */
  static async getStudentContext(userId: string): Promise<StudentContext> {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        moduleProgress: {
          where: { status: 'IN_PROGRESS' },
          include: { module: true },
          take: 1,
        }
      }
    })

    if (!user) throw new Error('User not found')

    const profile = await UserDiscoveryContext.getUserProfile(userId)

    return {
      name: user.name,
      grade: user.grade || undefined,
      topValues: profile?.topValues || [],
      topStrengths: profile?.topStrengths.map(s => s.name) || [],
      riasecCode: profile?.riasecCode || null,
      currentModule: user.moduleProgress[0]?.module.title,
      goals: (user.profile?.goals as string[]) || []
    }
  }

  /**
   * Generate suggested follow-up questions
   */
  static async generateSuggestions(
    conversationHistory: Array<{ role: string; content: string }>
  ): Promise<string[]> {
    if (conversationHistory.length === 0) {
      // Default suggestions for new conversation
      return [
        "Help me understand a concept from my coursework",
        "What careers align with my interests?",
        "How can I manage my time better?",
        "Can you review my essay or resume?"
      ]
    }

    try {
      const lastMessages = conversationHistory.slice(-4).map(m => 
        `${m.role}: ${m.content}`
      ).join('\n')

      const prompt = `Based on this conversation, suggest 3 relevant follow-up questions the student might want to ask next. Make them specific and helpful.

Recent conversation:
${lastMessages}

Return ONLY a JSON array of 3 short questions (under 60 characters each), like:
["Question 1?", "Question 2?", "Question 3?"]`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 200,
        response_format: { type: 'json_object' }
      })

      const result = JSON.parse(completion.choices[0].message.content || '{"suggestions": []}')
      return result.suggestions || result.questions || []
    } catch (error) {
      console.error('Error generating suggestions:', error)
      return []
    }
  }

  /**
   * Check content safety
   */
  static async checkContentSafety(message: string): Promise<{
    safe: boolean
    flagged: boolean
    reason?: string
  }> {
    try {
      const moderation = await openai.moderations.create({
        input: message
      })

      const results = moderation.results[0]
      
      return {
        safe: !results.flagged,
        flagged: results.flagged,
        reason: results.flagged ? 
          Object.entries(results.categories)
            .filter(([_, value]) => value)
            .map(([key]) => key)
            .join(', ') : undefined
      }
    } catch (error) {
      console.error('Error checking content safety:', error)
      // Fail open - allow the message but log the error
      return { safe: true, flagged: false }
    }
  }
}
