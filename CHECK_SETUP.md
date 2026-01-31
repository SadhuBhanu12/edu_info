# Quick Diagnostic Checklist

## ✅ Step 1: Verify Supabase Tables

1. Go to https://supabase.com/dashboard
2. Click your project (hcylrrfxcaqpqbmkdmzo)
3. Click **Table Editor** on the left
4. You should see these 3 tables:
   - ✅ user_profiles
   - ✅ user_progress  
   - ✅ problem_submissions

**If tables are MISSING:**
1. Click **SQL Editor** on the left
2. Click **+ New query**
3. Open `supabase-schema.sql` in VS Code
4. Copy lines 1-147 (ONLY the SQL code)
5. Paste and click **Run**

## ✅ Step 2: Check Browser Console

1. Open http://localhost:5174
2. Press **F12**
3. Click **Console** tab
4. Try to sign up
5. Look for RED error messages

**Common Errors:**

```
❌ "Database not configured"
Fix: Supabase credentials missing (but yours look correct)

❌ "relation public.user_profiles does not exist"
Fix: Tables not created - run SQL schema

❌ "duplicate key value violates unique constraint"
Fix: Email already used - try different email

❌ "new row violates row-level security policy"
Fix: RLS policies issue - re-run schema SQL
```

## ✅ Step 3: Test Email

Try these emails in order:
1. `test1@example.com` (password: test1234)
2. `test2@example.com` (password: test1234)
3. `yourname@gmail.com` (your real email)

## ✅ Step 4: Verify Environment

In VS Code terminal:
```powershell
Get-Content .env.local
```

Should show:
```
VITE_SUPABASE_URL=https://hcylrrfxcaqpqbmkdmzo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

## ✅ Step 5: Restart Dev Server

```powershell
# Stop current server (Ctrl+C)
npm run dev
```

## 🔍 What Error Are You Getting?

**Share the EXACT error message from:**
1. Browser console (F12 → Console)
2. Screenshot if possible

Then I can give you the exact fix!

## 🚨 Emergency Fix

If nothing works, run this in Supabase SQL Editor:

```sql
-- Delete all data and start fresh
DROP TABLE IF EXISTS public.problem_submissions CASCADE;
DROP TABLE IF EXISTS public.user_progress CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Then run the full schema from supabase-schema.sql again
```
