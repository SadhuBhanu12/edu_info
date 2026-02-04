-- ============================================
-- QUICK FIX: Run this if daily question is not working
-- ============================================

-- Step 1: Check if functions exist
SELECT 'Checking functions...' as step;
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('get_daily_question', 'generate_daily_question');
-- Expected: Should see 2 rows

-- Step 2: If no functions found, you need to run the complete daily-question-schema.sql
-- Go to: daily-question-schema.sql and run ALL 283 lines

-- Step 3: Grant additional permissions (run this anyway to be safe)
GRANT EXECUTE ON FUNCTION get_daily_question() TO authenticated;
GRANT EXECUTE ON FUNCTION get_daily_question() TO anon;
GRANT EXECUTE ON FUNCTION generate_daily_question(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT[]) TO authenticated;
GRANT EXECUTE ON FUNCTION generate_daily_question(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT[]) TO anon;

-- Step 4: Create a test question for today
SELECT generate_daily_question(
  'arr-1',
  'Two Sum',
  'Easy',
  'arrays-strings',
  'https://leetcode.com/problems/two-sum/',
  ARRAY['Hash Map', 'Array']
);
-- Expected: {"success": true, "message": "Daily question generated", "question_id": "..."}

-- Step 5: Verify the question was created
SELECT * FROM daily_questions WHERE date = CURRENT_DATE;
-- Expected: Should see 1 row with today's question

-- Step 6: Test get_daily_question function
SELECT * FROM get_daily_question();
-- Expected: Should return today's question

-- ============================================
-- If you see errors:
-- ============================================
-- Error: "function does not exist" 
--   → Run the complete daily-question-schema.sql file (all 283 lines)
--
-- Error: "permission denied"
--   → Run step 3 above (GRANT EXECUTE commands)
--
-- Error: "violates row-level security"
--   → You're not logged in. Login to your app first.
--
-- Error: "unique constraint violation"
--   → Question already exists for today! This is OK, skip to step 6
-- ============================================
