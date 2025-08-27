import { prisma } from './database';
import { Achievement } from '../types';

export interface AchievementDefinition {
  slug: string;
  title: string;
  description: string;
  monsterPointsReward: number;
  condition: (userId: string) => Promise<boolean>;
}

export class AchievementService {
  /**
   * Achievement definitions with Monster Points rewards
   */
  static readonly ACHIEVEMENTS: AchievementDefinition[] = [
    // Quest-related achievements
    {
      slug: 'first_quest_done',
      title: 'First Steps',
      description: 'Complete your first quest',
      monsterPointsReward: 10,
      condition: async (userId: string) => {
        const completedQuests = await prisma.quest.count({
          where: {
            userId,
            status: 'done',
          },
        });
        return completedQuests >= 1;
      },
    },
    {
      slug: '5_quests_completed',
      title: 'Quest Enthusiast',
      description: 'Complete 5 quests',
      monsterPointsReward: 25,
      condition: async (userId: string) => {
        const completedQuests = await prisma.quest.count({
          where: {
            userId,
            status: 'done',
          },
        });
        return completedQuests >= 5;
      },
    },
    {
      slug: '10_quests_completed',
      title: 'Quest Master',
      description: 'Complete 10 quests',
      monsterPointsReward: 50,
      condition: async (userId: string) => {
        const completedQuests = await prisma.quest.count({
          where: {
            userId,
            status: 'done',
          },
        });
        return completedQuests >= 10;
      },
    },
    {
      slug: '25_quests_completed',
      title: 'Quest Legend',
      description: 'Complete 25 quests',
      monsterPointsReward: 100,
      condition: async (userId: string) => {
        const completedQuests = await prisma.quest.count({
          where: {
            userId,
            status: 'done',
          },
        });
        return completedQuests >= 25;
      },
    },

    // Streak-related achievements
    {
      slug: '3_day_streak',
      title: 'Getting Started',
      description: 'Maintain a 3-day streak',
      monsterPointsReward: 15,
      condition: async (userId: string) => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });
        return user?.streak >= 3;
      },
    },
    {
      slug: '7_day_streak',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      monsterPointsReward: 30,
      condition: async (userId: string) => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });
        return user?.streak >= 7;
      },
    },
    {
      slug: '14_day_streak',
      title: 'Fortnight Fighter',
      description: 'Maintain a 14-day streak',
      monsterPointsReward: 60,
      condition: async (userId: string) => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });
        return user?.streak >= 14;
      },
    },
    {
      slug: '30_day_streak',
      title: 'Monthly Master',
      description: 'Maintain a 30-day streak',
      monsterPointsReward: 150,
      condition: async (userId: string) => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });
        return user?.streak >= 30;
      },
    },

    // Monster evolution achievements
    {
      slug: 'first_monster_evolution',
      title: 'Evolution Beginner',
      description: 'Evolve your first monster to stage 2',
      monsterPointsReward: 20,
      condition: async (userId: string) => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { monsters: true },
        });
        return user?.monsters.some(monster => monster.stage >= 2) || false;
      },
    },
    {
      slug: 'second_monster_evolution',
      title: 'Evolution Enthusiast',
      description: 'Evolve a second monster to stage 2',
      monsterPointsReward: 40,
      condition: async (userId: string) => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { monsters: true },
        });
        const evolvedMonsters =
          user?.monsters.filter(monster => monster.stage >= 2) || [];
        return evolvedMonsters.length >= 2;
      },
    },
    {
      slug: 'third_monster_evolution',
      title: 'Evolution Expert',
      description: 'Evolve a third monster to stage 2',
      monsterPointsReward: 60,
      condition: async (userId: string) => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { monsters: true },
        });
        const evolvedMonsters =
          user?.monsters.filter(monster => monster.stage >= 2) || [];
        return evolvedMonsters.length >= 3;
      },
    },
    {
      slug: 'all_monsters_evolved',
      title: 'Evolution Master',
      description: 'Evolve all your monsters to stage 2',
      monsterPointsReward: 100,
      condition: async (userId: string) => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { monsters: true },
        });
        const allMonsters = user?.monsters || [];
        return (
          allMonsters.length > 0 &&
          allMonsters.every(monster => monster.stage >= 2)
        );
      },
    },

    // Level-based achievements
    {
      slug: 'level_5',
      title: 'Rising Star',
      description: 'Reach level 5',
      monsterPointsReward: 25,
      condition: async (userId: string) => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });
        return user?.level >= 5;
      },
    },
    {
      slug: 'level_10',
      title: 'Level 10 Hero',
      description: 'Reach level 10',
      monsterPointsReward: 50,
      condition: async (userId: string) => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });
        return user?.level >= 10;
      },
    },
    {
      slug: 'level_20',
      title: 'Level 20 Champion',
      description: 'Reach level 20',
      monsterPointsReward: 100,
      condition: async (userId: string) => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });
        return user?.level >= 20;
      },
    },
    {
      slug: 'level_50',
      title: 'Level 50 Legend',
      description: 'Reach level 50',
      monsterPointsReward: 250,
      condition: async (userId: string) => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });
        return user?.level >= 50;
      },
    },

    // Monster collection achievements
    {
      slug: 'monster_collector',
      title: 'Monster Collector',
      description: 'Own all 4 different monster species',
      monsterPointsReward: 75,
      condition: async (userId: string) => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { monsters: true },
        });
        const species = new Set(
          user?.monsters.map(monster => monster.species) || []
        );
        return species.size >= 4;
      },
    },
  ];

  /**
   * Get all achievements for a user
   */
  static async getUserAchievements(userId: string): Promise<Achievement[]> {
    return prisma.achievement.findMany({
      where: { userId },
      orderBy: { earnedAt: 'desc' },
    });
  }

  /**
   * Check if user has a specific achievement
   */
  static async hasAchievement(userId: string, slug: string): Promise<boolean> {
    const achievement = await prisma.achievement.findUnique({
      where: {
        userId_slug: {
          userId,
          slug,
        },
      },
    });
    return !!achievement;
  }

  /**
   * Unlock an achievement for a user and award Monster Points
   */
  static async unlockAchievement(
    userId: string,
    slug: string,
    meta?: Record<string, any>
  ): Promise<Achievement> {
    // Check if already unlocked
    const existing = await this.hasAchievement(userId, slug);
    if (existing) {
      throw new Error('Achievement already unlocked');
    }

    // Get achievement definition to award Monster Points
    const achievementDef = this.getAchievementDefinition(slug);
    if (!achievementDef) {
      throw new Error('Achievement definition not found');
    }

    // Use a transaction to ensure both achievement and MP are updated atomically
    return await prisma.$transaction(async tx => {
      // Create the achievement
      const achievement = await tx.achievement.create({
        data: {
          userId,
          slug,
          meta,
        },
      });

      // Award Monster Points
      await tx.user.update({
        where: { id: userId },
        data: {
          monsterPoints: {
            increment: achievementDef.monsterPointsReward,
          },
        },
      });

      return achievement;
    });
  }

  /**
   * Check and unlock achievements for a user
   */
  static async checkAchievements(userId: string): Promise<Achievement[]> {
    const unlockedAchievements: Achievement[] = [];

    for (const achievement of this.ACHIEVEMENTS) {
      try {
        const hasAchievement = await this.hasAchievement(
          userId,
          achievement.slug
        );
        if (!hasAchievement) {
          const conditionMet = await achievement.condition(userId);
          if (conditionMet) {
            const unlocked = await this.unlockAchievement(
              userId,
              achievement.slug
            );
            unlockedAchievements.push(unlocked);
          }
        }
      } catch (error) {
        console.error(`Error checking achievement ${achievement.slug}:`, error);
      }
    }

    return unlockedAchievements;
  }

  /**
   * Get achievement definition by slug
   */
  static getAchievementDefinition(
    slug: string
  ): AchievementDefinition | undefined {
    return this.ACHIEVEMENTS.find(a => a.slug === slug);
  }

  /**
   * Get achievement progress for a user
   */
  static async getAchievementProgress(userId: string): Promise<{
    unlocked: Achievement[];
    locked: AchievementDefinition[];
    totalUnlocked: number;
    totalAchievements: number;
    totalMonsterPoints: number;
  }> {
    const unlockedAchievements = await this.getUserAchievements(userId);
    const unlockedSlugs = new Set(unlockedAchievements.map(a => a.slug));

    const lockedAchievements = this.ACHIEVEMENTS.filter(
      a => !unlockedSlugs.has(a.slug)
    );

    // Calculate total Monster Points earned
    const totalMonsterPoints = unlockedAchievements.reduce(
      (total, achievement) => {
        const def = this.getAchievementDefinition(achievement.slug);
        return total + (def?.monsterPointsReward || 0);
      },
      0
    );

    return {
      unlocked: unlockedAchievements,
      locked: lockedAchievements,
      totalUnlocked: unlockedAchievements.length,
      totalAchievements: this.ACHIEVEMENTS.length,
      totalMonsterPoints,
    };
  }
}
