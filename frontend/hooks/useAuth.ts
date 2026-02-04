'use client';

import { useState } from 'react';
import { register, login, logout } from '@/lib/auth';
import { useAuthStore } from '@/store/useAuthStore';

import { getCurrentUserId } from '@/lib/api/auth';

export function useRegisterUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerUser = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    setError(null);
    try {
      await register(email, password, displayName);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, error };
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginUser = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await login(email, password);

      return { data, error: null };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      setError(errorMessage);

      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, loading, error };
}

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logoutUser = async () => {
    setLoading(true);
    setError(null);
    try {
      await logout();

      return { error: null };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      setError(errorMessage);

      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { logoutUser, loading, error };
}

export function useInitCurrentUserId() {
  const { setCurrentUserId } = useAuthStore(); // Your existing store

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initCurrentUserId = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: { currentUserId: string } = await getCurrentUserId();

      setCurrentUserId(data.currentUserId);

      return { error: null };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      setError(errorMessage);

      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { initCurrentUserId, loading, error };
}
