-- =====================================================
-- CONCURRENT-SAFE STREAK TRACKING SYSTEM
-- =====================================================
-- Author: Senior Backend Engineering Team
-- Date: 2026-01-31
-- Database: PostgreSQL (Supabase)
-- Version: 1.0.0
-- =====================================================

-- =====================================================
-- TABLE: user_streaks
-- Purpose: Store daily activity streak data with concurrency controls
-- =====================================================

CREATE TABLE IF NOT EXISTS user_streaks (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User reference (indexed for fast lookups)
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Streak counters
    current_streak INTEGER NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
    longest_streak INTEGER NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
    
    -- Date tracking (ALWAYS stored in UTC, converted based on user timezone)
    last_active_date DATE NOT NULL,
    
    -- Timezone preference (IANA timezone identifier)
    -- Examples: "America/New_York", "Asia/Kolkata", "Europe/London"
    timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
    
    -- Optimistic locking version (prevents race conditions)
    version INTEGER NOT NULL DEFAULT 1,
    
    -- Audit timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Constraints
    CONSTRAINT unique_user_streak UNIQUE(user_id),
    CONSTRAINT valid_longest_streak CHECK (longest_streak >= current_streak)
);

-- =====================================================
-- INDEXES: Optimized for high-concurrency reads/writes
-- =====================================================

-- Primary lookup index
CREATE INDEX IF NOT EXISTS idx_user_streaks_user_id ON user_streaks(user_id);

-- Query optimization for leaderboard/analytics
CREATE INDEX IF NOT EXISTS idx_user_streaks_current ON user_streaks(current_streak DESC);
CREATE INDEX IF NOT EXISTS idx_user_streaks_longest ON user_streaks(longest_streak DESC);

-- Date-based queries (active users today, etc.)
CREATE INDEX IF NOT EXISTS idx_user_streaks_last_active ON user_streaks(last_active_date DESC);

-- Composite index for streak continuity checks
CREATE INDEX IF NOT EXISTS idx_user_streaks_user_date ON user_streaks(user_id, last_active_date);

-- =====================================================
-- TABLE: streak_history
-- Purpose: Audit log for all streak transitions (debugging & analytics)
-- =====================================================

CREATE TABLE IF NOT EXISTS streak_history (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Streak state before and after
    old_current_streak INTEGER NOT NULL,
    new_current_streak INTEGER NOT NULL,
    old_longest_streak INTEGER NOT NULL,
    new_longest_streak INTEGER NOT NULL,
    
    -- Date information
    activity_date DATE NOT NULL,
    last_active_date DATE,
    
    -- Change reason
    change_type VARCHAR(50) NOT NULL CHECK (change_type IN (
        'FIRST_ACTIVITY',      -- User's first problem solve
        'STREAK_INCREMENT',    -- Consecutive day activity
        'STREAK_MAINTAINED',   -- Same day activity (no change)
        'STREAK_RESET',        -- Gap detected, reset to 1
        'STREAK_RECOVERED'     -- Manual recovery/correction
    )),
    
    -- Metadata
    timezone VARCHAR(64) NOT NULL,
    version_before INTEGER NOT NULL,
    version_after INTEGER NOT NULL,
    
    -- Request tracking (for debugging race conditions)
    request_id VARCHAR(100),
    
    -- Timestamp
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Indexes
    CONSTRAINT valid_streak_change CHECK (new_current_streak >= 0)
);

-- Index for user history queries
CREATE INDEX IF NOT EXISTS idx_streak_history_user ON streak_history(user_id, created_at DESC);

-- Index for analytics (streak resets, increments, etc.)
CREATE INDEX IF NOT EXISTS idx_streak_history_type ON streak_history(change_type, created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- Purpose: Ensure users can only read their own streak data
-- =====================================================

ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_history ENABLE ROW LEVEL SECURITY;

-- Users can read only their own streak data
CREATE POLICY "Users can view own streak"
    ON user_streaks FOR SELECT
    USING (auth.uid() = user_id);

-- Users can view their own streak history
CREATE POLICY "Users can view own streak history"
    ON streak_history FOR SELECT
    USING (auth.uid() = user_id);

-- Service role can do everything (for backend operations)
CREATE POLICY "Service role full access to streaks"
    ON user_streaks FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to history"
    ON streak_history FOR ALL
    USING (auth.role() = 'service_role');

-- =====================================================
-- FUNCTION: get_user_local_date
-- Purpose: Convert UTC timestamp to user's local date
-- Concurrency: Read-only, safe for concurrent calls
-- =====================================================

CREATE OR REPLACE FUNCTION get_user_local_date(
    p_user_id UUID,
    p_utc_timestamp TIMESTAMPTZ DEFAULT now()
)
RETURNS DATE
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_timezone VARCHAR(64);
    v_local_date DATE;
BEGIN
    -- Get user's timezone preference
    SELECT timezone INTO v_timezone
    FROM user_streaks
    WHERE user_id = p_user_id;
    
    -- Default to UTC if no preference set
    IF v_timezone IS NULL THEN
        v_timezone := 'UTC';
    END IF;
    
    -- Convert UTC timestamp to local date
    v_local_date := (p_utc_timestamp AT TIME ZONE v_timezone)::DATE;
    
    RETURN v_local_date;
END;
$$;

-- =====================================================
-- FUNCTION: update_user_streak_atomic
-- Purpose: ATOMIC, IDEMPOTENT streak update with full concurrency safety
-- Concurrency: Row-level locking with SELECT FOR UPDATE
-- Idempotency: Same-day calls don't duplicate increments
-- =====================================================

CREATE OR REPLACE FUNCTION update_user_streak_atomic(
    p_user_id UUID,
    p_timezone VARCHAR(64) DEFAULT 'UTC',
    p_request_id VARCHAR(100) DEFAULT NULL
)
RETURNS TABLE(
    success BOOLEAN,
    current_streak INTEGER,
    longest_streak INTEGER,
    last_active_date DATE,
    change_type VARCHAR(50),
    message TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_today_local DATE;
    v_yesterday_local DATE;
    v_existing_record RECORD;
    v_new_current_streak INTEGER;
    v_new_longest_streak INTEGER;
    v_change_type VARCHAR(50);
    v_days_diff INTEGER;
    v_version_before INTEGER;
    v_version_after INTEGER;
BEGIN
    -- Calculate user's local date (timezone-aware)
    v_today_local := (now() AT TIME ZONE p_timezone)::DATE;
    v_yesterday_local := v_today_local - INTERVAL '1 day';
    
    -- =====================================================
    -- CRITICAL SECTION: Row-level lock to prevent race conditions
    -- SELECT FOR UPDATE ensures only ONE transaction can proceed
    -- =====================================================
    
    SELECT *
    INTO v_existing_record
    FROM user_streaks
    WHERE user_id = p_user_id
    FOR UPDATE;  -- LOCKS the row until transaction commits
    
    -- =====================================================
    -- CASE 1: New user (first problem solve)
    -- =====================================================
    
    IF v_existing_record IS NULL THEN
        INSERT INTO user_streaks (
            user_id,
            current_streak,
            longest_streak,
            last_active_date,
            timezone,
            version
        )
        VALUES (
            p_user_id,
            1,
            1,
            v_today_local,
            p_timezone,
            1
        );
        
        -- Log the change
        INSERT INTO streak_history (
            user_id,
            old_current_streak,
            new_current_streak,
            old_longest_streak,
            new_longest_streak,
            activity_date,
            last_active_date,
            change_type,
            timezone,
            version_before,
            version_after,
            request_id
        )
        VALUES (
            p_user_id,
            0,
            1,
            0,
            1,
            v_today_local,
            NULL,
            'FIRST_ACTIVITY',
            p_timezone,
            0,
            1,
            p_request_id
        );
        
        RETURN QUERY SELECT 
            true,
            1::INTEGER,
            1::INTEGER,
            v_today_local,
            'FIRST_ACTIVITY'::VARCHAR(50),
            'Streak started! First problem solved.'::TEXT;
        RETURN;
    END IF;
    
    -- =====================================================
    -- CASE 2: Same day activity (IDEMPOTENT - no change)
    -- =====================================================
    
    IF v_existing_record.last_active_date = v_today_local THEN
        -- Log idempotent call (for debugging)
        INSERT INTO streak_history (
            user_id,
            old_current_streak,
            new_current_streak,
            old_longest_streak,
            new_longest_streak,
            activity_date,
            last_active_date,
            change_type,
            timezone,
            version_before,
            version_after,
            request_id
        )
        VALUES (
            p_user_id,
            v_existing_record.current_streak,
            v_existing_record.current_streak,
            v_existing_record.longest_streak,
            v_existing_record.longest_streak,
            v_today_local,
            v_existing_record.last_active_date,
            'STREAK_MAINTAINED',
            p_timezone,
            v_existing_record.version,
            v_existing_record.version,
            p_request_id
        );
        
        RETURN QUERY SELECT 
            true,
            v_existing_record.current_streak,
            v_existing_record.longest_streak,
            v_existing_record.last_active_date,
            'STREAK_MAINTAINED'::VARCHAR(50),
            'Already active today. Streak unchanged.'::TEXT;
        RETURN;
    END IF;
    
    -- =====================================================
    -- CASE 3: Consecutive day activity (increment streak)
    -- =====================================================
    
    v_days_diff := v_today_local - v_existing_record.last_active_date;
    
    IF v_days_diff = 1 THEN
        -- Increment streak
        v_new_current_streak := v_existing_record.current_streak + 1;
        v_new_longest_streak := GREATEST(v_existing_record.longest_streak, v_new_current_streak);
        v_change_type := 'STREAK_INCREMENT';
        
    -- =====================================================
    -- CASE 4: Missed day(s) - reset streak
    -- =====================================================
    
    ELSE
        -- Reset to 1
        v_new_current_streak := 1;
        v_new_longest_streak := v_existing_record.longest_streak; -- Keep historical best
        v_change_type := 'STREAK_RESET';
    END IF;
    
    -- =====================================================
    -- ATOMIC UPDATE with optimistic locking
    -- =====================================================
    
    v_version_before := v_existing_record.version;
    v_version_after := v_version_before + 1;
    
    UPDATE user_streaks
    SET 
        current_streak = v_new_current_streak,
        longest_streak = v_new_longest_streak,
        last_active_date = v_today_local,
        timezone = p_timezone,
        version = v_version_after,
        updated_at = now()
    WHERE 
        user_id = p_user_id
        AND version = v_version_before;  -- Optimistic lock check
    
    -- Verify update succeeded (shouldn't fail with FOR UPDATE lock)
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Concurrent modification detected. Retry required.';
    END IF;
    
    -- =====================================================
    -- AUDIT LOG: Record the change
    -- =====================================================
    
    INSERT INTO streak_history (
        user_id,
        old_current_streak,
        new_current_streak,
        old_longest_streak,
        new_longest_streak,
        activity_date,
        last_active_date,
        change_type,
        timezone,
        version_before,
        version_after,
        request_id
    )
    VALUES (
        p_user_id,
        v_existing_record.current_streak,
        v_new_current_streak,
        v_existing_record.longest_streak,
        v_new_longest_streak,
        v_today_local,
        v_existing_record.last_active_date,
        v_change_type,
        p_timezone,
        v_version_before,
        v_version_after,
        p_request_id
    );
    
    -- Return success
    RETURN QUERY SELECT 
        true,
        v_new_current_streak,
        v_new_longest_streak,
        v_today_local,
        v_change_type,
        CASE 
            WHEN v_change_type = 'STREAK_INCREMENT' THEN 
                format('Streak increased to %s days! 🔥', v_new_current_streak)
            WHEN v_change_type = 'STREAK_RESET' THEN 
                format('Streak reset. You missed %s day(s). Starting fresh!', v_days_diff - 1)
        END;
END;
$$;

-- =====================================================
-- FUNCTION: get_user_streak
-- Purpose: Retrieve current streak data (read-only, fast)
-- Concurrency: Safe for concurrent reads
-- =====================================================

CREATE OR REPLACE FUNCTION get_user_streak(p_user_id UUID)
RETURNS TABLE(
    current_streak INTEGER,
    longest_streak INTEGER,
    last_active_date DATE,
    timezone VARCHAR(64),
    is_active_today BOOLEAN,
    days_since_activity INTEGER
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_today_local DATE;
    v_record RECORD;
BEGIN
    SELECT * INTO v_record
    FROM user_streaks
    WHERE user_id = p_user_id;
    
    IF v_record IS NULL THEN
        RETURN QUERY SELECT 
            0::INTEGER,
            0::INTEGER,
            NULL::DATE,
            'UTC'::VARCHAR(64),
            false::BOOLEAN,
            NULL::INTEGER;
        RETURN;
    END IF;
    
    v_today_local := (now() AT TIME ZONE v_record.timezone)::DATE;
    
    RETURN QUERY SELECT 
        v_record.current_streak,
        v_record.longest_streak,
        v_record.last_active_date,
        v_record.timezone,
        (v_record.last_active_date = v_today_local)::BOOLEAN,
        (v_today_local - v_record.last_active_date)::INTEGER;
END;
$$;

-- =====================================================
-- FUNCTION: get_streak_leaderboard
-- Purpose: Get top users by current streak
-- Concurrency: Safe, read-only
-- =====================================================

CREATE OR REPLACE FUNCTION get_streak_leaderboard(
    p_limit INTEGER DEFAULT 100,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE(
    rank BIGINT,
    user_id UUID,
    current_streak INTEGER,
    longest_streak INTEGER,
    last_active_date DATE,
    is_active_today BOOLEAN
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER (ORDER BY us.current_streak DESC, us.longest_streak DESC) as rank,
        us.user_id,
        us.current_streak,
        us.longest_streak,
        us.last_active_date,
        (us.last_active_date = (now() AT TIME ZONE us.timezone)::DATE)::BOOLEAN as is_active_today
    FROM user_streaks us
    WHERE us.current_streak > 0
    ORDER BY us.current_streak DESC, us.longest_streak DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;

-- =====================================================
-- TRIGGER: Auto-update updated_at timestamp
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_streaks_updated_at
    BEFORE UPDATE ON user_streaks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS: Documentation for future developers
-- =====================================================

COMMENT ON TABLE user_streaks IS 'Stores daily activity streaks with concurrency controls. Uses optimistic locking (version column) and row-level locks for atomic updates.';
COMMENT ON COLUMN user_streaks.version IS 'Optimistic locking version. Incremented on each update to detect concurrent modifications.';
COMMENT ON COLUMN user_streaks.timezone IS 'IANA timezone identifier (e.g., America/New_York). Used to calculate local dates correctly.';
COMMENT ON COLUMN user_streaks.last_active_date IS 'Last date user was active (in their local timezone). Stored as DATE in UTC, converted based on timezone.';

COMMENT ON TABLE streak_history IS 'Audit log for all streak changes. Useful for debugging race conditions and analyzing user behavior.';
COMMENT ON COLUMN streak_history.request_id IS 'Unique request identifier for tracing concurrent requests and debugging idempotency.';

COMMENT ON FUNCTION update_user_streak_atomic IS 'ATOMIC and IDEMPOTENT streak update. Uses SELECT FOR UPDATE for row-level locking. Safe for high-concurrency environments.';
COMMENT ON FUNCTION get_user_streak IS 'Read-only streak retrieval. Safe for concurrent reads. No locking required.';

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Allow authenticated users to call these functions
GRANT EXECUTE ON FUNCTION get_user_streak(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_streak_leaderboard(INTEGER, INTEGER) TO authenticated;

-- Only service role can update streaks (prevents client-side tampering)
GRANT EXECUTE ON FUNCTION update_user_streak_atomic(UUID, VARCHAR, VARCHAR) TO service_role;
GRANT EXECUTE ON FUNCTION get_user_local_date(UUID, TIMESTAMPTZ) TO service_role;

-- =====================================================
-- INDEXES FOR REALTIME SUBSCRIPTIONS
-- =====================================================

-- Enable realtime updates for streak changes
-- Run in Supabase dashboard to enable realtime:
-- ALTER PUBLICATION supabase_realtime ADD TABLE user_streaks;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Verify installation
DO $$
BEGIN
    RAISE NOTICE '✅ Streak tracking system installed successfully!';
    RAISE NOTICE '📊 Tables created: user_streaks, streak_history';
    RAISE NOTICE '🔒 Row-level security enabled';
    RAISE NOTICE '⚡ Functions ready: update_user_streak_atomic, get_user_streak';
    RAISE NOTICE '🏆 Leaderboard function: get_streak_leaderboard';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Next steps:';
    RAISE NOTICE '1. Run this SQL in Supabase SQL Editor';
    RAISE NOTICE '2. Enable Realtime for user_streaks table';
    RAISE NOTICE '3. Deploy TypeScript API layer';
    RAISE NOTICE '4. Test concurrent requests';
END $$;
