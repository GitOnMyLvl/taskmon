import React from 'react';
import { motion } from 'framer-motion';
import { Monster } from '../types';

interface MonsterDisplayProps {
  monster: Monster;
}

export default function MonsterDisplay({ monster }: MonsterDisplayProps) {
  const getMonsterEmoji = (species: string, stage: number) => {
    const emojiMap: Record<string, string[]> = {
      'slime': ['🟢', '🟢', '🟢'],
      'slime-warrior': ['🟢', '🟡', '🟠'],
      'slime-king': ['🟢', '🟡', '👑']
    };
    
    return emojiMap[species]?.[stage - 1] || '🟢';
  };

  const getMonsterSize = (stage: number) => {
    return stage === 1 ? 'text-6xl' : stage === 2 ? 'text-7xl' : 'text-8xl';
  };

  const getMonsterAnimation = (mood: string) => {
    switch (mood) {
      case 'happy':
        return { scale: [1, 1.1, 1], transition: { duration: 2, repeat: Infinity } };
      case 'neutral':
        return { y: [0, -5, 0], transition: { duration: 3, repeat: Infinity } };
      case 'sad':
        return { rotate: [0, -5, 5, 0], transition: { duration: 4, repeat: Infinity } };
      default:
        return {};
    }
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
          {monster.species.replace('-', ' ')} (Stage {monster.stage})
        </h3>
        <p className="text-sm text-gray-600">
          {monster.xp} XP • {monster.species === 'slime-king' ? 'Max Evolution' : `Next evolution at ${monster.stage === 1 ? 200 : 500} XP`}
        </p>
      </div>
    </div>
  );
}

