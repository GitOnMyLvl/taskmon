
import { motion } from 'framer-motion';

interface StreakDisplayProps {
  streak: number;
  className?: string;
}

export default function StreakDisplay({ streak, className = '' }: StreakDisplayProps) {
  const getStreakEmoji = (streak: number) => {
    if (streak === 0) return '🔥';
    if (streak < 3) return '🔥';
    if (streak < 7) return '🔥🔥';
    if (streak < 14) return '🔥🔥🔥';
    if (streak < 30) return '🔥🔥🔥🔥';
    return '🔥🔥🔥🔥🔥';
  };

  const getStreakColor = (streak: number) => {
    if (streak === 0) return 'text-gray-400';
    if (streak < 3) return 'text-orange-500';
    if (streak < 7) return 'text-red-500';
    if (streak < 14) return 'text-purple-500';
    if (streak < 30) return 'text-indigo-500';
    return 'text-pink-500';
  };

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return 'Start your streak!';
    if (streak === 1) return 'First day!';
    if (streak < 7) return 'Keep it up!';
    if (streak < 14) return 'On fire!';
    if (streak < 30) return 'Unstoppable!';
    return 'Legendary!';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200 ${className}`}
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        className="text-4xl mb-2"
      >
        {getStreakEmoji(streak)}
      </motion.div>
      
      <div className={`text-3xl font-bold mb-1 ${getStreakColor(streak)}`}>
        {streak}
      </div>
      
      <div className="text-sm text-gray-600 mb-2">
        Day{streak !== 1 ? 's' : ''} Streak
      </div>
      
      <div className="text-xs text-gray-500 font-medium">
        {getStreakMessage(streak)}
      </div>
      
      {streak > 0 && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((streak / 30) * 100, 100)}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-3 h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto"
        />
      )}
    </motion.div>
  );
}
