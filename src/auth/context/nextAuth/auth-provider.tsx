'use client';

import { useMemo, useEffect } from 'react';
import { useSetState } from 'minimal-shared/hooks';
import { getServerSessionUser } from '@/lib/session/getServerSessionUser';

import { AuthContext } from '../auth-context';

  import type {  AuthState } from '../../types';   

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({
    user: null,
    loading: true,
  });

  // ✅ Move async fetch inside useEffect
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getServerSessionUser();
        setState({ user: user ?? null, loading: false });
      } catch (error) {
        console.error('Failed to get user session:', error);
        setState({ user: null, loading: false });
      }
    };

    fetchUser();
  }, [setState]);

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';
  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user ? { ...state.user, role: state.user?.role ?? 'admin' } : null,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
