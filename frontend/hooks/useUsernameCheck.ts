import { useCallback, useEffect, useState } from 'react';

import { checkIfUsernameIsTaken } from '@/lib/api/auth';

export type UsernameStatus =
  | 'idle' // too short, or waiting out the debounce
  | 'checking'
  | 'available'
  | 'taken'
  | 'rate-limited'
  | 'error'; // network or server failure: availability is unknown

const DEBOUNCE_MS = 500;
const RATE_LIMIT_RETRY_MS = 60_000;

export function useUsernameCheck(username: string) {
  // Results are tagged with the name they belong to, so a reply for an older name never shows.
  const [result, setResult] = useState<{ name: string; status: UsernameStatus }>({
    name: '',
    status: 'idle',
  });
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);

  useEffect(() => {
    if (username.length < 3) return;

    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const timer = setTimeout(async () => {
      setResult({ name: username, status: 'checking' });
      try {
        const data = await checkIfUsernameIsTaken(username);
        if (cancelled) return;
        setResult({ name: username, status: data.does_username_exist ? 'taken' : 'available' });
      } catch (error: unknown) {
        if (cancelled) return;
        const status = (error as { status?: number }).status;
        if (status === 429) {
          setResult({ name: username, status: 'rate-limited' });
          retryTimer = setTimeout(() => setAttempt((count) => count + 1), RATE_LIMIT_RETRY_MS);
        } else {
          setResult({ name: username, status: 'error' });
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearTimeout(retryTimer);
    };
  }, [username, attempt]);

  const status: UsernameStatus =
    username.length >= 3 && result.name === username ? result.status : 'idle';

  return { status, retry };
}
