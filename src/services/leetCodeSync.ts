/**
 * LeetCode Auto-Sync Service
 * Automatically syncs problem completion from LeetCode to our platform
 */

interface LeetCodeSubmission {
  id: string;
  title: string;
  titleSlug: string;
  timestamp: number;
  statusDisplay: string;
  lang: string;
}

class LeetCodeSyncService {
  private syncInterval: number = 30000; // 30 seconds
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  /**
   * Start automatic sync with LeetCode
   */
  startAutoSync(userId: string, onUpdate: (problemId: string, status: string) => void) {
    if (this.isRunning) {
      console.log('Auto-sync already running');
      return;
    }

    this.isRunning = true;
    console.log('Starting LeetCode auto-sync...');

    // Initial sync
    this.syncRecentSubmissions(userId, onUpdate);

    // Set up interval for periodic sync
    this.intervalId = setInterval(() => {
      this.syncRecentSubmissions(userId, onUpdate);
    }, this.syncInterval);
  }

  /**
   * Stop automatic sync
   */
  stopAutoSync() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('LeetCode auto-sync stopped');
  }

  /**
   * Sync recent submissions from LeetCode
   * This uses browser extension or API polling
   */
  private async syncRecentSubmissions(
    userId: string,
    onUpdate: (problemId: string, status: string) => void
  ) {
    try {
      // Check if browser extension is installed
      const hasExtension = await this.checkExtensionInstalled();

      if (hasExtension) {
        // Use browser extension method
        await this.syncViaExtension(userId, onUpdate);
      } else {
        // Use fallback method (check localStorage for manual sync)
        await this.syncViaLocalStorage(userId, onUpdate);
      }
    } catch (error) {
      console.error('Error syncing LeetCode submissions:', error);
    }
  }

  /**
   * Check if browser extension is installed
   */
  private async checkExtensionInstalled(): Promise<boolean> {
    return new Promise((resolve) => {
      // Check if extension message listener exists
      if (window.chrome && window.chrome.runtime) {
        window.chrome.runtime.sendMessage(
          'YOUR_EXTENSION_ID',
          { type: 'ping' },
          (response) => {
            resolve(!!response);
          }
        );
      } else {
        resolve(false);
      }
    });
  }

  /**
   * Sync via browser extension
   */
  private async syncViaExtension(
    userId: string,
    onUpdate: (problemId: string, status: string) => void
  ) {
    return new Promise((resolve, reject) => {
      if (!window.chrome || !window.chrome.runtime) {
        reject(new Error('Chrome extension API not available'));
        return;
      }

      // Request recent submissions from extension
      window.chrome.runtime.sendMessage(
        'YOUR_EXTENSION_ID',
        {
          type: 'getRecentSubmissions',
          userId: userId,
        },
        (response) => {
          if (response && response.submissions) {
            this.processSubmissions(response.submissions, onUpdate);
            resolve(response);
          } else {
            reject(new Error('No submissions received'));
          }
        }
      );
    });
  }

  /**
   * Sync via localStorage (fallback method)
   * Checks for manually tracked completions
   */
  private async syncViaLocalStorage(
    _userId: string,
    onUpdate: (problemId: string, status: string) => void
  ) {
    try {
      const syncData = localStorage.getItem('leetcode_sync_data');
      if (!syncData) return;

      const data = JSON.parse(syncData);
      const lastSyncTime = localStorage.getItem('last_leetcode_sync') || '0';

      // Process new submissions since last sync
      if (data.submissions) {
        const newSubmissions = data.submissions.filter(
          (sub: any) => sub.timestamp > parseInt(lastSyncTime)
        );

        this.processSubmissions(newSubmissions, onUpdate);
        localStorage.setItem('last_leetcode_sync', Date.now().toString());
      }
    } catch (error) {
      console.error('Error in localStorage sync:', error);
    }
  }

  /**
   * Process submissions and update our platform
   */
  private processSubmissions(
    submissions: LeetCodeSubmission[],
    onUpdate: (problemId: string, status: string) => void
  ) {
    submissions.forEach((submission) => {
      if (submission.statusDisplay === 'Accepted') {
        // Map LeetCode problem to our problem ID
        const ourProblemId = this.mapLeetCodeToOurId(submission.titleSlug);

        if (ourProblemId) {
          console.log(`✅ Auto-synced: ${submission.title} - Accepted`);
          onUpdate(ourProblemId, 'solved');

          // Show notification
          this.showNotification(
            '🎉 LeetCode Sync',
            `${submission.title} marked as solved!`
          );
        }
      }
    });
  }

  /**
   * Map LeetCode problem slug to our problem ID
   */
  private mapLeetCodeToOurId(titleSlug: string): string | null {
    // This mapping should match your striverSheet data
    const mapping: Record<string, string> = {
      'two-sum': 'arr-1',
      'best-time-to-buy-and-sell-stock': 'arr-2',
      'contains-duplicate': 'arr-3',
      'product-of-array-except-self': 'arr-4',
      'maximum-subarray': 'arr-5',
      // Add more mappings as needed
    };

    return mapping[titleSlug] || null;
  }

  /**
   * Show browser notification
   */
  private showNotification(title: string, message: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/vite.svg',
        badge: '/vite.svg',
      });
    }
  }

  /**
   * Request notification permission
   */
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  /**
   * Manual sync trigger - opens LeetCode in new tab and tracks
   */
  openLeetCodeProblem(problemUrl: string, problemId: string) {
    // Store tracking info
    localStorage.setItem('tracking_problem', JSON.stringify({
      problemId: problemId,
      url: problemUrl,
      timestamp: Date.now(),
    }));

    // Open in new tab
    window.open(problemUrl, '_blank');

    // Set up listener for when tab becomes active again
    this.setupVisibilityListener(problemId);
  }

  /**
   * Listen for when user returns to our tab after solving
   */
  private setupVisibilityListener(problemId: string) {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // User came back to our tab
        setTimeout(() => {
          // Check if they want to mark as solved
          const shouldMark = window.confirm(
            'Did you solve this problem on LeetCode? Click OK to mark as solved.'
          );

          if (shouldMark) {
            const trackingData = localStorage.getItem('tracking_problem');
            if (trackingData) {
              const data = JSON.parse(trackingData);
              if (data.problemId === problemId) {
                // Trigger update
                window.dispatchEvent(
                  new CustomEvent('leetcode-problem-solved', {
                    detail: { problemId: problemId },
                  })
                );
                localStorage.removeItem('tracking_problem');
              }
            }
          }
        }, 1000);

        // Remove listener after first trigger
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
  }
}

// Export singleton instance
export const leetCodeSync = new LeetCodeSyncService();

// Global type declaration for Chrome extension
declare global {
  interface Window {
    chrome?: {
      runtime?: {
        sendMessage: (
          extensionId: string,
          message: any,
          callback?: (response: any) => void
        ) => void;
      };
    };
  }
}
