# 🔧 Daily Question Troubleshooting Guide

## Issue: "No Daily Question Available"

### ✅ Step-by-Step Solution

---

## Step 1: Verify Database Setup

### 1.1 Open Supabase SQL Editor
Go to your Supabase project → SQL Editor

### 1.2 Run the COMPLETE Schema
Copy **ALL** contents from `daily-question-schema.sql` and paste in SQL Editor, then click **RUN**.

**Important:** Make sure you run the ENTIRE file, not just parts of it!

### 1.3 Verify Setup
Run this test query:
```sql
-- Check if functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('get_daily_question', 'generate_daily_question');
```

**Expected Result:** You should see both functions listed:
- `get_daily_question`
- `generate_daily_question`

---

## Step 2: Check Browser Console

### 2.1 Open Browser DevTools
- Press `F12` or `Ctrl+Shift+I` (Windows)
- Click on the **Console** tab

### 2.2 Navigate to Daily Question Page
- Go to: `http://localhost:5174/course/daily-question`
- Watch the console for messages

### 2.3 Look for These Messages

**✅ Success (you should see):**
```
📅 Fetching daily question...
🎲 Generating daily question for today...
🎲 Selected problem: [Problem Name]
✅ Daily question generated: {...}
✅ Daily question loaded: {...}
```

**❌ Errors to check for:**
- `permission denied for function generate_daily_question`
  → Re-run the SQL schema
  
- `function generate_daily_question does not exist`
  → The function wasn't created properly
  
- `Failed to fetch daily question`
  → Check Supabase connection

---

## Step 3: Manual Test in Supabase

### 3.1 Test Function Directly
Run this in Supabase SQL Editor:

```sql
-- This should work without errors
SELECT generate_daily_question(
  'arr-1',
  'Two Sum',
  'Easy',
  'arrays-strings',
  'https://leetcode.com/problems/two-sum/',
  ARRAY['Hash Map', 'Array']
);
```

**Expected Result:**
```json
{
  "success": true,
  "message": "Daily question generated",
  "question_id": "some-uuid-here"
}
```

### 3.2 Check if Question Exists
```sql
SELECT * FROM daily_questions WHERE date = CURRENT_DATE;
```

**Expected:** You should see 1 row with today's question.

### 3.3 Test get_daily_question Function
```sql
SELECT * FROM get_daily_question();
```

**Expected:** You should see today's question with all details.

---

## Step 4: Clear Cache and Retry

### 4.1 Hard Refresh Browser
- Press `Ctrl+Shift+R` (Windows)
- Or `Ctrl+F5`

### 4.2 Clear Application Data (if needed)
1. Open DevTools (`F12`)
2. Go to **Application** tab
3. Under **Storage**, click **Clear site data**
4. Refresh the page

---

## Step 5: Common Issues & Fixes

### Issue A: Function Permission Error
**Error:** `permission denied for function generate_daily_question`

**Fix:**
```sql
-- Grant permissions again
GRANT EXECUTE ON FUNCTION generate_daily_question(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT[]) TO authenticated;
GRANT EXECUTE ON FUNCTION get_daily_question() TO authenticated;
```

### Issue B: RLS Policy Blocks Insert
**Error:** `new row violates row-level security policy`

**Fix:**
```sql
-- Ensure INSERT policy exists
DROP POLICY IF EXISTS "Allow authenticated users to insert daily questions" ON public.daily_questions;
CREATE POLICY "Allow authenticated users to insert daily questions" 
  ON public.daily_questions FOR INSERT
  TO authenticated
  WITH CHECK (true);
```

### Issue C: Table Doesn't Exist
**Error:** `relation "daily_questions" does not exist`

**Fix:** Run the complete `daily-question-schema.sql` file again.

### Issue D: User Not Logged In
**Symptom:** Page loads but shows empty state

**Fix:** Make sure you're logged in to your account.

---

## Step 6: Complete Fresh Setup

If nothing works, do a complete reset:

### 6.1 Drop Everything
```sql
-- Drop tables
DROP TABLE IF EXISTS public.daily_question_submissions CASCADE;
DROP TABLE IF EXISTS public.daily_questions CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS get_daily_question();
DROP FUNCTION IF EXISTS generate_daily_question(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT[]);
DROP FUNCTION IF EXISTS get_daily_question_stats(UUID);
DROP FUNCTION IF EXISTS submit_daily_question(UUID, TEXT, TEXT, INTEGER);
```

### 6.2 Re-run Complete Schema
Copy **ALL** contents from `daily-question-schema.sql` and run in SQL Editor.

### 6.3 Verify Tables Created
```sql
SELECT * FROM daily_questions; -- Should show empty table
SELECT * FROM daily_question_submissions; -- Should show empty table
```

### 6.4 Restart Dev Server
```bash
# Stop server (Ctrl+C in terminal)
npm run dev
```

### 6.5 Test Again
- Clear browser cache (`Ctrl+Shift+R`)
- Navigate to: `http://localhost:5174/course/daily-question`
- Check console logs

---

## Step 7: Debug with Network Tab

### 7.1 Open Network Tab
1. Open DevTools (`F12`)
2. Click **Network** tab
3. Refresh the page

### 7.2 Look for RPC Calls
Filter by "RPC" or look for:
- `generate_daily_question`
- `get_daily_question`

### 7.3 Check Response
Click on the request → **Preview** tab

**If you see an error:**
- Copy the error message
- Check against common issues above

---

## Quick Checklist

Run through this checklist:

- [ ] Ran complete `daily-question-schema.sql` in Supabase
- [ ] Verified functions exist (run test query)
- [ ] Confirmed RLS policies are set
- [ ] Logged into the application
- [ ] Dev server is running (`npm run dev`)
- [ ] Opened: `http://localhost:5174/course/daily-question`
- [ ] Checked browser console for errors
- [ ] Tried hard refresh (`Ctrl+Shift+R`)
- [ ] Tested manual generation in Supabase

---

## Still Not Working?

### Collect Debug Information

1. **Console Logs:**
   - Copy all console messages
   - Look for red error messages

2. **Network Errors:**
   - Check Network tab for failed requests
   - Look at the response of RPC calls

3. **SQL Test:**
   ```sql
   -- Run this and share the result
   SELECT * FROM get_daily_question();
   ```

4. **Function Test:**
   ```sql
   -- Run this and share any error
   SELECT generate_daily_question(
     'test-1', 'Test', 'Easy', 'arrays-strings', 
     'https://leetcode.com', ARRAY['Test']
   );
   ```

---

## Expected Behavior

When working correctly:

1. **First Visit:** App auto-generates a random question
2. **Console Shows:** Success messages with question details
3. **Page Displays:** 
   - Problem title
   - Difficulty badge
   - Pattern tags
   - "Solve on LeetCode" button
   - Community stats (might show 0 if no one solved yet)

4. **Next Day:** Automatically shows a new random question

---

## Contact Points

If you're still stuck:
1. Share the console error messages
2. Share the SQL test results
3. Confirm which step failed

The issue is usually one of:
- Schema not fully run
- Functions not created
- RLS policies missing
- User not authenticated
