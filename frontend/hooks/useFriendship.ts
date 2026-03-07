import { useState } from 'react';
import {
  createNewFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriendUser,
  reconnectToUser,
} from '@/lib/api/friendship';

export function useCreateNewFriendRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createFriendRequest = async (targetUserId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await createNewFriendRequest(targetUserId);

      return { data, error: null };
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }

      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  return { createFriendRequest, loading, error };
}

export function useCancelFriendRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelSentFriendRequest = async (targetUserId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await cancelFriendRequest(targetUserId);

      return { data, error: null };
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }

      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  return { cancelSentFriendRequest, loading, error };
}

export function useAcceptFriendRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptReceivedFriendRequest = async (targetUserId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await acceptFriendRequest(targetUserId);

      return { data, error: null };
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }

      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  return { acceptReceivedFriendRequest, loading, error };
}

export function useRejectFriendRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rejectReceivedFriendRequest = async (targetUserId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await rejectFriendRequest(targetUserId);

      return { data, error: null };
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }

      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  return { rejectReceivedFriendRequest, loading, error };
}

export function useUnfriendUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unfriendSelectedUser = async (targetUserId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await unfriendUser(targetUserId);

      return { data, error: null };
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }

      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  return { unfriendSelectedUser, loading, error };
}

export function useReconnectToUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reconnectToFormerFriend = async (targetUserId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await reconnectToUser(targetUserId);

      return { data, error: null };
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }

      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  return { reconnectToFormerFriend, loading, error };
}
