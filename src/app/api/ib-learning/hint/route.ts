import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { generateHint, Message, Question } from '@/lib/ai/ib-learning';

export async function POST(request: Request) {
  try {
    // Authenticate user
    const user = await requireAuth();

    // Parse request body
    const body = await request.json();
    const { question, conversationHistory } = body;

    // Validate required fields
    if (!question || !question.id) {
      return NextResponse.json(
        { error: 'Question data is required' },
        { status: 400 }
      );
    }

    if (!conversationHistory || !Array.isArray(conversationHistory)) {
      return NextResponse.json(
        { error: 'Conversation history is required' },
        { status: 400 }
      );
    }

    // Generate hint
    const hint = await generateHint(
      question as Question,
      conversationHistory as Message[]
    );

    return NextResponse.json({ hint });
  } catch (error) {
    console.error('Error in IB Learning hint API:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to generate hint',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
