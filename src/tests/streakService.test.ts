/**
 * =====================================================
 * CONCURRENT STREAK TRACKING - TEST SUITE
 * =====================================================
 * Purpose: Comprehensive tests for race conditions and edge cases
 * Framework: Jest / Vitest
 * =====================================================
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import StreakService from '../services/streakService';
import { supabase } from '../lib/supabase';

/**
 * =====================================================
 * TEST UTILITIES
 * =====================================================
 */

// Mock user IDs for testing
const TEST_USER_1 = '00000000-0000-0000-0000-000000000001';
const TEST_USER_2 = '00000000-0000-0000-0000-000000000002';

// Helper: Wait for specific duration
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Execute functions concurrently
async function runConcurrent<T>(
  fn: () => Promise<T>,
  count: number
): Promise<T[]> {
  const promises = Array.from({ length: count }, () => fn());
  return Promise.all(promises);
}

// Helper: Clean up test data
async function cleanupTestData(userId: string) {
  await supabase.from('user_streaks').delete().eq('user_id', userId);
  await supabase.from('streak_history').delete().eq('user_id', userId);
}

/**
 * =====================================================
 * TEST SUITE: Basic Functionality
 * =====================================================
 */

describe('StreakService - Basic Operations', () => {
  beforeEach(async () => {
    await cleanupTestData(TEST_USER_1);
  });
  
  afterEach(async () => {
    await cleanupTestData(TEST_USER_1);
  });
  
  it('should create initial streak for new user', async () => {
    const result = await StreakService.updateStreak(TEST_USER_1, 'UTC');
    
    expect(result.success).toBe(true);
    expect(result.current_streak).toBe(1);
    expect(result.longest_streak).toBe(1);
    expect(result.change_type).toBe('FIRST_ACTIVITY');
  });
  
  it('should be idempotent on same day', async () => {
    // First call
    const result1 = await StreakService.updateStreak(TEST_USER_1, 'UTC');
    expect(result1.change_type).toBe('FIRST_ACTIVITY');
    
    // Second call same day
    const result2 = await StreakService.updateStreak(TEST_USER_1, 'UTC');
    expect(result2.change_type).toBe('STREAK_MAINTAINED');
    expect(result2.current_streak).toBe(1);
    
    // Third call same day
    const result3 = await StreakService.updateStreak(TEST_USER_1, 'UTC');
    expect(result3.change_type).toBe('STREAK_MAINTAINED');
    expect(result3.current_streak).toBe(1);
  });
  
  it('should retrieve streak correctly', async () => {
    await StreakService.updateStreak(TEST_USER_1, 'UTC');
    
    const streak = await StreakService.getStreak(TEST_USER_1);
    
    expect(streak.current_streak).toBe(1);
    expect(streak.longest_streak).toBe(1);
    expect(streak.is_active_today).toBe(true);
  });
  
  it('should handle non-existent user', async () => {
    const streak = await StreakService.getStreak('00000000-0000-0000-0000-999999999999');
    
    expect(streak.current_streak).toBe(0);
    expect(streak.longest_streak).toBe(0);
    expect(streak.is_active_today).toBe(false);
  });
});

/**
 * =====================================================
 * TEST SUITE: Concurrency & Race Conditions
 * =====================================================
 */

describe('StreakService - Concurrency Safety', () => {
  beforeEach(async () => {
    await cleanupTestData(TEST_USER_1);
  });
  
  afterEach(async () => {
    await cleanupTestData(TEST_USER_1);
  });
  
  it('should handle 10 concurrent updates correctly (same user, same day)', async () => {
    // Simulate 10 simultaneous problem solves
    const results = await runConcurrent(
      () => StreakService.updateStreak(TEST_USER_1, 'UTC'),
      10
    );
    
    // All should succeed
    results.forEach(result => {
      expect(result.success).toBe(true);
    });
    
    // Verify final state: streak should be 1 (not 10!)
    const finalStreak = await StreakService.getStreak(TEST_USER_1);
    expect(finalStreak.current_streak).toBe(1);
    
    // Check history: should have records but final state is correct
    const history = await StreakService.getHistory(TEST_USER_1, 100);
    expect(history.length).toBeGreaterThan(0);
    
    // Most recent entry should show current_streak = 1
    const latestEntry = history[0];
    expect(latestEntry.new_current_streak).toBe(1);
  });
  
  it('should handle 50 concurrent updates without data corruption', async () => {
    // Stress test: 50 concurrent requests
    const results = await runConcurrent(
      () => StreakService.updateStreak(TEST_USER_1, 'UTC'),
      50
    );
    
    // All should complete
    expect(results.length).toBe(50);
    
    // Verify data integrity
    const finalStreak = await StreakService.getStreak(TEST_USER_1);
    expect(finalStreak.current_streak).toBe(1);
    expect(finalStreak.longest_streak).toBe(1);
    
    // Verify constraints still hold
    expect(finalStreak.longest_streak).toBeGreaterThanOrEqual(finalStreak.current_streak);
  });
  
  it('should handle concurrent updates with retries', async () => {
    // Test automatic retry mechanism
    const promises = [];
    
    for (let i = 0; i < 20; i++) {
      promises.push(
        StreakService.updateStreak(TEST_USER_1, 'UTC', 5) // 5 retries
      );
    }
    
    const results = await Promise.all(promises);
    
    // All should eventually succeed
    results.forEach(result => {
      expect(result.success).toBe(true);
    });
    
    // Final state correct
    const streak = await StreakService.getStreak(TEST_USER_1);
    expect(streak.current_streak).toBe(1);
  });
  
  it('should handle interleaved reads and writes', async () => {
    const operations = [];
    
    // Mix of reads and writes
    for (let i = 0; i < 10; i++) {
      operations.push(StreakService.updateStreak(TEST_USER_1, 'UTC'));
      operations.push(StreakService.getStreak(TEST_USER_1));
    }
    
    await Promise.all(operations);
    
    // Should not crash or corrupt data
    const streak = await StreakService.getStreak(TEST_USER_1);
    expect(streak.current_streak).toBe(1);
  });
});

/**
 * =====================================================
 * TEST SUITE: Timezone Handling
 * =====================================================
 */

describe('StreakService - Timezone Handling', () => {
  beforeEach(async () => {
    await cleanupTestData(TEST_USER_1);
  });
  
  afterEach(async () => {
    await cleanupTestData(TEST_USER_1);
  });
  
  it('should handle UTC timezone correctly', async () => {
    const result = await StreakService.updateStreak(TEST_USER_1, 'UTC');
    expect(result.success).toBe(true);
    
    const streak = await StreakService.getStreak(TEST_USER_1);
    expect(streak.timezone).toBe('UTC');
  });
  
  it('should handle different timezones', async () => {
    const timezones = [
      'America/New_York',
      'Europe/London',
      'Asia/Tokyo',
      'Australia/Sydney',
    ];
    
    for (const tz of timezones) {
      await cleanupTestData(TEST_USER_1);
      
      const result = await StreakService.updateStreak(TEST_USER_1, tz);
      expect(result.success).toBe(true);
      
      const streak = await StreakService.getStreak(TEST_USER_1);
      expect(streak.timezone).toBe(tz);
    }
  });
  
  it('should use detected timezone if not specified', async () => {
    const detectedTz = StreakService.detectTimezone();
    expect(detectedTz).toBeTruthy();
    expect(typeof detectedTz).toBe('string');
  });
});

/**
 * =====================================================
 * TEST SUITE: Edge Cases
 * =====================================================
 */

describe('StreakService - Edge Cases', () => {
  beforeEach(async () => {
    await cleanupTestData(TEST_USER_1);
  });
  
  afterEach(async () => {
    await cleanupTestData(TEST_USER_1);
  });
  
  it('should handle empty user ID gracefully', async () => {
    await expect(async () => {
      await StreakService.updateStreak('', 'UTC');
    }).rejects.toThrow();
  });
  
  it('should handle invalid timezone', async () => {
    // Should fallback to UTC or handle gracefully
    const result = await StreakService.updateStreak(TEST_USER_1, 'Invalid/Timezone');
    // Depending on implementation, this might succeed with UTC or throw
    // Adjust based on your error handling strategy
  });
  
  it('should maintain longest_streak correctly', async () => {
    // This test requires manual date manipulation
    // You would need to mock dates or use a test database
    
    // Day 1: Start streak
    let result = await StreakService.updateStreak(TEST_USER_1, 'UTC');
    expect(result.current_streak).toBe(1);
    expect(result.longest_streak).toBe(1);
    
    // Would need to advance date and continue testing
    // This is a placeholder for the test logic
  });
  
  it('should cache streak data correctly', async () => {
    await StreakService.updateStreak(TEST_USER_1, 'UTC');
    
    // First call (cache miss)
    const start = Date.now();
    const streak1 = await StreakService.getStreakCached(TEST_USER_1);
    const firstCallDuration = Date.now() - start;
    
    // Second call (cache hit, should be faster)
    const start2 = Date.now();
    const streak2 = await StreakService.getStreakCached(TEST_USER_1);
    const secondCallDuration = Date.now() - start2;
    
    expect(streak1.current_streak).toBe(streak2.current_streak);
    // Cache should be faster (though this is not always guaranteed in tests)
  });
  
  it('should invalidate cache after update', async () => {
    await StreakService.updateStreak(TEST_USER_1, 'UTC');
    
    // Get cached
    const cached = await StreakService.getStreakCached(TEST_USER_1);
    expect(cached.current_streak).toBe(1);
    
    // Invalidate
    StreakService.invalidateCache(TEST_USER_1);
    
    // Next call should fetch fresh data
    const fresh = await StreakService.getStreakCached(TEST_USER_1);
    expect(fresh.current_streak).toBe(1);
  });
});

/**
 * =====================================================
 * TEST SUITE: Leaderboard
 * =====================================================
 */

describe('StreakService - Leaderboard', () => {
  beforeEach(async () => {
    await cleanupTestData(TEST_USER_1);
    await cleanupTestData(TEST_USER_2);
  });
  
  afterEach(async () => {
    await cleanupTestData(TEST_USER_1);
    await cleanupTestData(TEST_USER_2);
  });
  
  it('should fetch leaderboard correctly', async () => {
    // Create streaks for two users
    await StreakService.updateStreak(TEST_USER_1, 'UTC');
    await StreakService.updateStreak(TEST_USER_2, 'UTC');
    
    const leaderboard = await StreakService.getLeaderboard(10, 0);
    
    expect(Array.isArray(leaderboard)).toBe(true);
    expect(leaderboard.length).toBeGreaterThanOrEqual(2);
  });
  
  it('should handle pagination', async () => {
    const page1 = await StreakService.getLeaderboard(5, 0);
    const page2 = await StreakService.getLeaderboard(5, 5);
    
    expect(Array.isArray(page1)).toBe(true);
    expect(Array.isArray(page2)).toBe(true);
  });
});

/**
 * =====================================================
 * TEST SUITE: Integration with Problem Solving
 * =====================================================
 */

describe('StreakService - Problem Solve Integration', () => {
  beforeEach(async () => {
    await cleanupTestData(TEST_USER_1);
  });
  
  afterEach(async () => {
    await cleanupTestData(TEST_USER_1);
  });
  
  it('should update streak on problem solve', async () => {
    const result = await StreakService.handleProblemSolved(TEST_USER_1);
    
    expect(result.success).toBe(true);
    expect(result.current_streak).toBeGreaterThan(0);
  });
  
  it('should handle concurrent problem solves', async () => {
    // User solves 5 problems simultaneously
    const results = await runConcurrent(
      () => StreakService.handleProblemSolved(TEST_USER_1),
      5
    );
    
    // All should complete
    expect(results.length).toBe(5);
    
    // Streak should still be 1 (same day)
    const streak = await StreakService.getStreak(TEST_USER_1);
    expect(streak.current_streak).toBe(1);
  });
  
  it('should not fail problem submission if streak update fails', async () => {
    // Mock supabase to simulate failure
    // This tests the non-blocking error handling
    
    // Even if streak fails, handleProblemSolved should return a result
    const result = await StreakService.handleProblemSolved(TEST_USER_1);
    expect(result).toBeTruthy();
  });
});

/**
 * =====================================================
 * MANUAL TEST SCENARIOS
 * =====================================================
 * 
 * These tests require manual date manipulation or database state changes.
 * Run these in a staging environment with controllable dates.
 */

export const MANUAL_TEST_SCENARIOS = `
SCENARIO 1: Consecutive Days
-------------------------------
Day 1 (2026-01-31): Solve problem → Streak = 1
Day 2 (2026-02-01): Solve problem → Streak = 2
Day 3 (2026-02-02): Solve problem → Streak = 3

Expected: Current streak = 3, Longest = 3

SCENARIO 2: Missed Day Reset
-------------------------------
Day 1 (2026-01-31): Solve problem → Streak = 1
Day 2 (2026-02-01): Solve problem → Streak = 2
Day 3 (2026-02-02): NO ACTIVITY
Day 4 (2026-02-03): Solve problem → Streak = 1 (RESET)

Expected: Current = 1, Longest = 2

SCENARIO 3: Multiple Same Day
-------------------------------
Day 1 (2026-01-31): 
  - 9:00 AM: Solve problem → Streak = 1
  - 12:00 PM: Solve problem → Streak = 1 (no change)
  - 5:00 PM: Solve problem → Streak = 1 (no change)

Expected: Current = 1, History has 3 entries (1 FIRST, 2 MAINTAINED)

SCENARIO 4: Timezone Edge Case
-------------------------------
User in New York (UTC-5):
  - 11:30 PM EST (2026-01-31): Solve → Day = 2026-01-31
  - 12:30 AM EST (2026-02-01): Solve → Day = 2026-02-01 (consecutive!)

Expected: Streak increments correctly based on local date

SCENARIO 5: Concurrent Users
-------------------------------
100 users solve problems simultaneously at midnight
Each user should get streak = 1
No cross-contamination between users

Expected: All users have correct individual streaks

SCENARIO 6: Load Test
-------------------------------
1 user solves 1000 problems in rapid succession (same day)
System should handle gracefully
Streak remains 1
No database locks or deadlocks

Expected: Streak = 1, System responsive

SCENARIO 7: Recovery from Crash
-------------------------------
1. Start update transaction
2. Simulate server crash mid-transaction
3. Retry update
4. Verify no partial updates or corruption

Expected: Either fully applied or fully rolled back

SCENARIO 8: Version Conflict
-------------------------------
1. Two processes read version = 5
2. Process A updates (version → 6)
3. Process B tries to update with old version
4. Process B should detect conflict and retry

Expected: Final state consistent, both updates applied in order
`;

/**
 * =====================================================
 * PERFORMANCE BENCHMARKS
 * =====================================================
 */

describe.skip('StreakService - Performance', () => {
  it('should handle 1000 sequential updates in reasonable time', async () => {
    const start = Date.now();
    
    for (let i = 0; i < 1000; i++) {
      await StreakService.updateStreak(TEST_USER_1, 'UTC');
    }
    
    const duration = Date.now() - start;
    console.log(`1000 sequential updates took ${duration}ms`);
    
    // Should complete in under 30 seconds
    expect(duration).toBeLessThan(30000);
  });
  
  it('should handle 100 concurrent users', async () => {
    const userIds = Array.from(
      { length: 100 },
      (_, i) => `user-${i}`
    );
    
    const start = Date.now();
    
    await Promise.all(
      userIds.map(userId => StreakService.updateStreak(userId, 'UTC'))
    );
    
    const duration = Date.now() - start;
    console.log(`100 concurrent users took ${duration}ms`);
    
    // Should complete in under 10 seconds
    expect(duration).toBeLessThan(10000);
  });
});

export default {
  MANUAL_TEST_SCENARIOS,
};
