import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { questsAPI } from '../services/api';

import QuestCard from '../components/QuestCard';
import LoadingSpinner from '../components/LoadingSpinner';
import CreateQuestModal from '../components/CreateQuestModal';
import { useAuth } from '../contexts/AuthContext';

export default function QuestsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'open' | 'done'>('all');
  
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  const { data: questsData, isLoading } = useQuery({
    queryKey: ['quests'],
    queryFn: questsAPI.getAll,
  });

  const completeQuestMutation = useMutation({
    mutationFn: questsAPI.complete,
    onSuccess: (data) => {
      console.log('✅ Quest completed successfully:', data);
      
      // Update user data directly with the response
      if (data.user) {
        updateUser(data.user);
        console.log('🔄 User data updated:', data.user);
      }
      
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      queryClient.invalidateQueries({ queryKey: ['monster'] });
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });

  const deleteQuestMutation = useMutation({
    mutationFn: questsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
  });

  const handleCompleteQuest = async (questId: string) => {
    try {
      await completeQuestMutation.mutateAsync(questId);
    } catch (error) {
      console.error('Failed to complete quest:', error);
    }
  };

  const handleDeleteQuest = async (questId: string) => {
    if (window.confirm('Are you sure you want to delete this quest?')) {
      try {
        await deleteQuestMutation.mutateAsync(questId);
      } catch (error) {
        console.error('Failed to delete quest:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const quests = questsData?.quests || [];
  const stats = questsData?.stats;

  // Filter quests based on selected filter
  const filteredQuests = quests.filter((quest) => {
    if (filter === 'all') return true;
    return quest.status === filter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quests</h1>
          <p className="mt-2 text-gray-600">Manage your tasks and track your progress</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary mt-4 sm:mt-0"
        >
          + Create Quest
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Quests</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.open}</div>
            <div className="text-sm text-gray-600">Open</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex space-x-2">
        {(['all', 'open', 'done'] as const).map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === filterOption
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </button>
        ))}
      </div>

      {/* Quests Grid */}
      {filteredQuests.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredQuests.map((quest, index) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <QuestCard quest={quest} />
              <div className="mt-4 flex space-x-2">
                {quest.status === 'open' && (
                  <button
                    onClick={() => handleCompleteQuest(quest.id)}
                    disabled={completeQuestMutation.isPending}
                    className="btn-primary flex-1 text-sm"
                  >
                    {completeQuestMutation.isPending ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      'Complete'
                    )}
                  </button>
                )}
                <button
                  onClick={() => handleDeleteQuest(quest.id)}
                  disabled={deleteQuestMutation.isPending}
                  className="btn-secondary flex-1 text-sm"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No quests found</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? "You haven't created any quests yet. Create your first quest to get started!"
              : `No ${filter} quests found.`
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary"
            >
              Create Your First Quest
            </button>
          )}
        </motion.div>
      )}

      {/* Create Quest Modal */}
      <CreateQuestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

