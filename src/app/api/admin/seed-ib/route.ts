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

    // Get all subjects
    const subjectMap = Object.fromEntries(
      createdSubjects.map((s) => [s.name, s])
    );

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

    // Create questions for all subjects
    const allQuestions = [
      // MATHEMATICS (3 questions)
      {
        subjectId: subjectMap[IBSubject.MATHEMATICS].id,
        questionType: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.EASY,
        title: 'Quadratic Formula',
        content: 'What is the solution to the equation x² - 5x + 6 = 0?',
        options: { A: 'x = 2 or x = 3', B: 'x = 1 or x = 6', C: 'x = -2 or x = -3', D: 'x = 0 or x = 5' },
        correctAnswer: 'A',
        explanation: 'Using the quadratic formula or factoring (x-2)(x-3) = 0, we get x = 2 or x = 3.',
        tags: ['algebra', 'quadratic equations'],
        learningObjectives: ['Solve quadratic equations using factoring'],
      },
      {
        subjectId: subjectMap[IBSubject.MATHEMATICS].id,
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
        subjectId: subjectMap[IBSubject.MATHEMATICS].id,
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

      // PHYSICS (3 questions)
      {
        subjectId: subjectMap[IBSubject.PHYSICS].id,
        questionType: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.EASY,
        title: "Newton's Second Law",
        content: 'A force of 10 N acts on a mass of 2 kg. What is the acceleration?',
        options: { A: '5 m/s²', B: '10 m/s²', C: '20 m/s²', D: '2 m/s²' },
        correctAnswer: 'A',
        explanation: "Using Newton's Second Law (F = ma), acceleration = F/m = 10/2 = 5 m/s².",
        tags: ['mechanics', 'forces'],
        learningObjectives: ["Apply Newton's Second Law"],
      },
      {
        subjectId: subjectMap[IBSubject.PHYSICS].id,
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
      {
        subjectId: subjectMap[IBSubject.PHYSICS].id,
        questionType: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.HARD,
        title: 'Wave Properties',
        content: 'A wave has a frequency of 50 Hz and a wavelength of 2 m. What is its speed?',
        options: { A: '25 m/s', B: '50 m/s', C: '100 m/s', D: '200 m/s' },
        correctAnswer: 'C',
        explanation: 'Wave speed v = fλ, where f is frequency and λ is wavelength. v = 50 × 2 = 100 m/s.',
        tags: ['waves', 'wave properties'],
        learningObjectives: ['Apply wave equation to calculate speed'],
      },

      // CHEMISTRY (3 questions)
      {
        subjectId: subjectMap[IBSubject.CHEMISTRY].id,
        questionType: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.EASY,
        title: 'Atomic Structure',
        content: 'How many protons does a carbon-12 atom have?',
        options: { A: '6', B: '12', C: '18', D: '24' },
        correctAnswer: 'A',
        explanation: 'Carbon has an atomic number of 6, which means it has 6 protons. The 12 refers to the mass number (protons + neutrons).',
        tags: ['atomic structure', 'elements'],
        learningObjectives: ['Understand atomic number and mass number'],
      },
      {
        subjectId: subjectMap[IBSubject.CHEMISTRY].id,
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
      {
        subjectId: subjectMap[IBSubject.CHEMISTRY].id,
        questionType: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.HARD,
        title: 'pH Calculation',
        content: 'What is the pH of a solution with [H⁺] = 1 × 10⁻³ M?',
        options: { A: '3', B: '11', C: '-3', D: '7' },
        correctAnswer: 'A',
        explanation: 'pH = -log[H⁺] = -log(10⁻³) = 3. This is an acidic solution.',
        tags: ['acids and bases', 'pH'],
        learningObjectives: ['Calculate pH from hydrogen ion concentration'],
      },

      // BIOLOGY (3 questions)
      {
        subjectId: subjectMap[IBSubject.BIOLOGY].id,
        questionType: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.EASY,
        title: 'Cell Structure',
        content: 'Which organelle is responsible for producing ATP in eukaryotic cells?',
        options: { A: 'Mitochondria', B: 'Nucleus', C: 'Ribosome', D: 'Golgi apparatus' },
        correctAnswer: 'A',
        explanation: 'Mitochondria are the "powerhouses" of the cell, producing ATP through cellular respiration.',
        tags: ['cell biology', 'organelles'],
        learningObjectives: ['Identify organelle functions'],
      },
      {
        subjectId: subjectMap[IBSubject.BIOLOGY].id,
        questionType: QuestionType.SHORT_ANSWER,
        difficulty: Difficulty.MEDIUM,
        title: 'DNA Replication',
        content: 'What enzyme is responsible for unwinding the DNA double helix during replication?',
        options: null,
        correctAnswer: 'Helicase',
        explanation: 'Helicase unwinds the DNA double helix by breaking hydrogen bonds between base pairs, creating a replication fork.',
        tags: ['genetics', 'DNA replication'],
        learningObjectives: ['Understand the role of enzymes in DNA replication'],
      },
      {
        subjectId: subjectMap[IBSubject.BIOLOGY].id,
        questionType: QuestionType.ESSAY,
        difficulty: Difficulty.HARD,
        title: 'Natural Selection',
        content: 'Explain how natural selection leads to evolution in a population. Include the key principles in your answer.',
        options: null,
        correctAnswer: 'Natural selection occurs when: 1) There is variation in traits within a population, 2) Some traits are heritable, 3) More offspring are produced than can survive, 4) Individuals with advantageous traits are more likely to survive and reproduce. Over time, beneficial traits become more common in the population, leading to evolution.',
        explanation: 'A complete answer should cover genetic variation, heritability, differential survival and reproduction, and the gradual change in allele frequencies over time.',
        tags: ['evolution', 'natural selection'],
        learningObjectives: ['Explain the mechanism of natural selection'],
      },

      // ENGLISH (3 questions)
      {
        subjectId: subjectMap[IBSubject.ENGLISH].id,
        questionType: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.EASY,
        title: 'Literary Device',
        content: 'What literary device is used in the phrase "The wind whispered through the trees"?',
        options: { A: 'Personification', B: 'Metaphor', C: 'Simile', D: 'Alliteration' },
        correctAnswer: 'A',
        explanation: 'Personification gives human qualities (whispering) to non-human things (wind).',
        tags: ['literary devices', 'figurative language'],
        learningObjectives: ['Identify literary devices in text'],
      },
      {
        subjectId: subjectMap[IBSubject.ENGLISH].id,
        questionType: QuestionType.SHORT_ANSWER,
        difficulty: Difficulty.MEDIUM,
        title: 'Theme Analysis',
        content: 'What is the main theme in George Orwell\'s "1984"?',
        options: null,
        correctAnswer: 'Totalitarianism and the dangers of government surveillance and control over individual freedom',
        explanation: 'The novel explores themes of totalitarian control, surveillance, propaganda, and the manipulation of truth and history.',
        tags: ['literature', 'themes'],
        learningObjectives: ['Analyze themes in literature'],
      },
      {
        subjectId: subjectMap[IBSubject.ENGLISH].id,
        questionType: QuestionType.ESSAY,
        difficulty: Difficulty.HARD,
        title: 'Poetry Analysis',
        content: 'Analyze the use of imagery in the opening lines of T.S. Eliot\'s "The Love Song of J. Alfred Prufrock": "Let us go then, you and I, / When the evening is spread out against the sky / Like a patient etherized upon a table."',
        options: null,
        correctAnswer: 'The imagery creates a sense of paralysis and malaise. The evening sky compared to an etherized patient suggests numbness, inaction, and a dreamlike state. This sets the tone for Prufrock\'s inability to act and his existential anxiety.',
        explanation: 'Strong answers should discuss the unusual simile, the medical imagery, and how it reflects the speaker\'s psychological state.',
        tags: ['poetry', 'imagery', 'analysis'],
        learningObjectives: ['Analyze poetic imagery and its effects'],
      },

      // HISTORY (3 questions)
      {
        subjectId: subjectMap[IBSubject.HISTORY].id,
        questionType: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.EASY,
        title: 'World War II',
        content: 'In which year did World War II end?',
        options: { A: '1943', B: '1944', C: '1945', D: '1946' },
        correctAnswer: 'C',
        explanation: 'World War II ended in 1945 with Germany\'s surrender in May and Japan\'s surrender in September.',
        tags: ['World War II', 'dates'],
        learningObjectives: ['Recall key dates in world history'],
      },
      {
        subjectId: subjectMap[IBSubject.HISTORY].id,
        questionType: QuestionType.SHORT_ANSWER,
        difficulty: Difficulty.MEDIUM,
        title: 'Cold War',
        content: 'What was the primary ideological conflict between the USA and USSR during the Cold War?',
        options: null,
        correctAnswer: 'Capitalism vs. Communism (or democracy vs. totalitarianism)',
        explanation: 'The Cold War was primarily an ideological conflict between Western capitalism/democracy and Soviet communism.',
        tags: ['Cold War', 'ideologies'],
        learningObjectives: ['Understand Cold War ideological divisions'],
      },
      {
        subjectId: subjectMap[IBSubject.HISTORY].id,
        questionType: QuestionType.ESSAY,
        difficulty: Difficulty.HARD,
        title: 'Treaty of Versailles',
        content: 'To what extent did the Treaty of Versailles contribute to the outbreak of World War II?',
        options: null,
        correctAnswer: 'The Treaty of Versailles significantly contributed to WWII through: harsh reparations that crippled Germany\'s economy, territorial losses that bred resentment, the "war guilt" clause that humiliated Germans, and created conditions that allowed Hitler\'s rise to power. However, other factors like the Great Depression and appeasement policies also played roles.',
        explanation: 'Strong answers should discuss economic impacts, political consequences, rise of nationalism, and balance with other contributing factors.',
        tags: ['World War I', 'World War II', 'treaties'],
        learningObjectives: ['Analyze causes of historical events'],
      },

      // GEOGRAPHY (3 questions)
      {
        subjectId: subjectMap[IBSubject.GEOGRAPHY].id,
        questionType: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.EASY,
        title: 'Plate Tectonics',
        content: 'What type of plate boundary is formed when two plates move apart?',
        options: { A: 'Divergent', B: 'Convergent', C: 'Transform', D: 'Subduction' },
        correctAnswer: 'A',
        explanation: 'Divergent boundaries occur where plates move apart, creating new crust as magma rises (e.g., mid-ocean ridges).',
        tags: ['plate tectonics', 'physical geography'],
        learningObjectives: ['Identify types of plate boundaries'],
      },
      {
        subjectId: subjectMap[IBSubject.GEOGRAPHY].id,
        questionType: QuestionType.SHORT_ANSWER,
        difficulty: Difficulty.MEDIUM,
        title: 'Climate Zones',
        content: 'What climate zone is characterized by hot, wet summers and mild, dry winters?',
        options: null,
        correctAnswer: 'Mediterranean climate',
        explanation: 'Mediterranean climates have hot, dry summers and mild, wet winters, found in regions like Southern California, central Chile, and the Mediterranean Basin.',
        tags: ['climate', 'climate zones'],
        learningObjectives: ['Classify climate zones'],
      },
      {
        subjectId: subjectMap[IBSubject.GEOGRAPHY].id,
        questionType: QuestionType.ESSAY,
        difficulty: Difficulty.HARD,
        title: 'Urbanization',
        content: 'Discuss the environmental impacts of rapid urbanization in developing countries.',
        options: null,
        correctAnswer: 'Rapid urbanization causes: deforestation and habitat loss, increased air and water pollution, strain on resources and infrastructure, growth of informal settlements with poor sanitation, urban heat island effect, and loss of agricultural land. However, it can also lead to more efficient resource use through density.',
        explanation: 'Strong answers should discuss multiple environmental impacts with specific examples and consider both negative and potential positive aspects.',
        tags: ['urbanization', 'human geography', 'environment'],
        learningObjectives: ['Analyze impacts of urbanization'],
      },

      // ECONOMICS (3 questions)
      {
        subjectId: subjectMap[IBSubject.ECONOMICS].id,
        questionType: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.EASY,
        title: 'Supply and Demand',
        content: 'What happens to the equilibrium price when demand increases and supply remains constant?',
        options: { A: 'Price increases', B: 'Price decreases', C: 'Price stays the same', D: 'Cannot be determined' },
        correctAnswer: 'A',
        explanation: 'When demand increases with constant supply, the equilibrium price rises due to increased competition for the good.',
        tags: ['supply and demand', 'market equilibrium'],
        learningObjectives: ['Analyze effects of supply and demand changes'],
      },
      {
        subjectId: subjectMap[IBSubject.ECONOMICS].id,
        questionType: QuestionType.CALCULATION,
        difficulty: Difficulty.MEDIUM,
        title: 'Opportunity Cost',
        content: 'A country can produce either 100 cars or 200 computers with its resources. What is the opportunity cost of producing 1 car?',
        options: null,
        correctAnswer: '2 computers',
        explanation: 'Opportunity cost = what is given up / what is gained. 200 computers / 100 cars = 2 computers per car.',
        tags: ['opportunity cost', 'trade-offs'],
        learningObjectives: ['Calculate opportunity cost'],
      },
      {
        subjectId: subjectMap[IBSubject.ECONOMICS].id,
        questionType: QuestionType.ESSAY,
        difficulty: Difficulty.HARD,
        title: 'Monetary Policy',
        content: 'Explain how a central bank can use monetary policy to combat inflation. Discuss the mechanisms and potential trade-offs.',
        options: null,
        correctAnswer: 'Central banks combat inflation by: raising interest rates to reduce borrowing and spending, selling government bonds to reduce money supply, and increasing reserve requirements for banks. Trade-offs include slower economic growth, higher unemployment, and reduced investment. The effectiveness depends on the cause of inflation and economic conditions.',
        explanation: 'Strong answers should explain contractionary monetary policy tools, transmission mechanisms, and discuss trade-offs with growth and employment.',
        tags: ['monetary policy', 'inflation', 'central banking'],
        learningObjectives: ['Analyze monetary policy tools and effects'],
      },

      // BUSINESS MANAGEMENT (3 questions)
      {
        subjectId: subjectMap[IBSubject.BUSINESS_MANAGEMENT].id,
        questionType: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.EASY,
        title: 'Business Organization',
        content: 'Which business organization type offers limited liability to its owners?',
        options: { A: 'Sole proprietorship', B: 'Partnership', C: 'Corporation', D: 'Cooperative' },
        correctAnswer: 'C',
        explanation: 'Corporations offer limited liability, meaning owners are not personally responsible for business debts beyond their investment.',
        tags: ['business organization', 'liability'],
        learningObjectives: ['Compare business organization types'],
      },
      {
        subjectId: subjectMap[IBSubject.BUSINESS_MANAGEMENT].id,
        questionType: QuestionType.SHORT_ANSWER,
        difficulty: Difficulty.MEDIUM,
        title: 'Marketing Mix',
        content: 'What are the 4 Ps of marketing?',
        options: null,
        correctAnswer: 'Product, Price, Place, Promotion',
        explanation: 'The 4 Ps (marketing mix) are: Product (what is sold), Price (how much), Place (where it\'s sold), and Promotion (how it\'s marketed).',
        tags: ['marketing', 'marketing mix'],
        learningObjectives: ['Identify components of the marketing mix'],
      },
      {
        subjectId: subjectMap[IBSubject.BUSINESS_MANAGEMENT].id,
        questionType: QuestionType.ESSAY,
        difficulty: Difficulty.HARD,
        title: 'Leadership Styles',
        content: 'Compare and contrast autocratic and democratic leadership styles. In what situations might each be most effective?',
        options: null,
        correctAnswer: 'Autocratic leadership involves centralized decision-making with little employee input, effective in crisis situations or with inexperienced workers. Democratic leadership involves participative decision-making, effective for creative tasks and with skilled employees. Trade-offs include speed vs. buy-in, control vs. innovation, and efficiency vs. employee satisfaction.',
        explanation: 'Strong answers should define each style, discuss advantages/disadvantages, and provide situational contexts for effectiveness.',
        tags: ['leadership', 'management styles'],
        learningObjectives: ['Analyze leadership styles and effectiveness'],
      },

      // PSYCHOLOGY (3 questions)
      {
        subjectId: subjectMap[IBSubject.PSYCHOLOGY].id,
        questionType: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.EASY,
        title: 'Brain Structure',
        content: 'Which part of the brain is primarily responsible for processing emotions?',
        options: { A: 'Cerebellum', B: 'Amygdala', C: 'Cerebral cortex', D: 'Medulla' },
        correctAnswer: 'B',
        explanation: 'The amygdala is a key structure in the limbic system responsible for processing emotions, particularly fear and aggression.',
        tags: ['biological psychology', 'brain structure'],
        learningObjectives: ['Identify brain structures and functions'],
      },
      {
        subjectId: subjectMap[IBSubject.PSYCHOLOGY].id,
        questionType: QuestionType.SHORT_ANSWER,
        difficulty: Difficulty.MEDIUM,
        title: 'Classical Conditioning',
        content: 'In Pavlov\'s experiment, what was the conditioned stimulus?',
        options: null,
        correctAnswer: 'The bell (or sound)',
        explanation: 'The bell was the conditioned stimulus - a neutral stimulus that became associated with food (unconditioned stimulus) to elicit salivation.',
        tags: ['learning', 'classical conditioning'],
        learningObjectives: ['Understand classical conditioning principles'],
      },
      {
        subjectId: subjectMap[IBSubject.PSYCHOLOGY].id,
        questionType: QuestionType.ESSAY,
        difficulty: Difficulty.HARD,
        title: 'Conformity',
        content: 'Discuss the factors that influence conformity, using research studies to support your answer.',
        options: null,
        correctAnswer: 'Key factors include: group size (Asch found conformity increases up to 3-5 people), unanimity (one dissenter reduces conformity), culture (collectivist cultures show higher conformity), task difficulty, and public vs. private responses. Asch\'s line study and Sherif\'s autokinetic effect demonstrate normative and informational social influence.',
        explanation: 'Strong answers should cite specific studies (Asch, Sherif, cross-cultural research) and explain different types of social influence.',
        tags: ['social psychology', 'conformity'],
        learningObjectives: ['Analyze factors influencing conformity with research support'],
      },

      // COMPUTER SCIENCE (3 questions)
      {
        subjectId: subjectMap[IBSubject.COMPUTER_SCIENCE].id,
        questionType: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.EASY,
        title: 'Data Types',
        content: 'Which data type would be most appropriate for storing a person\'s age?',
        options: { A: 'String', B: 'Integer', C: 'Boolean', D: 'Float' },
        correctAnswer: 'B',
        explanation: 'Integer is most appropriate for age as it\'s a whole number and doesn\'t require decimal precision.',
        tags: ['programming', 'data types'],
        learningObjectives: ['Choose appropriate data types'],
      },
      {
        subjectId: subjectMap[IBSubject.COMPUTER_SCIENCE].id,
        questionType: QuestionType.SHORT_ANSWER,
        difficulty: Difficulty.MEDIUM,
        title: 'Big O Notation',
        content: 'What is the time complexity of binary search?',
        options: null,
        correctAnswer: 'O(log n)',
        explanation: 'Binary search has O(log n) time complexity because it halves the search space with each iteration.',
        tags: ['algorithms', 'complexity'],
        learningObjectives: ['Analyze algorithm time complexity'],
      },
      {
        subjectId: subjectMap[IBSubject.COMPUTER_SCIENCE].id,
        questionType: QuestionType.ESSAY,
        difficulty: Difficulty.HARD,
        title: 'Object-Oriented Programming',
        content: 'Explain the concept of inheritance in object-oriented programming and discuss its benefits and potential drawbacks.',
        options: null,
        correctAnswer: 'Inheritance allows classes to inherit properties and methods from parent classes, promoting code reuse and establishing hierarchies. Benefits include reduced code duplication, easier maintenance, and polymorphism. Drawbacks include tight coupling, complexity in deep hierarchies, and the fragile base class problem. Composition is sometimes preferred.',
        explanation: 'Strong answers should define inheritance, provide examples, discuss benefits (reusability, maintainability), and drawbacks (coupling, complexity).',
        tags: ['OOP', 'inheritance', 'design'],
        learningObjectives: ['Evaluate OOP concepts and design decisions'],
      },
    ];

    // Create all questions
    let createdCount = 0;
    for (const question of allQuestions) {
      await db.iBQuestion.create({
        data: question as any,
      });
      createdCount++;
    }

    console.log('✅ IB Learning Platform seeding complete!');

    return NextResponse.json({
      success: true,
      message: 'IB Learning Platform seeded successfully!',
      subjects: createdSubjects.length,
      questions: createdCount,
      breakdown: {
        Mathematics: 3,
        Physics: 3,
        Chemistry: 3,
        Biology: 3,
        English: 3,
        History: 3,
        Geography: 3,
        Economics: 3,
        'Business Management': 3,
        Psychology: 3,
        'Computer Science': 3,
      },
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
