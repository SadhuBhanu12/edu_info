/**
 * Popup Script
 */

// Load and display stats
async function loadStats() {
  const { recentSubmissions = [] } = await chrome.storage.local.get(['recentSubmissions']);

  // Update counts
  const today = new Date().setHours(0, 0, 0, 0);
  const syncedToday = recentSubmissions.filter(
    sub => new Date(sub.timestamp).setHours(0, 0, 0, 0) === today
  ).length;

  document.getElementById('synced-count').textContent = syncedToday;
  document.getElementById('total-count').textContent = recentSubmissions.length;

  // Update status
  const statusDiv = document.getElementById('status');
  statusDiv.className = 'status active';
  statusDiv.innerHTML = `
    <span class="status-icon">✅</span>
    <div class="status-text">
      <div class="status-title">Active & Syncing</div>
      <div class="status-desc">Monitoring LeetCode submissions</div>
    </div>
  `;

  // Display recent submissions
  const submissionsList = document.getElementById('submissions-list');
  
  if (recentSubmissions.length === 0) {
    submissionsList.innerHTML = `
      <div class="empty-state">
        No submissions yet.<br>
        Solve problems on LeetCode to see them here!
      </div>
    `;
  } else {
    submissionsList.innerHTML = recentSubmissions
      .slice(0, 5)
      .map(sub => `
        <div class="submission-item">
          <div class="submission-title">✅ ${sub.title}</div>
          <div class="submission-time">${formatTime(sub.timestamp)}</div>
        </div>
      `)
      .join('');
  }
}

/**
 * Format timestamp
 */
function formatTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

/**
 * Open dashboard button
 */
document.getElementById('open-dashboard').addEventListener('click', () => {
  chrome.tabs.create({
    url: 'http://localhost:5173/course'
  });
});

// Load stats when popup opens
loadStats();

// Refresh every 5 seconds
setInterval(loadStats, 5000);
