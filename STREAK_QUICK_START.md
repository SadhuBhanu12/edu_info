# 🚀 Streak Tracking - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Run Database Migration

```bash
# Open Supabase Dashboard → SQL Editor
# Copy and paste contents of: database/streak-tracking-schema.sql
# Click "Run" to execute
```

### Step 2: Enable Realtime

```sql
-- In Supabase SQL Editor, run:
ALTER PUBLICATION supabase_realtime ADD TABLE user_streaks;
```

### Step 3: Install Dependencies

```bash
npm install uuid
```

### Step 4: Import and Use

```tsx
// In your problem submission component
import { useStreakOnSolve } from './hooks/useStreak';

function ProblemPage() {
  const { user } = useAuth();
  const { triggerStreakUpdate, lastResult } = useStreakOnSolve(user?.id);
  
  const handleSolveProblem = async () => {
    // Save problem submission
    await saveProblemSubmission();
    
    // Update streak automatically
    const result = await triggerStreakUpdate();
    
    // Show notification
    if (result?.change_type === 'STREAK_INCREMENT') {
      toast.success(`🔥 ${result.current_streak} day streak!`);
    }
  };
}
```

### Step 5: Add Streak Widget

```tsx
// In your dashboard/profile page
import StreakWidget from './components/StreakWidget';

function Dashboard() {
  return (
    <div>
      <StreakWidget />
      {/* ... other components */}
    </div>
  );
}
```

## ✅ Verification

Test the system:

```tsx
// Open browser console
import StreakService from './services/streakService';

// Update streak
const result = await StreakService.updateStreak(
  'your-user-id',
  'America/New_York'
);
console.log(result);

// Check streak
const streak = await StreakService.getStreak('your-user-id');
console.log(streak);
```

Expected output:
```json
{
  "success": true,
  "current_streak": 1,
  "longest_streak": 1,
  "change_type": "FIRST_ACTIVITY",
  "message": "Streak started! First problem solved."
}
```

## 🧪 Test Concurrency

Test concurrent safety:

```typescript
// Simulate 10 simultaneous problem solves
const promises = Array.from({ length: 10 }, () =>
  StreakService.updateStreak(userId, 'UTC')
);

const results = await Promise.all(promises);

// Verify final state
const streak = await StreakService.getStreak(userId);
console.log(streak.current_streak); // Should be 1, not 10!
```

## 📊 Monitor in Production

```sql
-- Check recent updates
SELECT 
    user_id,
    change_type,
    new_current_streak,
    created_at
FROM streak_history
ORDER BY created_at DESC
LIMIT 20;

-- Find active streaks
SELECT 
    user_id,
    current_streak,
    longest_streak,
    last_active_date
FROM user_streaks
WHERE current_streak > 0
ORDER BY current_streak DESC
LIMIT 10;
```

## 🎯 Integration Checklist

- [ ] Database schema created
- [ ] Realtime enabled
- [ ] Dependencies installed
- [ ] Service imported in app
- [ ] Hook used in problem page
- [ ] Widget displayed in UI
- [ ] Tested with real problem solve
- [ ] Verified concurrency safety
- [ ] Checked real-time updates
- [ ] Monitored error logs

## 🔥 Features Enabled

✅ **Automatic streak updates** when users solve problems  
✅ **Timezone-aware** date handling (no more UTC bugs!)  
✅ **Concurrent-safe** (no duplicate increments)  
✅ **Idempotent** (safe to retry)  
✅ **Real-time** UI updates  
✅ **Audit log** of all changes  
✅ **Leaderboard** ready  

## 🎨 Customization

### Change Streak Milestones

```typescript
// In StreakWidget.tsx
const milestones = [7, 14, 30, 50, 100, 365]; // Edit here
```

### Adjust Cache Duration

```typescript
// In streakService.ts
const CACHE_TTL_MS = 60 * 1000; // Change to 30s, 2min, etc.
```

### Modify Retry Logic

```typescript
// In updateUserStreak()
maxRetries: number = 3  // Increase for high-concurrency
```

## 🆘 Troubleshooting

**Streak not updating?**
- Check user is authenticated
- Verify timezone is valid IANA string
- Check Supabase RLS policies
- Look for errors in console

**Duplicate increments?**
- Verify database migration ran completely
- Check `SELECT FOR UPDATE` is in place
- Ensure version column exists

**Performance issues?**
- Enable connection pooling
- Add Redis cache layer
- Check database indexes: `SELECT * FROM pg_indexes WHERE tablename = 'user_streaks'`

## 📚 Full Documentation

See [STREAK_TRACKING_COMPLETE_GUIDE.md](./STREAK_TRACKING_COMPLETE_GUIDE.md) for:
- Detailed architecture
- Performance optimization
- Security best practices
- Advanced debugging
- Scaling strategies

## 🎉 You're Done!

Your streak system is now:
- ✅ Production-ready
- ✅ Concurrent-safe
- ✅ Scalable
- ✅ Real-time

**Happy coding! 🚀**
