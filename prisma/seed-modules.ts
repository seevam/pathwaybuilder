// prisma/seed-modules.ts
import { PrismaClient, ActivityType, ModuleStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function seedModules() {
  console.log('🌱 Seeding all modules and activities...');

  // ==============================================
  // MODULE 1: KNOW YOURSELF
  // ==============================================
  const module1 = await prisma.module.upsert({
    where: { orderIndex: 1 },
    update: {},
    create: {
      orderIndex: 1,
      title: 'Know Yourself',
      description: 'Discover your strengths, values, and personality through interactive assessments and reflections.',
      tagline: 'Discover Your Strengths, Values & Personality',
      estimatedHours: 3,
      icon: '🎯',
      status: ModuleStatus.PUBLISHED,
    },
  });

  const module1Activities = [
    {
      slug: 'who-am-i',
      title: 'Who Am I? Interactive Icebreaker',
      description: 'Answer rapid-fire prompts to create your identity snapshot',
      orderIndex: 1,
      type: ActivityType.INTERACTIVE,
      estimatedMinutes: 10,
      moduleId: module1.id,
      requiredForCompletion: true,
      content: {
        prompts: [
          { id: 1, question: 'Pick 3 words that describe you', type: 'word_select', options: ['Creative', 'Analytical', 'Social', 'Independent', 'Leader', 'Helper', 'Thinker', 'Doer'] },
          { id: 2, question: 'What do you do when you lose track of time?', type: 'multiple_choice', options: ['Creating art/music', 'Playing sports', 'Reading/learning', 'Helping others', 'Building things'] },
          { id: 3, question: 'Your friends come to you when they need...', type: 'multiple_choice', options: ['Advice', 'Fun', 'Help with work', 'Motivation', 'A listener'] },
        ]
      },
    },
    {
      slug: 'values-card-sort',
      title: 'Values Card Sort',
      description: 'Discover your core values through an interactive sorting activity',
      orderIndex: 2,
      type: ActivityType.INTERACTIVE,
      estimatedMinutes: 15,
      moduleId: module1.id,
      requiredForCompletion: true,
      content: {
        values: [
          { id: 'creativity', label: 'Creativity', icon: '🎨', description: 'Original thinking and artistic expression' },
          { id: 'impact', label: 'Making an Impact', icon: '🌍', description: 'Positive change in the world' },
          { id: 'innovation', label: 'Innovation', icon: '💡', description: 'Developing new ideas and solutions' },
        ]
      },
    },
    {
      slug: 'strengths-discovery',
      title: 'Strengths Discovery',
      description: 'Identify your top strengths across different areas',
      orderIndex: 3,
      type: ActivityType.INTERACTIVE,
      estimatedMinutes: 10,
      moduleId: module1.id,
      requiredForCompletion: true,
      content: {
        categories: ['Academic', 'Creative', 'Social', 'Physical/Technical'],
        strengths: [
          { id: 1, name: 'Math & Logic', category: 'Academic' },
          { id: 2, name: 'Writing & Communication', category: 'Academic' },
          { id: 3, name: 'Visual Arts', category: 'Creative' },
          { id: 4, name: 'Music', category: 'Creative' },
        ]
      },
    },
    {
      slug: 'integration-reflection',
      title: 'Integration & Reflection',
      description: 'Reflect on your discoveries with AI-powered insights',
      orderIndex: 4,
      type: ActivityType.REFLECTION,
      estimatedMinutes: 15,
      moduleId: module1.id,
      requiredForCompletion: true,
      content: {
        prompts: [
          'What patterns emerged across your assessments?',
          'Which result surprised you most?',
          'How do your values connect to your strengths?',
          'What\'s one word that captures who you are right now?',
        ]
      },
    },
  ];

  for (const activity of module1Activities) {
    await prisma.activity.upsert({
      where: { slug: activity.slug },
      update: {},
      create: activity,
    });
  }
  console.log(`✅ Module 1: ${module1.title} (${module1Activities.length} activities)`);

  // ==============================================
  // MODULE 2: EXPLORE CAREERS
  // ==============================================
  const module2 = await prisma.module.upsert({
    where: { orderIndex: 2 },
    update: {},
    create: {
      orderIndex: 2,
      title: 'Explore Careers',
      description: 'From interests to real-world opportunities',
      tagline: 'Explore Career Paths That Match You',
      estimatedHours: 3,
      icon: '🗺️',
      status: ModuleStatus.PUBLISHED,
    },
  });

  const module2Activities = [
    {
      slug: 'riasec-assessment',
      title: 'RIASEC Career Interest Inventory',
      description: 'Discover which career clusters match your interests',
      orderIndex: 1,
      type: ActivityType.INTERACTIVE,
      estimatedMinutes: 20,
      moduleId: module2.id,
      requiredForCompletion: true,
      content: {
        categories: ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional']
      },
    },
    {
      slug: 'career-clusters',
      title: 'Career Clusters Exploration',
      description: 'Explore careers that align with your RIASEC results',
      orderIndex: 2,
      type: ActivityType.INTERACTIVE,
      estimatedMinutes: 25,
      moduleId: module2.id,
      requiredForCompletion: true,
      content: {},
    },
    {
      slug: 'day-in-life',
      title: 'A Day in the Life Research',
      description: 'Research what professionals actually do day-to-day',
      orderIndex: 3,
      type: ActivityType.INTERACTIVE,
      estimatedMinutes: 20,
      moduleId: module2.id,
      requiredForCompletion: true,
      content: {},
    },
    {
      slug: 'career-reflection',
      title: 'Career Exploration Reflection',
      description: 'Synthesize your learning and identify next steps',
      orderIndex: 4,
      type: ActivityType.REFLECTION,
      estimatedMinutes: 15,
      moduleId: module2.id,
      requiredForCompletion: true,
      content: {
        prompts: [
          'Which careers surprised you?',
          'What skills do these careers have in common?',
          'What excites you most about your top career matches?',
        ]
      },
    },
  ];

  for (const activity of module2Activities) {
    await prisma.activity.upsert({
      where: { slug: activity.slug },
      update: {},
      create: activity,
    });
  }
  console.log(`✅ Module 2: ${module2.title} (${module2Activities.length} activities)`);

  // ==============================================
  // MODULE 3: WORK STYLE
  // ==============================================
  const module3 = await prisma.module.upsert({
    where: { orderIndex: 3 },
    update: {},
    create: {
      orderIndex: 3,
      title: 'Work Style',
      description: 'Understand how you thrive in work environments',
      tagline: 'Discover Your Ideal Work Environment',
      estimatedHours: 2,
      icon: '💼',
      status: ModuleStatus.PUBLISHED,
    },
  });

  const module3Activities = [
    {
      slug: 'disc-assessment',
      title: 'DISC Personality Profile',
      description: 'Understand your communication and work style',
      orderIndex: 1,
      type: ActivityType.INTERACTIVE,
      estimatedMinutes: 15,
      moduleId: module3.id,
      requiredForCompletion: true,
      content: {},
    },
    {
      slug: 'work-preferences',
      title: 'Work Environment Preferences',
      description: 'Identify your ideal work conditions and culture',
      orderIndex: 2,
      type: ActivityType.INTERACTIVE,
      estimatedMinutes: 15,
      moduleId: module3.id,
      requiredForCompletion: true,
      content: {},
    },
    {
      slug: 'collaboration-style',
      title: 'Collaboration Style Explorer',
      description: 'Learn how you work best with others',
      orderIndex: 3,
      type: ActivityType.INTERACTIVE,
      estimatedMinutes: 10,
      moduleId: module3.id,
      requiredForCompletion: true,
      content: {},
    },
    {
      slug: 'work-style-reflection',
      title: 'Work Style Reflection',
      description: 'Connect your work style to career choices',
      orderIndex: 4,
      type: ActivityType.REFLECTION,
      estimatedMinutes: 10,
      moduleId: module3.id,
      requiredForCompletion: true,
      content: {
        prompts: [
          'What work environments bring out your best?',
          'How does your work style connect to your values?',
          'What type of teams do you thrive in?',
        ]
      },
    },
  ];

  for (const activity of module3Activities) {
    await prisma.activity.upsert({
      where: { slug: activity.slug },
      update: {},
      create: activity,
    });
  }
  console.log(`✅ Module 3: ${module3.title} (${module3Activities.length} activities)`);

  // ==============================================
  // MODULE 4: MAP YOUR PATH
  // ==============================================
  const module4 = await prisma.module.upsert({
    where: { orderIndex: 4 },
    update: {},
    create: {
      orderIndex: 4,
      title: 'Map Your Path',
      description: 'From high school to career readiness',
      tagline: 'Create Your Roadmap to Success',
      estimatedHours: 3,
      icon: '🧭',
      status: ModuleStatus.PUBLISHED,
    },
  });

  const module4Activities = [
    {
      slug: 'education-pathways',
      title: 'Education Pathways Explorer',
      description: 'Understand different paths to your career goals',
      orderIndex: 1,
      type: ActivityType.INTERACTIVE,
      estimatedMinutes: 20,
      moduleId: module4.id,
      requiredForCompletion: true,
      content: {},
    },
    {
      slug: 'timeline-builder',
      title: 'High School Timeline Builder',
      description: 'Plan your remaining high school years strategically',
      orderIndex: 2,
      type: ActivityType.INTERACTIVE,
      estimatedMinutes: 25,
      moduleId: module4.id,
      requiredForCompletion: true,
      content: {},
    },
    {
      slug: 'skill-gap-analysis',
      title: 'Skill Gap Analysis',
      description: 'Identify skills you need to develop',
      orderIndex: 3,
      type: ActivityType.INTERACTIVE,
      estimatedMinutes: 15,
      moduleId: module4.id,
      requiredForCompletion: true,
      content: {},
    },
    {
      slug: 'pathway-reflection',
      title: 'Pathway Reflection',
      description: 'Reflect on your plan and make adjustments',
      orderIndex: 4,
      type: ActivityType.REFLECTION,
      estimatedMinutes: 10,
      moduleId: module4.id,
      requiredForCompletion: true,
      content: {
        prompts: [
          'What excites you most about your plan?',
          'What challenges do you anticipate?',
          'Who can support you on this journey?',
        ]
      },
    },
  ];

  for (const activity of module4Activities) {
    await prisma.activity.upsert({
      where: { slug: activity.slug },
      update: {},
      create: activity,
    });
  }
  console.log(`✅ Module 4: ${module4.title} (${module4Activities.length} activities)`);

  // ==============================================
  // MODULE 5: BUILD ACTION PLAN
  // ==============================================
  const module5 = await prisma.module.upsert({
    where: { orderIndex: 5 },
    update: {},
    create: {
      orderIndex: 5,
      title: 'Build Action Plan',
      description: 'Turn vision into concrete steps',
      tagline: 'Create Your Action Plan',
      estimatedHours: 2,
      icon: '✅',
      status: ModuleStatus.PUBLISHED,
    },
  });

  const module5Activities = [
    {
      slug: 'smart-goals',
      title: 'SMART Goals Workshop',
      description: 'Create specific, measurable goals for your future',
      orderIndex: 1,
      type: ActivityType.INTERACTIVE,
      estimatedMinutes: 20,
      moduleId: module5.id,
      requiredForCompletion: true,
      content: {},
    },
    {
      slug: 'quarterly-planning',
      title: 'Quarterly Action Planning',
      description: 'Break down your goals into quarterly milestones',
      orderIndex: 2,
      type: ActivityType.INTERACTIVE,
      estimatedMinutes: 20,
      moduleId: module5.id,
      requiredForCompletion: true,
      content: {},
    },
    {
      slug: 'accountability-system',
      title: 'Accountability System Setup',
      description: 'Create systems to track and achieve your goals',
      orderIndex: 3,
      type: ActivityType.INTERACTIVE,
      estimatedMinutes: 15,
      moduleId: module5.id,
      requiredForCompletion: true,
      content: {},
    },
    {
      slug: 'action-plan-reflection',
      title: 'Action Plan Reflection',
      description: 'Review your plan and commit to action',
      orderIndex: 4,
      type: ActivityType.REFLECTION,
      estimatedMinutes: 10,
      moduleId: module5.id,
      requiredForCompletion: true,
      content: {
        prompts: [
          'What\'s your first action step?',
          'How will you stay motivated?',
          'What will success look like in 3 months?',
        ]
      },
    },
  ];

  for (const activity of module5Activities) {
    await prisma.activity.upsert({
      where: { slug: activity.slug },
      update: {},
      create: activity,
    });
  }
  console.log(`✅ Module 5: ${module5.title} (${module5Activities.length} activities)`);

  // ==============================================
  // MODULE 6: OWN YOUR STORY
  // ==============================================
  const module6 = await prisma.module.upsert({
    where: { orderIndex: 6 },
    update: {},
    create: {
      orderIndex: 6,
      title: 'Own Your Story',
      description: 'Craft your narrative and digital presence',
      tagline: 'Tell Your Unique Story',
      estimatedHours: 2,
      icon: '📖',
      status: ModuleStatus.PUBLISHED,
    },
  });

  const module6Activities = [
    {
      slug: 'story-arc',
      title: 'Your Story Arc',
      description: 'Craft a compelling narrative about your journey',
      orderIndex: 1,
      type: ActivityType.INTERACTIVE,
      estimatedMinutes: 20,
      moduleId: module6.id,
      requiredForCompletion: true,
      content: {},
    },
    {
      slug: 'elevator-pitch',
      title: 'Elevator Pitch Builder',
      description: 'Create a powerful 30-second introduction',
      orderIndex: 2,
      type: ActivityType.INTERACTIVE,
      estimatedMinutes: 15,
      moduleId: module6.id,
      requiredForCompletion: true,
      content: {},
    },
    {
      slug: 'digital-presence',
      title: 'Digital Presence Audit',
      description: 'Build and optimize your online profile',
      orderIndex: 3,
      type: ActivityType.INTERACTIVE,
      estimatedMinutes: 20,
      moduleId: module6.id,
      requiredForCompletion: true,
      content: {},
    },
    {
      slug: 'final-reflection',
      title: 'Final Reflection & Next Steps',
      description: 'Celebrate your growth and plan your next chapter',
      orderIndex: 4,
      type: ActivityType.REFLECTION,
      estimatedMinutes: 15,
      moduleId: module6.id,
      requiredForCompletion: true,
      content: {
        prompts: [
          'How have you grown through this journey?',
          'What surprised you most about yourself?',
          'What are you most proud of?',
          'What\'s your next big goal?',
        ]
      },
    },
  ];

  for (const activity of module6Activities) {
    await prisma.activity.upsert({
      where: { slug: activity.slug },
      update: {},
      create: activity,
    });
  }
  console.log(`✅ Module 6: ${module6.title} (${module6Activities.length} activities)`);

  console.log('\n🎉 All modules and activities seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - 6 modules created`);
  console.log(`   - ${module1Activities.length + module2Activities.length + module3Activities.length + module4Activities.length + module5Activities.length + module6Activities.length} total activities created`);
}

seedModules()
  .catch((e) => {
    console.error('❌ Error seeding modules:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
