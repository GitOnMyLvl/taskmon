import { prisma } from './database';
import { Quest, CreateQuestRequest, UpdateQuestRequest } from '../types';

export class QuestService {
  /**
   * Create a new quest
   */
  static async createQuest(userId: string, data: CreateQuestRequest): Promise<Quest> {
    const { title, description, difficulty, type, rewardXp, dueAt } = data;

    return prisma.quest.create({
      data: {
        userId,
        title,
        description,
        difficulty: difficulty || 'normal',
        type: type || 'normal',
        rewardXp: rewardXp || 10,
        dueAt: dueAt ? new Date(dueAt) : null
      }
    });
  }

  /**
   * Get all quests for a user
   */
  static async getQuestsByUserId(userId: string): Promise<Quest[]> {
    return prisma.quest.findMany({
      where: { userId },
      orderBy: [
        { status: 'asc' },
        { dueAt: 'asc' },
        { createdAt: 'desc' }
      ]
    });
  }

  /**
   * Get a quest by ID
   */
  static async getQuestById(questId: string, userId: string): Promise<Quest | null> {
    return prisma.quest.findFirst({
      where: {
        id: questId,
        userId
      }
    });
  }

  /**
   * Update a quest
   */
  static async updateQuest(questId: string, userId: string, data: UpdateQuestRequest): Promise<Quest> {
    const updateData: any = { ...data };
    
    if (data.dueAt) {
      updateData.dueAt = new Date(data.dueAt);
    }

    return prisma.quest.update({
      where: {
        id: questId,
        userId
      },
      data: updateData
    });
  }

  /**
   * Delete a quest
   */
  static async deleteQuest(questId: string, userId: string): Promise<void> {
    await prisma.quest.delete({
      where: {
        id: questId,
        userId
      }
    });
  }

  /**
   * Complete a quest and award XP
   */
  static async completeQuest(questId: string, userId: string): Promise<{
    quest: Quest;
    xpGained: number;
    newLevel: number;
    levelUp: boolean;
  }> {
    const quest = await this.getQuestById(questId, userId);
    if (!quest) {
      throw new Error('Quest not found');
    }

    if (quest.status === 'done') {
      throw new Error('Quest already completed');
    }

    // Calculate XP and level up
    const xpGained = quest.rewardXp;
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const newTotalXp = user.xp + xpGained;
    const newLevel = this.calculateLevel(newTotalXp);
    const levelUp = newLevel > user.level;

    // Update quest and user in a transaction
    const [updatedQuest, updatedUser] = await prisma.$transaction([
      prisma.quest.update({
        where: { id: questId },
        data: {
          status: 'done',
          completedAt: new Date()
        }
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          xp: newTotalXp,
          level: newLevel
        }
      })
    ]);

    return {
      quest: updatedQuest,
      xpGained,
      newLevel,
      levelUp
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
      overdue: quests.filter(q => 
        q.status === 'open' && 
        q.dueAt && 
        q.dueAt < now
      ).length
    };
  }
}

