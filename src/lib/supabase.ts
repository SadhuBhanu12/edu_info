import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are set
const isMissingCredentials = !supabaseUrl || !supabaseAnonKey || 
  supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder');

if (isMissingCredentials) {
  console.error('❌ SUPABASE NOT CONFIGURED!');
  console.error('');
  console.error('📋 Quick Setup (5 minutes):');
  console.error('1. Go to https://supabase.com and create a free account');
  console.error('2. Create a new project');
  console.error('3. Copy your Project URL and anon key from Settings → API');
  console.error('4. Add to Vercel: Settings → Environment Variables:');
  console.error('   - VITE_SUPABASE_URL = your-project-url');
  console.error('   - VITE_SUPABASE_ANON_KEY = your-anon-key');
  console.error('5. Redeploy your app');
  console.error('');
  console.error('📖 See VERCEL_SETUP_CHECKLIST.md for detailed instructions');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
    }
  }
);

// Database types
export interface UserProgress {
  id: string;
  user_id: string;
  solved_problems: string[];
  theory_time_spent: Record<string, number>;
  animations_watched: Record<string, number>;
  videos_watched: Record<string, number>;
  concept_readiness: Record<string, number>;
  created_at: string;
  updated_at: string;
}
