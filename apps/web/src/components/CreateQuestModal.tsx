import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { questsAPI } from '../services/api';
import { CreateQuestRequest } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface CreateQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateQuestModal({ isOpen, onClose }: CreateQuestModalProps) {
  const [formData, setFormData] = useState<CreateQuestRequest>({
    title: '',
    description: '',
    difficulty: 'normal',
    type: 'normal',
    rewardXp: 10,
    dueAt: ''
  });

  const queryClient = useQueryClient();

  const createQuestMutation = useMutation({
    mutationFn: questsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      handleClose();
    },
    onError: (error) => {
      console.error('Failed to create quest:', error);
      // Mutation wird automatisch zurückgesetzt nach dem Fehler
    },
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        difficulty: 'normal',
        type: 'normal',
        rewardXp: 10,
        dueAt: ''
      });
      // Reset mutation state
      createQuestMutation.reset();
    }
  }, [isOpen]); // Nur isOpen als Dependency

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rewardXp' ? parseInt(value) || 10 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }

    try {
      await createQuestMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Failed to create quest:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      difficulty: 'normal',
      type: 'normal',
      rewardXp: 10,
      dueAt: ''
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-10"
              onClick={handleClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-20"
            >
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                      <span className="text-2xl">📋</span>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Create New Quest
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Quest Title *
                          </label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="input-field mt-1"
                            placeholder="Enter quest title"
                          />
                        </div>

                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            name="description"
                            id="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            className="input-field mt-1"
                            placeholder="Enter quest description (optional)"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                              Difficulty
                            </label>
                            <select
                              name="difficulty"
                              id="difficulty"
                              value={formData.difficulty}
                              onChange={handleChange}
                              className="input-field mt-1"
                            >
                              <option value="easy">Easy</option>
                              <option value="normal">Normal</option>
                              <option value="hard">Hard</option>
                            </select>
                          </div>

                          <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                              Type
                            </label>
                            <select
                              name="type"
                              id="type"
                              value={formData.type}
                              onChange={handleChange}
                              className="input-field mt-1"
                            >
                              <option value="normal">Normal</option>
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="rewardXp" className="block text-sm font-medium text-gray-700">
                              XP Reward
                            </label>
                            <input
                              type="number"
                              name="rewardXp"
                              id="rewardXp"
                              min="1"
                              max="1000"
                              value={formData.rewardXp}
                              onChange={handleChange}
                              className="input-field mt-1"
                            />
                          </div>

                          <div>
                            <label htmlFor="dueAt" className="block text-sm font-medium text-gray-700">
                              Due Date
                            </label>
                            <input
                              type="datetime-local"
                              name="dueAt"
                              id="dueAt"
                              value={formData.dueAt}
                              onChange={handleChange}
                              className="input-field mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={createQuestMutation.isPending}
                    className="btn-primary w-full sm:w-auto sm:ml-3"
                  >
                    {createQuestMutation.isPending ? (
                      <div className="flex items-center">
                        <LoadingSpinner size="sm" className="mr-2" />
                        Creating...
                      </div>
                    ) : (
                      'Create Quest'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

