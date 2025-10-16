// src/app/api/learning-hub/chat/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { LearningHubService } from '@/lib/services/learning-hub-service'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

function mapQuestionToSessionCategory(qc: string): string | null {
  switch (qc) {
    case 'HOMEWORK_HELP':
    case 'CONCEPT_CLARIFICATION':
    case 'STUDY_STRATEGY':
      return 'ACADEMIC'
    case 'CAREER_ADVICE':
      return 'CAREER'
    case 'COLLEGE_APPS':
      return 'COLLEGE_PREP'
    case 'EMOTIONAL_SUPPORT':
      return 'EMOTIONAL'
    case 'PLATFORM_HELP':
      return 'TECHNICAL'
    default:
      return null
  }
}

const chatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  sessionId: z.string().optional(),
  category: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const body = await req.json()
    const { message, sessionId, category } = chatSchema.parse(body)

    // Check content safety
    const safetyCheck = await LearningHubService.checkContentSafety(message)
    if (!safetyCheck.safe) {
      return NextResponse.json({
        success: false,
        error: 'inappropriate_content',
        message: 'This message contains inappropriate content. Please rephrase your question.'
      }, { status: 400 })
    }

    // Get or create session
    let session
    if (sessionId) {
      session = await db.learningSession.findUnique({
        where: { id: sessionId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 20, // Last 20 messages for context
          }
        }
      })

      if (!session || session.userId !== user.id) {
        return new NextResponse('Session not found', { status: 404 })
      }
    } else {
      // Create new session
      session = await db.learningSession.create({
        data: {
          userId: user.id,
          mode: 'TEXT',
        },
        include: {
          messages: true
        }
      })
    }

    // Save user message
    await db.learningMessage.create({
      data: {
        sessionId: session.id,
        role: 'USER',
        content: message,
        category: category as any,
      }
    })

    // Get student context
    const studentContext = await LearningHubService.getStudentContext(user.id)

    // Build conversation history
    const conversationHistory = session.messages.map(m => ({
      role: m.role === 'USER' ? 'user' : 'assistant',
      content: m.content
    }))

    // Generate AI response
    const { response, category: detectedCategory } = await LearningHubService.generateResponse(
      message,
      conversationHistory,
      studentContext
    )

    // Save AI response
    const aiMessage = await db.learningMessage.create({
      data: {
        sessionId: session.id,
        role: 'ASSISTANT',
        content: response,
        category: detectedCategory,
        modelUsed: 'gpt-4o',
      }
    })

    // Update session
    const updatedSession = await db.learningSession.update({
      where: { id: session.id },
      data: {
        messageCount: { increment: 2 },
        category: mapQuestionToSessionCategory(detectedCategory)
          ? { set: mapQuestionToSessionCategory(detectedCategory) }
          : undefined,

        title: session.title || message.slice(0, 50), // Use first message as title
        updatedAt: new Date(),
      }
    })

    // Generate suggested questions
    const suggestions = await LearningHubService.generateSuggestions([
      ...conversationHistory,
      { role: 'user', content: message },
      { role: 'assistant', content: response }
    ])

    return NextResponse.json({
      success: true,
      response,
      sessionId: session.id,
      category: detectedCategory,
      suggestedActions: [
        'Explain like I\'m 5',
        'Give me an example',
        'Quiz me on this',
      ],
      suggestedQuestions: suggestions,
    })
  } catch (error) {
    console.error('[LEARNING_HUB_CHAT]', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
