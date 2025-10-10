import { PrismaClient, ActivityType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // First, create a module if it doesn't exist
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
      status: 'PUBLISHED',
    },
  });

  console.log(`✅ Created/found module: ${module1.title}`);

  // Seed Module 1 activities with moduleId
  const activities = [
    {
      slug: 'values-card-sort',
      title: 'Values Card Sort',
      description: 'Discover your core values through an interactive sorting activity',
      orderIndex: 1,
      type: ActivityType.INTERACTIVE,
      estimatedMinutes: 15,
      moduleId: module1.id, // Add moduleId
    },
    {
      slug: 'strengths-discovery',
      title: 'Strengths Discovery',
      description: 'Identify your top strengths across different areas',
      orderIndex: 2,
      type: ActivityType.INTERACTIVE,
      estimatedMinutes: 10,
      moduleId: module1.id, // Add moduleId
    },
    {
      slug: 'reflection-prompts',
      title: 'Personal Reflection',
      description: 'Reflect on your discoveries with AI-powered insights',
      orderIndex: 3,
      type: ActivityType.REFLECTION,
      estimatedMinutes: 15,
      moduleId: module1.id, // Add moduleId
    },
  ];

  for (const activity of activities) {
    await prisma.activity.upsert({
      where: { slug: activity.slug },
      update: activity,
      create: activity,
    });
    console.log(`✅ Created activity: ${activity.title}`);
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
