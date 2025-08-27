import React from 'react';
import { motion } from 'framer-motion';
import { Monster } from '../types';
import { 
  getMonsterEmoji, 
  getMonsterName, 
  getEvolutionMessage, 
  getMonsterAnimation 
} from '../constants/monsters';

interface MonsterDisplayProps {
  monster: Monster;
}

export default function MonsterDisplay({ monster }: MonsterDisplayProps) {
  const getMonsterSize = (stage: number) => {
    return stage === 1 ? 'text-6xl' : stage === 2 ? 'text-7xl' : 'text-8xl';
  };

  return (
    <div className="text-center">
      <motion.div
        className={`monster-container flex items-center justify-center ${getMonsterSize(monster.stage)}`}
        animate={getMonsterAnimation(monster.mood)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {getMonsterEmoji(monster.species, monster.stage)}
      </motion.div>
      
      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 capitalize">
          {getMonsterName(monster.species)} (Stage {monster.stage})
        </h3>
        <p className="text-sm text-gray-600">
          {monster.xp} XP • {getEvolutionMessage(monster.species, monster.stage)}
        </p>
      </div>
    </div>
  );
}

