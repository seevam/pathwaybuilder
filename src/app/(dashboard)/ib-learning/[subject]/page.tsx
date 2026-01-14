import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { QuestionPractice } from '@/components/ib-learning/QuestionPractice';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ subject: string }>;
}

export default async function SubjectPracticePage({ params }: PageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    redirect('/sign-in');
  }

  const resolvedParams = await params;
  const subjectName = resolvedParams.subject.toUpperCase() as any;

  // Find the subject
  const subject = await db.iBSubjectModel.findFirst({
    where: {
      name: subjectName,
    },
  });

  if (!subject) {
    notFound();
  }

  // Fetch questions for this subject (limit to 20 for now)
  const questions = await db.iBQuestion.findMany({
    where: {
      subjectId: subject.id,
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: 20,
  });

  if (questions.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            {subject.icon} {subject.displayName}
          </h1>
          <p className="text-muted-foreground mt-2">
            Practice IB {subject.displayName} questions
          </p>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No questions available for this subject yet. Please check back later!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          {subject.icon} {subject.displayName}
        </h1>
        <p className="text-muted-foreground mt-2">
          Practice IB {subject.displayName} questions with AI tutoring
        </p>
      </div>

      <QuestionPractice
        questions={questions.map((q) => ({
          id: q.id,
          title: q.title,
          content: q.content,
          questionType: q.questionType,
          difficulty: q.difficulty,
          options: q.options as Record<string, string> | null,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        }))}
        userId={user.id}
        subjectName={subject.displayName}
      />
    </div>
  );
}
