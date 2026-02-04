-- ============================================
-- UNIQUE USERNAME SYSTEM FOR SIGNUP
-- ============================================
-- This creates a unique username system where users can choose their own unique username

-- Step 1: Create user_profiles table if not exists (to store unique usernames)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 1.5: Add username column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'username'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN username TEXT;
  END IF;
END $$;

-- Step 1.6: Add unique constraint on username if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND constraint_name = 'user_profiles_username_key'
  ) THEN
    ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_username_key UNIQUE (username);
  END IF;
END $$;

-- Step 2: Create index on username for fast lookups
DROP INDEX IF EXISTS idx_user_profiles_username;
CREATE UNIQUE INDEX idx_user_profiles_username ON public.user_profiles(LOWER(username));

-- Step 3: Create a function to check if username is available
CREATE OR REPLACE FUNCTION is_username_available(p_username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 
    FROM public.user_profiles 
    WHERE LOWER(username) = LOWER(p_username)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Create a function to generate a unique username from full name
CREATE OR REPLACE FUNCTION generate_unique_username(p_full_name TEXT, p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INTEGER := 0;
BEGIN
  -- Clean the full name and convert to lowercase username
  base_username := LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(p_full_name, '[^a-zA-Z0-9]', '', 'g'),
      '\s+', '', 'g'
    )
  );
  
  -- Limit to 20 characters
  base_username := SUBSTRING(base_username, 1, 20);
  
  -- If empty, use 'user' as base
  IF base_username = '' THEN
    base_username := 'user';
  END IF;
  
  final_username := base_username;
  
  -- Keep trying until we find an available username
  WHILE EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE LOWER(username) = LOWER(final_username)
    AND id != p_user_id
  ) LOOP
    counter := counter + 1;
    final_username := base_username || counter::TEXT;
  END LOOP;
  
  RETURN final_username;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create a function to create/update user profile
CREATE OR REPLACE FUNCTION upsert_user_profile(
  p_user_id UUID,
  p_username TEXT,
  p_full_name TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_final_username TEXT;
BEGIN
  -- Check if username is provided
  IF p_username IS NULL OR TRIM(p_username) = '' THEN
    -- Generate from full name
    v_final_username := generate_unique_username(COALESCE(p_full_name, 'user'), p_user_id);
  ELSE
    -- Use provided username (check if available)
    IF NOT is_username_available(p_username) AND NOT EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = p_user_id AND LOWER(username) = LOWER(p_username)
    ) THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'Username already taken',
        'available', false
      );
    END IF;
    v_final_username := LOWER(TRIM(p_username));
  END IF;
  
  -- Insert or update user profile
  INSERT INTO public.user_profiles (id, username, full_name)
  VALUES (p_user_id, v_final_username, p_full_name)
  ON CONFLICT (id) 
  DO UPDATE SET 
    username = EXCLUDED.username,
    full_name = COALESCE(EXCLUDED.full_name, user_profiles.full_name),
    updated_at = NOW();
  
  RETURN jsonb_build_object(
    'success', true,
    'username', v_final_username,
    'available', true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 7: Create RLS policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;
CREATE POLICY "Users can view all profiles"
  ON public.user_profiles
  FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Step 8: Grant permissions
GRANT EXECUTE ON FUNCTION is_username_available(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION generate_unique_username(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION upsert_user_profile(UUID, TEXT, TEXT) TO authenticated;

-- Step 9: Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username, full_name)
  VALUES (
    NEW.id,
    generate_unique_username(
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      NEW.id
    ),
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Step 10: Update get_leaderboard to use username from user_profiles
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
  CASE time_filter
    WHEN 'daily' THEN filter_date := CURRENT_DATE;
    WHEN 'weekly' THEN filter_date := CURRENT_DATE - INTERVAL '7 days';
    WHEN 'monthly' THEN filter_date := CURRENT_DATE - INTERVAL '30 days';
    ELSE filter_date := '1970-01-01'::TIMESTAMP;
  END CASE;

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
      COALESCE(up.username, up.full_name, au.email, 'User ' || SUBSTRING(us.user_id::TEXT, 1, 8)) AS display_name,
      us.total_solved,
      us.easy_count,
      us.medium_count,
      us.hard_count,
      us.points,
      0 AS streak
    FROM user_stats us
    LEFT JOIN auth.users au ON us.user_id = au.id
    LEFT JOIN public.user_profiles up ON us.user_id = up.id
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

GRANT EXECUTE ON FUNCTION get_leaderboard(TEXT) TO authenticated, anon;

-- ============================================
-- TEST THE SYSTEM
-- ============================================

-- Test 1: Check if username is available
SELECT is_username_available('testuser123');
-- Expected: true (if not taken)

-- Test 2: Check all existing usernames
SELECT id, username, full_name FROM public.user_profiles;

-- Test 3: Generate a unique username
SELECT generate_unique_username('John Doe', gen_random_uuid());
-- Expected: 'johndoe' or 'johndoe1' if taken

-- ============================================
-- SUMMARY
-- ============================================
-- This script creates:
-- 1. user_profiles table with unique username constraint
-- 2. Function to check username availability
-- 3. Function to generate unique usernames from full names
-- 4. Function to create/update user profiles
-- 5. Trigger to auto-create profile on signup
-- 6. Updated get_leaderboard to show usernames
-- 7. RLS policies for security
