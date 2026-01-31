# Supabase Setup Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Account

1. Go to **https://app.supabase.com**
2. Click **"Start your project"** or **"Sign In"**
3. Sign up with GitHub, Google, or Email

### Step 2: Create New Project

1. Click **"New Project"**
2. Fill in the details:
   - **Name**: `dsa-tracker` (or any name you prefer)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users (e.g., `us-east-1`, `ap-south-1`)
   - **Pricing Plan**: Select **Free** (perfect for starting)
3. Click **"Create new project"**
4. ⏳ Wait 2-3 minutes for the project to initialize

### Step 3: Get Your Credentials

Once your project is ready:

1. Go to **Settings** (gear icon in sidebar) → **API**
2. You'll see two important values:

   **Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
   Copy this entire URL ✅

   **anon/public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....(long string)
   ```
   Copy this entire key ✅

### Step 4: Add to Vercel Environment Variables

1. Go to **https://vercel.com**
2. Select your project (`edu-info`)
3. Click **Settings** → **Environment Variables**
4. Add **two** new variables:

   **Variable 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://xxxxxxxxxxxxx.supabase.co` (paste your Project URL)
   - Environment: ✅ Production ✅ Preview ✅ Development

   **Variable 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJ...` (paste your anon key)
   - Environment: ✅ Production ✅ Preview ✅ Development

5. Click **Save**

### Step 5: Set Up Database Tables

Go back to Supabase and run this SQL:

1. In Supabase dashboard, click **SQL Editor** (in sidebar)
2. Click **"New query"**
3. Paste this SQL:

```sql
-- Enable Row Level Security
create table if not exists public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  problem_progress jsonb default '{}'::jsonb,
  topic_progress jsonb default '{}'::jsonb,
  stats jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Enable RLS
alter table public.user_progress enable row level security;

-- Policy: Users can only see their own data
create policy "Users can view own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own data
create policy "Users can insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

-- Policy: Users can update their own data
create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists user_progress_user_id_idx on public.user_progress(user_id);

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-update updated_at
create trigger on_user_progress_updated
  before update on public.user_progress
  for each row
  execute procedure public.handle_updated_at();
```

4. Click **Run** (or press Ctrl+Enter)
5. ✅ You should see "Success. No rows returned"

### Step 6: Configure Email Settings (Optional but Recommended)

1. In Supabase, go to **Authentication** → **Settings**
2. **Email Auth**:
   - ✅ Enable Email provider
   - Set **Confirm email**: ON (recommended for security)
   - **Site URL**: `https://your-vercel-url.vercel.app`
   - **Redirect URLs**: Add `https://your-vercel-url.vercel.app/**`
3. Click **Save**

### Step 7: Redeploy on Vercel

1. Go to Vercel → Your Project → **Deployments**
2. Click the **⋮** menu on latest deployment
3. Click **Redeploy**
4. ✅ Wait for deployment to complete (~1-2 minutes)

## ✅ Verification

After redeployment, test your app:

1. Visit your deployed URL
2. Try **Sign Up**:
   - Enter email, name, password
   - ✅ Should see success message
   - Check your email for verification link
3. Check Supabase **Authentication** → **Users** to see new user
4. Try **Login** after verifying email
5. ✅ Your progress should now sync to cloud!

## 🔍 Troubleshooting

### "Missing Supabase environment variables" error
- Make sure you added BOTH variables in Vercel
- Check variable names are EXACTLY: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Redeploy after adding variables

### Can't sign up / "Email not confirmed"
- Check your email inbox (including spam)
- Or disable email confirmation in Supabase → Authentication → Settings

### Database errors
- Make sure you ran the SQL script in Step 5
- Check **Database** → **Tables** to verify `user_progress` table exists

### Still not working?
- Check browser console (F12) for errors
- Check Vercel deployment logs
- Verify environment variables are set correctly

## 📊 Monitoring

**Check User Activity:**
- Supabase → **Authentication** → **Users**
- See all registered users

**Check Database:**
- Supabase → **Database** → **user_progress**
- View stored user progress data

**View Logs:**
- Supabase → **Logs** → **Auth**
- See login/signup events

## 🎉 You're Done!

Your app now has:
- ✅ Secure cloud authentication
- ✅ User registration with email verification
- ✅ Password reset functionality
- ✅ Progress synced across devices
- ✅ Automatic database backups (via Supabase)

## 💰 Free Tier Limits

Supabase Free tier includes:
- 500 MB database storage
- 2 GB bandwidth per month
- 50,000 monthly active users
- 500 MB file storage

More than enough for most projects! 🚀
