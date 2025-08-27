import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { monsterAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import { getMonsterEmoji, getMonsterName } from '../constants/monsters';

interface MonsterSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MonsterSwitcher({ isOpen, onClose }: MonsterSwitcherProps) {
  const queryClient = useQueryClient();
  const [selectedMonsterId, setSelectedMonsterId] = useState<string | null>(null);

  const { data: monstersData, isLoading } = useQuery({
    queryKey: ['monsters'],
    queryFn: monsterAPI.getAll,
    enabled: isOpen,
  });

  const switchMonsterMutation = useMutation({
    mutationFn: monsterAPI.switch,
    onSuccess: () => {
      // Invalidate and refetch monster data
      queryClient.invalidateQueries({ queryKey: ['monster'] });
      queryClient.invalidateQueries({ queryKey: ['monsters'] });
      onClose();
    },
  });

  // Use shared helper functions for consistency
  const getMonsterEmojiForSwitcher = (species: string) => {
    return getMonsterEmoji(species, 1); // Always show stage 1 emoji in switcher
  };

  const handleMonsterSelect = (monsterId: string) => {
    setSelectedMonsterId(monsterId);
  };

  const handleSwitchMonster = () => {
    if (selectedMonsterId) {
      switchMonsterMutation.mutate(selectedMonsterId);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-black bg-opacity-50 transition-opacity z-10"
              onClick={onClose}
            />

            {/* Modal */}
                         <motion.div
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               transition={{ duration: 0.15, ease: "easeOut" }}
               className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full mx-4 z-20"
               onClick={(e) => e.stopPropagation()}
             >
               <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Switch Monster</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Choose a monster to switch to. Each monster has its own XP and progress!
              </p>

              <div className="grid grid-cols-2 gap-3">
                {monstersData?.monsters.map((monster) => (
                  <motion.div
                    key={monster.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedMonsterId === monster.id
                        ? 'border-blue-500 bg-blue-50'
                        : monster.id === monstersData.activeMonster?.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => handleMonsterSelect(monster.id)}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">
                        {getMonsterEmojiForSwitcher(monster.species)}
                      </div>
                      <div className="font-semibold text-gray-900">
                        {getMonsterName(monster.species)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {monster.xp} XP
                      </div>
                      {monster.id === monstersData.activeMonster?.id && (
                        <div className="text-xs text-green-600 font-medium mt-1">
                          Active
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {selectedMonsterId && selectedMonsterId !== monstersData?.activeMonster?.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <button
                    onClick={handleSwitchMonster}
                    disabled={switchMonsterMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    {switchMonsterMutation.isPending ? (
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Switching...</span>
                      </div>
                    ) : (
                      'Switch to this monster'
                    )}
                  </button>
                </motion.div>
              )}

              {selectedMonsterId === monstersData?.activeMonster?.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <p className="text-sm text-green-700 text-center">
                    This is your current active monster!
                  </p>
                </motion.div>
              )}
                         </div>
           )}
               </div>
             </motion.div>
           </div>
         </div>
       )}
     </AnimatePresence>
   );
 }
