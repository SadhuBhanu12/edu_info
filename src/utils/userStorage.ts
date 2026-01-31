/**
 * Enterprise-grade user-scoped storage
 * Used by companies like Google, Netflix, Facebook
 * 
 * Key Features:
 * 1. User ID scoping - Each user has isolated storage
 * 2. Automatic cleanup on logout
 * 3. Type-safe operations
 * 4. Prevents data leakage between users
 */

/**
 * Get user-scoped storage key
 * Format: app:userId:keyName
 */
const getUserKey = (userId: string | undefined, key: string): string => {
  if (!userId) {
    throw new Error('Cannot access storage without user ID');
  }
  return `eduinfo:${userId}:${key}`;
};

/**
 * Store data for current user only
 */
export const setUserData = <T>(userId: string | undefined, key: string, value: T): void => {
  if (!userId) {
    console.warn('⚠️ Cannot save data without user ID');
    return;
  }
  try {
    const scopedKey = getUserKey(userId, key);
    localStorage.setItem(scopedKey, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

/**
 * Get data for current user only
 */
export const getUserData = <T>(userId: string | undefined, key: string, defaultValue: T): T => {
  if (!userId) {
    return defaultValue;
  }
  try {
    const scopedKey = getUserKey(userId, key);
    const item = localStorage.getItem(scopedKey);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading user data:', error);
    return defaultValue;
  }
};

/**
 * Remove specific key for current user
 */
export const removeUserData = (userId: string | undefined, key: string): void => {
  if (!userId) return;
  try {
    const scopedKey = getUserKey(userId, key);
    localStorage.removeItem(scopedKey);
  } catch (error) {
    console.error('Error removing user data:', error);
  }
};

/**
 * Clear ALL data for a specific user
 * Called on logout to prevent data leakage
 */
export const clearUserData = (userId: string | undefined): void => {
  if (!userId) return;
  
  try {
    const prefix = `eduinfo:${userId}:`;
    const keysToRemove: string[] = [];
    
    // Find all keys for this user
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    
    // Remove all user-specific keys
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log(`🧹 Cleared ${keysToRemove.length} storage items for user ${userId}`);
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

/**
 * Clear ALL app data (used for complete reset)
 * DANGEROUS: Only use for full logout or troubleshooting
 */
export const clearAllAppData = (): void => {
  try {
    const keysToRemove: string[] = [];
    
    // Find all app keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('eduinfo:')) {
        keysToRemove.push(key);
      }
    }
    
    // Remove all app keys (preserves Supabase auth)
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log(`🧹 Cleared ${keysToRemove.length} total app storage items`);
  } catch (error) {
    console.error('Error clearing app data:', error);
  }
};

/**
 * Get storage stats for debugging
 */
export const getStorageStats = (userId: string | undefined) => {
  if (!userId) return { count: 0, keys: [] };
  
  const prefix = `eduinfo:${userId}:`;
  const userKeys: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      userKeys.push(key.replace(prefix, ''));
    }
  }
  
  return {
    count: userKeys.length,
    keys: userKeys
  };
};
