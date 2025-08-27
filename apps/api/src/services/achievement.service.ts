import { prisma } from './database';
import { Achievement } from '../types';

export interface AchievementDefinition {
  slug: string;
  title: string;
  description: string;
  condition: (userId: string) => Promise<boolean>;
}

export class AchievementService {
  /**
   * Achievement definitions
   */
  static readonly ACHIEVEMENTS: AchievementDefinition[] = [
    {
      slug: 'first_quest_done',
      title: 'First Steps',
      description: 'Complete your first quest',
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
      slug: '7_day_streak',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      condition: async (userId: string) => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });
        return user?.streak >= 7;
      },
    },
    {
      slug: '10_quests_completed',
      title: 'Quest Master',
      description: 'Complete 10 quests',
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
      slug: 'monster_evolution',
      title: 'Evolution Champion',
      description: 'Evolve your monster to stage 2',
      condition: async (userId: string) => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { activeMonster: true },
        });
        return user?.activeMonster?.stage >= 2;
      },
    },
    {
      slug: 'level_10',
      title: 'Level 10 Hero',
      description: 'Reach level 10',
      condition: async (userId: string) => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });
        return user?.level >= 10;
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
   * Unlock an achievement for a user
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

    return prisma.achievement.create({
      data: {
        userId,
        slug,
        meta,
      },
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
  }> {
    const unlockedAchievements = await this.getUserAchievements(userId);
    const unlockedSlugs = new Set(unlockedAchievements.map(a => a.slug));

    const lockedAchievements = this.ACHIEVEMENTS.filter(
      a => !unlockedSlugs.has(a.slug)
    );

    return {
      unlocked: unlockedAchievements,
      locked: lockedAchievements,
      totalUnlocked: unlockedAchievements.length,
      totalAchievements: this.ACHIEVEMENTS.length,
    };
  }
}
