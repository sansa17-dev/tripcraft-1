/**
 * Authentication hook for managing user state
 * Uses secure backend API calls instead of direct Supabase client
 */

import { useState, useEffect } from 'react';
import { authApi } from '../lib/api';

interface User {
  id: string;
  email: string;
}

interface Session {
  access_token: string;
  user: User;
}

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

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem('tripcraft_user');
        const savedSession = localStorage.getItem('tripcraft_session');
        
        if (savedUser && savedSession) {
          const parsedUser = JSON.parse(savedUser);
          const parsedSession = JSON.parse(savedSession);
          
          console.log('🔄 Restoring auth state:', { user: parsedUser.email });
          setUser(parsedUser);
          setSession(parsedSession);
        }
      } catch (error) {
        console.error('❌ Error restoring auth state:', error);
        // Clear corrupted data
        localStorage.removeItem('tripcraft_user');
        localStorage.removeItem('tripcraft_session');
      } finally {
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (initialized) {
      if (user && session) {
        localStorage.setItem('tripcraft_user', JSON.stringify(user));
        localStorage.setItem('tripcraft_session', JSON.stringify(session));
        console.log('💾 Auth state saved:', { user: user.email });
      } else {
        localStorage.removeItem('tripcraft_user');
        localStorage.removeItem('tripcraft_session');
        console.log('🗑️ Auth state cleared');
      }
    }
  }, [user, session, initialized]);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('📝 Signing up user:', email);
      const result = await authApi.signUp(email, password);
      if (result.success && result.data) {
        if (result.data.user) {
          setUser(result.data.user);
          console.log('✅ User created:', result.data.user.email);
        }
        if (result.data.session) {
          setSession(result.data.session);
        }
        return { error: null };
      } else {
        console.error('❌ Signup failed:', result.error);
        return { error: result.error || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { error: error instanceof Error ? error.message : 'Signup failed' };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('🔐 Signing in user:', email);
      const result = await authApi.signIn(email, password);
      if (result.success && result.data) {
        if (result.data.user) {
          setUser(result.data.user);
          console.log('✅ User signed in:', result.data.user.email);
        }
        if (result.data.session) {
          setSession(result.data.session);
        }
        return { error: null };
      } else {
        console.error('❌ Signin failed:', result.error);
        return { error: result.error || 'Signin failed' };
      }
    } catch (error) {
      console.error('Signin error:', error);
      return { error: error instanceof Error ? error.message : 'Signin failed' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      console.log('🚪 Signing out user');
      await authApi.signOut();
      setUser(null);
      setSession(null);
      console.log('✅ User signed out');
      return { error: null };
    } catch (error) {
      console.error('Signout error:', error);
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