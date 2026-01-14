import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { IBSubject, QuestionType, Difficulty } from '@prisma/client';

export async function GET(request: Request) {
  try {
    // Check for admin authorization (optional but recommended)
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // You should set ADMIN_SEED_SECRET in your environment variables
    if (process.env.ADMIN_SEED_SECRET && secret !== process.env.ADMIN_SEED_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🌱 Seeding IB Learning Platform data...');

    // Define subjects with metadata
    const subjects = [
      {
        name: IBSubject.MATHEMATICS,
        displayName: 'Mathematics',
        description: 'Algebra, Calculus, Statistics, and more',
        icon: '📐',
      },
      {
        name: IBSubject.PHYSICS,
        displayName: 'Physics',
        description: 'Mechanics, Thermodynamics, Electromagnetism',
        icon: '⚛️',
      },
      {
        name: IBSubject.CHEMISTRY,
        displayName: 'Chemistry',
        description: 'Organic, Inorganic, Physical Chemistry',
        icon: '🧪',
      },
      {
        name: IBSubject.BIOLOGY,
        displayName: 'Biology',
        description: 'Cell Biology, Genetics, Ecology',
        icon: '🧬',
      },
      {
        name: IBSubject.ENGLISH,
        displayName: 'English',
        description: 'Literature, Language, and Analysis',
        icon: '📚',
      },
      {
        name: IBSubject.HISTORY,
        displayName: 'History',
        description: 'World History, Historical Analysis',
        icon: '🏛️',
      },
      {
        name: IBSubject.GEOGRAPHY,
        displayName: 'Geography',
        description: 'Physical and Human Geography',
        icon: '🗺️',
      },
      {
        name: IBSubject.ECONOMICS,
        displayName: 'Economics',
        description: 'Micro and Macroeconomics',
        icon: '💰',
      },
      {
        name: IBSubject.BUSINESS_MANAGEMENT,
        displayName: 'Business Management',
        description: 'Business Operations and Strategy',
        icon: '💼',
      },
      {
        name: IBSubject.PSYCHOLOGY,
        displayName: 'Psychology',
        description: 'Cognitive, Social, and Biological Psychology',
        icon: '🧠',
      },
      {
        name: IBSubject.COMPUTER_SCIENCE,
        displayName: 'Computer Science',
        description: 'Programming, Algorithms, Data Structures',
        icon: '💻',
      },
    ];

    // Create subjects
    const createdSubjects = [];
    for (const subject of subjects) {
      const created = await db.iBSubjectModel.upsert({
        where: { name: subject.name },
        update: subject,
        create: subject,
      });
      createdSubjects.push(created);
      console.log(`✅ Created subject: ${subject.displayName}`);
    }

    // Get subjects for questions
    const mathSubject = createdSubjects.find((s) => s.name === IBSubject.MATHEMATICS)!;
    const physicsSubject = createdSubjects.find((s) => s.name === IBSubject.PHYSICS)!;
    const chemistrySubject = createdSubjects.find((s) => s.name === IBSubject.CHEMISTRY)!;

    // Check if questions already exist
    const existingQuestions = await db.iBQuestion.count();

    if (existingQuestions > 0) {
      return NextResponse.json({
        success: true,
        message: 'Subjects refreshed. Questions already exist.',
        subjects: createdSubjects.length,
        questions: existingQuestions,
      });
    }

    // Mathematics questions
    const mathQuestions = [
      {
        subjectId: mathSubject.id,
        questionType: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.EASY,
        title: 'Quadratic Formula',
        content: 'What is the solution to the equation x² - 5x + 6 = 0?',
        options: {
          A: 'x = 2 or x = 3',
          B: 'x = 1 or x = 6',
          C: 'x = -2 or x = -3',
          D: 'x = 0 or x = 5',
        },
        correctAnswer: 'A',
        explanation: 'Using the quadratic formula or factoring (x-2)(x-3) = 0, we get x = 2 or x = 3.',
        tags: ['algebra', 'quadratic equations'],
        learningObjectives: ['Solve quadratic equations using factoring'],
      },
      {
        subjectId: mathSubject.id,
        questionType: QuestionType.SHORT_ANSWER,
        difficulty: Difficulty.MEDIUM,
        title: 'Derivative Calculation',
        content: 'Find the derivative of f(x) = 3x³ - 2x² + 5x - 1',
        options: null,
        correctAnswer: "f'(x) = 9x² - 4x + 5",
        explanation: 'Using the power rule: derivative of xⁿ is nxⁿ⁻¹. So 3(3x²) - 2(2x) + 5(1) - 0 = 9x² - 4x + 5.',
        tags: ['calculus', 'derivatives'],
        learningObjectives: ['Apply the power rule to find derivatives'],
      },
      {
        subjectId: mathSubject.id,
        questionType: QuestionType.CALCULATION,
        difficulty: Difficulty.HARD,
        title: 'Integral Evaluation',
        content: 'Evaluate the definite integral: ∫₀² (2x + 1) dx',
        options: null,
        correctAnswer: '6',
        explanation: 'First find the antiderivative: x² + x. Then evaluate at bounds: (2² + 2) - (0² + 0) = 6.',
        tags: ['calculus', 'integrals'],
        learningObjectives: ['Evaluate definite integrals'],
      },
    ];

    // Physics questions
    const physicsQuestions = [
      {
        subjectId: physicsSubject.id,
        questionType: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.EASY,
        title: "Newton's Second Law",
        content: 'A force of 10 N acts on a mass of 2 kg. What is the acceleration?',
        options: {
          A: '5 m/s²',
          B: '10 m/s²',
          C: '20 m/s²',
          D: '2 m/s²',
        },
        correctAnswer: 'A',
        explanation: "Using Newton's Second Law (F = ma), acceleration = F/m = 10/2 = 5 m/s².",
        tags: ['mechanics', 'forces'],
        learningObjectives: ["Apply Newton's Second Law"],
      },
      {
        subjectId: physicsSubject.id,
        questionType: QuestionType.CALCULATION,
        difficulty: Difficulty.MEDIUM,
        title: 'Kinetic Energy',
        content: 'Calculate the kinetic energy of a 1000 kg car moving at 20 m/s.',
        options: null,
        correctAnswer: '200,000 J or 200 kJ',
        explanation: 'KE = ½mv² = ½(1000)(20²) = ½(1000)(400) = 200,000 J.',
        tags: ['energy', 'mechanics'],
        learningObjectives: ['Calculate kinetic energy'],
      },
    ];

    // Chemistry questions
    const chemistryQuestions = [
      {
        subjectId: chemistrySubject.id,
        questionType: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.EASY,
        title: 'Atomic Structure',
        content: 'How many protons does a carbon-12 atom have?',
        options: {
          A: '6',
          B: '12',
          C: '18',
          D: '24',
        },
        correctAnswer: 'A',
        explanation: 'Carbon has an atomic number of 6, which means it has 6 protons. The 12 refers to the mass number (protons + neutrons).',
        tags: ['atomic structure', 'elements'],
        learningObjectives: ['Understand atomic number and mass number'],
      },
      {
        subjectId: chemistrySubject.id,
        questionType: QuestionType.SHORT_ANSWER,
        difficulty: Difficulty.MEDIUM,
        title: 'Balancing Equations',
        content: 'Balance the equation: H₂ + O₂ → H₂O',
        options: null,
        correctAnswer: '2H₂ + O₂ → 2H₂O',
        explanation: 'We need 2 molecules of H₂ to provide 4 H atoms and 1 molecule of O₂ to provide 2 O atoms, forming 2 molecules of H₂O.',
        tags: ['chemical equations', 'stoichiometry'],
        learningObjectives: ['Balance chemical equations'],
      },
    ];

    // Create all questions
    const allQuestions = [...mathQuestions, ...physicsQuestions, ...chemistryQuestions];
    let createdCount = 0;

    for (const question of allQuestions) {
      await db.iBQuestion.create({
        data: question as any,
      });
      createdCount++;
      console.log(`✅ Created question: ${question.title}`);
    }

    console.log('✅ IB Learning Platform seeding complete!');

    return NextResponse.json({
      success: true,
      message: 'IB Learning Platform seeded successfully!',
      subjects: createdSubjects.length,
      questions: createdCount,
      subjectsList: createdSubjects.map(s => s.displayName),
    });

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    return NextResponse.json(
      {
        error: 'Seeding failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
