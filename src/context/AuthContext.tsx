import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ data: any; error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TUF Standard: Maximum 500ms auth loading
    const authTimeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    // Check if Supabase is properly configured
    const hasSupabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!hasSupabase) {
      // Check for local user session
      const localUserStr = localStorage.getItem('local_user');
      if (localUserStr) {
        try {
          const localUser = JSON.parse(localUserStr);
          const mockSession = {
            user: localUser,
            access_token: 'local-token',
          };
          setUser(localUser as any);
          setSession(mockSession as any);
        } catch (err) {
          console.error('Failed to parse local user:', err);
        }
      }
      clearTimeout(authTimeout);
      setLoading(false);
      return;
    }

    // Get initial session with error handling
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        setSession(null);
        setUser(null);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
      clearTimeout(authTimeout);
      setLoading(false);
    }).catch((err) => {
      console.error('Auth error:', err);
      clearTimeout(authTimeout);
      setLoading(false);
    });

    // Listen for auth changes with comprehensive event handling
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      // Handle different auth events
      switch (event) {
        case 'SIGNED_IN':
          setSession(session);
          setUser(session?.user ?? null);
          break;
        case 'SIGNED_OUT':
          setSession(null);
          setUser(null);
          // Clear any cached data
          localStorage.removeItem('supabase.auth.token');
          break;
        case 'TOKEN_REFRESHED':
          setSession(session);
          setUser(session?.user ?? null);
          break;
        case 'USER_UPDATED':
          setSession(session);
          setUser(session?.user ?? null);
          break;
        case 'PASSWORD_RECOVERY':
          // Handle password recovery if needed
          break;
        default:
          setSession(session);
          setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(authTimeout);
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    // Check if Supabase is properly configured
    const hasSupabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!hasSupabase) {
      // Local-only mode - create a mock user session
      console.warn('🔒 Running in local-only mode. User data will only be saved in browser storage.');
      
      try {
        // Create a local user object
        const localUser = {
          id: `local-${Date.now()}`,
          email,
          user_metadata: {
            full_name: fullName,
            display_name: fullName,
          },
          created_at: new Date().toISOString(),
        };
        
        // Store in localStorage
        localStorage.setItem('local_user', JSON.stringify(localUser));
        localStorage.setItem('local_user_email', email);
        localStorage.setItem('local_user_name', fullName);
        
        // Mock session
        const mockSession = {
          user: localUser as any,
          access_token: 'local-token',
        };
        
        setUser(localUser as any);
        setSession(mockSession as any);
        
        return { 
          data: { user: localUser, session: mockSession }, 
          error: null 
        };
      } catch (error: any) {
        console.error('Local signup error:', error);
        return { data: null, error: { message: 'Failed to create local account' } as any };
      }
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            display_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      return { data, error };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    // Check if Supabase is properly configured
    const hasSupabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!hasSupabase) {
      // Local-only mode - very permissive for demo/testing
      console.warn('🔒 Running in local-only mode. Using browser storage for authentication.');
      
      try {
        let localUserStr = localStorage.getItem('local_user');
        let localUser;
        
        if (!localUserStr) {
          // Auto-create a local account if it doesn't exist
          console.log('Creating local account on first login...');
          localUser = {
            id: `local-${Date.now()}`,
            email,
            user_metadata: {
              full_name: email.split('@')[0], // Use email username as name
              display_name: email.split('@')[0],
            },
            created_at: new Date().toISOString(),
          };
          
          localStorage.setItem('local_user', JSON.stringify(localUser));
          localStorage.setItem('local_user_email', email);
          localStorage.setItem('local_user_name', email.split('@')[0]);
        } else {
          localUser = JSON.parse(localUserStr);
        }
        
        const mockSession = {
          user: localUser,
          access_token: 'local-token',
        };
        
        setUser(localUser as any);
        setSession(mockSession as any);
        
        return { error: null };
      } catch (error: any) {
        console.error('Local signin error:', error);
        return { error: { message: 'Failed to sign in. Please try again.' } as any };
      }
    }
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    // Check if Supabase is properly configured
    const hasSupabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    try {
      if (hasSupabase) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Error signing out:', error);
        }
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      // Always clear local state for security
      setSession(null);
      setUser(null);
      // Clear any cached data
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('local_user');
      localStorage.removeItem('local_user_email');
      localStorage.removeItem('local_user_name');
    }
  };

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing session:', error);
        // If refresh fails, sign out for security
        await signOut();
      } else {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      }
    } catch (error) {
      console.error('Refresh session error:', error);
      await signOut();
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
