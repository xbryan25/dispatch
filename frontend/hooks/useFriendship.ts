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
} from '@/lib/api/friendship';

export function useGetCurrentFriends() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFriends = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCurrentFriends();

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

  const getProfilesOfSentRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getSentRequestsProfile();

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

  const getProfilesOfReceivedRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getReceivedRequestsProfile();

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

  return { getProfilesOfReceivedRequests, loading, error };
}

export function useGetFormerFriends() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProfilesOfFormerFriends = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getFormerFriends();

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

  const getSuggestedProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getFriendSuggestions();

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

  const createFriendRequest = async (receiverId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await createNewFriendRequest(receiverId);

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

  const cancelSentFriendRequest = async (receiverId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await cancelFriendRequest(receiverId);

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

  const acceptReceivedFriendRequest = async (senderId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await acceptFriendRequest(senderId);

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

  const rejectReceivedFriendRequest = async (senderId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await rejectFriendRequest(senderId);

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
