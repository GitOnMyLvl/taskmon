import { Router } from 'express';
import { AchievementService } from '../services/achievement.service';
import { authenticateToken, requireUser } from '../middleware/auth.middleware';

const router = Router();

/**
 * GET /achievements
 * Get all achievements for the authenticated user
 */
router.get('/', authenticateToken, requireUser, async (req, res) => {
  try {
    const progress = await AchievementService.getAchievementProgress(
      req.user!.userId
    );

    res.json(progress);
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /achievements/unlocked
 * Get only unlocked achievements
 */
router.get('/unlocked', authenticateToken, requireUser, async (req, res) => {
  try {
    const achievements = await AchievementService.getUserAchievements(
      req.user!.userId
    );

    res.json({ achievements });
  } catch (error) {
    console.error('Get unlocked achievements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /achievements/:achievementId/claim
 * Claim Monster Points for an achievement
 */
router.post(
  '/:achievementId/claim',
  authenticateToken,
  requireUser,
  async (req, res) => {
    try {
      const { achievementId } = req.params;
      const result = await AchievementService.claimAchievement(
        req.user!.userId,
        achievementId
      );

      res.json({
        success: true,
        achievement: result.achievement,
        monsterPointsAwarded: result.monsterPointsAwarded,
        message: `Claimed ${result.monsterPointsAwarded} Monster Points!`,
      });
    } catch (error) {
      console.error('Claim achievement error:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
);

export default router;
