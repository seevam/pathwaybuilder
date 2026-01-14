import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getAITutorResponse, Message, Question } from '@/lib/ai/ib-learning';

export async function POST(request: Request) {
  try {
    // Authenticate user
    const user = await requireAuth();

    // Parse request body
    const body = await request.json();
    const { messages, question, userAnswer } = body;

    // Validate required fields
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    if (!question || !question.id) {
      return NextResponse.json(
        { error: 'Question data is required' },
        { status: 400 }
      );
    }

    // Get AI response
    const response = await getAITutorResponse(
      messages as Message[],
      question as Question,
      userAnswer
    );

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in IB Learning chat API:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to get AI response',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
