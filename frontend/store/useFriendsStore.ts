import { create } from 'zustand';

import { UserInfo } from '@/types/auth';

interface FriendsState {
  users: UserInfo[];
  loading: boolean;
  error: string | null;

  // Actions
  setUsers: (newUsers: UserInfo[]) => void;
  clearUsers: () => void;

  setLoading: (state: boolean) => void;
  setError: (state: string | null) => void;
}

export const useFriendsStore = create<FriendsState>()((set) => ({
  users: [],
  loading: false,
  error: '',
  setUsers: (newUsers) => set({ users: newUsers }),
  clearUsers: () => set({ users: [] }),
  setLoading: (state) => set({ loading: state }),
  setError: (state) => set({ error: state }),
}));
