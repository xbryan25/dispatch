import { create } from 'zustand';

interface AuthState {
  currentUserId: string;

  // Actions
  setCurrentUserId: (userId: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUserId: '',

  setCurrentUserId: (userId) => set({ currentUserId: userId }),
}));
