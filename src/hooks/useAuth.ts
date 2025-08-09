/**
 * Authentication hook for managing user state
 * Uses secure backend API calls instead of direct Supabase client
 */

import { useState } from 'react';
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

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authApi.signUp(email, password);
      if (result.success && result.data) {
        if (result.data.user) {
          setUser(result.data.user);
        }
        if (result.data.session) {
          setSession(result.data.session);
        }
        return { error: null };
      } else {
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
      const result = await authApi.signIn(email, password);
      if (result.success && result.data) {
        if (result.data.user) {
          setUser(result.data.user);
        }
        if (result.data.session) {
          setSession(result.data.session);
        }
        return { error: null };
      } else {
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
      await authApi.signOut();
      setUser(null);
      setSession(null);
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
    loading,
    signUp,
    signIn,
    signOut,
  };
}