import { useCallback, useState } from 'react';
import { getCurrentFriends } from '@/lib/api/friendship';

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
