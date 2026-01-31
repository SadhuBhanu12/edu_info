/**
 * Content Script - Runs on LeetCode problem pages
 * Detects when user submits a solution successfully
 */

(function() {
  console.log('DSA Tracker Extension - Content Script Loaded');

  let lastSubmissionId = null;
  let checkInterval = null;

  /**
   * Start monitoring for successful submissions
   */
  function startMonitoring() {
    // Check every 2 seconds for new submissions
    checkInterval = setInterval(checkForSubmissions, 2000);
  }

  /**
   * Check for successful submissions
   */
  async function checkForSubmissions() {
    try {
      // Look for success notification elements
      const successElements = document.querySelectorAll('[class*="success"]');
      
      // Check for "Accepted" status
      const acceptedElement = Array.from(document.querySelectorAll('*')).find(
        el => el.textContent?.trim() === 'Accepted'
      );

      if (acceptedElement) {
        // Get problem details
        const problemTitle = getProblemTitle();
        const problemSlug = getProblemSlug();
        const submissionId = getSubmissionId();

        // Only process if it's a new submission
        if (submissionId && submissionId !== lastSubmissionId) {
          lastSubmissionId = submissionId;
          
          console.log('✅ Detected successful submission:', {
            title: problemTitle,
            slug: problemSlug,
            submissionId: submissionId
          });

          // Send to background script
          chrome.runtime.sendMessage({
            type: 'submission_success',
            data: {
              title: problemTitle,
              titleSlug: problemSlug,
              submissionId: submissionId,
              timestamp: Date.now(),
              statusDisplay: 'Accepted'
            }
          });

          // Show notification
          showSuccessNotification(problemTitle);
        }
      }
    } catch (error) {
      console.error('Error checking for submissions:', error);
    }
  }

  /**
   * Get problem title from page
   */
  function getProblemTitle() {
    const titleElement = document.querySelector('[class*="text-title"]') ||
                        document.querySelector('h1') ||
                        document.querySelector('[data-cy="question-title"]');
    return titleElement?.textContent?.trim() || 'Unknown Problem';
  }

  /**
   * Get problem slug from URL
   */
  function getProblemSlug() {
    const url = window.location.pathname;
    const match = url.match(/\/problems\/([^/]+)/);
    return match ? match[1] : '';
  }

  /**
   * Get submission ID (try to extract from page)
   */
  function getSubmissionId() {
    // Try to get from URL or page elements
    const url = window.location.href;
    const match = url.match(/submissions\/(\d+)/);
    if (match) return match[1];

    // Generate a unique ID based on timestamp
    return `sub_${Date.now()}`;
  }

  /**
   * Show success notification overlay
   */
  function showSuccessNotification(problemTitle) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(16, 185, 129, 0.4);
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      font-weight: 600;
      animation: slideIn 0.3s ease-out;
    `;
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="white" opacity="0.2"/>
          <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <div>
          <div style="font-weight: 700;">Synced to DSA Tracker!</div>
          <div style="font-size: 12px; opacity: 0.9; margin-top: 2px;">${problemTitle}</div>
        </div>
      </div>
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.transition = 'all 0.3s ease-out';
      notification.style.transform = 'translateX(400px)';
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  /**
   * Monitor for navigation changes (SPA)
   */
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      // Reset monitoring when page changes
      if (checkInterval) {
        clearInterval(checkInterval);
      }
      if (url.includes('/problems/')) {
        lastSubmissionId = null;
        startMonitoring();
      }
    }
  }).observe(document, { subtree: true, childList: true });

  // Start monitoring immediately
  startMonitoring();

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'ping') {
      sendResponse({ status: 'ok' });
    }
  });
})();
