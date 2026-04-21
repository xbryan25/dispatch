'use client';

import { useEffect } from 'react';

import { useAuthStore } from '@/store/useAuthStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { clearCurrentUserId, getCurrentId } = useAuthStore();

  useEffect(() => {
    const verifySession = async () => {
      try {
        await getCurrentId();
      } catch {
        // Wipe the store
        console.error('Session invalid, logging out...');
        clearCurrentUserId();
      }
    };

    verifySession();
  }, [getCurrentId, clearCurrentUserId]);

  return <>{children}</>;
}
