// User types
export interface User {
  id: string;
  email: string;
  displayName: string;
  xp: number;
  level: number;
  streak: number;
  createdAt: string;
  updatedAt: string;
}

// Monster types
export interface Monster {
  id: string;
  ownerId: string;
  species: string;
  stage: number;
  xp: number;
  hunger: number;
  mood: 'happy' | 'neutral' | 'sad';
  lastFedAt: string;
  lastActiveAt: string;
  createdAt: string;
  updatedAt: string;
}

// Quest types
export interface Quest {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  difficulty: 'easy' | 'normal' | 'hard';
  type: 'daily' | 'weekly' | 'normal';
  status: 'open' | 'done';
  rewardXp: number;
  dueAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Achievement types
export interface Achievement {
  id: string;
  userId: string;
  slug: string;
  earnedAt: string;
  meta: Record<string, any> | null;
}

export interface AchievementDefinition {
  slug: string;
  title: string;
  description: string;
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
  user: User;
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

// Quest completion response
export interface QuestCompletionResponse {
  quest: Quest;
  xpGained: number;
  newLevel: number;
  levelUp: boolean;
  monster: Monster;
  monsterEvolved: boolean;
  newAchievements: Achievement[];
  user: User;
}

// Monster evolution info
export interface EvolutionInfo {
  currentSpecies: string;
  nextSpecies: string | null;
  xpToNextStage: number;
}

// Monster status response
export interface MonsterStatusResponse {
  monster: Monster;
  hungerDecay: number;
  evolutionInfo: EvolutionInfo;
}

// Quest statistics
export interface QuestStats {
  total: number;
  completed: number;
  open: number;
  overdue: number;
}

// Achievement progress
export interface AchievementProgress {
  unlocked: Achievement[];
  locked: AchievementDefinition[];
  totalUnlocked: number;
  totalAchievements: number;
}

// Socket event types
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

