/**
 * =====================================================
 * STREAK WIDGET COMPONENT
 * =====================================================
 * Purpose: Display user's streak with real-time updates
 * Features: Fire animation, progress bars, notifications
 * =====================================================
 */

import React from 'react';
import { useUserStreak, useStreakStats } from '../hooks/useStreak';
import { useAuth } from '../context/AuthContext';
import { Flame, Trophy, Calendar, TrendingUp } from 'lucide-react';
import './StreakWidget.css';

export function StreakWidget() {
  const { user } = useAuth();
  const { streak, loading, error } = useUserStreak(user?.id || null);
  const stats = useStreakStats(streak);

  if (loading) {
    return (
      <div className="streak-widget loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="streak-widget error">
        <p>⚠️ Unable to load streak data</p>
      </div>
    );
  }

  if (!streak) return null;

  return (
    <div className="streak-widget">
      {/* Main Streak Display */}
      <div className="streak-main">
        <div className="streak-icon">
          {stats.isOnFire ? (
            <Flame className="flame-icon animated" size={48} />
          ) : (
            <Flame className="flame-icon" size={48} />
          )}
        </div>
        
        <div className="streak-info">
          <div className="streak-current">
            <span className="streak-number">{streak.current_streak}</span>
            <span className="streak-label">Day Streak</span>
          </div>
          
          {stats.isLegendary && (
            <div className="legendary-badge">
              🏆 LEGENDARY
            </div>
          )}
        </div>
      </div>

      {/* Status Message */}
      <div className="streak-status">
        {streak.is_active_today ? (
          <p className="status-active">
            ✅ Active today! Streak safe until tomorrow.
          </p>
        ) : stats.willResetTomorrow ? (
          <p className="status-warning">
            ⚠️ Solve a problem today or lose your {streak.current_streak}-day streak!
          </p>
        ) : (
          <p className="status-inactive">
            💡 Start your streak by solving a problem today
          </p>
        )}
      </div>

      {/* Progress to Next Milestone */}
      {stats.progressToNextMilestone && (
        <div className="streak-progress">
          <div className="progress-header">
            <span>Next milestone: {stats.progressToNextMilestone.next} days</span>
            <span>{stats.progressToNextMilestone.remaining} to go</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${stats.progressToNextMilestone.percentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="streak-stats">
        <div className="stat-item">
          <Trophy className="stat-icon" size={20} />
          <div className="stat-value">{streak.longest_streak}</div>
          <div className="stat-label">Best Streak</div>
        </div>
        
        <div className="stat-item">
          <Calendar className="stat-icon" size={20} />
          <div className="stat-value">
            {streak.last_active_date 
              ? new Date(streak.last_active_date).toLocaleDateString()
              : 'Never'}
          </div>
          <div className="stat-label">Last Active</div>
        </div>
        
        <div className="stat-item">
          <TrendingUp className="stat-icon" size={20} />
          <div className="stat-value">
            {streak.current_streak > 0 
              ? `${Math.round((streak.current_streak / streak.longest_streak) * 100)}%`
              : '0%'}
          </div>
          <div className="stat-label">Of Best</div>
        </div>
      </div>

      {/* Motivational Messages */}
      {getMotivationalMessage(streak.current_streak)}
    </div>
  );
}

/**
 * Get motivational message based on streak length
 */
function getMotivationalMessage(streak: number): React.ReactNode {
  if (streak === 0) {
    return (
      <div className="motivation neutral">
        Start your journey today! 🚀
      </div>
    );
  }
  
  if (streak === 1) {
    return (
      <div className="motivation positive">
        Great start! Keep it going tomorrow. 💪
      </div>
    );
  }
  
  if (streak >= 2 && streak < 7) {
    return (
      <div className="motivation positive">
        Building momentum! {7 - streak} more day{7 - streak !== 1 ? 's' : ''} to 1 week. 🔥
      </div>
    );
  }
  
  if (streak === 7) {
    return (
      <div className="motivation excellent">
        🎉 One week streak! You're on fire!
      </div>
    );
  }
  
  if (streak >= 8 && streak < 30) {
    return (
      <div className="motivation excellent">
        Amazing consistency! {30 - streak} more to a month. 🌟
      </div>
    );
  }
  
  if (streak === 30) {
    return (
      <div className="motivation legendary">
        🏆 30-DAY STREAK! You're a legend!
      </div>
    );
  }
  
  if (streak > 30 && streak < 100) {
    return (
      <div className="motivation legendary">
        Unstoppable! {100 - streak} days to triple digits. 🚀
      </div>
    );
  }
  
  if (streak >= 100) {
    return (
      <div className="motivation legendary">
        💎 100+ DAY STREAK! Absolute legend!
      </div>
    );
  }
  
  return null;
}

export default StreakWidget;
