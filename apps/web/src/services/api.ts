import axios from 'axios';
import {
  AuthRequest,
  RegisterRequest,
  AuthResponse,
  User,
  Quest,
  CreateQuestRequest,
  UpdateQuestRequest,
  Monster,
  Achievement,
  QuestCompletionResponse,
  MonsterStatusResponse,
  QuestStats,
  AchievementProgress
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error.response?.data);
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  getStreak: async (): Promise<{ streak: number; lastLoginAt: string; message: string }> => {
    const response = await api.get('/auth/streak');
    return response.data;
  },
};

// Quests API
export const questsAPI = {
  getAll: async (): Promise<{ quests: Quest[]; stats: QuestStats }> => {
    const response = await api.get('/quests');
    return response.data;
  },

  getById: async (id: string): Promise<{ quest: Quest }> => {
    const response = await api.get(`/quests/${id}`);
    return response.data;
  },

  create: async (data: CreateQuestRequest): Promise<{ quest: Quest }> => {
    const response = await api.post('/quests', data);
    return response.data;
  },

  update: async (id: string, data: UpdateQuestRequest): Promise<{ quest: Quest }> => {
    const response = await api.patch(`/quests/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/quests/${id}`);
  },

  complete: async (id: string): Promise<QuestCompletionResponse> => {
    const response = await api.post(`/quests/${id}/complete`);
    return response.data;
  },
};

// Monster API
export const monsterAPI = {
  getStatus: async (): Promise<MonsterStatusResponse> => {
    const response = await api.get('/monster');
    return response.data;
  },

  feed: async (): Promise<{ monster: Monster }> => {
    const response = await api.post('/monster/feed');
    return response.data;
  },

  getAll: async (): Promise<{ monsters: Monster[]; activeMonster: Monster | null }> => {
    const response = await api.get('/monster/all');
    return response.data;
  },

  switch: async (monsterId: string): Promise<{ monster: Monster }> => {
    const response = await api.post(`/monster/switch/${monsterId}`);
    return response.data;
  },
};

// Achievements API
export const achievementsAPI = {
  getProgress: async (): Promise<AchievementProgress> => {
    const response = await api.get('/achievements');
    return response.data;
  },

  getUnlocked: async (): Promise<{ achievements: Achievement[] }> => {
    const response = await api.get('/achievements/unlocked');
    return response.data;
  },

  claim: async (achievementId: string): Promise<{
    success: boolean;
    achievement: Achievement;
    monsterPointsAwarded: number;
    message: string;
  }> => {
    const response = await api.post(`/achievements/${achievementId}/claim`);
    return response.data;
  },
};

export default api;

