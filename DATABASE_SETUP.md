# 🗄️ Database Setup Guide

## Overview
Your DSA Tracker now stores each user's progress separately in Supabase PostgreSQL database. This guide will help you set up the required tables.

---

## 📋 Step-by-Step Setup

### Step 1: Access Supabase SQL Editor

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create one if you haven't)
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run the Database Schema

Copy and paste the following SQL into the editor and click **Run**:

```sql
-- =====================================================
-- DSA TRACKER DATABASE SCHEMA
-- =====================================================

-- Table 1: user_progress (stores overall user progress)
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  solved_problems TEXT[] DEFAULT '{}',
  theory_time_spent JSONB DEFAULT '{}',
  animations_watched JSONB DEFAULT '{}',
  videos_watched JSONB DEFAULT '{}',
  concept_readiness JSONB DEFAULT '{}',
  topics_progress JSONB DEFAULT '{}',
  total_solved INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Table 2: problem_submissions (stores individual problem attempts)
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_problem_submissions_user_id 
  ON public.problem_submissions(user_id);
  
CREATE INDEX IF NOT EXISTS idx_problem_submissions_status 
  ON public.problem_submissions(user_id, status);
  
CREATE INDEX IF NOT EXISTS idx_problem_submissions_solved_at 
  ON public.problem_submissions(user_id, solved_at DESC);
  
CREATE INDEX IF NOT EXISTS idx_problem_submissions_topic 
  ON public.problem_submissions(user_id, topic_id);
  
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id 
  ON public.user_progress(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can view their own submissions" ON public.problem_submissions;
DROP POLICY IF EXISTS "Users can insert their own submissions" ON public.problem_submissions;
DROP POLICY IF EXISTS "Users can update their own submissions" ON public.problem_submissions;
DROP POLICY IF EXISTS "Users can delete their own submissions" ON public.problem_submissions;

-- Create RLS policies for user_progress
CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for problem_submissions
CREATE POLICY "Users can view their own submissions"
  ON public.problem_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own submissions"
  ON public.problem_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions"
  ON public.problem_submissions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own submissions"
  ON public.problem_submissions FOR DELETE
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.user_progress TO authenticated;
GRANT ALL ON public.problem_submissions TO authenticated;
```

### Step 3: Verify Tables Created

Run this query to check if tables were created successfully:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_progress', 'problem_submissions');
```

You should see both tables listed.

---

## 🧪 Testing the Setup

### Option 1: Use the Test Page

1. Open `setup-database.html` in your browser
2. Update the Supabase credentials at the top of the file:
   ```javascript
   const SUPABASE_URL = 'your-project-url';
   const SUPABASE_ANON_KEY = 'your-anon-key';
   ```
3. Click "Test Connection" to verify everything works

### Option 2: Manual SQL Test

Run this in Supabase SQL Editor to insert test data:

```sql
-- Replace 'YOUR_USER_ID' with your actual user ID from auth.users
INSERT INTO user_progress (user_id, total_solved, streak, topics_progress)
VALUES (
  'YOUR_USER_ID',
  5,
  3,
  '{"arrays": {"topicId": "arrays", "theoryCompleted": true}}'::jsonb
)
ON CONFLICT (user_id) DO UPDATE
SET total_solved = 5, streak = 3;
```

---

## 🔍 How It Works

### When User Logs In:
```
1. loadProgressFromSupabase() is called
2. Fetches from user_progress table → gets streak, total_solved, topics_progress
3. Fetches from problem_submissions table → gets all solved problems
4. Merges data into React state
5. Shows loading screen while fetching
```

### When User Solves a Problem:
```
1. updateProblemStatus() is called
2. Updates local React state
3. Queues sync to problem_submissions table (batched)
4. Calls syncUserProgress() → updates user_progress table
5. Data is now saved in database
```

### Multi-User Isolation:
```
- Each user has their own row in user_progress (filtered by user_id)
- Each problem submission is tied to user_id
- Row Level Security (RLS) ensures users only see their own data
```

---

## 🐛 Troubleshooting

### Problem: "No progress loading"
**Solution:** 
1. Check browser console for errors
2. Verify Supabase credentials in `src/lib/supabase.ts`
3. Make sure you've run the SQL schema
4. Ensure RLS policies are created

### Problem: "PGRST116 error"
**Solution:** This is normal - it means no data exists yet for the user. Data will be created when they first solve a problem.

### Problem: "RLS policy violation"
**Solution:**
1. Make sure RLS policies are created (run the schema again)
2. Verify user is logged in (`auth.uid()` returns valid ID)
3. Check Table Editor > Policies in Supabase dashboard

### Problem: "Data not persisting"
**Solution:**
1. Open browser DevTools Console
2. Look for errors during `syncUserProgress`
3. Check Supabase logs in Dashboard > Logs
4. Verify table permissions are correct

---

## 📊 Database Schema Details

### user_progress Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| total_solved | INTEGER | Total problems solved |
| streak | INTEGER | Current daily streak |
| last_active_date | DATE | Last activity date |
| topics_progress | JSONB | Progress per topic (theory, videos, etc.) |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

### problem_submissions Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| problem_id | TEXT | Unique problem identifier |
| problem_title | TEXT | Problem name |
| difficulty | TEXT | easy/medium/hard |
| topic_id | TEXT | Topic this problem belongs to |
| status | TEXT | solved/unsolved/revision |
| confidence | INTEGER | User confidence (1-5) |
| notes | TEXT | User notes |
| attempts | INTEGER | Number of attempts |
| solved_at | TIMESTAMP | When problem was solved |
| created_at | TIMESTAMP | First attempt time |

---

## ✅ Verification Checklist

- [ ] Tables created in Supabase
- [ ] RLS policies enabled
- [ ] Indexes created
- [ ] Test connection successful
- [ ] Can insert test data
- [ ] Can fetch test data
- [ ] User login triggers data load
- [ ] Problem solve triggers data save
- [ ] Different users see different data

---

## 🚀 Next Steps

Once setup is complete:

1. **Sign up** a new user in your app
2. **Solve a problem** - data should save to database
3. **Logout and login** - progress should reload
4. **Open browser console** - check for any errors
5. **View data** in Supabase Table Editor

---

## 📝 Notes

- Data is synced in real-time as users interact with the app
- Problem submissions are batched (1 second delay) to reduce database calls
- User progress (streak, totals) syncs immediately
- Loading screen prevents showing stale data
- All queries are filtered by user_id for security
