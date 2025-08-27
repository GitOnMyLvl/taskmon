import { Router } from 'express';
import { MonsterService } from '../services/monster.service';
import { authenticateToken, requireUser } from '../middleware/auth.middleware';

const router = Router();

/**
 * GET /monster
 * Get monster status and information
 */
router.get('/', authenticateToken, requireUser, async (req, res) => {
  try {
    const { monster, hungerDecay } = await MonsterService.getMonsterStatus(
      req.user!.userId
    );
    const evolutionInfo = MonsterService.getEvolutionInfo(monster.stage);

    res.json({
      monster,
      hungerDecay,
      evolutionInfo,
    });
  } catch (error) {
    console.error('Get monster error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /monster/feed
 * Feed the monster
 */
router.post('/feed', authenticateToken, requireUser, async (req, res) => {
  try {
    const monster = await MonsterService.feedMonster(req.user!.userId);

    res.json({
      message: 'Monster fed successfully',
      monster,
    });
  } catch (error) {
    console.error('Feed monster error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /monster/all
 * Get all monsters for the user
 */
router.get('/all', authenticateToken, requireUser, async (req, res) => {
  try {
    const monsters = await MonsterService.getAllMonstersByUserId(
      req.user!.userId
    );
    const activeMonster = await MonsterService.getActiveMonsterByUserId(
      req.user!.userId
    );

    res.json({
      monsters,
      activeMonster,
    });
  } catch (error) {
    console.error('Get all monsters error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /monster/switch/:monsterId
 * Switch to a different monster
 */
router.post(
  '/switch/:monsterId',
  authenticateToken,
  requireUser,
  async (req, res) => {
    try {
      const { monsterId } = req.params;
      const monster = await MonsterService.switchActiveMonster(
        req.user!.userId,
        monsterId
      );

      res.json({
        message: 'Monster switched successfully',
        monster,
      });
    } catch (error) {
      console.error('Switch monster error:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        return res.status(404).json({ error: 'Monster not found' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
