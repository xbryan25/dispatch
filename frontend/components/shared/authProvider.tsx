'use client';

import { useEffect } from 'react';

import { useAuthStore } from '@/store/useAuthStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const clearCurrentUserId = useAuthStore((state) => state.clearCurrentUserId);
  const initCurrentUserId = useAuthStore((state) => state.getCurrentId);

  useEffect(() => {
    const verifySession = async () => {
      try {
        await initCurrentUserId();
      } catch {
        // Wipe the store
        console.error('Session invalid, logging out...');
        clearCurrentUserId();
      }
    };

    verifySession();
  }, [initCurrentUserId, clearCurrentUserId]);

  return <>{children}</>;
}
