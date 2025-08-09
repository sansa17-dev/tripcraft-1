/**
 * Authentication hook for managing user state
 * Uses direct Supabase client for secure authentication
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
}

interface AuthActions {
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
}

export function useAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Initialize auth state and listen for changes
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
        } else if (initialSession && mounted) {
          console.log('🔄 Restoring auth state:', { user: initialSession.user.email });
          setUser(initialSession.user);
          setSession(initialSession);
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
      } finally {
        if (mounted) {
          setInitialized(true);
        }
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('🔄 Auth state changed:', event, session?.user?.email);
        
        if (session) {
          setUser(session.user);
          setSession(session);
        } else {
          setUser(null);
          setSession(null);
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('📝 Signing up user:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('❌ Signup failed:', error.message);
        return { error: error.message };
      }

      if (data.user) {
        console.log('✅ User created:', data.user.email);
        // Auth state will be updated via onAuthStateChange
      }

      return { error: null };
    } catch (error) {
      console.error('💥 Signup exception:', error);
      return { error: error instanceof Error ? error.message : 'Signup failed' };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('🔐 Signing in user:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Signin failed:', error.message);
        return { error: error.message };
      }

      if (data.user) {
        console.log('✅ User signed in:', data.user.email);
        // Auth state will be updated via onAuthStateChange
      }

      return { error: null };
    } catch (error) {
      console.error('💥 Signin exception:', error);
      return { error: error instanceof Error ? error.message : 'Signin failed' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      console.log('🚪 Signing out user');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Signout failed:', error.message);
        return { error: error.message };
      }

      console.log('✅ User signed out');
      // Auth state will be updated via onAuthStateChange
      return { error: null };
    } catch (error) {
      console.error('💥 Signout exception:', error);
      return { error: error instanceof Error ? error.message : 'Signout failed' };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading: loading || !initialized,
    initialized,
    signUp,
    signIn,
    signOut,
  };
}