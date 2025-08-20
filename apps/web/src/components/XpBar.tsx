import React from 'react';
import { motion } from 'framer-motion';

interface XpBarProps {
  currentXp: number;
  level: number;
}

export default function XpBar({ currentXp, level }: XpBarProps) {
  // Calculate XP progress within current level
  const xpForCurrentLevel = (level - 1) * 100;
  const xpForNextLevel = level * 100;
  const xpInCurrentLevel = currentXp - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - currentXp;
  const progressPercentage = (xpInCurrentLevel / 100) * 100;

  return (
    <div className="space-y-2">
      <div className="xp-bar">
        <motion.div
          className="xp-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{xpInCurrentLevel} / 100 XP</span>
        <span>{xpNeededForNextLevel} XP to next level</span>
      </div>
    </div>
  );
}

