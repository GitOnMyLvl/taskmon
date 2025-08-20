import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a test user
  const passwordHash = await bcrypt.hash('password123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'test@taskmon.com' },
    update: {},
    create: {
      email: 'test@taskmon.com',
      passwordHash,
      displayName: 'Test User',
      xp: 50,
      level: 1,
      streak: 3,
    },
  });

  console.log('✅ Created test user:', user.email);

  // Create monster for the user
  const monster = await prisma.monster.upsert({
    where: { ownerId: user.id },
    update: {},
    create: {
      ownerId: user.id,
      species: 'slime',
      stage: 1,
      xp: 25,
      hunger: 85,
      mood: 'happy',
    },
  });

  console.log('✅ Created monster for user');

  // Create some sample quests
  const quests = await Promise.all([
    prisma.quest.upsert({
      where: { id: 'quest-1' },
      update: {},
      create: {
        id: 'quest-1',
        userId: user.id,
        title: 'Complete project documentation',
        description:
          'Write comprehensive documentation for the current project',
        difficulty: 'hard',
        type: 'normal',
        rewardXp: 25,
        status: 'open',
      },
    }),
    prisma.quest.upsert({
      where: { id: 'quest-2' },
      update: {},
      create: {
        id: 'quest-2',
        userId: user.id,
        title: 'Daily exercise',
        description: 'Go for a 30-minute walk or workout',
        difficulty: 'easy',
        type: 'daily',
        rewardXp: 15,
        status: 'open',
      },
    }),
    prisma.quest.upsert({
      where: { id: 'quest-3' },
      update: {},
      create: {
        id: 'quest-3',
        userId: user.id,
        title: 'Read a book chapter',
        description: 'Read at least one chapter of your current book',
        difficulty: 'normal',
        type: 'daily',
        rewardXp: 10,
        status: 'done',
        completedAt: new Date(),
      },
    }),
  ]);

  console.log('✅ Created sample quests');

  // Create some achievements
  const achievements = await Promise.all([
    prisma.achievement.upsert({
      where: {
        userId_slug: {
          userId: user.id,
          slug: 'first_quest_done',
        },
      },
      update: {},
      create: {
        userId: user.id,
        slug: 'first_quest_done',
        meta: JSON.stringify({ completedAt: new Date() }),
      },
    }),
  ]);

  console.log('✅ Created sample achievements');

  console.log('🎉 Database seeding completed!');
  console.log('📧 Test user email: test@taskmon.com');
  console.log('🔑 Test user password: password123');
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
