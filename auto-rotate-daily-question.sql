-- ============================================
-- AUTOMATIC DAILY QUESTION ROTATION
-- ============================================
-- This creates a scheduled job to generate a new random question every day at midnight

-- Step 1: Enable the pg_cron extension (run this once)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Step 2: Create a function to auto-generate daily question
CREATE OR REPLACE FUNCTION auto_generate_daily_question()
RETURNS void AS $$
DECLARE
  v_random_problem RECORD;
  v_question_id UUID;
BEGIN
  -- Check if a question already exists for today
  SELECT id INTO v_question_id
  FROM public.daily_questions
  WHERE date = CURRENT_DATE;

  -- Only generate if no question exists for today
  IF v_question_id IS NULL THEN
    -- Select a random problem (you'll need to replace this with actual problem data)
    -- For now, we'll use arr-1 as a placeholder
    -- In production, this would select from your problems table
    
    INSERT INTO public.daily_questions (
      problem_id,
      problem_title,
      difficulty,
      topic_id,
      url,
      patterns,
      date
    ) VALUES (
      'arr-' || floor(random() * 1680 + 1)::text,
      'Daily Challenge',
      CASE floor(random() * 3)
        WHEN 0 THEN 'Easy'
        WHEN 1 THEN 'Medium'
        ELSE 'Hard'
      END,
      'arrays-strings',
      'https://leetcode.com/problems/daily-challenge/',
      ARRAY['Array', 'Problem Solving'],
      CURRENT_DATE
    );
    
    RAISE NOTICE 'Daily question generated for %', CURRENT_DATE;
  ELSE
    RAISE NOTICE 'Question already exists for %', CURRENT_DATE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Schedule the job to run every day at midnight (UTC)
-- Note: This requires Supabase Pro plan or database with pg_cron enabled
SELECT cron.schedule(
  'generate-daily-question',           -- Job name
  '0 0 * * *',                        -- Every day at midnight (cron format)
  $$SELECT auto_generate_daily_question();$$
);

-- ============================================
-- ALTERNATIVE: Trigger-based approach (no pg_cron needed)
-- ============================================
-- This approach uses the frontend to generate questions automatically
-- The frontend already handles this, so no additional setup needed

-- To manually trigger question generation for testing:
-- SELECT auto_generate_daily_question();

-- To check scheduled jobs:
-- SELECT * FROM cron.job;

-- To remove the scheduled job:
-- SELECT cron.unschedule('generate-daily-question');

-- ============================================
-- CLEANUP: Delete old questions (optional)
-- ============================================
-- Keep only last 30 days of questions
CREATE OR REPLACE FUNCTION cleanup_old_daily_questions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.daily_questions
  WHERE date < CURRENT_DATE - INTERVAL '30 days';
  
  RAISE NOTICE 'Cleaned up old daily questions';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule cleanup to run weekly
SELECT cron.schedule(
  'cleanup-old-questions',
  '0 0 * * 0',  -- Every Sunday at midnight
  $$SELECT cleanup_old_daily_questions();$$
);
