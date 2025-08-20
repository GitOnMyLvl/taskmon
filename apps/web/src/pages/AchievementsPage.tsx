import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { achievementsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AchievementsPage() {
  const { data: achievementsData, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: achievementsAPI.getProgress,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const { unlocked, locked, totalUnlocked, totalAchievements } = achievementsData || {
    unlocked: [],
    locked: [],
    totalUnlocked: 0,
    totalAchievements: 0
  };

  const progressPercentage = totalAchievements > 0 ? (totalUnlocked / totalAchievements) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements</h1>
        <p className="text-gray-600">Track your progress and unlock rewards</p>
      </div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-primary-600 mb-2">
            {totalUnlocked} / {totalAchievements}
          </div>
          <div className="text-lg text-gray-600 mb-4">Achievements Unlocked</div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <motion.div
              className="h-4 bg-gradient-to-r from-primary-500 to-monster-purple rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="text-sm text-gray-500">
            {progressPercentage.toFixed(1)}% Complete
          </div>
        </div>
      </motion.div>

      {/* Unlocked Achievements */}
      {unlocked.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unlocked Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlocked.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🏆</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {achievement.slug.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {achievement.slug === 'first_quest_done' && 'Complete your first quest'}
                      {achievement.slug === '7_day_streak' && 'Maintain a 7-day streak'}
                      {achievement.slug === '10_quests_completed' && 'Complete 10 quests'}
                      {achievement.slug === 'monster_evolution' && 'Evolve your monster to stage 2'}
                      {achievement.slug === 'level_10' && 'Reach level 10'}
                    </p>
                    <div className="text-xs text-gray-500">
                      Unlocked {new Date(achievement.earnedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Locked Achievements */}
      {locked.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Locked Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locked.map((achievement, index) => (
              <motion.div
                key={achievement.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card bg-gray-50 border-gray-200 opacity-75"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-2xl text-gray-400">🔒</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-400 mb-1">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {achievement.description}
                    </p>
                    <div className="text-xs text-gray-400">
                      Keep playing to unlock!
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {totalAchievements === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements available</h3>
          <p className="text-gray-600">
            Start completing quests to unlock achievements!
          </p>
        </motion.div>
      )}
    </div>
  );
}

