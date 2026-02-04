-- ============================================
-- DAILY QUESTION (POTD) SCHEMA
-- ============================================

-- Create daily_questions table to store the daily question
CREATE TABLE IF NOT EXISTS public.daily_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  problem_id TEXT NOT NULL,
  problem_title TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  url TEXT NOT NULL,
  patterns TEXT[] DEFAULT '{}',
  date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on date for quick lookups
CREATE INDEX IF NOT EXISTS idx_daily_questions_date ON public.daily_questions(date);

-- Create daily_question_submissions table to track user attempts on daily questions
CREATE TABLE IF NOT EXISTS public.daily_question_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_question_id UUID REFERENCES public.daily_questions(id) ON DELETE CASCADE,
  problem_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unsolved', -- 'solved', 'unsolved', 'attempted'
  time_spent INTEGER DEFAULT 0, -- in seconds
  solved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, daily_question_id)
);

-- Create index on user_id and date for quick lookups
CREATE INDEX IF NOT EXISTS idx_daily_question_submissions_user ON public.daily_question_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_question_submissions_daily_question ON public.daily_question_submissions(daily_question_id);

-- Enable Row Level Security
ALTER TABLE public.daily_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_question_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for daily_questions (everyone can read, authenticated can insert)
DROP POLICY IF EXISTS "Allow public read access to daily_questions" ON public.daily_questions;
CREATE POLICY "Allow public read access to daily_questions" 
  ON public.daily_questions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert daily questions" ON public.daily_questions;
CREATE POLICY "Allow authenticated users to insert daily questions" 
  ON public.daily_questions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for daily_question_submissions (users can manage their own submissions)
DROP POLICY IF EXISTS "Users can read own daily submissions" ON public.daily_question_submissions;
CREATE POLICY "Users can read own daily submissions" 
  ON public.daily_question_submissions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own daily submissions" ON public.daily_question_submissions;
CREATE POLICY "Users can insert own daily submissions" 
  ON public.daily_question_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own daily submissions" ON public.daily_question_submissions;
CREATE POLICY "Users can update own daily submissions" 
  ON public.daily_question_submissions FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTION: Get Today's Daily Question
-- ============================================

DROP FUNCTION IF EXISTS get_daily_question();

CREATE OR REPLACE FUNCTION get_daily_question()
RETURNS TABLE (
  id UUID,
  problem_id TEXT,
  problem_title TEXT,
  difficulty TEXT,
  topic_id TEXT,
  url TEXT,
  patterns TEXT[],
  date DATE,
  user_solved BOOLEAN,
  solved_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dq.id,
    dq.problem_id,
    dq.problem_title,
    dq.difficulty,
    dq.topic_id,
    dq.url,
    dq.patterns,
    dq.date,
    CASE WHEN dqs.status = 'solved' THEN true ELSE false END AS user_solved,
    dqs.solved_at
  FROM public.daily_questions dq
  LEFT JOIN public.daily_question_submissions dqs 
    ON dq.id = dqs.daily_question_id AND dqs.user_id = auth.uid()
  WHERE dq.date = CURRENT_DATE
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Get Daily Question Stats
-- ============================================

DROP FUNCTION IF EXISTS get_daily_question_stats(UUID);

CREATE OR REPLACE FUNCTION get_daily_question_stats(p_daily_question_id UUID)
RETURNS TABLE (
  total_attempts BIGINT,
  total_solved BIGINT,
  solve_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) AS total_attempts,
    COUNT(*) FILTER (WHERE status = 'solved') AS total_solved,
    CASE 
      WHEN COUNT(*) > 0 THEN 
        ROUND((COUNT(*) FILTER (WHERE status = 'solved')::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
      ELSE 0
    END AS solve_percentage
  FROM public.daily_question_submissions
  WHERE daily_question_id = p_daily_question_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Submit Daily Question Attempt
-- ============================================

DROP FUNCTION IF EXISTS submit_daily_question(UUID, TEXT, TEXT, INTEGER);

CREATE OR REPLACE FUNCTION submit_daily_question(
  p_daily_question_id UUID,
  p_problem_id TEXT,
  p_status TEXT,
  p_time_spent INTEGER DEFAULT 0
)
RETURNS JSONB AS $$
DECLARE
  v_submission_id UUID;
  v_existing_record UUID;
BEGIN
  -- Check if user already has a submission for this daily question
  SELECT id INTO v_existing_record
  FROM public.daily_question_submissions
  WHERE user_id = auth.uid() AND daily_question_id = p_daily_question_id;

  IF v_existing_record IS NOT NULL THEN
    -- Update existing submission
    UPDATE public.daily_question_submissions
    SET 
      status = p_status,
      time_spent = time_spent + p_time_spent,
      solved_at = CASE WHEN p_status = 'solved' AND solved_at IS NULL THEN NOW() ELSE solved_at END,
      updated_at = NOW()
    WHERE id = v_existing_record
    RETURNING id INTO v_submission_id;
  ELSE
    -- Insert new submission
    INSERT INTO public.daily_question_submissions (
      user_id,
      daily_question_id,
      problem_id,
      status,
      time_spent,
      solved_at
    ) VALUES (
      auth.uid(),
      p_daily_question_id,
      p_problem_id,
      p_status,
      p_time_spent,
      CASE WHEN p_status = 'solved' THEN NOW() ELSE NULL END
    )
    RETURNING id INTO v_submission_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'submission_id', v_submission_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_daily_question() TO authenticated;
GRANT EXECUTE ON FUNCTION get_daily_question_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION submit_daily_question(UUID, TEXT, TEXT, INTEGER) TO authenticated;

-- ============================================
-- FUNCTION: Generate Daily Question (Auto)
-- ============================================

DROP FUNCTION IF EXISTS generate_daily_question(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT[]);

CREATE OR REPLACE FUNCTION generate_daily_question(
  p_problem_id TEXT,
  p_problem_title TEXT,
  p_difficulty TEXT,
  p_topic_id TEXT,
  p_url TEXT,
  p_patterns TEXT[]
)
RETURNS JSONB AS $$
DECLARE
  v_question_id UUID;
  v_existing_id UUID;
BEGIN
  -- Check if question already exists for today
  SELECT id INTO v_existing_id
  FROM public.daily_questions
  WHERE date = CURRENT_DATE;

  IF v_existing_id IS NOT NULL THEN
    -- Question already exists, return it
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Question already exists for today',
      'question_id', v_existing_id
    );
  END IF;

  -- Insert new daily question
  INSERT INTO public.daily_questions (
    problem_id,
    problem_title,
    difficulty,
    topic_id,
    url,
    patterns,
    date
  ) VALUES (
    p_problem_id,
    p_problem_title,
    p_difficulty,
    p_topic_id,
    p_url,
    p_patterns,
    CURRENT_DATE
  )
  RETURNING id INTO v_question_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Daily question generated',
    'question_id', v_question_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION generate_daily_question(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT[]) TO authenticated;

-- ============================================
-- SAMPLE DATA: Insert Daily Questions (Optional)
-- ============================================
-- This will be populated by the frontend automatically,
-- but you can manually insert for testing:

-- Example:
-- INSERT INTO public.daily_questions (problem_id, problem_title, difficulty, topic_id, url, patterns, date)
-- VALUES (
--   'arr-1',
--   'Two Sum',
--   'Easy',
--   'arrays-strings',
--   'https://leetcode.com/problems/two-sum/',
--   ARRAY['Hash Map', 'Array'],
--   CURRENT_DATE
-- );
