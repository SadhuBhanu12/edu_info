# 🔧 Supabase Setup Guide - Fix Signup Error

## Problem
You're getting **"Unable to create account. Please try again later."** because Supabase credentials are not configured.

## Solution (5 minutes)

### Step 1: Create Supabase Account (Free)

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub/Google/Email
4. It's completely **FREE** for development!

### Step 2: Create New Project

1. Click **"New Project"**
2. Fill in:
   - **Name:** `dsa-tracker` (or any name)
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to you
3. Click **"Create new project"**
4. Wait ~2 minutes for setup to complete ⏳

### Step 3: Get Your API Keys

1. In your Supabase dashboard, click **"Settings"** (gear icon, bottom left)
2. Click **"API"** in the settings menu
3. You'll see two important values:

```
Project URL: https://xxxxx.supabase.co
anon public: eyJhbGci...
```

**Copy both of these!**

### Step 4: Create .env File

1. In your project root folder (`dsa_tracter`), create a file named `.env`
2. Add this content (replace with YOUR values):

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:** 
- Replace `https://xxxxx.supabase.co` with your actual Project URL
- Replace the key with your actual `anon public` key
- Do NOT add quotes around the values
- Do NOT commit this file to git (it's already in .gitignore)

### Step 5: Setup Database Schema

1. In Supabase dashboard, click **"SQL Editor"** (on left sidebar)
2. Click **"New query"**
3. Copy the contents of `supabase-schema.sql` from your project
4. Paste it in the SQL editor
5. Click **"Run"** button

This creates all necessary tables for your app.

### Step 6: Restart Dev Server

```powershell
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### Step 7: Test Signup!

1. Go to http://localhost:5173/signup
2. Fill in the form:
   - **Email:** your-email@example.com
   - **Password:** minimum 6 characters
   - **Full Name:** Your Name
3. Click **"Sign Up"**
4. You should get: ✅ **"Account created! Please check your email..."**

---

## Verification Checklist

- [ ] Created Supabase account
- [ ] Created new project
- [ ] Copied Project URL
- [ ] Copied anon public key
- [ ] Created `.env` file in project root
- [ ] Added both values to `.env`
- [ ] Ran `supabase-schema.sql` in SQL Editor
- [ ] Restarted dev server
- [ ] Tested signup - SUCCESS! ✅

---

## Common Issues

### Still getting error after setup?

**Check 1: Verify .env file location**
```powershell
# Should be in project root, not in src/
ls .env
# Should show: .env
```

**Check 2: Verify environment variables loaded**
- Open browser console (F12)
- Type: `import.meta.env.VITE_SUPABASE_URL`
- Should show your Supabase URL (not undefined)

**Check 3: Restart dev server**
```powershell
# Stop server (Ctrl+C)
# Clear cache and restart
npm run dev
```

**Check 4: Check Supabase dashboard**
- Go to your Supabase project
- Check "Authentication" → "Users"
- Any error messages there?

### Email confirmation not working?

1. In Supabase dashboard → **"Authentication"** → **"Email Templates"**
2. Make sure email confirmation is enabled
3. For development, you can disable email confirmation:
   - Go to **"Authentication"** → **"Settings"**
   - Toggle **"Enable email confirmations"** OFF (for testing only)

### Want to test without email?

In Supabase dashboard:
1. **"Authentication"** → **"Settings"**
2. Find **"Enable email confirmations"**
3. Toggle it **OFF**
4. Now signups work immediately without email verification!

---

## Quick Reference

### .env File Template
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...yourkey...
```

### Where to find these values?
- Supabase Dashboard → Settings (gear icon) → API
- **Project URL** = `VITE_SUPABASE_URL`
- **anon public** = `VITE_SUPABASE_ANON_KEY`

### File location
```
dsa_tracter/
├── .env          ← Create this file HERE
├── src/
├── public/
└── package.json
```

---

## Security Notes

✅ **Safe to use:**
- The `anon public` key is safe for frontend code
- It's designed to be public
- Row Level Security (RLS) protects your data

❌ **NEVER share:**
- Your database password
- The `service_role` key (if you see it)
- Your `.env` file

---

## Next Steps After Setup

Once signup works:

1. ✅ Test login functionality
2. ✅ Check dashboard loads
3. ✅ Try solving a problem
4. ✅ Test LeetCode auto-sync (follow LEETCODE_AUTO_SYNC_GUIDE.md)

---

## Still Need Help?

### Debug Mode

Add console logging to see what's happening:

1. Open `src/lib/supabase.ts`
2. Add at the bottom:
```typescript
console.log('Supabase configured:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey
});
```
3. Check browser console - should show:
```
Supabase configured: {url: "https://xxx.supabase.co", hasKey: true}
```

### Check Supabase Status

- Visit: https://status.supabase.com
- Make sure all systems are operational

### Alternative: Use Local Development

If you want to test without Supabase initially:

1. Comment out Supabase in `AuthContext.tsx`
2. Use mock authentication
3. Set up Supabase later

---

## Summary

**The Error Happened Because:**
- No `.env` file existed
- Supabase credentials were missing
- The app couldn't connect to authentication service

**The Fix:**
1. Create Supabase account (free)
2. Get API keys
3. Create `.env` file
4. Add credentials
5. Restart server
6. Signup now works! ✅

**Time Required:** ~5-7 minutes

---

**You're almost there! Follow the steps above and signup will work perfectly.** 🚀

*Last Updated: January 18, 2026*
