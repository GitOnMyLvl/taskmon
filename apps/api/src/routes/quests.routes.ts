import { Router } from 'express';
import { z } from 'zod';
import { QuestService } from '../services/quest.service';
import { MonsterService } from '../services/monster.service';
import { AchievementService } from '../services/achievement.service';
import { AuthService } from '../services/auth.service';
import { authenticateToken, requireUser } from '../middleware/auth.middleware';
import { validateBody, validateParams } from '../middleware/validation.middleware';
import { createQuestSchema, updateQuestSchema } from '../types';

const router = Router();

// Validation schemas
const questIdSchema = z.object({
  id: z.string().cuid()
});

/**
 * GET /quests
 * Get all quests for the authenticated user
 */
router.get('/', authenticateToken, requireUser, async (req, res) => {
  try {
    const quests = await QuestService.getQuestsByUserId(req.user!.userId);
    const stats = await QuestService.getQuestStats(req.user!.userId);

    res.json({
      quests,
      stats
    });
  } catch (error) {
    console.error('Get quests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /quests
 * Create a new quest
 */
router.post('/', authenticateToken, requireUser, validateBody(createQuestSchema), async (req, res) => {
  try {
    const quest = await QuestService.createQuest(req.user!.userId, req.body);

    res.status(201).json({
      message: 'Quest created successfully',
      quest
    });
  } catch (error) {
    console.error('Create quest error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /quests/:id
 * Get a specific quest
 */
router.get('/:id', authenticateToken, requireUser, validateParams(questIdSchema), async (req, res) => {
  try {
    const quest = await QuestService.getQuestById(req.params.id, req.user!.userId);

    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' });
    }

    res.json({ quest });
  } catch (error) {
    console.error('Get quest error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PATCH /quests/:id
 * Update a quest
 */
router.patch('/:id', authenticateToken, requireUser, validateParams(questIdSchema), validateBody(updateQuestSchema), async (req, res) => {
  try {
    const quest = await QuestService.updateQuest(req.params.id, req.user!.userId, req.body);

    res.json({
      message: 'Quest updated successfully',
      quest
    });
  } catch (error) {
    console.error('Update quest error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /quests/:id
 * Delete a quest
 */
router.delete('/:id', authenticateToken, requireUser, validateParams(questIdSchema), async (req, res) => {
  try {
    await QuestService.deleteQuest(req.params.id, req.user!.userId);

    res.json({
      message: 'Quest deleted successfully'
    });
  } catch (error) {
    console.error('Delete quest error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /quests/:id/complete
 * Complete a quest and award XP
 */
router.post('/:id/complete', authenticateToken, requireUser, validateParams(questIdSchema), async (req, res) => {
  try {
    // Complete the quest
    const result = await QuestService.completeQuest(req.params.id, req.user!.userId);

    // Update monster XP and check for evolution
    const monsterResult = await MonsterService.updateMonsterXp(req.user!.userId, result.xpGained);

    // Check for achievements
    const newAchievements = await AchievementService.checkAchievements(req.user!.userId);

    // Get updated user data
    const user = await AuthService.getUserById(req.user!.userId);

    res.json({
      message: 'Quest completed successfully',
      quest: result.quest,
      xpGained: result.xpGained,
      newLevel: result.newLevel,
      levelUp: result.levelUp,
      monster: monsterResult.monster,
      monsterEvolved: monsterResult.evolved,
      newAchievements,
      user
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Quest not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Quest already completed') {
        return res.status(400).json({ error: error.message });
      }
    }
    console.error('Complete quest error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
