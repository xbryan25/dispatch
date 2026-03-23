'use client';

import { useState, useCallback } from 'react';
import { register, login, logout } from '@/lib/auth';
import { useAuthStore } from '@/store/useAuthStore';

import {
  getCurrentUserId,
  getCurrentUserDetails,
  updateUserDetails,
  getPresignedUrl,
  updateProfileImage,
} from '@/lib/api/auth';

import { uploadImageToSupabaseStorage } from '@/lib/supabase/client';

import { UserProfile, UserProfileUpdate } from '@/types/auth';

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
  const { setCurrentUserId } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initCurrentUserId = useCallback(async () => {
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
  }, [setCurrentUserId]);

  return { initCurrentUserId, loading, error };
}

export function useGetCurrentUserDetails() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const retrieveUserDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: UserProfile = await getCurrentUserDetails();
      setLoading(false);
      return { data, error: null, rateLimited: false };
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        setIsRateLimited(true);
        setTimeout(() => setIsRateLimited(false), 60000);
        return { data: null, error: null, rateLimited: true };
      }
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      setError(errorMessage);

      return { data: null, error: errorMessage, rateLimited: false };
    }
  };

  return { retrieveUserDetails, loading, error, isRateLimited };
}

export function useUpdateCurrentUserDetails() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const patchUserDetails = async (payload: UserProfileUpdate) => {
    setLoading(true);
    setError(null);
    try {
      await updateUserDetails(payload);
      return { error: null, rateLimited: false };
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        setIsRateLimited(true);
        setTimeout(() => setIsRateLimited(false), 60000);
        return { error: null, rateLimited: true };
      }
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      setError(errorMessage);

      return { error: errorMessage, rateLimited: false };
    } finally {
      setLoading(false);
    }
  };

  return { patchUserDetails, loading, error, isRateLimited };
}

export function useUpdateUserProfileImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRateLimitedPresignedURL, setIsRateLimitedPresignedURL] = useState(false);
  const [isRateLimitedUpdatingImage, setIsRateLimitedUpdatingImage] = useState(false);

  const patchUserProfileImage = async (image: File) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPresignedUrl(image);

      await uploadImageToSupabaseStorage(data.upload_url, image);

      await updateProfileImage(data.final_image_url);

      return { error: null, rateLimited: false };
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        setIsRateLimitedPresignedURL(true);
        setIsRateLimitedUpdatingImage(true);
        setTimeout(
          () => (setIsRateLimitedPresignedURL(false), setIsRateLimitedUpdatingImage(false)),
          60000
        );
        return { error: null, rateLimited: true };
      }

      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      setError(errorMessage);

      return { error: errorMessage, rateLimited: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    patchUserProfileImage,
    loading,
    error,
    isRateLimitedPresignedURL,
    isRateLimitedUpdatingImage,
  };
}
