import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { validateBody } from '../middleware/validation.middleware';
import { registerSchema, loginSchema } from '../types';

const router = Router();

/**
 * POST /auth/register
 * Register a new user
 */
router.post('/register', validateBody(registerSchema), async (req, res) => {
  try {
    const user = await AuthService.register(req.body);
    const token = AuthService.generateToken(user as any);

    res.status(201).json({
      message: 'User registered successfully',
      user,
      accessToken: token,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'User already exists') {
        return res.status(409).json({ error: error.message });
      }
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /auth/login
 * Login user
 */
router.post('/login', validateBody(loginSchema), async (req, res) => {
  try {
    console.log('🔍 Login attempt for:', req.body.email);
    const user = await AuthService.login(req.body);
    console.log('✅ Login successful for user:', user.email);

    const token = AuthService.generateToken(user as any);

    res.json({
      message: 'Login successful',
      user,
      accessToken: token,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Login error details:', {
        message: error.message,
        stack: error.stack,
        email: req.body.email,
      });

      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ error: error.message });
      }
    }
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /auth/me
 * Get current user profile
 */
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const payload = AuthService.verifyToken(token);
    const user = await AuthService.getUserById(payload.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Invalid token') {
        return res.status(403).json({ error: error.message });
      }
    }
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /auth/streak
 * Get current user streak information
 */
router.get('/streak', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const payload = AuthService.verifyToken(token);
    const user = await AuthService.getUserById(payload.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      streak: user.streak,
      lastLoginAt: user.lastLoginAt,
      message:
        user.streak === 0
          ? 'Start your streak today!'
          : `You're on a ${user.streak}-day streak!`,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Invalid token') {
        return res.status(403).json({ error: error.message });
      }
    }
    console.error('Get streak error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
