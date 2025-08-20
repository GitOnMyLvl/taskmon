import React from 'react';
import { motion } from 'framer-motion';
import { Quest } from '../types';

interface QuestCardProps {
  quest: Quest;
  compact?: boolean;
}

export default function QuestCard({ quest, compact = false }: QuestCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'daily':
        return '📅';
      case 'weekly':
        return '📆';
      default:
        return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'done' ? 'bg-green-500' : 'bg-yellow-500';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm">{getTypeIcon(quest.type)}</span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quest.difficulty)}`}>
                {quest.difficulty}
              </span>
              <div className={`w-2 h-2 rounded-full ${getStatusColor(quest.status)}`} />
            </div>
            <h3 className="text-sm font-medium text-gray-900 truncate">{quest.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{quest.rewardXp} XP</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">{getTypeIcon(quest.type)}</span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quest.difficulty)}`}>
              {quest.difficulty}
            </span>
            <div className={`w-3 h-3 rounded-full ${getStatusColor(quest.status)}`} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{quest.title}</h3>
          {quest.description && (
            <p className="text-gray-600 text-sm mb-3">{quest.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>🎯 {quest.rewardXp} XP</span>
          {quest.dueAt && (
            <span>📅 Due: {formatDate(quest.dueAt)}</span>
          )}
        </div>
        <span className="capitalize font-medium">
          {quest.status === 'done' ? '✅ Completed' : '⏳ Open'}
        </span>
      </div>
    </motion.div>
  );
}

