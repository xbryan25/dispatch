import { useState, useEffect } from 'react';
import { checkIfUsernameIsTaken } from '@/lib/api/auth';

export function useUsernameCheck(username: string) {
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);

  useEffect(() => {
    if (username.length < 3) {
      setIsUsernameTaken(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await checkIfUsernameIsTaken(username);
        setIsUsernameTaken(data.does_username_exist);
      } catch (error: unknown) {
        if (error instanceof Error && (error as Error & { status: number }).status === 429) {
          setIsRateLimited(true);
          setTimeout(() => setIsRateLimited(false), 60000);
        }
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [username]);

  // [username] means that effect will be run everytime the string changes (like watch() in Vue/Nuxt)

  return { isUsernameTaken, isLoading, isRateLimited };
}
