# LeetCode Auto-Sync Extension Setup Guide

## Quick Start (3 minutes)

### Step 1: Generate Icon Files
1. Open `extension/generate-icons.html` in your browser
2. Click "Download All" button
3. Move the downloaded files to `extension/icons/` folder:
   - icon16.png
   - icon48.png
   - icon128.png

### Step 2: Install Extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `extension` folder from this project
5. ✅ Extension installed!

### Step 3: Get Extension ID
1. After loading, copy the Extension ID (looks like: `abcdefghijklmnopqrstuvwxyz123456`)
2. Open `src/services/leetCodeSync.ts`
3. Replace `'YOUR_EXTENSION_ID'` with your actual ID
4. Save the file

### Step 4: Test It
1. Start your dev server: `npm run dev`
2. Login to your DSA Tracker account
3. Click any LeetCode problem link from the platform
4. Solve the problem on LeetCode
5. Wait for "Accepted" status
6. Check your DSA Tracker dashboard - it should auto-update! ✨

## How It Works

The extension uses three sync methods:

### 1. Extension-Based Sync (Primary) ⭐
- Content script runs on LeetCode problem pages
- Detects when you get "Accepted" status
- Sends message to your open DSA Tracker tab
- Updates happen in real-time (2-5 seconds)

### 2. Visibility API Sync (Secondary)
- When you return to DSA Tracker tab
- Checks for any missed submissions
- Syncs from chrome.storage.local

### 3. LocalStorage Fallback (Backup)
- Manual tracking if extension not installed
- Uses browser localStorage
- Syncs every 5 seconds

## Features

### Real-Time Updates
- Detects submission within 2 seconds
- Updates dashboard automatically
- No page refresh needed

### Notifications
- Browser notification on completion
- Toast notification in app
- On-page overlay on LeetCode

### Data Persistence
- Stores last 100 submissions
- Syncs across browser sessions
- Works offline (queues updates)

### Smart Problem Mapping
- Maps LeetCode slugs to platform IDs
- Automatically categorizes topics
- Handles custom problem IDs

## Troubleshooting

### Extension not working?
1. Check if extension is enabled in `chrome://extensions/`
2. Verify Extension ID is correct in `leetCodeSync.ts`
3. Make sure you're logged in to DSA Tracker
4. Check browser console for errors

### Not detecting submissions?
1. Make sure you're on a LeetCode problem page
2. Wait for full "Accepted" status (green checkmark)
3. Check extension popup for recent submissions
4. Try reloading LeetCode page

### Dashboard not updating?
1. Verify you're logged in
2. Check if problem ID exists in platform
3. Look for toast notifications
4. Check browser console for sync errors

## Development

### Updating Content Script
Edit `extension/content.js` and reload extension in `chrome://extensions/`

### Updating Background Worker
Edit `extension/background.js` and reload extension

### Adding New Problem Mappings
Edit the `problemSlugMap` in `src/services/leetCodeSync.ts`:

```typescript
private problemSlugMap: Record<string, string> = {
  'two-sum': 'arr-1',
  'reverse-linked-list': 'll-2',
  // Add your mappings here
};
```

### Testing Sync Methods
```typescript
// Force extension sync
leetCodeSync.syncViaExtension('user123', callback);

// Force visibility sync
leetCodeSync.startVisibilitySync('user123', callback);

// Force localStorage sync
leetCodeSync.syncViaLocalStorage('user123', callback);
```

## Security

- Extension only runs on leetcode.com domains
- No external API calls
- No data collection
- All storage is local

## File Structure

```
extension/
├── manifest.json          # Extension config
├── content.js            # Runs on LeetCode pages
├── background.js         # Background service worker
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic
├── generate-icons.html   # Icon generator tool
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Next Steps

1. ✅ Generate and add icon files
2. ✅ Install extension in Chrome
3. ✅ Update extension ID in code
4. ✅ Test with a LeetCode problem
5. 🎉 Enjoy automatic sync!

## Support

If you encounter issues:
1. Check browser console (F12)
2. Check extension popup for status
3. Verify all setup steps completed
4. Try reloading extension

Happy coding! 🚀
