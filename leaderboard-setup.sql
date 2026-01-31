-- Professional Leaderboard System for DSA Tracker
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- 1. CREATE LEADERBOARD FUNCTION
-- ============================================

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_leaderboard(TEXT);

-- Create get_leaderboard function with proper user aggregation
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

  -- Return leaderboard data
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
      COALESCE(up.full_name, au.email, 'Anonymous User') AS display_name,
      us.total_solved,
      us.easy_count,
      us.medium_count,
      us.hard_count,
      us.points,
      COALESCE(uprog.streak, 0) AS streak
    FROM user_stats us
    LEFT JOIN auth.users au ON us.user_id = au.id
    LEFT JOIN public.user_profiles up ON us.user_id = up.id
    LEFT JOIN public.user_progress uprog ON us.user_id = uprog.user_id
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

-- ============================================
-- 2. CREATE USER RANK FUNCTION
-- ============================================

DROP FUNCTION IF EXISTS get_user_rank(UUID);

CREATE OR REPLACE FUNCTION get_user_rank(p_user_id UUID)
RETURNS TABLE (
  user_id UUID,
  rank BIGINT,
  total_users BIGINT,
  points BIGINT,
  total_solved BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH user_stats AS (
    SELECT
      ps.user_id,
      COUNT(DISTINCT ps.problem_id) AS total_solved,
      (
        COUNT(DISTINCT CASE WHEN ps.difficulty = 'Easy' THEN ps.problem_id END) * 10 +
        COUNT(DISTINCT CASE WHEN ps.difficulty = 'Medium' THEN ps.problem_id END) * 25 +
        COUNT(DISTINCT CASE WHEN ps.difficulty = 'Hard' THEN ps.problem_id END) * 50
      ) AS points
    FROM public.problem_submissions ps
    WHERE ps.status = 'solved'
    GROUP BY ps.user_id
  ),
  ranked_users AS (
    SELECT
      us.user_id,
      us.points,
      us.total_solved,
      ROW_NUMBER() OVER (ORDER BY us.points DESC, us.total_solved DESC) AS rank
    FROM user_stats us
  )
  SELECT
    ru.user_id,
    ru.rank,
    (SELECT COUNT(*) FROM ranked_users)::BIGINT AS total_users,
    ru.points,
    ru.total_solved
  FROM ranked_users ru
  WHERE ru.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 3. CREATE LEADERBOARD POLICIES
-- ============================================

-- Allow all authenticated users to view leaderboard
CREATE POLICY IF NOT EXISTS "Allow all users to view leaderboard"
  ON public.problem_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- 4. GRANT PERMISSIONS
-- ============================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_leaderboard(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_user_rank(UUID) TO authenticated, anon;

-- ============================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Create indexes for faster leaderboard queries
CREATE INDEX IF NOT EXISTS idx_problem_submissions_leaderboard 
  ON public.problem_submissions(user_id, status, difficulty, solved_at)
  WHERE status = 'solved';

CREATE INDEX IF NOT EXISTS idx_problem_submissions_points 
  ON public.problem_submissions(user_id, difficulty)
  WHERE status = 'solved';

-- ============================================
-- SETUP COMPLETE
-- ============================================

-- Test the leaderboard function
SELECT * FROM get_leaderboard('alltime') LIMIT 10;

-- Verify the setup
SELECT 
  'Leaderboard function created successfully!' AS status,
  COUNT(*) AS total_users_on_leaderboard
FROM get_leaderboard('alltime');
