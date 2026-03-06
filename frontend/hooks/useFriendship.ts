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

import { useFriendsStore } from '@/store/useFriendsStore';

export function useGetCurrentFriends() {
  const setUsers = useFriendsStore((state) => state.setUsers);
  const setLoading = useFriendsStore((state) => state.setLoading);
  const setError = useFriendsStore((state) => state.setError);

  const getFriends = useCallback(
    async (sortState: string, searchQuery: string) => {
      setLoading(true);
      setError(null);

      try {
        const data = await getCurrentFriends(sortState, searchQuery);

        setUsers(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    },
    [setUsers, setLoading, setError]
  );

  return { getFriends };
}

export function useGetSentRequestsProfiles() {
  const setUsers = useFriendsStore((state) => state.setUsers);
  const setLoading = useFriendsStore((state) => state.setLoading);
  const setError = useFriendsStore((state) => state.setError);

  const getProfilesOfSentRequests = useCallback(
    async (sortState: string, searchQuery: string) => {
      setLoading(true);
      setError(null);

      try {
        const data = await getSentRequestsProfile(sortState, searchQuery);

        setUsers(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    },
    [setUsers, setLoading, setError]
  );

  return { getProfilesOfSentRequests };
}

export function useGetReceivedRequestsProfiles() {
  const setUsers = useFriendsStore((state) => state.setUsers);
  const setLoading = useFriendsStore((state) => state.setLoading);
  const setError = useFriendsStore((state) => state.setError);

  const getProfilesOfReceivedRequests = useCallback(
    async (sortState: string, searchQuery: string) => {
      setLoading(true);
      setError(null);

      try {
        const data = await getReceivedRequestsProfile(sortState, searchQuery);

        setUsers(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    },
    [setUsers, setLoading, setError]
  );

  return { getProfilesOfReceivedRequests };
}

export function useGetFormerFriends() {
  const setUsers = useFriendsStore((state) => state.setUsers);
  const setLoading = useFriendsStore((state) => state.setLoading);
  const setError = useFriendsStore((state) => state.setError);

  const getProfilesOfFormerFriends = useCallback(
    async (sortState: string, searchQuery: string) => {
      setLoading(true);
      setError(null);

      try {
        const data = await getFormerFriends(sortState, searchQuery);

        setUsers(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    },
    [setUsers, setLoading, setError]
  );

  return { getProfilesOfFormerFriends };
}

export function useGetFriendSuggestions() {
  const setUsers = useFriendsStore((state) => state.setUsers);
  const setLoading = useFriendsStore((state) => state.setLoading);
  const setError = useFriendsStore((state) => state.setError);

  const getSuggestedProfiles = useCallback(
    async (sortState: string, searchQuery: string) => {
      setLoading(true);
      setError(null);

      try {
        const data = await getFriendSuggestions(sortState, searchQuery);

        setUsers(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    },
    [setUsers, setLoading, setError]
  );

  return { getSuggestedProfiles };
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
