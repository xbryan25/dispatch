import { useState, useEffect } from 'react';
import { checkIfUsernameIsTaken } from '@/lib/api/auth';

export function useUsernameCheck(username: string) {
  const [isTaken, setIsTaken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // if (username.length < 3) {
    //   setIsTaken(false);
    //   return;
    // }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await checkIfUsernameIsTaken(username);
        setIsTaken(data.does_username_exist);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [username]);

  // [username] means that effect will be run everytime the string changes (like watch() in Vue/Nuxt)

  return { isTaken, isLoading };
}
