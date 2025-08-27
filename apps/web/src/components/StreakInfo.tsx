import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { authAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

export default function StreakInfo() {
  const { data: streakData, isLoading } = useQuery({
    queryKey: ['streak'],
    queryFn: authAPI.getStreak,
  });

  if (isLoading) {
    return <LoadingSpinner size="sm" />;
  }

  if (!streakData) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Streak Information</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Current Streak:</span>
          <span className="text-lg font-bold text-orange-600">{streakData.streak} days</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Last Login:</span>
          <span className="text-sm text-gray-900">{formatDate(streakData.lastLoginAt)}</span>
        </div>
        
        <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
          <p className="text-sm text-gray-700 text-center">{streakData.message}</p>
        </div>
      </div>
    </div>
  );
}
