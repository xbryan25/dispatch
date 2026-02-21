'use client';

import { useEffect } from 'react';
import { useInitCurrentUserId } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { clearCurrentUserId } = useAuthStore();
  const { initCurrentUserId } = useInitCurrentUserId();

  useEffect(() => {
    const verifySession = async () => {
      try {
        await initCurrentUserId();
      } catch {
        // If the backend says the session is dead, wipe the store
        console.error('Session invalid, logging out...');
        clearCurrentUserId();
      }
    };

    verifySession();
  }, [initCurrentUserId, clearCurrentUserId]);

  return <>{children}</>;
}
