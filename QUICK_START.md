# 🎬 Quick Start - Visual Guide

## Step 1: Generate Extension Icons (1 minute)

```
📂 Open file: extension/generate-icons.html
🌐 In your browser
🖱️  Click "Download All" button
📁 Move files to: extension/icons/
   ├── icon16.png
   ├── icon48.png
   └── icon128.png
```

---

## Step 2: Install Chrome Extension (1 minute)

```
🌐 Open Chrome
📍 Go to: chrome://extensions/
🔧 Enable "Developer mode" (top-right toggle)
➕ Click "Load unpacked"
📂 Select folder: extension/
✅ Extension installed!
```

**You'll see:**
```
┌─────────────────────────────────────┐
│ DSA Tracker - LeetCode Sync         │
│ ID: abcd...xyz (copy this!)         │
│ ✓ Enabled                           │
└─────────────────────────────────────┘
```

---

## Step 3: Configure Extension ID (30 seconds)

```javascript
// Open: src/services/leetCodeSync.ts
// Find line 219:

private extensionId = 'YOUR_EXTENSION_ID';

// Replace with:

private extensionId = 'abcdefg...xyz123'; // Your copied ID
```

**Save the file!** ✅

---

## Step 4: Start Development Server (10 seconds)

```powershell
npm run dev
```

**You'll see:**
```
ROLLDOWN-VITE v7.2.5 ready in 805 ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.10:5173/
```

---

## Step 5: Test Auto-Sync! (2 minutes)

### A. Open Platform
```
🌐 Go to: http://localhost:5173/
👤 Login to your account
📊 Open Dashboard
```

### B. Click LeetCode Link
```
📋 Find any problem (e.g., "Two Sum")
🔗 Click the LeetCode icon/link
🌐 Opens leetcode.com in new tab
```

### C. Solve Problem
```
💻 Write your solution
▶️  Run code
✅ Submit solution
🎉 Get "Accepted" status
```

### D. Watch The Magic! ✨
```
⏱️  Wait 2-5 seconds...

You'll see:

1. 🔔 Browser notification
   "Problem completed: Two Sum"

2. 🎯 Toast in platform (top-right)
   "✓ Two Sum marked as solved!"

3. 📊 Dashboard auto-updates
   - Progress bar moves
   - Problem marked green
   - Streak increments
   - Stats update

4. 🎨 On-page overlay (LeetCode)
   "✓ Synced to DSA Tracker!"
```

---

## Visual Flow Diagram

```
┌──────────────────┐
│  DSA Tracker     │
│  Dashboard       │
│  localhost:5173  │
└────────┬─────────┘
         │ 1. Click LeetCode link
         ↓
┌──────────────────┐
│  LeetCode.com    │
│  Problem Page    │
│  (Extension ON)  │
└────────┬─────────┘
         │ 2. Solve problem
         │ 3. Get "Accepted"
         ↓
┌──────────────────┐
│  Content Script  │
│  Detects (2s)    │
└────────┬─────────┘
         │ 4. Send message
         ↓
┌──────────────────┐
│  Background JS   │
│  Stores & Syncs  │
└────────┬─────────┘
         │ 5. Message to tab
         ↓
┌──────────────────┐
│  DSA Tracker     │
│  Auto-updates!   │
│  🎉 ✨ 🎯       │
└──────────────────┘
```

---

## What You'll See

### 1. Extension Popup
```
┌──────────────────────────┐
│ DSA Tracker Sync         │
│─────────────────────────│
│ Problems synced: 5       │
│ Last sync: 2 mins ago    │
│                          │
│ Recent:                  │
│ ✓ Two Sum               │
│ ✓ Valid Parentheses     │
│ ✓ Merge Two Lists       │
│─────────────────────────│
│ Status: ✓ Connected     │
└──────────────────────────┘
```

### 2. Browser Notification
```
┌──────────────────────────┐
│ 🎉 DSA Tracker          │
│─────────────────────────│
│ Problem completed!       │
│ Two Sum                  │
│                          │
│ Dashboard updated ✓      │
└──────────────────────────┘
```

### 3. Toast Notification (In App)
```
       ┌────────────────────────┐
       │ ✓ Two Sum              │
       │ Marked as solved!      │
       └────────────────────────┘
         (top-right, slides in)
```

### 4. Dashboard Update
```
Before:
┌─────────────────────┐
│ Arrays & Strings    │
│ ███░░░░░░░ 30%     │
│ 3 / 10 problems     │
└─────────────────────┘

After (auto-update):
┌─────────────────────┐
│ Arrays & Strings    │
│ ████░░░░░░ 40%     │
│ 4 / 10 problems     │
└─────────────────────┘
  ↑ No refresh needed!
```

---

## Troubleshooting

### Extension not appearing?
```
✓ Check chrome://extensions/
✓ Ensure "Enabled" is ON
✓ Click refresh icon
✓ Reload LeetCode page
```

### Not syncing?
```
✓ Extension ID correct?
✓ Logged in to platform?
✓ LeetCode page fully loaded?
✓ Check browser console (F12)
```

### Dashboard not updating?
```
✓ Tab is open?
✓ Not in incognito mode?
✓ Internet connected?
✓ Check console for errors
```

---

## Pro Tips

### Keyboard Shortcuts
- `Ctrl+Shift+E` - Open extension popup
- `F12` - Open developer console
- `Ctrl+R` - Refresh LeetCode page

### Best Practices
- ✓ Keep DSA Tracker tab open
- ✓ Click links from platform (auto-tracking)
- ✓ Wait for full "Accepted" status
- ✓ Check extension popup for confirmation

### Advanced
- Check `chrome.storage.local` for submissions
- Monitor console for debug logs
- Use extension options for settings

---

## Success Checklist

- [ ] Icons generated ✓
- [ ] Extension installed ✓
- [ ] Extension ID configured ✓
- [ ] Dev server running ✓
- [ ] Account logged in ✓
- [ ] Test problem solved ✓
- [ ] Dashboard updated ✓
- [ ] Notifications received ✓

**All checked? You're done! 🎉**

---

## Time Breakdown

| Step | Time | Difficulty |
|------|------|-----------|
| 1. Generate icons | 1 min | Easy ⭐ |
| 2. Install extension | 1 min | Easy ⭐ |
| 3. Configure ID | 30s | Easy ⭐ |
| 4. Start server | 10s | Easy ⭐ |
| 5. Test sync | 2 min | Easy ⭐ |
| **Total** | **~5 min** | **Very Easy** |

---

## Need Help?

### Read These First:
1. [LEETCODE_AUTO_SYNC_GUIDE.md](LEETCODE_AUTO_SYNC_GUIDE.md) - Complete guide
2. [extension/README.md](extension/README.md) - Quick reference
3. [TESTING_GUIDE.md](TESTING_GUIDE.md) - Test everything

### Or Run:
```powershell
.\setup-extension.ps1
```
(Automated setup wizard)

---

**You're all set! Start solving and watch the magic happen! ✨**

🚀 Happy Coding!
