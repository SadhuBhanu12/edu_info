# 📡 Streak Tracking API Specification

## Base URL
```
https://your-project.supabase.co/rest/v1
```

## Authentication
All requests require authentication via Supabase JWT token:
```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### 1. Update Streak (Atomic)

**RPC Function**: `update_user_streak_atomic`

```http
POST /rpc/update_user_streak_atomic
Content-Type: application/json
Authorization: Bearer <token>

{
  "p_user_id": "uuid-string",
  "p_timezone": "America/New_York",
  "p_request_id": "optional-unique-id"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "current_streak": 5,
  "longest_streak": 10,
  "last_active_date": "2026-01-31",
  "change_type": "STREAK_INCREMENT",
  "message": "Streak increased to 5 days! 🔥"
}
```

**Change Types**:
- `FIRST_ACTIVITY` - User's first solve
- `STREAK_INCREMENT` - Consecutive day (streak++)
- `STREAK_MAINTAINED` - Same day (no change)
- `STREAK_RESET` - Missed day(s)

**Error Response** (500):
```json
{
  "code": "CONCURRENT_MODIFICATION",
  "message": "Concurrent modification detected. Retry required.",
  "hint": "Use exponential backoff retry"
}
```

---

### 2. Get User Streak

**RPC Function**: `get_user_streak`

```http
POST /rpc/get_user_streak
Content-Type: application/json
Authorization: Bearer <token>

{
  "p_user_id": "uuid-string"
}
```

**Response** (200 OK):
```json
{
  "current_streak": 5,
  "longest_streak": 10,
  "last_active_date": "2026-01-31",
  "timezone": "America/New_York",
  "is_active_today": true,
  "days_since_activity": 0
}
```

**New User** (never solved):
```json
{
  "current_streak": 0,
  "longest_streak": 0,
  "last_active_date": null,
  "timezone": "UTC",
  "is_active_today": false,
  "days_since_activity": null
}
```

---

### 3. Get Streak Leaderboard

**RPC Function**: `get_streak_leaderboard`

```http
POST /rpc/get_streak_leaderboard
Content-Type: application/json
Authorization: Bearer <token>

{
  "p_limit": 100,
  "p_offset": 0
}
```

**Response** (200 OK):
```json
[
  {
    "rank": 1,
    "user_id": "uuid-1",
    "current_streak": 365,
    "longest_streak": 400,
    "last_active_date": "2026-01-31",
    "is_active_today": true
  },
  {
    "rank": 2,
    "user_id": "uuid-2",
    "current_streak": 180,
    "longest_streak": 200,
    "last_active_date": "2026-01-31",
    "is_active_today": true
  }
]
```

**Pagination**:
- `p_limit`: Max results (default: 100, max: 1000)
- `p_offset`: Skip N results (for pagination)

---

### 4. Get Streak History (Audit Log)

**Table Query**: `streak_history`

```http
GET /streak_history?user_id=eq.uuid-string&order=created_at.desc&limit=50
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
[
  {
    "id": 12345,
    "user_id": "uuid-string",
    "old_current_streak": 4,
    "new_current_streak": 5,
    "old_longest_streak": 10,
    "new_longest_streak": 10,
    "activity_date": "2026-01-31",
    "last_active_date": "2026-01-30",
    "change_type": "STREAK_INCREMENT",
    "timezone": "America/New_York",
    "version_before": 45,
    "version_after": 46,
    "request_id": "req-abc123",
    "created_at": "2026-01-31T14:30:00Z"
  }
]
```

**Filters**:
- `change_type=eq.STREAK_INCREMENT` - Only increments
- `activity_date=gte.2026-01-01` - Date range
- `created_at=gte.2026-01-31T00:00:00Z` - Timestamp range

---

### 5. Get User's Current Streak (Direct Table)

**Table Query**: `user_streaks`

```http
GET /user_streaks?user_id=eq.uuid-string&select=*
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
[
  {
    "id": "internal-uuid",
    "user_id": "user-uuid",
    "current_streak": 5,
    "longest_streak": 10,
    "last_active_date": "2026-01-31",
    "timezone": "America/New_York",
    "version": 46,
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-01-31T14:30:00Z"
  }
]
```

---

## TypeScript Client Usage

### Using Supabase Client

```typescript
import { supabase } from './lib/supabase';

// 1. Update streak
const { data, error } = await supabase.rpc('update_user_streak_atomic', {
  p_user_id: userId,
  p_timezone: 'America/New_York',
  p_request_id: crypto.randomUUID(),
});

// 2. Get streak
const { data, error } = await supabase.rpc('get_user_streak', {
  p_user_id: userId,
});

// 3. Get leaderboard
const { data, error } = await supabase.rpc('get_streak_leaderboard', {
  p_limit: 50,
  p_offset: 0,
});

// 4. Get history
const { data, error } = await supabase
  .from('streak_history')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(50);
```

### Using Service Layer (Recommended)

```typescript
import StreakService from './services/streakService';

// 1. Update streak (with retry logic)
const result = await StreakService.updateStreak(userId, 'UTC');

// 2. Get streak (with caching)
const streak = await StreakService.getStreakCached(userId);

// 3. Handle problem solved (full flow)
const result = await StreakService.handleProblemSolved(userId);

// 4. Get leaderboard
const leaderboard = await StreakService.getLeaderboard(100, 0);

// 5. Get history
const history = await StreakService.getHistory(userId, 50);
```

---

## Real-time Subscriptions

### Subscribe to User's Streak Updates

```typescript
const channel = supabase
  .channel(`user:${userId}:streaks`)
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'user_streaks',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      console.log('Streak updated!', payload.new);
      // Update UI
    }
  )
  .subscribe();
```

### Subscribe to Leaderboard Changes

```typescript
const channel = supabase
  .channel('streak-leaderboard')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'user_streaks',
    },
    () => {
      // Refetch leaderboard
      fetchLeaderboard();
    }
  )
  .subscribe();
```

---

## Error Codes

| Code | Description | Retryable | Solution |
|------|-------------|-----------|----------|
| `CONCURRENT_MODIFICATION` | Version conflict detected | ✅ Yes | Retry with backoff |
| `DATABASE_ERROR` | PostgreSQL error | ⚠️ Maybe | Check logs, retry once |
| `INVALID_INPUT` | Invalid user ID or timezone | ❌ No | Fix input parameters |
| `INVALID_RESPONSE` | Empty response from DB | ❌ No | Check function exists |
| `MAX_RETRIES_EXCEEDED` | All retry attempts failed | ❌ No | Investigate root cause |

---

## Rate Limiting

**Recommended Limits**:
- Per user: 60 requests/minute
- Global: 10,000 requests/minute

**Implementation**:
```typescript
// Client-side debouncing
const debouncedUpdate = debounce(
  () => StreakService.updateStreak(userId, tz),
  1000 // 1 second
);
```

---

## Performance Benchmarks

**Expected Latency** (p95):
- `update_user_streak_atomic`: < 150ms
- `get_user_streak`: < 50ms
- `get_streak_leaderboard`: < 200ms

**Throughput**:
- Single user: 1,000+ updates/sec
- Concurrent users: 10,000+ updates/sec

---

## Idempotency

All update operations are **idempotent**:

```typescript
// Same day, multiple calls
await updateStreak(userId, 'UTC'); // FIRST_ACTIVITY
await updateStreak(userId, 'UTC'); // STREAK_MAINTAINED (no change)
await updateStreak(userId, 'UTC'); // STREAK_MAINTAINED (no change)

// Final state: streak = 1
```

**Request ID** for deduplication:
```typescript
const requestId = crypto.randomUUID();

await updateStreak(userId, 'UTC', 3, requestId);
await updateStreak(userId, 'UTC', 3, requestId); // Same request ID

// Tracked in streak_history for debugging
```

---

## Security

### Row Level Security (RLS)

Users can only:
- ✅ Read their own streak data
- ❌ Update their own streak (requires service role)
- ✅ View public leaderboard

**Policies**:
```sql
-- Users read own streak
CREATE POLICY "Users view own streak"
ON user_streaks FOR SELECT
USING (auth.uid() = user_id);

-- Service role updates
CREATE POLICY "Service role updates"
ON user_streaks FOR ALL
USING (auth.role() = 'service_role');
```

### Input Validation

```typescript
// Validate user ID
if (!isValidUUID(userId)) {
  throw new Error('Invalid user ID');
}

// Validate timezone
if (!IANA_TIMEZONES.includes(timezone)) {
  timezone = 'UTC'; // Fallback
}
```

---

## Monitoring Queries

### Active Users Today

```sql
SELECT COUNT(*) 
FROM user_streaks
WHERE last_active_date = CURRENT_DATE;
```

### Average Streak

```sql
SELECT AVG(current_streak)
FROM user_streaks
WHERE current_streak > 0;
```

### Top Streaks

```sql
SELECT user_id, current_streak, longest_streak
FROM user_streaks
ORDER BY current_streak DESC
LIMIT 10;
```

### Recent Updates

```sql
SELECT 
    change_type,
    COUNT(*) as count
FROM streak_history
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY change_type;
```

---

## Testing Endpoints

### cURL Examples

```bash
# Update streak
curl -X POST "https://your-project.supabase.co/rest/v1/rpc/update_user_streak_atomic" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "p_user_id": "uuid-here",
    "p_timezone": "UTC"
  }'

# Get streak
curl -X POST "https://your-project.supabase.co/rest/v1/rpc/get_user_streak" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "p_user_id": "uuid-here"
  }'

# Get leaderboard
curl -X POST "https://your-project.supabase.co/rest/v1/rpc/get_streak_leaderboard" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "p_limit": 10,
    "p_offset": 0
  }'
```

---

## Support

For issues or questions:
1. Check [STREAK_TRACKING_COMPLETE_GUIDE.md](./STREAK_TRACKING_COMPLETE_GUIDE.md)
2. Review [STREAK_QUICK_START.md](./STREAK_QUICK_START.md)
3. Check test suite: `src/tests/streakService.test.ts`
4. Review database schema: `database/streak-tracking-schema.sql`

---

**Version**: 1.0.0  
**Last Updated**: 2026-01-31  
**API Stability**: Stable ✅
