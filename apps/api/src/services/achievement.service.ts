import { prisma } from './database';
import { Achievement } from '../types';

export interface AchievementDefinition {
  slug: string;
  title: string;
  description: string;
  monsterPointsReward: number;
  category: string; // For grouping progressive achievements
  condition: (userId: string) => Promise<boolean>;
}

export class AchievementService {
  /**
   * Achievement definitions with Monster Points rewards and categories
   */
  static readonly ACHIEVEMENTS: AchievementDefinition[] = [
    // Quest-related achievements
    {
      slug: 'first_quest_done',
      title: 'First Steps',
      description: 'Complete your first quest',
      monsterPointsReward: 10,
      category: 'quests',
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
      category: 'quests',
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
      category: 'quests',
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
      category: 'quests',
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
      category: 'streaks',
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
      category: 'streaks',
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
      category: 'streaks',
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
      category: 'streaks',
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
      category: 'evolution',
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
      category: 'evolution',
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
      category: 'evolution',
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
      category: 'evolution',
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
      category: 'levels',
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
      category: 'levels',
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
      category: 'levels',
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
      category: 'levels',
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
      category: 'collection',
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
   * Unlock an achievement for a user (without awarding MP immediately)
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

    // Create the achievement (MP will be claimed later)
    return await prisma.achievement.create({
      data: {
        userId,
        slug,
        meta,
        claimed: false, // MP not claimed yet
      },
    });
  }

  /**
   * Claim Monster Points for an achievement
   */
  static async claimAchievement(
    userId: string,
    achievementId: string
  ): Promise<{
    achievement: Achievement;
    monsterPointsAwarded: number;
  }> {
    // Get achievement and check if it exists and belongs to user
    const achievement = await prisma.achievement.findFirst({
      where: {
        id: achievementId,
        userId,
      },
    });

    if (!achievement) {
      throw new Error('Achievement not found');
    }

    if (achievement.claimed) {
      throw new Error('Achievement already claimed');
    }

    // Get achievement definition to award Monster Points
    const achievementDef = this.getAchievementDefinition(achievement.slug);
    if (!achievementDef) {
      throw new Error('Achievement definition not found');
    }

    // Use a transaction to ensure both achievement and MP are updated atomically
    return await prisma.$transaction(async tx => {
      // Mark achievement as claimed
      const updatedAchievement = await tx.achievement.update({
        where: { id: achievementId },
        data: { claimed: true },
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

      return {
        achievement: updatedAchievement,
        monsterPointsAwarded: achievementDef.monsterPointsReward,
      };
    });
  }

  /**
   * Check and unlock achievements for a user (progressive system)
   */
  static async checkAchievements(userId: string): Promise<Achievement[]> {
    const unlockedAchievements: Achievement[] = [];

    // Group achievements by category
    const achievementsByCategory = this.ACHIEVEMENTS.reduce(
      (acc, achievement) => {
        if (!acc[achievement.category]) {
          acc[achievement.category] = [];
        }
        acc[achievement.category].push(achievement);
        return acc;
      },
      {} as Record<string, AchievementDefinition[]>
    );

    // Sort achievements within each category by their order in the array
    Object.keys(achievementsByCategory).forEach(category => {
      achievementsByCategory[category].sort((a, b) => {
        const aIndex = this.ACHIEVEMENTS.findIndex(ach => ach.slug === a.slug);
        const bIndex = this.ACHIEVEMENTS.findIndex(ach => ach.slug === b.slug);
        return aIndex - bIndex;
      });
    });

    // Check each category progressively
    for (const [category, achievements] of Object.entries(
      achievementsByCategory
    )) {
      for (const achievement of achievements) {
        try {
          const hasAchievement = await this.hasAchievement(
            userId,
            achievement.slug
          );

          if (!hasAchievement) {
            // Check if previous achievement in category is completed
            const achievementIndex = achievements.findIndex(
              a => a.slug === achievement.slug
            );
            if (achievementIndex > 0) {
              const previousAchievement = achievements[achievementIndex - 1];
              const hasPreviousAchievement = await this.hasAchievement(
                userId,
                previousAchievement.slug
              );
              if (!hasPreviousAchievement) {
                // Skip this achievement until previous one is completed
                continue;
              }
            }

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
          console.error(
            `Error checking achievement ${achievement.slug}:`,
            error
          );
        }
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
   * Get achievement progress for a user (with progressive visibility)
   */
  static async getAchievementProgress(userId: string): Promise<{
    unlocked: (Achievement & { monsterPointsReward: number })[];
    locked: AchievementDefinition[];
    totalUnlocked: number;
    totalAchievements: number;
    totalMonsterPoints: number;
    unclaimedAchievements: (Achievement & { monsterPointsReward: number })[];
  }> {
    const unlockedAchievements = await this.getUserAchievements(userId);

    // Add monsterPointsReward to each achievement
    const achievementsWithRewards = unlockedAchievements.map(achievement => {
      const def = this.getAchievementDefinition(achievement.slug);
      return {
        ...achievement,
        monsterPointsReward: def?.monsterPointsReward || 0,
      };
    });

    const unlockedSlugs = new Set(achievementsWithRewards.map(a => a.slug));

    // Group achievements by category for progressive visibility
    const achievementsByCategory = this.ACHIEVEMENTS.reduce(
      (acc, achievement) => {
        if (!acc[achievement.category]) {
          acc[achievement.category] = [];
        }
        acc[achievement.category].push(achievement);
        return acc;
      },
      {} as Record<string, AchievementDefinition[]>
    );

    // Sort achievements within each category
    Object.keys(achievementsByCategory).forEach(category => {
      achievementsByCategory[category].sort((a, b) => {
        const aIndex = this.ACHIEVEMENTS.findIndex(ach => ach.slug === a.slug);
        const bIndex = this.ACHIEVEMENTS.findIndex(ach => ach.slug === b.slug);
        return aIndex - bIndex;
      });
    });

    // Build visible locked achievements (progressive system)
    const visibleLockedAchievements: AchievementDefinition[] = [];

    for (const [category, achievements] of Object.entries(
      achievementsByCategory
    )) {
      for (let i = 0; i < achievements.length; i++) {
        const achievement = achievements[i];

        if (unlockedSlugs.has(achievement.slug)) {
          // Achievement is unlocked, continue to next
          continue;
        }

        // Check if previous achievement in category is completed
        if (i > 0) {
          const previousAchievement = achievements[i - 1];
          if (!unlockedSlugs.has(previousAchievement.slug)) {
            // Previous achievement not completed, hide this one
            break;
          }
        }

        // This achievement should be visible
        visibleLockedAchievements.push(achievement);
        break; // Only show the next achievable one
      }
    }

    // Calculate total Monster Points earned (only from claimed achievements)
    const totalMonsterPoints = achievementsWithRewards
      .filter(achievement => achievement.claimed)
      .reduce((total, achievement) => {
        return total + achievement.monsterPointsReward;
      }, 0);

    // Get unclaimed achievements
    const unclaimedAchievements = achievementsWithRewards.filter(
      achievement => !achievement.claimed
    );

    return {
      unlocked: achievementsWithRewards,
      locked: visibleLockedAchievements,
      totalUnlocked: achievementsWithRewards.length,
      totalAchievements: this.ACHIEVEMENTS.length,
      totalMonsterPoints,
      unclaimedAchievements,
    };
  }
}
