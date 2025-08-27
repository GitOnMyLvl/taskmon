
import { motion } from 'framer-motion';
import { Monster } from '../types';
import { 
  getMonsterEmoji, 
  getMonsterName, 
  getEvolutionMessage,
  XP_REQUIREMENTS
} from '../constants/monsters';

interface MonsterDisplayProps {
  monster: Monster;
}

export default function MonsterDisplay({ monster }: MonsterDisplayProps) {
  const getMonsterSize = (stage: number) => {
    return stage === 1 ? 'text-6xl' : stage === 2 ? 'text-7xl' : 'text-8xl';
  };

  const getXpProgress = () => {
    if (monster.stage >= 3) return 100; // Max evolution
    
    const currentStageXp = monster.xp;
    const requiredXp = XP_REQUIREMENTS[monster.stage as keyof typeof XP_REQUIREMENTS] || 200;
    
    return Math.min((currentStageXp / requiredXp) * 100, 100);
  };

  const xpProgress = getXpProgress();

  return (
    <div className="text-center">
      <motion.div
        className={`monster-container flex items-center justify-center ${getMonsterSize(monster.stage)}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {getMonsterEmoji(monster.species, monster.stage)}
      </motion.div>
      
      <div className="mt-4 space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 capitalize">
          {getMonsterName(monster.species)} (Stage {monster.stage})
        </h3>
        
        {/* XP Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">XP Progress</span>
            <span className="font-semibold text-gray-900">{monster.xp} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-gray-500">
            {getEvolutionMessage(monster.species, monster.stage)}
          </p>
        </div>
      </div>
    </div>
  );
}

