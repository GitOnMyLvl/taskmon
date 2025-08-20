import { z } from 'zod';

// Base interfaces matching Prisma models
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  xp: number;
  level: number;
  streak: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Monster {
  id: string;
  ownerId: string;
  species: string;
  stage: number;
  xp: number;
  hunger: number;
  mood: 'happy' | 'neutral' | 'sad';
  lastFedAt: Date;
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quest {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  difficulty: 'easy' | 'normal' | 'hard';
  type: 'daily' | 'weekly' | 'normal';
  status: 'open' | 'done';
  rewardXp: number;
  dueAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  userId: string;
  slug: string;
  earnedAt: Date;
  meta: Record<string, any> | null;
}

// API Request/Response types
export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  displayName: string;
}

export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  accessToken: string;
}

export interface CreateQuestRequest {
  title: string;
  description?: string;
  difficulty?: 'easy' | 'normal' | 'hard';
  type?: 'daily' | 'weekly' | 'normal';
  rewardXp?: number;
  dueAt?: string;
}

export interface UpdateQuestRequest {
  title?: string;
  description?: string;
  difficulty?: 'easy' | 'normal' | 'hard';
  type?: 'daily' | 'weekly' | 'normal';
  rewardXp?: number;
  dueAt?: string;
  status?: 'open' | 'done';
}

// Zod schemas for validation
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(2).max(50),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const createQuestSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional().or(z.literal('')),
  difficulty: z.enum(['easy', 'normal', 'hard']).default('normal'),
  type: z.enum(['daily', 'weekly', 'normal']).default('normal'),
  rewardXp: z.number().min(1).max(1000).default(10),
  dueAt: z.string().optional().or(z.literal('')),
});

export const updateQuestSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  difficulty: z.enum(['easy', 'normal', 'hard']).optional(),
  type: z.enum(['daily', 'weekly', 'normal']).optional(),
  rewardXp: z.number().min(1).max(1000).optional(),
  dueAt: z.string().datetime().optional(),
  status: z.enum(['open', 'done']).optional(),
});

// JWT payload type
export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

// Socket.io event types
export interface SocketEvents {
  'quest:completed': {
    questId: string;
    xpGained: number;
    newLevel: number;
    monsterEvolution?: boolean;
  };
  'monster:fed': {
    hunger: number;
    mood: string;
  };
  'achievement:unlocked': {
    slug: string;
    title: string;
    description: string;
  };
}
