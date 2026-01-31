# Complete Testing & Verification Guide

## 🎯 Testing Steps

### Step 1: Open Browser Console
1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Keep it open during testing

### Step 2: Clear Everything (Start Fresh)
1. Press **Ctrl + Shift + Delete**
2. Select:
   - ✅ Cookies and site data
   - ✅ Cached files
3. Click "Clear data"
4. **Close and reopen browser**

### Step 3: Sign Up New User
1. Go to http://localhost:5173
2. Click "Sign Up"
3. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: test1234
4. Click "Create Account"

**Watch Console:**
```
✅ Account created successfully
📥 [DB Load] Starting to load progress...
📥 [DB Load] User progress query result: {hasData: false}
📥 [DB Load] Problem submissions query result: {count: 0}
```

### Step 4: Mark a Problem as Complete
1. Go to "Dashboard" or "Practice"
2. Find ANY problem (e.g., "Two Sum")
3. Click the checkbox to mark it complete

**Watch Console - Should See:**
```
📝 [Sync] Queued problem: two-sum status: solved
🔄 [Sync] Processing 1 problem updates...
📤 [Sync] Saving to database: [{user_id: "...", problem_id: "two-sum", ...}]
✅ [Sync] Successfully saved 1 problems to database
✅ [Sync] Database confirmed: [{...}]
🔄 [DB Sync] Syncing user progress...
✅ [DB Sync] User progress synced successfully: {totalSolved: 1}
```

### Step 5: Verify in Supabase
1. Open https://supabase.com/dashboard
2. Go to your project → Table Editor
3. Click `problem_submissions` table

**Should See:**
- 1 row with your problem
- `user_id` = your user ID
- `problem_id` = "two-sum"
- `status` = "solved"
- `solved_at` = timestamp

4. Click `user_progress` table

**Should See:**
- 1 row with your user ID
- `total_solved` = 1
- `streak` = 1
- `last_active_date` = today

### Step 6: Mark More Problems
1. Mark 2 more problems as complete
2. Watch console for each:
   ```
   📝 Queued problem...
   ✅ Successfully saved...
   ```
3. Check Supabase → `problem_submissions` → Should now have 3 rows
4. Check `user_progress` → `total_solved` should be 3

### Step 7: Test Persistence (Critical!)
1. **Logout** completely
2. **Login again** with same credentials

**Watch Console:**
```
📥 [DB Load] Starting to load progress... {userId: "..."}
📥 [DB Load] User progress query result: {totalSolved: 3, streak: 1}
📥 [DB Load] Problem submissions query result: {count: 3}
✅ [DB Load] Progress loaded successfully: {totalSolved: 3}
```

3. Go to "Completed Problems" page
4. **Should see all 3 problems you marked!** ✅

### Step 8: Test Different User
1. **Logout**
2. **Sign up new user:** test2@example.com
3. Mark 5 different problems
4. Check Supabase:
   - `problem_submissions` should have 8 rows total (3 from user1 + 5 from user2)
   - Each row has different `user_id`
5. **Logout and login as test@example.com**
6. Should ONLY see 3 problems (not 8!)

## 🔍 Troubleshooting

### Problem: Console shows "⚠️ Cannot queue sync - no user logged in"
**Fix:** You're not logged in. Sign up or login first.

### Problem: Console shows "❌ Database error: 23505"
**Reason:** Duplicate key violation - problem already marked
**Fix:** This is normal if clicking same problem twice. It will update, not duplicate.

### Problem: Console shows "❌ Database error: 42501"
**Reason:** Permission denied - RLS policy blocking
**Fix:** Run this in Supabase SQL Editor:
```sql
-- Ensure policies allow INSERT
DROP POLICY IF EXISTS "Users can insert their own submissions" ON problem_submissions;
CREATE POLICY "Users can insert their own submissions"
  ON problem_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Problem: No console logs appearing
**Fix:**
1. Open browser console (F12)
2. Check filter - should be "All levels" not "Errors only"
3. Try marking a problem again

### Problem: Data not loading after login
**Check Console For:**
- `📥 [DB Load] Starting to load progress...` ← Should appear
- If missing: User not logged in properly
- If shows error: Check error message

**Common Errors:**
- `PGRST116`: No data yet (normal for new users)
- `42P01`: Table doesn't exist (run schema SQL again)
- `42501`: Permission denied (check RLS policies)

## ✅ Success Criteria

You know it's working when:

1. ✅ Console shows "✅ Successfully saved" after marking problem
2. ✅ Supabase tables have your data
3. ✅ Logout → Login → Data still there
4. ✅ Different users see different data
5. ✅ "Completed Problems" page shows correct count

## 📊 Verify Data in Supabase

Run this query in Supabase SQL Editor:

```sql
-- See all data for your user
SELECT 
  u.email,
  up.total_solved,
  up.streak,
  COUNT(ps.id) as problems_in_db
FROM auth.users u
LEFT JOIN user_progress up ON u.id = up.user_id
LEFT JOIN problem_submissions ps ON u.id = ps.user_id
WHERE u.email = 'test@example.com'  -- Change to your email
GROUP BY u.email, up.total_solved, up.streak;
```

**Expected:**
```
email              | total_solved | streak | problems_in_db
-------------------|--------------|--------|---------------
test@example.com   | 3            | 1      | 3
```

## 🚨 If Nothing Works

1. **Check Supabase Credentials:**
   - `.env.local` has correct `VITE_SUPABASE_URL`
   - `.env.local` has correct `VITE_SUPABASE_ANON_KEY`
   - Restart dev server: `npm run dev`

2. **Check Database Tables Exist:**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```
   Should show: `user_profiles`, `user_progress`, `problem_submissions`

3. **Check RLS Policies:**
   ```sql
   SELECT tablename, policyname FROM pg_policies 
   WHERE schemaname = 'public';
   ```
   Should show policies for each table

4. **Full Reset:**
   - Delete tables in Supabase
   - Run `supabase-schema.sql` again
   - Clear browser data
   - Create new account
   - Test again

## 💡 What to Watch For

**Good Signs:**
- ✅ Logs appear immediately when marking problems
- ✅ "Successfully saved" messages
- ✅ Data appears in Supabase within seconds
- ✅ Login shows correct count

**Bad Signs:**
- ❌ No console logs when marking problems
- ❌ "Cannot queue sync" messages
- ❌ Errors in console (red text)
- ❌ Data not appearing in Supabase

If you see bad signs, check the specific error message and use the troubleshooting section above!

---

**Need More Help?**

Share your browser console output (F12 → Console → Copy all text) to diagnose the exact issue.
