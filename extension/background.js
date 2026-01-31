/**
 * Background Service Worker
 * Handles communication between content script and our web app
 */

// Store recent submissions
let recentSubmissions = [];
const MAX_SUBMISSIONS = 100;

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);

  switch (request.type) {
    case 'submission_success':
      handleSubmissionSuccess(request.data);
      sendResponse({ status: 'recorded' });
      break;

    case 'getRecentSubmissions':
      sendResponse({ submissions: recentSubmissions });
      break;

    case 'ping':
      sendResponse({ status: 'ok' });
      break;

    default:
      sendResponse({ status: 'unknown_command' });
  }

  return true; // Keep message channel open
});

/**
 * Handle successful submission
 */
function handleSubmissionSuccess(data) {
  console.log('Recording submission:', data);

  // Add to recent submissions
  recentSubmissions.unshift(data);

  // Keep only recent ones
  if (recentSubmissions.length > MAX_SUBMISSIONS) {
    recentSubmissions = recentSubmissions.slice(0, MAX_SUBMISSIONS);
  }

  // Store in chrome.storage
  chrome.storage.local.set({ recentSubmissions: recentSubmissions });

  // Try to sync with our web app (if it's open)
  syncWithWebApp(data);

  // Show notification
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: '🎉 Problem Solved!',
    message: `${data.title} synced to DSA Tracker`,
    priority: 2
  });
}

/**
 * Sync with our web app
 */
async function syncWithWebApp(data) {
  try {
    // Find our app's tab
    const tabs = await chrome.tabs.query({
      url: ['http://localhost:*/*', 'https://yourdomain.com/*']
    });

    if (tabs.length > 0) {
      // Send message to our app
      tabs.forEach(tab => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            type: 'leetcode_submission',
            data: data
          });
        }
      });
    } else {
      // Store for later sync
      console.log('DSA Tracker not open, will sync later');
    }
  } catch (error) {
    console.error('Error syncing with web app:', error);
  }
}

/**
 * Load stored submissions on startup
 */
chrome.storage.local.get(['recentSubmissions'], (result) => {
  if (result.recentSubmissions) {
    recentSubmissions = result.recentSubmissions;
    console.log(`Loaded ${recentSubmissions.length} stored submissions`);
  }
});

/**
 * Listen for extension installation
 */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('DSA Tracker Extension installed!');
    
    // Open welcome page
    chrome.tabs.create({
      url: 'http://localhost:5173/course'
    });
  }
});
