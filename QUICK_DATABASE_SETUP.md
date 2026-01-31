# ✅ Database Setup Quick Checklist

## Current Status: Database Tables Need to be Created

Your app has the code to store progress, but the database tables don't exist yet in Supabase.

---

## 🚀 Quick Setup (5 minutes)

### ✅ Step 1: Create Database Tables

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Copy & Run This SQL**
   ```sql
   -- Copy the entire SQL from DATABASE_SETUP.md
   -- OR run the SQL from supabase-schema.sql
   ```

4. **Verify Tables Created**
   - Go to "Table Editor" in Supabase
   - You should see:
     - ✅ `user_progress`
     - ✅ `problem_submissions`

---

### ✅ Step 2: Test the Setup

**Option A: Use Test Page (Easiest)**
1. Open `setup-database.html` in browser
2. Update Supabase URL and Key (lines 247-248)
3. Click "Test Connection"
4. Click "Check Tables"

**Option B: Use Your App**
1. Run dev server: `npm run dev`
2. Open browser console (F12)
3. Sign up / Login
4. Look for these logs:
   ```
   📥 [DB Load] Starting to load progress...
   ✅ [DB Load] Progress loaded successfully
   ```
5. Solve a problem
6. Look for:
   ```
   🔄 [DB Sync] Syncing user progress...
   ✅ [DB Sync] User progress synced successfully
   ```

---

### ✅ Step 3: Verify Data Persistence

1. Solve a few problems
2. Logout
3. Login again
4. Check if your progress loaded back ✅

---

## 🐛 Troubleshooting

### See this in console: `❌ relation "public.user_progress" does not exist`
**Fix:** Tables not created. Run the SQL schema in Step 1.

### See this in console: `❌ Error syncing user progress`
**Check:**
- [ ] SQL schema was run successfully
- [ ] RLS policies were created
- [ ] User is logged in
- [ ] Supabase credentials are correct in `src/lib/supabase.ts`

### See this in console: `ℹ️ No existing progress data`
**This is normal!** Data will be created when you first solve a problem.

### Progress not saving
**Check browser console for:**
- Red ❌ errors during sync
- Look for `[DB Sync]` logs
- If no logs appear, the sync function isn't being called

---

## 📊 What to Expect

### When You Login:
```
📥 [DB Load] Starting to load progress from database...
📥 [DB Load] User progress query result: { hasData: true/false }
📥 [DB Load] Problem submissions query result: { count: X }
✅ [DB Load] Progress loaded successfully
```

### When You Solve a Problem:
```
🔄 [DB Sync] Syncing user progress to database...
✅ [DB Sync] User progress synced successfully
```

### If Tables Don't Exist:
```
❌ [DB Load] Error loading progress: relation "public.user_progress" does not exist
```
→ **Run the SQL schema!**

---

## 🎯 Success Criteria

- [ ] Can see database tables in Supabase Table Editor
- [ ] Login shows `[DB Load]` logs in console
- [ ] Solving problems shows `[DB Sync]` logs
- [ ] Logout → Login → Progress persists ✅
- [ ] Different users see different data ✅

---

## 📚 Resources

- **Full Setup Guide:** `DATABASE_SETUP.md`
- **SQL Schema:** `supabase-schema.sql`
- **Test Page:** `setup-database.html`
- **Supabase Dashboard:** https://app.supabase.com

---

## 💡 Quick SQL (Copy-Paste Ready)

```sql
-- RUN THIS IN SUPABASE SQL EDITOR
-- Creates both tables with all policies

CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topics_progress JSONB DEFAULT '{}',
  total_solved INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.problem_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id TEXT NOT NULL,
  problem_title TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unsolved',
  confidence INTEGER DEFAULT 3,
  notes TEXT,
  time_spent INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  solved_at TIMESTAMP WITH TIME ZONE,
  last_attempted TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, problem_id)
);

-- Enable RLS
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own progress"
  ON public.user_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own submissions"
  ON public.problem_submissions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.user_progress TO authenticated;
GRANT ALL ON public.problem_submissions TO authenticated;
```

✅ **After running this SQL, your database is ready!**
