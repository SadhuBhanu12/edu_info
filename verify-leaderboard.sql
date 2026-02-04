-- ============================================
-- LEADERBOARD VERIFICATION SCRIPT
-- ============================================
-- Run this in Supabase SQL Editor to verify everything is working

-- 1. Check if get_leaderboard function exists
SELECT 
  routine_name,
  routine_type,
  data_type as return_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name = 'get_leaderboard';

-- Expected: Should see one row with get_leaderboard function

-- 2. Check if problem_submissions table exists
SELECT 
  table_name,
  (SELECT COUNT(*) FROM problem_submissions) as total_records
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'problem_submissions';

-- Expected: Should see problem_submissions table with record count

-- 3. Test the get_leaderboard function
SELECT * FROM get_leaderboard('alltime');

-- Expected: Should return all users with:
-- - user_id
-- - display_name
-- - total_solved
-- - easy_count, medium_count, hard_count
-- - points
-- - streak
-- - rank

-- 4. Check if users have solved problems
SELECT 
  user_id,
  COUNT(DISTINCT problem_id) as unique_problems_solved,
  COUNT(*) FILTER (WHERE difficulty = 'Easy') as easy_solved,
  COUNT(*) FILTER (WHERE difficulty = 'Medium') as medium_solved,
  COUNT(*) FILTER (WHERE difficulty = 'Hard') as hard_solved
FROM problem_submissions
WHERE status = 'solved'
GROUP BY user_id
ORDER BY unique_problems_solved DESC;

-- Expected: Should show breakdown for each user

-- 5. If get_leaderboard doesn't exist, create it:
-- Copy and run this only if step 1 shows no results

/*
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
BEGIN
  RETURN QUERY
  WITH user_stats AS (
    SELECT 
      ps.user_id,
      COALESCE(u.raw_user_meta_data->>'display_name', u.email) as display_name,
      COUNT(DISTINCT ps.problem_id) as total_solved,
      COUNT(DISTINCT ps.problem_id) FILTER (WHERE ps.difficulty = 'Easy') as easy_count,
      COUNT(DISTINCT ps.problem_id) FILTER (WHERE ps.difficulty = 'Medium') as medium_count,
      COUNT(DISTINCT ps.problem_id) FILTER (WHERE ps.difficulty = 'Hard') as hard_count,
      (
        COUNT(DISTINCT ps.problem_id) FILTER (WHERE ps.difficulty = 'Easy') * 10 +
        COUNT(DISTINCT ps.problem_id) FILTER (WHERE ps.difficulty = 'Medium') * 25 +
        COUNT(DISTINCT ps.problem_id) FILTER (WHERE ps.difficulty = 'Hard') * 50
      ) as points,
      0 as streak
    FROM problem_submissions ps
    LEFT JOIN auth.users u ON u.id = ps.user_id
    WHERE ps.status = 'solved'
      AND (
        time_filter = 'alltime' OR
        (time_filter = 'daily' AND ps.solved_at >= CURRENT_DATE) OR
        (time_filter = 'weekly' AND ps.solved_at >= CURRENT_DATE - INTERVAL '7 days') OR
        (time_filter = 'monthly' AND ps.solved_at >= CURRENT_DATE - INTERVAL '30 days')
      )
    GROUP BY ps.user_id, u.email, u.raw_user_meta_data
  )
  SELECT 
    us.user_id,
    us.display_name,
    us.total_solved,
    us.easy_count,
    us.medium_count,
    us.hard_count,
    us.points,
    us.streak,
    ROW_NUMBER() OVER (ORDER BY us.points DESC, us.total_solved DESC) as rank
  FROM user_stats us
  ORDER BY rank;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_leaderboard(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_leaderboard(TEXT) TO anon;
*/
