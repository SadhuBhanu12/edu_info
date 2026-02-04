/**
 * =====================================================
 * CONCURRENT-SAFE STREAK TRACKING - API LAYER
 * =====================================================
 * Purpose: TypeScript service layer for streak management
 * Features: Atomic updates, idempotency, retry logic
 * Database: Supabase PostgreSQL
 * =====================================================
 */

import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Streak data structure
 */
export interface UserStreak {
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null; // ISO date string (YYYY-MM-DD)
  timezone: string;
  is_active_today: boolean;
  days_since_activity: number | null;
}

/**
 * Streak update result
 */
export interface StreakUpdateResult {
  success: boolean;
  current_streak: number;
  longest_streak: number;
  last_active_date: string;
  change_type: 'FIRST_ACTIVITY' | 'STREAK_INCREMENT' | 'STREAK_MAINTAINED' | 'STREAK_RESET';
  message: string;
}

/**
 * Streak history entry
 */
export interface StreakHistoryEntry {
  id: number;
  user_id: string;
  old_current_streak: number;
  new_current_streak: number;
  old_longest_streak: number;
  new_longest_streak: number;
  activity_date: string;
  last_active_date: string | null;
  change_type: string;
  timezone: string;
  created_at: string;
}

/**
 * Leaderboard entry
 */
export interface StreakLeaderboardEntry {
  rank: number;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string;
  is_active_today: boolean;
  // Extended with user profile data
  username?: string;
  avatar_url?: string;
}

/**
 * Error types for better error handling
 */
export class StreakError extends Error {
  code: string;
  retryable: boolean;

  constructor(
    message: string,
    code: string,
    retryable: boolean = false
  ) {
    super(message);
    this.name = 'StreakError';
    this.code = code;
    this.retryable = retryable;
  }
}

/**
 * =====================================================
 * CORE FUNCTION: Update user streak (Atomic & Idempotent)
 * =====================================================
 * 
 * Features:
 * - Automatic retry on concurrent modification
 * - Idempotent: Safe to call multiple times
 * - Timezone-aware date calculation
 * - Request deduplication via requestId
 * 
 * @param userId - User UUID
 * @param timezone - IANA timezone (e.g., "America/New_York")
 * @param maxRetries - Maximum retry attempts on conflict
 * @returns Streak update result
 */
export async function updateUserStreak(
  userId: string,
  timezone: string = 'UTC',
  maxRetries: number = 3
): Promise<StreakUpdateResult> {
  // Generate unique request ID for idempotency tracking
  const requestId = uuidv4();
  
  let lastError: Error | null = null;
  
  // Retry loop for handling concurrent modifications
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Call atomic database function
      const { data, error } = await supabase.rpc('update_user_streak_atomic', {
        p_user_id: userId,
        p_timezone: timezone,
        p_request_id: requestId,
      });
      
      if (error) {
        // Check if it's a retryable error
        if (error.message.includes('Concurrent modification')) {
          lastError = new StreakError(
            'Concurrent update detected',
            'CONCURRENT_MODIFICATION',
            true
          );
          
          // Exponential backoff: 50ms, 100ms, 200ms
          const backoffMs = 50 * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
          continue; // Retry
        }
        
        // Non-retryable error
        throw new StreakError(
          `Streak update failed: ${error.message}`,
          'DATABASE_ERROR',
          false
        );
      }
      
      // Success! Return the result
      if (!data || data.length === 0) {
        throw new StreakError(
          'No data returned from streak update',
          'INVALID_RESPONSE',
          false
        );
      }
      
      const result = data[0];
      return {
        success: result.success,
        current_streak: result.current_streak,
        longest_streak: result.longest_streak,
        last_active_date: result.last_active_date,
        change_type: result.change_type,
        message: result.message,
      };
      
    } catch (error) {
      lastError = error as Error;
      
      // If it's a retryable error and we have attempts left, continue
      if (
        error instanceof StreakError &&
        error.retryable &&
        attempt < maxRetries
      ) {
        continue;
      }
      
      // Otherwise, throw immediately
      throw error;
    }
  }
  
  // All retries exhausted
  throw new StreakError(
    `Streak update failed after ${maxRetries} attempts: ${lastError?.message}`,
    'MAX_RETRIES_EXCEEDED',
    false
  );
}

/**
 * =====================================================
 * GET USER STREAK (Read-only, fast)
 * =====================================================
 */
export async function getUserStreak(userId: string): Promise<UserStreak> {
  const { data, error } = await supabase.rpc('get_user_streak', {
    p_user_id: userId,
  });
  
  if (error) {
    throw new StreakError(
      `Failed to fetch streak: ${error.message}`,
      'DATABASE_ERROR',
      false
    );
  }
  
  if (!data || data.length === 0) {
    // Return default for new users
    return {
      current_streak: 0,
      longest_streak: 0,
      last_active_date: null,
      timezone: 'UTC',
      is_active_today: false,
      days_since_activity: null,
    };
  }
  
  return data[0];
}

/**
 * =====================================================
 * GET STREAK LEADERBOARD
 * =====================================================
 */
export async function getStreakLeaderboard(
  limit: number = 100,
  offset: number = 0
): Promise<StreakLeaderboardEntry[]> {
  const { data, error } = await supabase.rpc('get_streak_leaderboard', {
    p_limit: limit,
    p_offset: offset,
  });
  
  if (error) {
    throw new StreakError(
      `Failed to fetch leaderboard: ${error.message}`,
      'DATABASE_ERROR',
      false
    );
  }
  
  return data || [];
}

/**
 * =====================================================
 * GET STREAK HISTORY (Audit log)
 * =====================================================
 */
export async function getStreakHistory(
  userId: string,
  limit: number = 50
): Promise<StreakHistoryEntry[]> {
  const { data, error } = await supabase
    .from('streak_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    throw new StreakError(
      `Failed to fetch history: ${error.message}`,
      'DATABASE_ERROR',
      false
    );
  }
  
  return data || [];
}

/**
 * =====================================================
 * UPDATE STREAK ON PROBLEM SOLVE (Main Integration Point)
 * =====================================================
 * 
 * Call this function whenever a user successfully solves a problem.
 * It will automatically:
 * - Detect timezone from user profile
 * - Update streak atomically
 * - Handle concurrency safely
 * - Return updated streak data
 */
export async function handleProblemSolved(userId: string): Promise<StreakUpdateResult> {
  try {
    // 1. Get user timezone preference
    const timezone = await getUserTimezone(userId);
    
    // 2. Update streak atomically
    const result = await updateUserStreak(userId, timezone);
    
    // 3. Optionally trigger real-time notification
    await notifyStreakUpdate(userId, result);
    
    return result;
    
  } catch (error) {
    console.error('[STREAK] Failed to update streak:', error);
    
    // Non-blocking: Don't fail the problem submission if streak update fails
    // Log to monitoring system instead
    await logStreakError(userId, error);
    
    // Return a safe fallback
    return {
      success: false,
      current_streak: 0,
      longest_streak: 0,
      last_active_date: new Date().toISOString().split('T')[0],
      change_type: 'STREAK_MAINTAINED',
      message: 'Streak update temporarily unavailable',
    };
  }
}

/**
 * =====================================================
 * HELPER: Get user timezone from profile
 * =====================================================
 */
async function getUserTimezone(userId: string): Promise<string> {
  // Try to get from user_streaks first (cached)
  const { data: streakData } = await supabase
    .from('user_streaks')
    .select('timezone')
    .eq('user_id', userId)
    .single();
  
  if (streakData?.timezone) {
    return streakData.timezone;
  }
  
  // Fallback: Get from user profile
  const { data: profileData } = await supabase
    .from('user_profiles')
    .select('timezone')
    .eq('user_id', userId)
    .single();
  
  // Default to UTC if not set
  return profileData?.timezone || 'UTC';
}

/**
 * =====================================================
 * HELPER: Notify streak update via Realtime
 * =====================================================
 */
async function notifyStreakUpdate(
  userId: string,
  result: StreakUpdateResult
): Promise<void> {
  try {
    // Broadcast to user's private channel
    const channel = supabase.channel(`user:${userId}:streaks`);
    
    await channel.send({
      type: 'broadcast',
      event: 'streak_updated',
      payload: {
        current_streak: result.current_streak,
        longest_streak: result.longest_streak,
        change_type: result.change_type,
        message: result.message,
      },
    });
    
  } catch (error) {
    // Non-critical: Log but don't throw
    console.warn('[STREAK] Failed to send realtime notification:', error);
  }
}

/**
 * =====================================================
 * HELPER: Log streak errors for monitoring
 * =====================================================
 */
async function logStreakError(userId: string, error: any): Promise<void> {
  try {
    // Log to error tracking system (e.g., Sentry, LogRocket)
    console.error('[STREAK ERROR]', {
      userId,
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString(),
    });
    
    // Optionally log to database for analytics
    await supabase.from('error_logs').insert({
      user_id: userId,
      error_type: 'STREAK_UPDATE_FAILED',
      error_message: error.message,
      error_code: error.code,
      metadata: { retryable: error.retryable },
    });
    
  } catch (logError) {
    // Ignore logging errors
    console.error('[STREAK] Failed to log error:', logError);
  }
}

/**
 * =====================================================
 * CACHE HELPER: Cache streak data in memory
 * =====================================================
 * 
 * For high-traffic scenarios, cache streak reads to reduce DB load.
 * Cache is invalidated on updates.
 */

const streakCache = new Map<string, { data: UserStreak; timestamp: number }>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

export async function getUserStreakCached(userId: string): Promise<UserStreak> {
  const cached = streakCache.get(userId);
  const now = Date.now();
  
  // Return cached data if still valid
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }
  
  // Fetch fresh data
  const data = await getUserStreak(userId);
  
  // Update cache
  streakCache.set(userId, { data, timestamp: now });
  
  return data;
}

/**
 * Invalidate cache after update
 */
export function invalidateStreakCache(userId: string): void {
  streakCache.delete(userId);
}

/**
 * =====================================================
 * TIMEZONE UTILITIES
 * =====================================================
 */

/**
 * Get list of common timezones for UI dropdown
 */
export const COMMON_TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
  { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Central European Time' },
  { value: 'Asia/Dubai', label: 'Dubai' },
  { value: 'Asia/Kolkata', label: 'India Standard Time' },
  { value: 'Asia/Shanghai', label: 'China Standard Time' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time' },
];

/**
 * Detect user timezone from browser
 */
export function detectUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

/**
 * =====================================================
 * EXPORTS
 * =====================================================
 */

export const StreakService = {
  // Core functions
  updateStreak: updateUserStreak,
  getStreak: getUserStreak,
  getStreakCached: getUserStreakCached,
  getLeaderboard: getStreakLeaderboard,
  getHistory: getStreakHistory,
  
  // Integration
  handleProblemSolved,
  
  // Utilities
  invalidateCache: invalidateStreakCache,
  detectTimezone: detectUserTimezone,
  
  // Constants
  COMMON_TIMEZONES,
};

export default StreakService;
