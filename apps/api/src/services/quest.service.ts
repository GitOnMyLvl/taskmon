import { prisma } from './database';
import { Quest, CreateQuestRequest, UpdateQuestRequest } from '../types';

export class QuestService {
  /**
   * Create a new quest
   */
  static async createQuest(
    userId: string,
    data: CreateQuestRequest
  ): Promise<Quest> {
    console.log('🔍 QuestService.createQuest called:', { userId, data });

    const { title, description, difficulty, type, rewardXp, dueAt } = data;

    // Clean up empty strings
    const cleanDescription =
      description && description.trim() !== '' ? description : null;
    const cleanDueAt = dueAt && dueAt.trim() !== '' ? new Date(dueAt) : null;

    console.log('🔍 Processed data:', {
      title,
      description: cleanDescription,
      difficulty: difficulty || 'normal',
      type: type || 'normal',
      rewardXp: rewardXp || 10,
      dueAt: cleanDueAt,
    });

    return prisma.quest.create({
      data: {
        userId,
        title,
        description: cleanDescription,
        difficulty: difficulty || 'normal',
        type: type || 'normal',
        rewardXp: rewardXp || 10,
        dueAt: cleanDueAt,
      },
    });
  }

  /**
   * Get all quests for a user
   */
  static async getQuestsByUserId(userId: string): Promise<Quest[]> {
    return prisma.quest.findMany({
      where: { userId },
      orderBy: [{ status: 'asc' }, { dueAt: 'asc' }, { createdAt: 'desc' }],
    });
  }

  /**
   * Get a quest by ID
   */
  static async getQuestById(
    questId: string,
    userId: string
  ): Promise<Quest | null> {
    return prisma.quest.findFirst({
      where: {
        id: questId,
        userId,
      },
    });
  }

  /**
   * Update a quest
   */
  static async updateQuest(
    questId: string,
    userId: string,
    data: UpdateQuestRequest
  ): Promise<Quest> {
    const updateData: any = { ...data };

    if (data.dueAt) {
      updateData.dueAt = new Date(data.dueAt);
    }

    return prisma.quest.update({
      where: {
        id: questId,
        userId,
      },
      data: updateData,
    });
  }

  /**
   * Delete a quest
   */
  static async deleteQuest(questId: string, userId: string): Promise<void> {
    await prisma.quest.delete({
      where: {
        id: questId,
        userId,
      },
    });
  }

  /**
   * Complete a quest and award XP
   */
  static async completeQuest(
    questId: string,
    userId: string
  ): Promise<{
    quest: Quest;
    xpGained: number;
    newLevel: number;
    levelUp: boolean;
  }> {
    console.log('🔍 QuestService.completeQuest called:', { questId, userId });

    const quest = await this.getQuestById(questId, userId);
    console.log('Quest found:', quest ? 'Yes' : 'No');

    if (!quest) {
      console.log('❌ Quest not found in database');
      throw new Error('Quest not found');
    }

    console.log('Quest status:', quest.status);
    if (quest.status === 'done') {
      console.log('❌ Quest already completed');
      throw new Error('Quest already completed');
    }

    // Calculate XP and level up
    const xpGained = quest.rewardXp;
    console.log('🔍 XP to be gained:', xpGained);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    console.log('🔍 Current user data:', {
      currentXp: user.xp,
      currentLevel: user.level,
      xpToGain: xpGained,
    });

    const newTotalXp = user.xp + xpGained;
    const newLevel = this.calculateLevel(newTotalXp);
    const levelUp = newLevel > user.level;

    console.log('🔍 Calculated new values:', {
      newTotalXp,
      newLevel,
      levelUp,
    });

    // Update quest and user in a transaction
    const [updatedQuest, updatedUser] = await prisma.$transaction([
      prisma.quest.update({
        where: { id: questId },
        data: {
          status: 'done',
          completedAt: new Date(),
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          xp: newTotalXp,
          level: newLevel,
        },
      }),
    ]);

    console.log('✅ User updated successfully:', {
      oldXp: user.xp,
      newXp: updatedUser.xp,
      oldLevel: user.level,
      newLevel: updatedUser.level,
    });

    return {
      quest: updatedQuest,
      xpGained,
      newLevel,
      levelUp,
    };
  }

  /**
   * Calculate level based on XP
   */
  static calculateLevel(xp: number): number {
    // Simple level calculation: every 100 XP = 1 level
    return Math.floor(xp / 100) + 1;
  }

  /**
   * Get quest statistics for a user
   */
  static async getQuestStats(userId: string): Promise<{
    total: number;
    completed: number;
    open: number;
    overdue: number;
  }> {
    const quests = await this.getQuestsByUserId(userId);
    const now = new Date();

    return {
      total: quests.length,
      completed: quests.filter(q => q.status === 'done').length,
      open: quests.filter(q => q.status === 'open').length,
      overdue: quests.filter(
        q => q.status === 'open' && q.dueAt && q.dueAt < now
      ).length,
    };
  }
}
