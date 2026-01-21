'use client';

import { useState } from 'react';
import { register, login } from '@/lib/auth';

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
      await login(email, password);
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

  return { loginUser, loading, error };
}
