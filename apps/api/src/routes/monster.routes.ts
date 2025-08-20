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
    const { monster, hungerDecay } = await MonsterService.getMonsterStatus(req.user!.userId);
    const evolutionInfo = MonsterService.getEvolutionInfo(monster.stage);

    res.json({
      monster,
      hungerDecay,
      evolutionInfo
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
      monster
    });
  } catch (error) {
    console.error('Feed monster error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

