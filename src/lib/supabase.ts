import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Missing Supabase environment variables!');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  console.error('See SUPABASE_SETUP.md for detailed setup instructions');
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
