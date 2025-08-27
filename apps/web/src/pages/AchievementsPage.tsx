import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { achievementsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AchievementsPage() {
  const queryClient = useQueryClient();
  
  const { data: achievementsData, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: achievementsAPI.getProgress,
  });

  const claimMutation = useMutation({
    mutationFn: achievementsAPI.claim,
    onSuccess: (data) => {
      // Invalidate and refetch achievements and user data
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      // Show success message (you could add a toast notification here)
      console.log(`🎉 ${data.message}`);
    },
    onError: (error) => {
      console.error('Failed to claim achievement:', error);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const { 
    unlocked, 
    locked, 
    totalUnlocked, 
    totalAchievements, 
    totalMonsterPoints,
    unclaimedAchievements 
  } = achievementsData || {
    unlocked: [],
    locked: [],
    totalUnlocked: 0,
    totalAchievements: 0,
    totalMonsterPoints: 0,
    unclaimedAchievements: []
  };

  const progressPercentage = totalAchievements > 0 ? (totalUnlocked / totalAchievements) * 100 : 0;

  const handleClaimAchievement = (achievementId: string) => {
    claimMutation.mutate(achievementId);
  };

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-1">
                {totalUnlocked} / {totalAchievements}
              </div>
              <div className="text-sm text-gray-600">Achievements</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {totalMonsterPoints}
              </div>
              <div className="text-sm text-gray-600">Monster Points</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-1">
                {progressPercentage.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <motion.div
              className="h-4 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full"
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

      {/* Unclaimed Achievements */}
      {unclaimedAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Claim Your Rewards!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unclaimedAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🎁</span>
                    </div>
                  </div>
                  <div className="flex-1">
                                         <div className="flex items-center justify-between mb-1">
                       <h3 className="text-lg font-semibold text-gray-900">
                         {achievement.slug.split('_').map(word => 
                           word.charAt(0).toUpperCase() + word.slice(1)
                         ).join(' ')}
                       </h3>
                       <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 rounded-full">
                         <span className="text-xs">🎁</span>
                         <span className="text-xs font-bold text-green-600">
                           {achievement.monsterPointsReward || 0} MP
                         </span>
                       </div>
                     </div>
                     <p className="text-sm text-gray-600 mb-3">
                      {achievement.slug === 'first_quest_done' && 'Complete your first quest'}
                      {achievement.slug === '5_quests_completed' && 'Complete 5 quests'}
                      {achievement.slug === '10_quests_completed' && 'Complete 10 quests'}
                      {achievement.slug === '25_quests_completed' && 'Complete 25 quests'}
                      {achievement.slug === '3_day_streak' && 'Maintain a 3-day streak'}
                      {achievement.slug === '7_day_streak' && 'Maintain a 7-day streak'}
                      {achievement.slug === '14_day_streak' && 'Maintain a 14-day streak'}
                      {achievement.slug === '30_day_streak' && 'Maintain a 30-day streak'}
                      {achievement.slug === 'first_monster_evolution' && 'Evolve your first monster to stage 2'}
                      {achievement.slug === 'second_monster_evolution' && 'Evolve a second monster to stage 2'}
                      {achievement.slug === 'third_monster_evolution' && 'Evolve a third monster to stage 2'}
                      {achievement.slug === 'all_monsters_evolved' && 'Evolve all your monsters to stage 2'}
                      {achievement.slug === 'level_5' && 'Reach level 5'}
                      {achievement.slug === 'level_10' && 'Reach level 10'}
                      {achievement.slug === 'level_20' && 'Reach level 20'}
                      {achievement.slug === 'level_50' && 'Reach level 50'}
                      {achievement.slug === 'monster_collector' && 'Own all 4 different monster species'}
                    </p>
                    <button
                      onClick={() => handleClaimAchievement(achievement.id)}
                      disabled={claimMutation.isPending}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      {claimMutation.isPending ? (
                        <div className="flex items-center justify-center">
                          <LoadingSpinner size="sm" />
                          <span className="ml-2">Claiming...</span>
                        </div>
                      ) : (
                        `Claim ${achievement.monsterPointsReward || 0} MP`
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Unlocked Achievements */}
      {unlocked.filter(a => a.claimed).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unlocked Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlocked.filter(a => a.claimed).map((achievement, index) => (
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
                                         <div className="flex items-center justify-between mb-1">
                       <h3 className="text-lg font-semibold text-gray-900">
                         {achievement.slug.split('_').map(word => 
                           word.charAt(0).toUpperCase() + word.slice(1)
                         ).join(' ')}
                       </h3>
                       <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 rounded-full">
                         <span className="text-xs">✅</span>
                         <span className="text-xs font-bold text-green-600">
                           Claimed
                         </span>
                       </div>
                     </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {achievement.slug === 'first_quest_done' && 'Complete your first quest'}
                      {achievement.slug === '5_quests_completed' && 'Complete 5 quests'}
                      {achievement.slug === '10_quests_completed' && 'Complete 10 quests'}
                      {achievement.slug === '25_quests_completed' && 'Complete 25 quests'}
                      {achievement.slug === '3_day_streak' && 'Maintain a 3-day streak'}
                      {achievement.slug === '7_day_streak' && 'Maintain a 7-day streak'}
                      {achievement.slug === '14_day_streak' && 'Maintain a 14-day streak'}
                      {achievement.slug === '30_day_streak' && 'Maintain a 30-day streak'}
                      {achievement.slug === 'first_monster_evolution' && 'Evolve your first monster to stage 2'}
                      {achievement.slug === 'second_monster_evolution' && 'Evolve a second monster to stage 2'}
                      {achievement.slug === 'third_monster_evolution' && 'Evolve a third monster to stage 2'}
                      {achievement.slug === 'all_monsters_evolved' && 'Evolve all your monsters to stage 2'}
                      {achievement.slug === 'level_5' && 'Reach level 5'}
                      {achievement.slug === 'level_10' && 'Reach level 10'}
                      {achievement.slug === 'level_20' && 'Reach level 20'}
                      {achievement.slug === 'level_50' && 'Reach level 50'}
                      {achievement.slug === 'monster_collector' && 'Own all 4 different monster species'}
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
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Next Achievements</h2>
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
                                         <div className="flex items-center justify-between mb-1">
                       <h3 className="text-lg font-semibold text-gray-400">
                         {achievement.title}
                       </h3>
                       <div className="flex items-center space-x-1 px-2 py-1 bg-purple-100 rounded-full">
                         <span className="text-xs">💎</span>
                         <span className="text-xs font-bold text-purple-600">
                           {achievement.monsterPointsReward} MP
                         </span>
                       </div>
                     </div>
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

