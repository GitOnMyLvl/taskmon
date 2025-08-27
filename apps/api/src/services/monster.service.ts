import { prisma } from './database';
import { Monster } from '../types';

export class MonsterService {
  /**
   * Get active monster by user ID
   */
  static async getActiveMonsterByUserId(
    userId: string
  ): Promise<Monster | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { activeMonster: true },
    });

    return user?.activeMonster || null;
  }

  /**
   * Get all monsters by user ID
   */
  static async getAllMonstersByUserId(userId: string): Promise<Monster[]> {
    return prisma.monster.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Switch active monster
   */
  static async switchActiveMonster(
    userId: string,
    monsterId: string
  ): Promise<Monster> {
    // Verify the monster belongs to the user
    const monster = await prisma.monster.findFirst({
      where: {
        id: monsterId,
        ownerId: userId,
      },
    });

    if (!monster) {
      throw new Error('Monster not found or does not belong to user');
    }

    // Update user's active monster
    await prisma.user.update({
      where: { id: userId },
      data: { activeMonsterId: monsterId },
    });

    return monster;
  }

  /**
   * Feed the active monster
   */
  static async feedMonster(userId: string): Promise<Monster> {
    const monster = await this.getActiveMonsterByUserId(userId);
    if (!monster) {
      throw new Error('No active monster found');
    }

    // Calculate new hunger and mood
    const newHunger = Math.min(100, monster.hunger + 30);
    const newMood = this.calculateMood(newHunger);

    return prisma.monster.update({
      where: { id: monster.id },
      data: {
        hunger: newHunger,
        mood: newMood,
        lastFedAt: new Date(),
        lastActiveAt: new Date(),
      },
    });
  }

  /**
   * Update active monster XP and check for evolution
   */
  static async updateMonsterXp(
    userId: string,
    xpGained: number
  ): Promise<{
    monster: Monster;
    evolved: boolean;
  }> {
    const monster = await this.getActiveMonsterByUserId(userId);
    if (!monster) {
      throw new Error('No active monster found');
    }

    const newXp = monster.xp + xpGained;
    const newStage = this.calculateStage(newXp);
    const evolved = newStage > monster.stage;

    const updatedMonster = await prisma.monster.update({
      where: { id: monster.id },
      data: {
        xp: newXp,
        stage: newStage,
        lastActiveAt: new Date(),
      },
    });

    return {
      monster: updatedMonster,
      evolved,
    };
  }

  /**
   * Calculate monster mood based on hunger
   */
  static calculateMood(hunger: number): 'happy' | 'neutral' | 'sad' {
    if (hunger >= 80) {
      return 'happy';
    } else if (hunger >= 40) {
      return 'neutral';
    } else {
      return 'sad';
    }
  }

  /**
   * Calculate monster stage based on XP
   */
  static calculateStage(xp: number): number {
    if (xp >= 500) {
      return 3;
    } else if (xp >= 200) {
      return 2;
    } else {
      return 1;
    }
  }

  /**
   * Get active monster status (hunger decay over time)
   */
  static async getMonsterStatus(userId: string): Promise<{
    monster: Monster;
    hungerDecay: number;
  }> {
    const monster = await this.getActiveMonsterByUserId(userId);
    if (!monster) {
      throw new Error('No active monster found');
    }

    // Calculate hunger decay (1 point per hour since last fed)
    const hoursSinceLastFed =
      (Date.now() - monster.lastFedAt.getTime()) / (1000 * 60 * 60);
    const hungerDecay = Math.floor(hoursSinceLastFed);

    // Update hunger if needed
    if (hungerDecay > 0) {
      const newHunger = Math.max(0, monster.hunger - hungerDecay);
      const newMood = this.calculateMood(newHunger);

      const updatedMonster = await prisma.monster.update({
        where: { id: monster.id },
        data: {
          hunger: newHunger,
          mood: newMood,
          lastActiveAt: new Date(),
        },
      });

      return {
        monster: updatedMonster,
        hungerDecay,
      };
    }

    return {
      monster,
      hungerDecay: 0,
    };
  }

  /**
   * Get monster evolution info
   */
  static getEvolutionInfo(stage: number): {
    currentSpecies: string;
    nextSpecies: string | null;
    xpToNextStage: number;
  } {
    const speciesMap = {
      1: 'slime',
      2: 'slime-warrior',
      3: 'slime-king',
    };

    const xpRequirements = {
      1: 200,
      2: 500,
      3: null,
    };

    return {
      currentSpecies: speciesMap[stage as keyof typeof speciesMap] || 'slime',
      nextSpecies:
        stage < 3 ? speciesMap[(stage + 1) as keyof typeof speciesMap] : null,
      xpToNextStage: xpRequirements[stage as keyof typeof xpRequirements] || 0,
    };
  }
}
