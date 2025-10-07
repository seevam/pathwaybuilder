import { PrismaClient, ActivityType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed Module 1 activities
  const activities = [
    {
      slug: 'values-card-sort',
      title: 'Values Card Sort',
      description: 'Discover your core values through an interactive sorting activity',
      orderIndex: 1,
      type: ActivityType.INTERACTIVE,
      estimatedMinutes: 15,
    },
    {
      slug: 'strengths-discovery',
      title: 'Strengths Discovery',
      description: 'Identify your top strengths across different areas',
      orderIndex: 2,
      type: ActivityType.INTERACTIVE,
      estimatedMinutes: 10,
    },
    {
      slug: 'reflection-prompts',
      title: 'Personal Reflection',
      description: 'Reflect on your discoveries with AI-powered insights',
      orderIndex: 3,
      type: ActivityType.REFLECTION,
      estimatedMinutes: 15,
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
