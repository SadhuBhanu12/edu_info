# Test Your Database Setup

## 🧪 Quick Test to Verify User Isolation

Each user should only see THEIR OWN data. Let's verify:

### Test 1: Create Two Test Accounts

1. **Open**: http://localhost:5173
2. **Create Account 1**:
   - Name: Test User 1
   - Email: testuser1@example.com
   - Password: test1234
3. **Verify email and login**
4. **Solve 1-2 problems** (mark as complete)
5. **Logout**

6. **Create Account 2**:
   - Name: Test User 2  
   - Email: testuser2@example.com
   - Password: test1234
7. **Verify email and login**
8. **Solve 1-2 DIFFERENT problems**

### Test 2: Verify Data Isolation

**Still logged in as Test User 2:**
- Check "Completed Problems" page
- You should ONLY see problems solved by Test User 2
- Should NOT see Test User 1's problems

**Now logout and login as Test User 1:**
- Check "Completed Problems" page
- You should ONLY see Test User 1's problems
- Should NOT see Test User 2's problems

### Test 3: Check Database Directly

In Supabase → SQL Editor, run:

```sql
-- See all users and their progress
SELECT 
  u.email,
  up.total_solved,
  up.streak,
  up.user_id
FROM auth.users u
LEFT JOIN user_progress up ON u.id = up.user_id
ORDER BY u.created_at DESC;
```

**Expected Result:**
- Each user has DIFFERENT total_solved count
- Each user_id is unique
- Test User 1 and Test User 2 have separate rows

### Test 4: Check Problem Submissions

```sql
-- See all problem submissions grouped by user
SELECT 
  u.email,
  COUNT(ps.id) as problems_solved,
  array_agg(ps.problem_title) as solved_problems
FROM auth.users u
LEFT JOIN problem_submissions ps ON u.id = ps.user_id
WHERE ps.status = 'solved'
GROUP BY u.email
ORDER BY u.created_at DESC;
```

**Expected Result:**
- Each user shows different problems
- No user sees another user's problems

## 🔍 If Data is Mixed Up (Same Results for Everyone):

This means Row Level Security isn't working. Fix it:

### Solution 1: Verify RLS is Enabled

In Supabase → Table Editor:
1. Click on `user_progress` table
2. Look for "RLS Enabled" badge
3. If NOT enabled, run:

```sql
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
```

### Solution 2: Re-create Policies

Sometimes policies don't apply correctly. Drop and recreate:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can view their own submissions" ON public.problem_submissions;
DROP POLICY IF EXISTS "Users can insert their own submissions" ON public.problem_submissions;
DROP POLICY IF EXISTS "Users can update their own submissions" ON public.problem_submissions;
DROP POLICY IF EXISTS "Users can delete their own submissions" ON public.problem_submissions;

-- Recreate policies
CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

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
```

### Solution 3: Check Browser Console

1. Open browser (F12)
2. Go to Console tab
3. Look for logs like:
   ```
   📥 [DB Load] Starting to load progress from database... {userId: "abc-123"}
   📥 [DB Load] Problem submissions query result: {count: 5}
   ```
4. Verify userId changes when you switch accounts

## ✅ Expected Behavior:

**User 1 Login:**
- Sees their own 5 solved problems
- Streak: 3 days
- Total: 5 problems

**User 2 Login:**
- Sees their own 3 solved problems
- Streak: 1 day
- Total: 3 problems

**Each user's data is completely separate!**

## 🎯 Quick Verification Query:

Run this in Supabase SQL Editor to see if RLS is working:

```sql
-- This should return ONLY the current logged-in user's data
SELECT * FROM user_progress WHERE user_id = auth.uid();
SELECT * FROM problem_submissions WHERE user_id = auth.uid();
```

If you're logged into the Supabase dashboard, this should return ONLY your test account data, not all users.

---

**Still having issues?** The code is correct - the problem is likely:
1. RLS not enabled on tables
2. Policies not created properly
3. Need to logout/login to refresh session

Try the solutions above and test with 2 different accounts!
