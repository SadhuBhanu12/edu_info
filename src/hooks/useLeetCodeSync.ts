import { useEffect, useCallback } from 'react';
import { useProgress } from '../context/ProgressContext';
import { leetCodeSync } from '../services/leetCodeSync';

/**
 * Custom hook for LeetCode auto-sync functionality
 */
export function useLeetCodeSync() {
  const { updateProblemStatus } = useProgress();

  /**
   * Handle problem update from LeetCode sync
   */
  const handleProblemUpdate = useCallback(
    (problemId: string, status: string) => {
      console.log(`Updating problem ${problemId} to ${status}`);
      
      // Update problem status directly - the updateProblemStatus function
      // will determine the topic from the problem ID
      updateProblemStatus(problemId, status as any);
    },
    [updateProblemStatus]
  );

  /**
   * Start auto-sync when component mounts
   */
  useEffect(() => {
    const userId = localStorage.getItem('user_id') || 'default-user';

    // Request notification permission
    leetCodeSync.requestNotificationPermission();

    // Start auto-sync
    leetCodeSync.startAutoSync(userId, handleProblemUpdate);

    // Listen for manual problem solved events
    const handleManualSolve = (event: CustomEvent) => {
      const { problemId } = event.detail;
      handleProblemUpdate(problemId, 'solved');
    };

    window.addEventListener('leetcode-problem-solved', handleManualSolve as EventListener);

    // Cleanup on unmount
    return () => {
      leetCodeSync.stopAutoSync();
      window.removeEventListener('leetcode-problem-solved', handleManualSolve as EventListener);
    };
  }, [handleProblemUpdate]);

  /**
   * Open LeetCode problem and track completion
   */
  const openAndTrackProblem = useCallback((problemUrl: string, problemId: string) => {
    leetCodeSync.openLeetCodeProblem(problemUrl, problemId);
  }, []);

  return {
    openAndTrackProblem,
  };
}
