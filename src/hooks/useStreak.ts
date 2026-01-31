/**
 * =====================================================
 * REACT HOOKS - STREAK TRACKING
 * =====================================================
 * Purpose: React hooks for streak management with real-time updates
 * Features: Automatic refetch, optimistic updates, real-time sync
 * =====================================================
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import StreakService, {
  UserStreak,
  StreakUpdateResult,
  StreakLeaderboardEntry,
  StreakHistoryEntry,
} from '../services/streakService';

/**
 * =====================================================
 * HOOK: useUserStreak
 * =====================================================
 * 
 * Manages user's streak data with real-time updates
 * 
 * Features:
 * - Automatic data fetching
 * - Real-time sync via Supabase
 * - Loading and error states
 * - Manual refresh
 */
export function useUserStreak(userId: string | null) {
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  
  // Fetch streak data
  const fetchStreak = useCallback(async () => {
    if (!userId) {
      setStreak(null);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await StreakService.getStreakCached(userId);
      setStreak(data);
      
    } catch (err: any) {
      console.error('[useUserStreak] Fetch error:', err);
      setError(err.message || 'Failed to fetch streak data');
      
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  // Initial fetch
  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);
  
  // Real-time subscription
  useEffect(() => {
    if (!userId) return;
    
    const channel = supabase
      .channel(`user:${userId}:streaks`)
      .on('broadcast', { event: 'streak_updated' }, (payload) => {
        console.log('[useUserStreak] Real-time update received:', payload);
        
        // Update local state with new data
        setStreak((prev) => {
          if (!prev) return prev;
          
          return {
            ...prev,
            current_streak: payload.payload.current_streak,
            longest_streak: payload.payload.longest_streak,
            is_active_today: true,
          };
        });
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);
  
  // Subscribe to database changes (fallback to postgres_changes)
  useEffect(() => {
    if (!userId) return;
    
    const channel = supabase
      .channel('streak-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_streaks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('[useUserStreak] DB change detected:', payload);
          // Refetch to get latest data
          fetchStreak();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchStreak]);
  
  // Update streak manually
  const updateStreak = useCallback(async (timezone?: string) => {
    if (!userId) return null;
    
    try {
      setUpdating(true);
      setError(null);
      
      const detectedTimezone = timezone || StreakService.detectTimezone();
      const result = await StreakService.updateStreak(userId, detectedTimezone);
      
      // Invalidate cache
      StreakService.invalidateCache(userId);
      
      // Refresh data
      await fetchStreak();
      
      return result;
      
    } catch (err: any) {
      console.error('[useUserStreak] Update error:', err);
      setError(err.message || 'Failed to update streak');
      return null;
      
    } finally {
      setUpdating(false);
    }
  }, [userId, fetchStreak]);
  
  return {
    streak,
    loading,
    error,
    updating,
    refresh: fetchStreak,
    updateStreak,
  };
}

/**
 * =====================================================
 * HOOK: useStreakLeaderboard
 * =====================================================
 * 
 * Manages streak leaderboard with pagination and real-time updates
 */
export function useStreakLeaderboard(limit: number = 100, offset: number = 0) {
  const [leaderboard, setLeaderboard] = useState<StreakLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  
  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await StreakService.getLeaderboard(limit, offset);
      setLeaderboard(data);
      setTotal(data.length);
      
    } catch (err: any) {
      console.error('[useStreakLeaderboard] Fetch error:', err);
      setError(err.message || 'Failed to fetch leaderboard');
      
    } finally {
      setLoading(false);
    }
  }, [limit, offset]);
  
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);
  
  // Real-time updates for leaderboard
  useEffect(() => {
    const channel = supabase
      .channel('streak-leaderboard-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_streaks',
        },
        () => {
          // Debounce: Only refetch after 2 seconds of no changes
          setTimeout(() => {
            fetchLeaderboard();
          }, 2000);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLeaderboard]);
  
  return {
    leaderboard,
    loading,
    error,
    total,
    refresh: fetchLeaderboard,
  };
}

/**
 * =====================================================
 * HOOK: useStreakHistory
 * =====================================================
 * 
 * Fetches user's streak change history
 */
export function useStreakHistory(userId: string | null, limit: number = 50) {
  const [history, setHistory] = useState<StreakHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchHistory = useCallback(async () => {
    if (!userId) {
      setHistory([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await StreakService.getHistory(userId, limit);
      setHistory(data);
      
    } catch (err: any) {
      console.error('[useStreakHistory] Fetch error:', err);
      setError(err.message || 'Failed to fetch history');
      
    } finally {
      setLoading(false);
    }
  }, [userId, limit]);
  
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);
  
  return {
    history,
    loading,
    error,
    refresh: fetchHistory,
  };
}

/**
 * =====================================================
 * HOOK: useStreakOnSolve
 * =====================================================
 * 
 * Automatically updates streak when user solves a problem
 * 
 * Usage:
 * ```tsx
 * const { triggerStreakUpdate } = useStreakOnSolve(userId);
 * 
 * const handleProblemSolved = async () => {
 *   await saveProblemSubmission();
 *   await triggerStreakUpdate(); // Updates streak automatically
 * };
 * ```
 */
export function useStreakOnSolve(userId: string | null) {
  const [lastResult, setLastResult] = useState<StreakUpdateResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const processingRef = useRef(false); // Prevent duplicate calls
  
  const triggerStreakUpdate = useCallback(async () => {
    if (!userId) return null;
    
    // Prevent duplicate concurrent calls
    if (processingRef.current) {
      console.warn('[useStreakOnSolve] Update already in progress, skipping...');
      return null;
    }
    
    try {
      processingRef.current = true;
      setProcessing(true);
      
      const result = await StreakService.handleProblemSolved(userId);
      setLastResult(result);
      
      return result;
      
    } catch (err: any) {
      console.error('[useStreakOnSolve] Update error:', err);
      return null;
      
    } finally {
      setProcessing(false);
      processingRef.current = false;
    }
  }, [userId]);
  
  return {
    triggerStreakUpdate,
    lastResult,
    processing,
  };
}

/**
 * =====================================================
 * HOOK: useStreakNotification
 * =====================================================
 * 
 * Shows toast notifications for streak updates
 * 
 * Usage:
 * ```tsx
 * const { showStreakNotification } = useStreakNotification();
 * 
 * // After streak update
 * if (result.change_type === 'STREAK_INCREMENT') {
 *   showStreakNotification(result);
 * }
 * ```
 */
export function useStreakNotification() {
  const showStreakNotification = useCallback((result: StreakUpdateResult) => {
    const { change_type, current_streak, message } = result;
    
    // Get appropriate emoji
    const emoji = {
      FIRST_ACTIVITY: '🎉',
      STREAK_INCREMENT: '🔥',
      STREAK_MAINTAINED: '✅',
      STREAK_RESET: '💔',
    }[change_type] || '📊';
    
    // Show notification (integrate with your toast library)
    console.log(`${emoji} ${message}`);
    
    // Example with react-hot-toast:
    // if (change_type === 'STREAK_INCREMENT') {
    //   toast.success(`${emoji} ${current_streak} day streak! ${message}`);
    // } else if (change_type === 'STREAK_RESET') {
    //   toast.error(`${emoji} ${message}`);
    // } else {
    //   toast.info(`${emoji} ${message}`);
    // }
    
    // Browser notification (if permission granted)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Streak Update ${emoji}`, {
        body: message,
        icon: '/logo.png',
        badge: '/badge.png',
      });
    }
  }, []);
  
  return {
    showStreakNotification,
  };
}

/**
 * =====================================================
 * HOOK: useStreakStats
 * =====================================================
 * 
 * Calculates derived streak statistics
 */
export function useStreakStats(streak: UserStreak | null) {
  const stats = {
    isOnFire: streak ? streak.current_streak >= 7 : false,
    isLegendary: streak ? streak.current_streak >= 30 : false,
    needsToSolveToday: streak ? !streak.is_active_today : false,
    willResetTomorrow: streak
      ? !streak.is_active_today && (streak.days_since_activity ?? 0) >= 1
      : false,
    daysUntilReset: streak
      ? streak.is_active_today
        ? 1
        : Math.max(0, 2 - (streak.days_since_activity ?? 0))
      : 0,
    progressToNextMilestone: streak
      ? (() => {
          const current = streak.current_streak;
          const milestones = [7, 14, 30, 50, 100, 365];
          const nextMilestone = milestones.find((m) => m > current) || current;
          return {
            current,
            next: nextMilestone,
            remaining: nextMilestone - current,
            percentage: (current / nextMilestone) * 100,
          };
        })()
      : null,
  };
  
  return stats;
}

/**
 * =====================================================
 * EXPORTS
 * =====================================================
 */

export const StreakHooks = {
  useUserStreak,
  useStreakLeaderboard,
  useStreakHistory,
  useStreakOnSolve,
  useStreakNotification,
  useStreakStats,
};

export default StreakHooks;
