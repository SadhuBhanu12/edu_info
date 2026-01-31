import { useEffect } from 'react';
import { useProgress } from '../context/ProgressContext';
import { leetCodeSync } from '../services/leetCodeSync';

/**
 * LeetCode Sync Provider Component
 * Wraps the app and provides automatic LeetCode sync functionality
 */
export function LeetCodeSyncProvider({ children }: { children: React.ReactNode }) {
  const { updateProblemStatus } = useProgress();

  useEffect(() => {
    // Get user ID from auth
    const userId = localStorage.getItem('user_id') || 'default-user';

    // Request notification permission
    leetCodeSync.requestNotificationPermission();

    // Start auto-sync with callback
    leetCodeSync.startAutoSync(userId, (problemId: string, status: string) => {
      console.log(`🔄 LeetCode Sync: Updating ${problemId} to ${status}`);
      updateProblemStatus(problemId, status as any);
    });

    // Listen for messages from browser extension
    const handleExtensionMessage = (event: MessageEvent) => {
      if (event.data.type === 'leetcode_submission' && event.data.data) {
        const { titleSlug, statusDisplay } = event.data.data;
        
        if (statusDisplay === 'Accepted') {
          // Map LeetCode slug to our problem ID
          const problemId = mapLeetCodeSlug(titleSlug);
          
          if (problemId) {
            console.log(`✅ LeetCode Extension: Problem ${titleSlug} solved!`);
            updateProblemStatus(problemId, 'solved');
            
            // Show success notification
            showSuccessToast(event.data.data.title);
          }
        }
      }
    };

    window.addEventListener('message', handleExtensionMessage);

    // Listen for manual problem solve events
    const handleManualSolve = (event: CustomEvent) => {
      const { problemId } = event.detail;
      updateProblemStatus(problemId, 'solved');
      console.log(`✅ Manual solve: ${problemId}`);
    };

    window.addEventListener('leetcode-problem-solved', handleManualSolve as EventListener);

    // Cleanup on unmount
    return () => {
      leetCodeSync.stopAutoSync();
      window.removeEventListener('message', handleExtensionMessage);
      window.removeEventListener('leetcode-problem-solved', handleManualSolve as EventListener);
    };
  }, [updateProblemStatus]);

  return <>{children}</>;
}

/**
 * Map LeetCode problem slug to our problem ID
 */
function mapLeetCodeSlug(slug: string): string | null {
  // Common mappings - extend this based on your data
  const mappings: Record<string, string> = {
    'two-sum': 'arr-1',
    'best-time-to-buy-and-sell-stock': 'arr-2',
    'contains-duplicate': 'arr-3',
    'product-of-array-except-self': 'arr-4',
    'maximum-subarray': 'arr-5',
    'maximum-product-subarray': 'arr-6',
    'find-minimum-in-rotated-sorted-array': 'arr-7',
    'search-in-rotated-sorted-array': 'arr-8',
    '3sum': 'arr-9',
    'container-with-most-water': 'arr-10',
    // Add more mappings as needed
  };

  return mappings[slug] || null;
}

/**
 * Show success toast notification
 */
function showSuccessToast(problemTitle: string) {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'leetcode-sync-toast';
  toast.innerHTML = `
    <div class="toast-content">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <div>
        <div class="toast-title">🎉 Synced from LeetCode!</div>
        <div class="toast-message">${problemTitle} marked as solved</div>
      </div>
    </div>
  `;

  // Add styles if not already added
  if (!document.getElementById('leetcode-sync-styles')) {
    const style = document.createElement('style');
    style.id = 'leetcode-sync-styles';
    style.textContent = `
      .leetcode-sync-toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(16, 185, 129, 0.4);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out, fadeOut 0.3s ease-out 4.7s;
        min-width: 320px;
      }

      .toast-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .toast-content svg {
        flex-shrink: 0;
      }

      .toast-title {
        font-weight: 700;
        font-size: 14px;
        margin-bottom: 2px;
      }

      .toast-message {
        font-size: 12px;
        opacity: 0.9;
      }

      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes fadeOut {
        to {
          opacity: 0;
          transform: translateX(400px);
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);

  // Remove after 5 seconds
  setTimeout(() => {
    toast.remove();
  }, 5000);
}
