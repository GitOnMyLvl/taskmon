import { prisma } from './database';
import { Monster } from '../types';

export class MonsterService {
  /**
   * Get monster by user ID
   */
  static async getMonsterByUserId(userId: string): Promise<Monster | null> {
    return prisma.monster.findUnique({
      where: { ownerId: userId }
    });
  }

  /**
   * Feed the monster
   */
  static async feedMonster(userId: string): Promise<Monster> {
    const monster = await this.getMonsterByUserId(userId);
    if (!monster) {
      throw new Error('Monster not found');
    }

    // Calculate new hunger and mood
    const newHunger = Math.min(100, monster.hunger + 30);
    const newMood = this.calculateMood(newHunger);

    return prisma.monster.update({
      where: { ownerId: userId },
      data: {
        hunger: newHunger,
        mood: newMood,
        lastFedAt: new Date(),
        lastActiveAt: new Date()
      }
    });
  }

  /**
   * Update monster XP and check for evolution
   */
  static async updateMonsterXp(userId: string, xpGained: number): Promise<{
    monster: Monster;
    evolved: boolean;
  }> {
    const monster = await this.getMonsterByUserId(userId);
    if (!monster) {
      throw new Error('Monster not found');
    }

    const newXp = monster.xp + xpGained;
    const newStage = this.calculateStage(newXp);
    const evolved = newStage > monster.stage;

    const updatedMonster = await prisma.monster.update({
      where: { ownerId: userId },
      data: {
        xp: newXp,
        stage: newStage,
        lastActiveAt: new Date()
      }
    });

    return {
      monster: updatedMonster,
      evolved
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
   * Get monster status (hunger decay over time)
   */
  static async getMonsterStatus(userId: string): Promise<{
    monster: Monster;
    hungerDecay: number;
  }> {
    const monster = await this.getMonsterByUserId(userId);
    if (!monster) {
      throw new Error('Monster not found');
    }

    // Calculate hunger decay (1 point per hour since last fed)
    const hoursSinceLastFed = (Date.now() - monster.lastFedAt.getTime()) / (1000 * 60 * 60);
    const hungerDecay = Math.floor(hoursSinceLastFed);

    // Update hunger if needed
    if (hungerDecay > 0) {
      const newHunger = Math.max(0, monster.hunger - hungerDecay);
      const newMood = this.calculateMood(newHunger);

      const updatedMonster = await prisma.monster.update({
        where: { ownerId: userId },
        data: {
          hunger: newHunger,
          mood: newMood,
          lastActiveAt: new Date()
        }
      });

      return {
        monster: updatedMonster,
        hungerDecay
      };
    }

    return {
      monster,
      hungerDecay: 0
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
      3: 'slime-king'
    };

    const xpRequirements = {
      1: 200,
      2: 500,
      3: null
    };

    return {
      currentSpecies: speciesMap[stage as keyof typeof speciesMap] || 'slime',
      nextSpecies: stage < 3 ? speciesMap[(stage + 1) as keyof typeof speciesMap] : null,
      xpToNextStage: xpRequirements[stage as keyof typeof xpRequirements] || 0
    };
  }
}

