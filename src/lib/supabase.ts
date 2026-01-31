import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase environment variables not configured!');
  console.warn('The app will work with local storage only. Cloud sync is disabled.');
  console.warn('To enable cloud features, add these environment variables in Vercel:');
  console.warn('- VITE_SUPABASE_URL');
  console.warn('- VITE_SUPABASE_ANON_KEY');
  console.warn('Visit: https://vercel.com/docs/projects/environment-variables');
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
