import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { evaluateAnswer, Question } from '@/lib/ai/ib-learning';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    // Authenticate user
    const user = await requireAuth();

    // Parse request body
    const body = await request.json();
    const { question, userAnswer, questionId } = body;

    // Validate required fields
    if (!question || !question.id) {
      return NextResponse.json(
        { error: 'Question data is required' },
        { status: 400 }
      );
    }

    if (!userAnswer || typeof userAnswer !== 'string') {
      return NextResponse.json(
        { error: 'User answer is required' },
        { status: 400 }
      );
    }

    // Evaluate answer using AI
    const evaluation = await evaluateAnswer(question as Question, userAnswer);

    // Update user progress in database
    try {
      const existingProgress = await db.iBUserProgress.findUnique({
        where: {
          userId_questionId: {
            userId: user.id,
            questionId: questionId || question.id,
          },
        },
      });

      if (existingProgress) {
        // Update existing progress
        await db.iBUserProgress.update({
          where: { id: existingProgress.id },
          data: {
            attempts: existingProgress.attempts + 1,
            correctAttempts: evaluation.isCorrect
              ? existingProgress.correctAttempts + 1
              : existingProgress.correctAttempts,
            lastAttemptedAt: new Date(),
            isCompleted: evaluation.isCorrect,
            userAnswer,
            score: evaluation.score,
          },
        });
      } else {
        // Create new progress record
        const questionData = await db.iBQuestion.findUnique({
          where: { id: questionId || question.id },
          select: { subjectId: true },
        });

        if (questionData) {
          await db.iBUserProgress.create({
            data: {
              userId: user.id,
              questionId: questionId || question.id,
              subjectId: questionData.subjectId,
              attempts: 1,
              correctAttempts: evaluation.isCorrect ? 1 : 0,
              lastAttemptedAt: new Date(),
              isCompleted: evaluation.isCorrect,
              userAnswer,
              score: evaluation.score,
            },
          });
        }
      }

      // Update user stats
      const existingStats = await db.iBUserStats.findUnique({
        where: { userId: user.id },
      });

      if (existingStats) {
        // Calculate streak
        const lastActivityDate = existingStats.lastActivityDate;
        const now = new Date();
        let currentStreak = existingStats.currentStreak;

        if (lastActivityDate) {
          const daysSinceLastActivity = Math.floor(
            (now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysSinceLastActivity === 0) {
            // Same day, keep streak
          } else if (daysSinceLastActivity === 1) {
            // Consecutive day, increment streak
            currentStreak += 1;
          } else {
            // Streak broken, reset to 1
            currentStreak = 1;
          }
        } else {
          currentStreak = 1;
        }

        const longestStreak = Math.max(existingStats.longestStreak, currentStreak);

        await db.iBUserStats.update({
          where: { userId: user.id },
          data: {
            totalQuestionsAttempted: existingStats.totalQuestionsAttempted + 1,
            totalQuestionsCorrect: evaluation.isCorrect
              ? existingStats.totalQuestionsCorrect + 1
              : existingStats.totalQuestionsCorrect,
            currentStreak,
            longestStreak,
            lastActivityDate: now,
          },
        });
      } else {
        // Create new stats record
        await db.iBUserStats.create({
          data: {
            userId: user.id,
            totalQuestionsAttempted: 1,
            totalQuestionsCorrect: evaluation.isCorrect ? 1 : 0,
            currentStreak: 1,
            longestStreak: 1,
            lastActivityDate: new Date(),
            totalStudyTimeMinutes: 0,
          },
        });
      }
    } catch (dbError) {
      console.error('Error updating database:', dbError);
      // Don't fail the request if database update fails
      // Still return the evaluation
    }

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error('Error in IB Learning evaluate API:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to evaluate answer',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
