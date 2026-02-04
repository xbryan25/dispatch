import { create } from 'zustand';

interface AuthState {
  currentUserId: string | null;

  // Actions
  setCurrentUserId: (userId: string) => void;
  clearCurrentUserId: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  currentUserId: null,
  setCurrentUserId: (id) => set({ currentUserId: id }),
  clearCurrentUserId: () => set({ currentUserId: null }),
}));
