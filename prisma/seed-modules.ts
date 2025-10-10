// prisma/seed-modules.ts
import { PrismaClient, ActivityType } from '@prisma/client';

const prisma = new PrismaClient();

async function seedModules() {
  console.log('🌱 Seeding modules...');

  // Module 1: Know Yourself
  const module1 = await prisma.module.upsert({
    where: { orderIndex: 1 },
    update: {},
    create: {
      orderIndex: 1,
      title: 'Know Yourself',
      description: 'Discover your strengths, values, and personality',
      tagline: 'Discover Your Strengths, Values & Personality',
      estimatedHours: 3,
      icon: '🎯',
      videoUrl: '/videos/module-1-intro.mp4',
      status: 'PUBLISHED',
    },
  });

  // Module 1 Activities
  const module1Activities = [
    {
      slug: 'who-am-i',
      title: 'Who Am I? Interactive Icebreaker',
      description: 'Answer rapid-fire prompts to create your identity snapshot',
      orderIndex: 1,
      type: ActivityType.INTERACTIVE,
      estimatedMinutes: 10,
      moduleId: module1.id,
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
      content: {
        categories: ['Academic', 'Creative', 'Social', 'Physical/Technical'],
        strengths: [
          { id: 1, name: 'Math', category: 'Academic' },
          { id: 2, name: 'Writing', category: 'Academic' },
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

  console.log('✅ Modules seeded successfully!');
}

seedModules()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
