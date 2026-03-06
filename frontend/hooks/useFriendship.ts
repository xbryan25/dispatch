import { useCallback, useState } from 'react';
import {
  getCurrentFriends,
  getSentRequestsProfile,
  getReceivedRequestsProfile,
  getFormerFriends,
  getFriendSuggestions,
  createNewFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriendUser,
  reconnectToUser,
} from '@/lib/api/friendship';

export function useGetCurrentFriends() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFriends = useCallback(async (sortState: string, searchQuery: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCurrentFriends(sortState, searchQuery);

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
  }, []);

  return { getFriends, loading, error };
}

export function useGetSentRequestsProfiles() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProfilesOfSentRequests = useCallback(async (sortState: string, searchQuery: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getSentRequestsProfile(sortState, searchQuery);

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
  }, []);

  return { getProfilesOfSentRequests, loading, error };
}

export function useGetReceivedRequestsProfiles() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProfilesOfReceivedRequests = useCallback(
    async (sortState: string, searchQuery: string) => {
      setLoading(true);
      setError(null);

      try {
        const data = await getReceivedRequestsProfile(sortState, searchQuery);

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
    },
    []
  );

  return { getProfilesOfReceivedRequests, loading, error };
}

export function useGetFormerFriends() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProfilesOfFormerFriends = useCallback(async (sortState: string, searchQuery: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getFormerFriends(sortState, searchQuery);

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
  }, []);

  return { getProfilesOfFormerFriends, loading, error };
}

export function useGetFriendSuggestions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSuggestedProfiles = useCallback(async (sortState: string, searchQuery: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getFriendSuggestions(sortState, searchQuery);

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
  }, []);

  return { getSuggestedProfiles, loading, error };
}

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
