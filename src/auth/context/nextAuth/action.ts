'use client';

import type { SignInResponse } from 'next-auth/react';

import { verifyEmail } from '@/lib/action/verify';
import { signIn, signOut as signOutLogin } from 'next-auth/react';

import { setSession } from './utils';
import { JWT_STORAGE_KEY } from './constant';

import axios, { endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

export type SignInParams = {
  email: string;
  password?: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  token?: string;
  error?: string;
};

/** **************************************
 * Sign in Passwordless
 *************************************** */
export const signInPasswordless = async ({ email }: SignInParams): Promise<AuthResponse> => {
  try {
    const res = (await signIn('nodemailer',  {email, redirect: false })) as unknown as SignInResponse;

    if (!res?.ok) {
      return {
        success: false,
        message: 'Failed to initiate passwordless sign in',
        error: res?.error || 'Unknown error occurred'
      };
    }

    const verify = await verifyEmail(email);
    
    if (!verify.success) {
      return {
        success: false,
        message: 'Email verification failed',
        error: verify.message
      };
    }

    return {
      success: true,
      message: 'Sign in initiated successfully',
      token: verify.callbackUrl
    };
  } catch (error) {
    console.error('Error during passwordless sign in:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/** **************************************
 * Sign in with Password
 *************************************** */
export const signInWithPassword = async ({ email, password }: SignInParams): Promise<AuthResponse> => {
  try {
    if (!password) {
      return {
        success: false,
        message: 'Password is required for this sign in method',
        error: 'Missing password'
      };
    }

    const params = { email, password };
    const res = await axios.post(endpoints.auth.signIn, params);
    const { accessToken } = res.data;

    if (!accessToken) {
      return {
        success: false,
        message: 'Authentication failed',
        error: 'Access token not found in response'
      };
    }

    setSession(accessToken);

    return {
      success: true,
      message: 'Successfully signed in',
      token: accessToken
    };
  } catch (error) {
    console.error('Error during sign in:', error);
    return {
      success: false,
      message: 'Authentication failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
}: SignUpParams): Promise<AuthResponse> => {
  try {
    const params = {
      email,
      password,
      firstName,
      lastName,
    };

    const res = await axios.post(endpoints.auth.signUp, params);
    const { accessToken } = res.data;

    if (!accessToken) {
      return {
        success: false,
        message: 'Registration failed',
        error: 'Access token not found in response'
      };
    }

    sessionStorage.setItem(JWT_STORAGE_KEY, accessToken);

    return {
      success: true,
      message: 'Successfully registered',
      token: accessToken
    };
  } catch (error) {
    console.error('Error during sign up:', error);
    return {
      success: false,
      message: 'Registration failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<AuthResponse> => {
  try {
    await signOutLogin();
    return {
      success: true,
      message: 'Successfully signed out'
    };
  } catch (error) {
    console.error('Error during sign out:', error);
    return {
      success: false,
      message: 'Failed to sign out',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
