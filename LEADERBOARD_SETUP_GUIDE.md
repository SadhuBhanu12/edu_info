# 🏆 Professional Leaderboard Setup Guide

## Overview
This guide will help you set up a fully functional, professional-grade leaderboard system with user rankings, points, and real-time updates.

---

## 📋 Step 1: Database Setup

### 1.1 Run the Leaderboard SQL

1. Open your Supabase Dashboard: https://supabase.com/dashboard
2. Go to your project: **hcylrrfxcaqpqbmkdmzo**
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the content from `leaderboard-setup.sql`
6. Click **Run** or press `Ctrl+Enter`

### 1.2 Verify the Setup

After running the SQL, verify by running this test query:

```sql
SELECT * FROM get_leaderboard('alltime') LIMIT 10;
```

You should see a table structure with columns:
- user_id
- display_name  
- total_solved
- easy_count
- medium_count
- hard_count
- points
- streak
- rank

---

## 🎯 Step 2: Features Included

### Leaderboard System
✅ **Real-time Rankings** - Automatically calculated from problem submissions
✅ **Points System**:
  - Easy problems: 10 points
  - Medium problems: 25 points
  - Hard problems: 50 points
✅ **Time Filters**: Daily, Weekly, Monthly, All-Time
✅ **All Users Displayed** - See every user on the platform
✅ **Pagination** - 50 users per page for easy navigation
✅ **Search Feature** - Find any user by name or ID
✅ **Professional UI** with table headers and clean design

### User Stats Dashboard
✅ **Personal Rank** - Your current position
✅ **Total Points** - Cumulative score
✅ **Problems Solved** - Total count
✅ **Total Users** - Platform statistics

### Visual Features
✅ **Top 3 Highlighting** - Crown/Medal icons for top performers
✅ **Current User Highlight** - "YOU" badge on your entry
✅ **Difficulty Breakdown** - Easy/Medium/Hard counts per user
✅ **Streak Display** - Consecutive days active
✅ **Search Bar** - Find any user instantly
✅ **Pagination** - Navigate through 50 users at a time
✅ **"Find Me" Button** - Jump to your position quickly
✅ **User Count Display** - See total number of competitive users
✅ **Refresh Button** - Manual data refresh
✅ **Responsive Design** - Mobile-friendly layout

---

## 🚀 Step 3: How It Works

### Data Flow

1. **User Solves Problem** → Saved to `problem_submissions` table
2. **Leaderboard Calculation** → SQL function aggregates data
3. **Points Calculation**:
   ```
   Total Points = (Easy × 10) + (Medium × 25) + (Hard × 50)
   ```
4. **Ranking** → Users sorted by points, then by problems solved
5. **Display** → Frontend fetches and displays leaderboard

### Real-time Updates

- Data refreshes when:
  - Page loads
  - Time filter changes (Daily/Weekly/Monthly/All-Time)
  - Refresh button clicked
  
- Automatic fallback if RPC function fails:
  - Calculates leaderboard from raw submissions
  - Ensures system always works

---

## 📊 Step 4: Testing the Leaderboard

### Test with Real Data

1. **Solve some problems** in your app
2. Go to the Leaderboard page: `/course/leaderboard`
3. You should see yourself on the leaderboard
4. Try different time filters to see rankings change

### Test SQL Directly

```sql
-- View all-time leaderboard
SELECT * FROM get_leaderboard('alltime');

-- View your rank
SELECT * FROM get_user_rank('your-user-id-here');

-- Check submissions count
SELECT user_id, COUNT(*) as submissions
FROM problem_submissions
WHERE status = 'solved'
GROUP BY user_id
ORDER BY submissions DESC;
```

---

## 🎨 Step 5: UI Components

### Stats Overview Cards
Shows at the top of the leaderboard:
- Your Rank (with trophy icon)
- Your Points (with zap icon)
- Problems Solved (with target icon)
- Total Users (with users icon)

### Leaderboard Table
Professional table with columns:
- **Rank** - Position (#1, #2, #3 get special icons)
- **User** - Avatar + Name (+ YOU badge for current user)
- **Problems** - Total solved count
- **Difficulty** - E/M/H breakdown with color coding
- **Streak** - Fire icon + days count
- **Points** - Total score with gradient effect

**Search & Navigation**:
- Search bar to find specific users
- "Find Me" button to jump to your position
- Shows total user count
- Pagination (50 users per page)
- First/Previous/Next/Last page controls

### Filter Buttons
- Daily - Last 24 hours
- Weekly - Last 7 days
- Monthly - Last 30 days
- All Time - Since beginning

---

## 🔧 Step 6: Customization

### Modify Points System

Edit `leaderboard-setup.sql` and change the points calculation:

```sql
(
  COUNT(DISTINCT CASE WHEN ps.difficulty = 'Easy' THEN ps.problem_id END) * 10 +
  COUNT(DISTINCT CASE WHEN ps.difficulty = 'Medium' THEN ps.problem_id END) * 25 +
  COUNT(DISTINCT CASE WHEN ps.difficulty = 'Hard' THEN ps.problem_id END) * 50
) AS points
```

Change the multipliers (10, 25, 50) to your preference.

### Modify Display Limit

The leaderboard now shows **ALL users** with pagination. 

To change how many users appear per page, edit the component:

```typescript
// In LeaderboardAchievements.tsx
const [itemsPerPage] = useState(50); // Change 50 to your preference
```

Options:
- 25 users per page (more pages, faster loading)
- 50 users per page (balanced, default)
- 100 users per page (fewer pages, see more at once)

---

## 🛠️ Step 7: Troubleshooting

### Leaderboard Not Showing?

**Check 1**: Ensure SQL functions are created
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name IN ('get_leaderboard', 'get_user_rank');
```

**Check 2**: Check browser console for errors
- Press F12
- Look for red errors
- Check Network tab for failed API calls

**Check 3**: Verify submissions exist
```sql
SELECT COUNT(*) FROM problem_submissions WHERE status = 'solved';
```

### No Users Appearing?

**Solution**: Solve at least one problem to appear on leaderboard
- Go to any topic
- Mark a problem as solved
- Return to leaderboard
- You should now appear

### RPC Error?

**Fallback Active**: The system automatically uses fallback calculation
- Data still shows
- Performance may be slightly slower
- Consider re-running the SQL setup

---

## 📱 Step 8: Mobile Responsiveness

The leaderboard is fully responsive:

- **Desktop (> 968px)**: Full table view with all columns
- **Tablet (768-968px)**: Condensed table view
- **Mobile (< 768px)**: Card-based layout, stacked view

Test on different devices or use browser DevTools:
- Press F12
- Click device toolbar icon
- Select different device sizes

---

## 🎯 Step 9: Features Roadmap

### Currently Implemented ✅
- Real-time leaderboard
- Points system
- Time filters
- User rankings
- Difficulty breakdown
- Streak display
- Responsive design
- Auto-refresh

### Future Enhancements 🚀
- Weekly/Monthly winners
- Achievement integration
- Level/Badge system
- Friend leaderboards
- Custom challenges
- Email notifications
- Social sharing
- Export data

---

## 📚 Step 10: API Reference

### Get Leaderboard

```typescript
const { data, error } = await supabase
  .rpc('get_leaderboard', {
    time_filter: 'alltime' // 'daily' | 'weekly' | 'monthly' | 'alltime'
  });
```

**Returns**:
```typescript
{
  user_id: string;
  display_name: string;
  total_solved: number;
  easy_count: number;
  medium_count: number;
  hard_count: number;
  points: number;
  streak: number;
  rank: number;
}[]
```

### Get User Rank

```typescript
const { data, error } = await supabase
  .rpc('get_user_rank', {
    p_user_id: userId
  });
```

**Returns**:
```typescript
{
  user_id: string;
  rank: number;
  total_users: number;
  points: number;
  total_solved: number;
}
```

---

## ✅ Setup Checklist

- [ ] Run `leaderboard-setup.sql` in Supabase SQL Editor
- [ ] Verify functions created successfully
- [ ] Test SQL queries return data
- [ ] Solve at least one problem
- [ ] Navigate to `/course/leaderboard`
- [ ] Verify you appear on leaderboard
- [ ] Test time filters (Daily/Weekly/Monthly/All-Time)
- [ ] Test refresh button
- [ ] Check mobile responsiveness
- [ ] Verify points calculation is correct

---

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ Leaderboard page loads without errors
2. ✅ Your stats cards show correct information
3. ✅ Your name appears in the leaderboard list
4. ✅ Points match your solved problems (Easy×10 + Medium×25 + Hard×50)
5. ✅ Rank changes when filtering by time period
6. ✅ Refresh button updates data
7. ✅ Top 3 users have special crown/medal icons
8. ✅ Your row has "YOU" badge and special highlighting

---

## 🆘 Support

If you encounter issues:

1. Check browser console (F12) for errors
2. Verify Supabase connection in `.env.local`
3. Ensure SQL functions are created
4. Check problem submissions exist
5. Try the fallback system (should work automatically)

---

## 🎓 Learning Resources

- [Supabase RPC Documentation](https://supabase.com/docs/guides/database/functions)
- [PostgreSQL Window Functions](https://www.postgresql.org/docs/current/tutorial-window.html)
- [React State Management](https://react.dev/learn/managing-state)

---

**Your professional leaderboard is now ready! 🚀**

Navigate to `/course/leaderboard` to see it in action!
