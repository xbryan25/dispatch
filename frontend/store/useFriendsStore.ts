import { create } from 'zustand';

import { UserInfo } from '@/types/auth';

import {
  getCurrentFriends,
  getSentRequestsProfile,
  getReceivedRequestsProfile,
  getFormerFriends,
  getFriendSuggestions,
} from '@/lib/api/friendship';

import { SortState, UserCategory } from '@/types/friends';

interface FriendsState {
  users: UserInfo[];
  loading: boolean;
  error: string | null;

  sortState: SortState;
  searchQuery: string;
  userType: UserCategory;

  totalUsers: number;
  totalPages: number;
  currentPage: number;

  // Actions
  setUsers: (newUsers: UserInfo[]) => void;
  clearUsers: () => void;

  setLoading: (state: boolean) => void;
  setError: (state: string | null) => void;

  setSortState: (newSortState: 'ascending' | 'descending') => void;
  setSearchQuery: (newSearchQuery: string) => void;
  setUserType: (newUserType: UserCategory) => void;

  setTotalUsers: (newTotalUsers: number) => void;
  setTotalPages: (newTotalPages: number) => void;
  setCurrentPage: (newCurrentPage: number) => void;

  getFriends: (sortState: string, searchQuery: string, page: number) => Promise<void>;
  getProfilesOfSentRequests: (
    sortState: string,
    searchQuery: string,
    page: number
  ) => Promise<void>;
  getProfilesOfReceivedRequests: (
    sortState: string,
    searchQuery: string,
    page: number
  ) => Promise<void>;
  getProfilesOfFormerFriends: (
    sortState: string,
    searchQuery: string,
    page: number
  ) => Promise<void>;
  getSuggestedProfiles: (sortState: string, searchQuery: string, page: number) => Promise<void>;

  loadUsersData: (newPage?: number) => void;
}

export const useFriendsStore = create<FriendsState>()((set, get) => ({
  users: [],
  loading: false,
  error: '',

  sortState: 'ascending',
  searchQuery: '',
  userType: 'friends',

  totalUsers: 0,
  totalPages: 0,
  currentPage: 1,

  setUsers: (newUsers) => set({ users: newUsers }),
  clearUsers: () => set({ users: [] }),

  setLoading: (state) => set({ loading: state }),
  setError: (state) => set({ error: state }),

  setSortState: (newSortState) => set({ sortState: newSortState }),
  setSearchQuery: (newSearchQuery) => set({ searchQuery: newSearchQuery }),
  setUserType: (newUserType) => set({ userType: newUserType }),

  setTotalUsers: (newTotalUsers) => set({ totalUsers: newTotalUsers }),
  setTotalPages: (newTotalPages) => set({ totalPages: newTotalPages }),
  setCurrentPage: (newCurrentPage) => set({ currentPage: newCurrentPage }),

  getFriends: async (sortState: string, searchQuery: string, page: number) => {
    set({ loading: true, error: null });

    try {
      const data = await getCurrentFriends(sortState, searchQuery, page);

      set({
        users: data.users,
        totalUsers: data.pagination.totalUsers,
        totalPages: data.pagination.totalPages,
        currentPage: data.pagination.currentPage,
        loading: false,
      });
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'An error occurred',
        loading: false,
      });
    }
  },

  getProfilesOfSentRequests: async (sortState: string, searchQuery: string, page: number) => {
    set({ loading: true, error: null });

    try {
      const data = await getSentRequestsProfile(sortState, searchQuery, page);

      set({
        users: data.users,
        totalUsers: data.pagination.totalUsers,
        totalPages: data.pagination.totalPages,
        currentPage: data.pagination.currentPage,
        loading: false,
      });
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'An error occurred',
        loading: false,
      });
    }
  },

  getProfilesOfReceivedRequests: async (sortState: string, searchQuery: string, page: number) => {
    set({ loading: true, error: null });

    try {
      const data = await getReceivedRequestsProfile(sortState, searchQuery, page);

      set({
        users: data.users,
        totalUsers: data.pagination.totalUsers,
        totalPages: data.pagination.totalPages,
        currentPage: data.pagination.currentPage,
        loading: false,
      });
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'An error occurred',
        loading: false,
      });
    }
  },

  getProfilesOfFormerFriends: async (sortState: string, searchQuery: string, page: number) => {
    set({ loading: true, error: null });

    try {
      const data = await getFormerFriends(sortState, searchQuery, page);

      set({
        users: data.users,
        totalUsers: data.pagination.totalUsers,
        totalPages: data.pagination.totalPages,
        currentPage: data.pagination.currentPage,
        loading: false,
      });
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'An error occurred',
        loading: false,
      });
    }
  },

  getSuggestedProfiles: async (sortState: string, searchQuery: string, page: number) => {
    set({ loading: true, error: null });

    try {
      const data = await getFriendSuggestions(sortState, searchQuery, page);

      set({
        users: data.users,
        totalUsers: data.pagination.totalUsers,
        totalPages: data.pagination.totalPages,
        currentPage: data.pagination.currentPage,
        loading: false,
      });
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'An error occurred',
        loading: false,
      });
    }
  },

  loadUsersData: async (newPage?: number) => {
    const {
      currentPage,
      sortState,
      searchQuery,
      userType,
      getFriends,
      getProfilesOfSentRequests,
      getProfilesOfReceivedRequests,
      getProfilesOfFormerFriends,
      getSuggestedProfiles,
    } = get();

    const page = newPage ?? currentPage;

    set({ loading: true, error: null });

    try {
      const apiMap: Record<string, () => Promise<void>> = {
        friends: () => getFriends(sortState, searchQuery, page),
        pending: () => getProfilesOfSentRequests(sortState, searchQuery, page),
        requests: () => getProfilesOfReceivedRequests(sortState, searchQuery, page),
        formerFriends: () => getProfilesOfFormerFriends(sortState, searchQuery, page),
        addFriend: () => getSuggestedProfiles(sortState, searchQuery, page),
      };

      await apiMap[userType]();
    } catch (err) {
      set({ error: 'Failed to load data' });
    } finally {
      set({ loading: false });
    }
  },
}));
