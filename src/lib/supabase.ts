import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Enable session persistence for proper auth flow
    autoRefreshToken: true, // Enable automatic token refresh
    detectSessionInUrl: true, // Detect session from URL for email confirmation
    storage: window.localStorage, // Use localStorage for session storage
  }
});

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
