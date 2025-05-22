'use client';

import type { User as FirebaseUser } from 'firebase/auth';

import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import { AuthContext } from '../auth-context';

import type { AuthState } from '../../types';

import axios from 'src/lib/axios';
import { AUTH, FIRESTORE } from 'src/lib/firebase';

// ----------------------------------------------------------------------

/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({ user: null, loading: true });

  const checkUserSession = useCallback(async () => {
    try {
      onAuthStateChanged(AUTH, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser && firebaseUser.emailVerified) {
          const userProfile = doc(FIRESTORE, 'users', firebaseUser.uid);
          const docSnap = await getDoc(userProfile);
          const profileData = docSnap.data();

          setState({ 
            user: { 
              id: firebaseUser.uid,
              email: firebaseUser.email ?? undefined,
              name: firebaseUser.displayName ?? undefined,
              avatar: firebaseUser.photoURL ?? undefined,
              role: profileData?.role ?? 'admin',
              ...profileData
            }, 
            loading: false 
          });
          axios.defaults.headers.common.Authorization = `Bearer ${await firebaseUser.getIdToken()}`;
        } else {
          setState({ user: null, loading: false });
          delete axios.defaults.headers.common.Authorization;
        }
      });
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
     
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            id: state.user.id,
            email: state.user.email,
            name: state.user.name,
            avatar: state.user.avatar,
            role: state.user.role,
          }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
