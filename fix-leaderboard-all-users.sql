-- ============================================
-- FIX LEADERBOARD - SHOW ALL USERS
-- ============================================
-- This fixes the issue where leaderboard only shows current user

-- Step 1: Check current RLS policies on problem_submissions
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'problem_submissions';

-- Step 2: Drop restrictive RLS policies that might be blocking
DROP POLICY IF EXISTS "Users can only view own submissions" ON public.problem_submissions;
DROP POLICY IF EXISTS "Users can view own submissions" ON public.problem_submissions;

-- Step 3: Create proper RLS policy for leaderboard (allow reading all solved problems)
DROP POLICY IF EXISTS "Allow reading all solved submissions for leaderboard" ON public.problem_submissions;
CREATE POLICY "Allow reading all solved submissions for leaderboard"
  ON public.problem_submissions
  FOR SELECT
  TO authenticated, anon
  USING (status = 'solved');

-- Step 4: Also allow users to see their own submissions (all statuses)
DROP POLICY IF EXISTS "Users can read own submissions" ON public.problem_submissions;
CREATE POLICY "Users can read own submissions"
  ON public.problem_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Step 5: Recreate the get_leaderboard function with SECURITY DEFINER
DROP FUNCTION IF EXISTS get_leaderboard(TEXT);

CREATE OR REPLACE FUNCTION get_leaderboard(time_filter TEXT DEFAULT 'alltime')
RETURNS TABLE (
  user_id UUID,
  display_name TEXT,
  total_solved BIGINT,
  easy_count BIGINT,
  medium_count BIGINT,
  hard_count BIGINT,
  points BIGINT,
  streak INTEGER,
  rank BIGINT
) AS $$
DECLARE
  filter_date TIMESTAMP;
BEGIN
  -- Determine the date filter
  CASE time_filter
    WHEN 'daily' THEN
      filter_date := CURRENT_DATE;
    WHEN 'weekly' THEN
      filter_date := CURRENT_DATE - INTERVAL '7 days';
    WHEN 'monthly' THEN
      filter_date := CURRENT_DATE - INTERVAL '30 days';
    ELSE
      filter_date := '1970-01-01'::TIMESTAMP; -- All time
  END CASE;

  -- Return leaderboard data (SECURITY DEFINER bypasses RLS)
  RETURN QUERY
  WITH user_stats AS (
    SELECT
      ps.user_id,
      COUNT(DISTINCT ps.problem_id) AS total_solved,
      COUNT(DISTINCT CASE WHEN ps.difficulty = 'Easy' THEN ps.problem_id END) AS easy_count,
      COUNT(DISTINCT CASE WHEN ps.difficulty = 'Medium' THEN ps.problem_id END) AS medium_count,
      COUNT(DISTINCT CASE WHEN ps.difficulty = 'Hard' THEN ps.problem_id END) AS hard_count,
      (
        COUNT(DISTINCT CASE WHEN ps.difficulty = 'Easy' THEN ps.problem_id END) * 10 +
        COUNT(DISTINCT CASE WHEN ps.difficulty = 'Medium' THEN ps.problem_id END) * 25 +
        COUNT(DISTINCT CASE WHEN ps.difficulty = 'Hard' THEN ps.problem_id END) * 50
      ) AS points
    FROM public.problem_submissions ps
    WHERE ps.status = 'solved'
      AND ps.solved_at >= filter_date
    GROUP BY ps.user_id
  ),
  user_info AS (
    SELECT
      us.user_id,
      COALESCE(
        au.raw_user_meta_data->>'display_name',
        au.raw_user_meta_data->>'full_name', 
        au.email,
        'User ' || SUBSTRING(us.user_id::TEXT, 1, 8)
      ) AS display_name,
      us.total_solved,
      us.easy_count,
      us.medium_count,
      us.hard_count,
      us.points,
      0 AS streak
    FROM user_stats us
    LEFT JOIN auth.users au ON us.user_id = au.id
    WHERE us.total_solved > 0
  )
  SELECT
    ui.user_id,
    ui.display_name,
    ui.total_solved,
    ui.easy_count,
    ui.medium_count,
    ui.hard_count,
    ui.points,
    ui.streak,
    ROW_NUMBER() OVER (ORDER BY ui.points DESC, ui.total_solved DESC) AS rank
  FROM user_info ui
  ORDER BY ui.points DESC, ui.total_solved DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Grant execute permissions
GRANT EXECUTE ON FUNCTION get_leaderboard(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_leaderboard(TEXT) TO anon;

-- Step 7: Test the leaderboard
SELECT 
  user_id,
  display_name,
  total_solved,
  easy_count,
  medium_count,
  hard_count,
  points,
  rank
FROM get_leaderboard('alltime');

-- Expected: You should see ALL users who have solved at least 1 problem

-- Step 8: Verify user count
SELECT 
  COUNT(DISTINCT user_id) as total_users_with_submissions,
  COUNT(DISTINCT CASE WHEN status = 'solved' THEN user_id END) as users_with_solved_problems
FROM public.problem_submissions;

-- Step 9: If you still see only yourself, check if other users have solved problems
SELECT 
  user_id,
  COUNT(DISTINCT problem_id) as problems_solved,
  MAX(solved_at) as last_solved
FROM public.problem_submissions
WHERE status = 'solved'
GROUP BY user_id
ORDER BY problems_solved DESC;

-- ============================================
-- ALTERNATIVE FIX: Disable RLS temporarily for testing
-- ============================================
-- WARNING: Only use this for testing! Re-enable RLS after confirming it works

-- Disable RLS on problem_submissions (TESTING ONLY)
-- ALTER TABLE public.problem_submissions DISABLE ROW LEVEL SECURITY;

-- Test leaderboard
-- SELECT * FROM get_leaderboard('alltime');

-- Re-enable RLS (IMPORTANT!)
-- ALTER TABLE public.problem_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SUMMARY
-- ============================================
-- This script:
-- 1. Removes restrictive RLS policies
-- 2. Adds policy to allow reading ALL solved submissions
-- 3. Recreates get_leaderboard with SECURITY DEFINER (bypasses RLS)
-- 4. Grants proper permissions
-- 5. Shows all users on leaderboard ranked by points
