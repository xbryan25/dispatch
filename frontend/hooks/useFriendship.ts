import { useState } from 'react';
import {
  createNewFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriendUser,
  reconnectToUser,
} from '@/lib/api/friendship';

import { useFriendsStore } from '@/store/useFriendsStore';

export function useCreateNewFriendRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setIsRateLimitedFromActions = useFriendsStore((state) => state.setIsRateLimitedFromActions);

  const createFriendRequest = async (targetUserId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await createNewFriendRequest(targetUserId);

      return { data, error: null, rateLimited: false };
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        setIsRateLimitedFromActions('createNewRequestAction', true);

        setTimeout(() => setIsRateLimitedFromActions('createNewRequestAction', false), 60000);

        return { data: null, error: null, rateLimited: true };
      }

      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      setError(errorMessage);

      return { data: null, error: errorMessage, rateLimited: false };
    } finally {
      setLoading(false);
    }
  };

  return { createFriendRequest, loading, error };
}

export function useCancelFriendRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setIsRateLimitedFromActions = useFriendsStore((state) => state.setIsRateLimitedFromActions);

  const cancelSentFriendRequest = async (targetUserId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await cancelFriendRequest(targetUserId);

      return { data, error: null, rateLimited: false };
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        setIsRateLimitedFromActions('cancelRequestAction', true);

        setTimeout(() => setIsRateLimitedFromActions('cancelRequestAction', false), 60000);

        return { data: null, error: null, rateLimited: true };
      }

      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      setError(errorMessage);

      return { data: null, error: errorMessage, rateLimited: false };
    } finally {
      setLoading(false);
    }
  };

  return { cancelSentFriendRequest, loading, error };
}

export function useAcceptFriendRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setIsRateLimitedFromActions = useFriendsStore((state) => state.setIsRateLimitedFromActions);

  const acceptReceivedFriendRequest = async (targetUserId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await acceptFriendRequest(targetUserId);

      return { data, error: null, rateLimited: false };
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        setIsRateLimitedFromActions('acceptAction', true);

        setTimeout(() => setIsRateLimitedFromActions('acceptAction', false), 60000);

        return { data: null, error: null, rateLimited: true };
      }

      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      setError(errorMessage);

      return { data: null, error: errorMessage, rateLimited: false };
    } finally {
      setLoading(false);
    }
  };

  return { acceptReceivedFriendRequest, loading, error };
}

export function useRejectFriendRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setIsRateLimitedFromActions = useFriendsStore((state) => state.setIsRateLimitedFromActions);

  const rejectReceivedFriendRequest = async (targetUserId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await rejectFriendRequest(targetUserId);

      return { data, error: null, rateLimited: false };
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        setIsRateLimitedFromActions('rejectAction', true);

        setTimeout(() => setIsRateLimitedFromActions('rejectAction', false), 60000);

        return { data: null, error: null, rateLimited: true };
      }

      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      setError(errorMessage);

      return { data: null, error: errorMessage, rateLimited: false };
    } finally {
      setLoading(false);
    }
  };

  return { rejectReceivedFriendRequest, loading, error };
}

export function useUnfriendUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setIsRateLimitedFromActions = useFriendsStore((state) => state.setIsRateLimitedFromActions);

  const unfriendSelectedUser = async (targetUserId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await unfriendUser(targetUserId);

      return { data, error: null, rateLimited: false };
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        setIsRateLimitedFromActions('unfriendAction', true);

        setTimeout(() => setIsRateLimitedFromActions('unfriendAction', false), 60000);

        return { data: null, error: null, rateLimited: true };
      }

      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      setError(errorMessage);

      return { data: null, error: errorMessage, rateLimited: false };
    } finally {
      setLoading(false);
    }
  };

  return { unfriendSelectedUser, loading, error };
}

export function useReconnectToUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setIsRateLimitedFromActions = useFriendsStore((state) => state.setIsRateLimitedFromActions);

  const reconnectToFormerFriend = async (targetUserId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await reconnectToUser(targetUserId);

      return { data, error: null, rateLimited: false };
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        setIsRateLimitedFromActions('reconnectRequestAction', true);

        setTimeout(() => setIsRateLimitedFromActions('reconnectRequestAction', false), 60000);

        return { data: null, error: null, rateLimited: true };
      }

      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      setError(errorMessage);

      return { data: null, error: errorMessage, rateLimited: false };
    } finally {
      setLoading(false);
    }
  };

  return { reconnectToFormerFriend, loading, error };
}
