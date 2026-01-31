# Set Up Your Database (2 Minutes)

## ✅ You Already Have:
- Supabase account and project ✓
- Credentials in `.env.local` ✓
- Database schema file ready ✓

## 🎯 What You Need to Do Now:

### Step 1: Open Supabase SQL Editor

1. Go to **https://supabase.com/dashboard**
2. Click on your project (`hcylrrfxcaqpqbmkdmzo`)
3. Click **SQL Editor** in the left sidebar (icon looks like `</>`)

### Step 2: Run the Schema

1. Click **+ New query** button
2. Copy **ALL** the content from `supabase-schema.sql` in your project
3. Paste it into the SQL editor
4. Click **Run** (or press Ctrl+Enter)
5. You should see: "Success. No rows returned"

### Step 3: Verify Tables Created

1. Click **Table Editor** in the left sidebar
2. You should now see these tables:
   - ✅ `user_profiles` - Stores user info
   - ✅ `user_progress` - Stores streak, total solved, last active
   - ✅ `problem_submissions` - Stores each problem attempt with timestamps

## 📊 What This Database Stores:

### `user_progress` Table:
- **Total completed questions** (`total_solved`)
- **Current streak** (`streak`)
- **Last active date** (`last_active_date`)
- **Topic progress** (`topics_progress`)
- **Time spent on theory** (`theory_time_spent`)
- **Videos/animations watched**

### `problem_submissions` Table:
- **Each problem you solve** with timestamp
- **Difficulty level** and topic
- **Time spent** on each problem
- **Number of attempts**
- **Confidence level** (1-5)
- **Personal notes**
- **Revision status**

### How It Works:

**When you sign up:**
1. Account created in `auth.users`
2. Automatically creates your `user_profiles` entry
3. Automatically creates your `user_progress` entry with streak = 0

**When you solve a problem:**
1. Saved to `problem_submissions` with timestamp
2. `user_progress.total_solved` increases by 1
3. Streak updated based on last_active_date
4. All data linked to your account

**When you login from another device:**
1. Fetches your `user_progress` - shows your streak & total
2. Fetches your `problem_submissions` - shows all solved problems
3. Everything syncs automatically! ✨

## 🧪 Test It Now:

After running the schema:

1. Go to http://localhost:5173 (your dev server is running)
2. Create an account with your email
3. Check your email and verify
4. Login
5. Solve a problem in the DSA section
6. Go back to Supabase → Table Editor → `problem_submissions`
7. You'll see your solved problem there! 🎉

## 🔄 Auto-Sync Features:

✅ **Streak calculation** - Updates when you solve daily
✅ **Problem history** - All attempts saved with timestamps
✅ **Cross-device sync** - Login anywhere, see your progress
✅ **Backup** - All data safe in Supabase cloud
✅ **Privacy** - Row Level Security ensures you only see your own data

## ⚡ Quick Commands Reference:

**Check your progress:**
```sql
SELECT * FROM user_progress WHERE user_id = auth.uid();
```

**See all solved problems:**
```sql
SELECT * FROM problem_submissions 
WHERE user_id = auth.uid() AND status = 'solved'
ORDER BY solved_at DESC;
```

**Check your streak:**
```sql
SELECT streak, total_solved, last_active_date 
FROM user_progress 
WHERE user_id = auth.uid();
```

You can run these queries in Supabase SQL Editor anytime!

## 🎯 Summary:

**Right Now:**
- Database ready to track everything
- Just need to run the SQL schema once
- Then signup/login will automatically create your tracking tables

**After Setup:**
- Every problem you solve → saved with timestamp
- Streak calculated automatically
- Progress syncs across all devices
- Can view analytics, history, revision lists

**Time Required:** 2 minutes to copy-paste SQL and run it

---

**Ready?** Go to Supabase → SQL Editor → Paste schema → Run! 🚀
