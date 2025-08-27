import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { monsterAPI, questsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import MonsterDisplay from '../components/MonsterDisplay';
import XpBar from '../components/XpBar';
import QuestCard from '../components/QuestCard';
import LoadingSpinner from '../components/LoadingSpinner';
import StreakDisplay from '../components/StreakDisplay';
import StreakInfo from '../components/StreakInfo';
import MonsterSwitcher from '../components/MonsterSwitcher';

export default function DashboardPage() {
  const { user } = useAuth();
  const [showMonsterSwitcher, setShowMonsterSwitcher] = useState(false);

  const { data: monsterData, isLoading: monsterLoading } = useQuery({
    queryKey: ['monster'],
    queryFn: monsterAPI.getStatus,
  });

  const { data: questsData, isLoading: questsLoading } = useQuery({
    queryKey: ['quests'],
    queryFn: questsAPI.getAll,
  });

  if (monsterLoading || questsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const monster = monsterData?.monster;
  const quests = questsData?.quests || [];
  const stats = questsData?.stats;

  // Get recent quests (last 5)
  const recentQuests = quests.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.displayName}! 👋
        </h1>
        <p className="text-gray-600">Ready to complete some quests and feed your monster?</p>
      </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monster Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Monster</h2>
              <button
                onClick={() => setShowMonsterSwitcher(true)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
              >
                Switch Monster
              </button>
            </div>
            
            {monster && (
              <div className="space-y-4">
                <MonsterDisplay monster={monster} />
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Hunger</span>
                      <span>{monster.hunger}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${monster.hunger}%`,
                          backgroundColor: monster.hunger > 60 ? '#10b981' : monster.hunger > 30 ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Mood</span>
                    <span className="capitalize">{monster.mood}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">
                        {monster.mood === 'happy' ? '😊' : monster.mood === 'neutral' ? '😐' : '😢'}
                      </span>
                      <span className="text-sm text-gray-600 capitalize">{monster.mood}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Streak Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <StreakInfo />
          </motion.div>
        </motion.div>

        {/* Stats and Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Progress</h2>
            
            <div className="space-y-6">
              {/* XP and Level */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Level {user?.level}</span>
                  <span className="text-sm text-gray-500">{user?.xp} XP</span>
                </div>
                <XpBar currentXp={user?.xp || 0} level={user?.level || 1} />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">{stats?.total || 0}</div>
                  <div className="text-sm text-gray-600">Total Quests</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats?.completed || 0}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{stats?.open || 0}</div>
                  <div className="text-sm text-gray-600">Open</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{stats?.overdue || 0}</div>
                  <div className="text-sm text-gray-600">Overdue</div>
                </div>
              </div>

              {/* Streak */}
              <StreakDisplay streak={user?.streak || 0} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Quests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Quests</h2>
            <a href="/quests" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
              View all →
            </a>
          </div>
          
          {recentQuests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} compact />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📋</div>
              <p>No quests yet. Create your first quest to get started!</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Monster Switcher Modal */}
      <MonsterSwitcher 
        isOpen={showMonsterSwitcher} 
        onClose={() => setShowMonsterSwitcher(false)} 
      />
    </div>
  );
}

