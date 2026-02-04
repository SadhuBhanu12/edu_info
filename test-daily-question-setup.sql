-- ============================================
-- TEST DAILY QUESTION SETUP
-- Run this in Supabase SQL Editor to verify setup
-- ============================================

-- Test 1: Check if tables exist
SELECT 'Tables Check:' as test;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('daily_questions', 'daily_question_submissions');

-- Test 2: Check if functions exist
SELECT 'Functions Check:' as test;
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('get_daily_question', 'generate_daily_question', 'get_daily_question_stats', 'submit_daily_question');

-- Test 3: Check RLS policies
SELECT 'RLS Policies Check:' as test;
SELECT tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename IN ('daily_questions', 'daily_question_submissions');

-- Test 4: Try to generate a test question (as authenticated user)
-- This will only work if you're logged in
SELECT 'Generate Test Question:' as test;
SELECT generate_daily_question(
  'test-1',
  'Test Problem',
  'Easy',
  'arrays-strings',
  'https://leetcode.com/problems/two-sum/',
  ARRAY['Array', 'Hash Map']
);

-- Test 5: Check if question was created
SELECT 'Check Created Question:' as test;
SELECT * FROM daily_questions WHERE date = CURRENT_DATE;

-- Test 6: Try to fetch daily question
SELECT 'Fetch Daily Question:' as test;
SELECT * FROM get_daily_question();

-- ============================================
-- CLEANUP (Optional - run if you want to reset)
-- ============================================
-- DELETE FROM daily_questions WHERE date = CURRENT_DATE;
