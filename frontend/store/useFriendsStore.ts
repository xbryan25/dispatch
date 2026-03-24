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
import { Factory } from 'lucide-react';

interface FriendsState {
  users: UserInfo[];
  loading: boolean;
  error: string | null;
  isRateLimited: Record<UserCategory, boolean>;

  sortState: SortState;
  searchQuery: string;
  userType: UserCategory;

  totalUsers: number;
  totalPages: number;
  currentPage: number;

  retryTimeout: ReturnType<typeof setTimeout> | null;

  // Actions
  setUsers: (newUsers: UserInfo[]) => void;
  clearUsers: () => void;

  setLoading: (state: boolean) => void;
  setError: (state: string | null) => void;

  setIsRateLimited: (userCategory: UserCategory, state: boolean) => void;

  setSortState: (newSortState: 'ascending' | 'descending') => void;
  setSearchQuery: (newSearchQuery: string) => void;
  setUserType: (newUserType: UserCategory) => void;

  setTotalUsers: (newTotalUsers: number) => void;
  setTotalPages: (newTotalPages: number) => void;
  setCurrentPage: (newCurrentPage: number) => void;

  getFriends: (
    sortState: string,
    searchQuery: string,
    page: number,
    isRetry?: boolean
  ) => Promise<void>;
  getProfilesOfSentRequests: (
    sortState: string,
    searchQuery: string,
    page: number,
    isRetry?: boolean
  ) => Promise<void>;
  getProfilesOfReceivedRequests: (
    sortState: string,
    searchQuery: string,
    page: number,
    isRetry?: boolean
  ) => Promise<void>;
  getProfilesOfFormerFriends: (
    sortState: string,
    searchQuery: string,
    page: number,
    isRetry?: boolean
  ) => Promise<void>;
  getSuggestedProfiles: (
    sortState: string,
    searchQuery: string,
    page: number,
    isRetry?: boolean
  ) => Promise<void>;

  loadUsersData: (newPage?: number) => Promise<void>;
}

export const useFriendsStore = create<FriendsState>()((set, get) => ({
  users: [],
  loading: false,
  error: '',

  isRateLimited: {
    friends: false,
    pending: false,
    requests: false,
    formerFriends: false,
    addFriend: false,
  },

  sortState: 'ascending',
  searchQuery: '',
  userType: 'friends',

  totalUsers: 0,
  totalPages: 0,
  currentPage: 1,

  retryTimeout: null,

  setUsers: (newUsers) => set({ users: newUsers }),
  clearUsers: () => set({ users: [] }),

  setLoading: (state) => set({ loading: state }),
  setError: (state) => set({ error: state }),

  setIsRateLimited: (userCategory, state) =>
    set((prev) => ({
      isRateLimited: {
        ...prev.isRateLimited,
        [userCategory]: state,
      },
    })),

  setSortState: async (newSortState) => {
    set({ sortState: newSortState });

    await get().loadUsersData(1);
  },
  setSearchQuery: async (newSearchQuery) => {
    set({ searchQuery: newSearchQuery });

    await get().loadUsersData(1);
  },
  setUserType: async (newUserType) => {
    set({ userType: newUserType, searchQuery: '' });

    await get().loadUsersData(1);
  },

  setTotalUsers: (newTotalUsers) => set({ totalUsers: newTotalUsers }),
  setTotalPages: (newTotalPages) => set({ totalPages: newTotalPages }),
  setCurrentPage: (newCurrentPage) => set({ currentPage: newCurrentPage }),

  getFriends: async (
    sortState: string,
    searchQuery: string,
    page: number,
    isRetry: boolean = false
  ) => {
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
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        set((prev) => ({
          isRateLimited: {
            ...prev.isRateLimited,
            friends: true,
          },
          users: [],
        }));

        if (!isRetry) {
          setTimeout(() => {
            set((prev) => ({
              isRateLimited: { ...prev.isRateLimited, friends: false },
            }));
          }, 60000);

          const timeout = setTimeout(() => {
            get().getFriends(sortState, searchQuery, page, true);
          }, 60000);

          set({ retryTimeout: timeout });
        }
      } else {
        set({
          error: err instanceof Error ? err.message : 'An error occurred',
        });
      }
    } finally {
      set({
        loading: false,
      });
    }
  },

  getProfilesOfSentRequests: async (
    sortState: string,
    searchQuery: string,
    page: number,
    isRetry: boolean = false
  ) => {
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
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        set((prev) => ({
          isRateLimited: {
            ...prev.isRateLimited,
            pending: true,
          },
          users: [],
        }));
        if (!isRetry) {
          setTimeout(() => {
            set((prev) => ({
              isRateLimited: { ...prev.isRateLimited, pending: false },
            }));
          }, 60000);

          const timeout = setTimeout(() => {
            get().getProfilesOfSentRequests(sortState, searchQuery, page, true);
          }, 60000);

          set({ retryTimeout: timeout });
        }
      } else {
        set({
          error: err instanceof Error ? err.message : 'An error occurred',
        });
      }
    } finally {
      set({
        loading: false,
      });
    }
  },

  getProfilesOfReceivedRequests: async (
    sortState: string,
    searchQuery: string,
    page: number,
    isRetry: boolean = false
  ) => {
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
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        set((prev) => ({
          isRateLimited: {
            ...prev.isRateLimited,
            requests: true,
          },
          users: [],
        }));
        if (!isRetry) {
          setTimeout(() => {
            set((prev) => ({
              isRateLimited: { ...prev.isRateLimited, requests: false },
            }));
          }, 60000);

          const timeout = setTimeout(() => {
            get().getProfilesOfReceivedRequests(sortState, searchQuery, page, true);
          }, 60000);

          set({ retryTimeout: timeout });
        }
      } else {
        set({
          error: err instanceof Error ? err.message : 'An error occurred',
        });
      }
    } finally {
      set({
        loading: false,
      });
    }
  },

  getProfilesOfFormerFriends: async (
    sortState: string,
    searchQuery: string,
    page: number,
    isRetry: boolean = false
  ) => {
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
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        set((prev) => ({
          isRateLimited: {
            ...prev.isRateLimited,
            formerFriends: true,
          },
          users: [],
        }));
        if (!isRetry) {
          setTimeout(() => {
            set((prev) => ({
              isRateLimited: { ...prev.isRateLimited, formerFriends: false },
            }));
          }, 60000);
          const timeout = setTimeout(() => {
            get().getProfilesOfFormerFriends(sortState, searchQuery, page, true);
          }, 60000);

          set({ retryTimeout: timeout });
        }
      } else {
        set({
          error: err instanceof Error ? err.message : 'An error occurred',
        });
      }
    } finally {
      set({
        loading: false,
      });
    }
  },

  getSuggestedProfiles: async (
    sortState: string,
    searchQuery: string,
    page: number,
    isRetry: boolean = false
  ) => {
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
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        set((prev) => ({
          isRateLimited: {
            ...prev.isRateLimited,
            addFriend: true,
          },
          users: [],
        }));
        if (!isRetry) {
          setTimeout(() => {
            set((prev) => ({
              isRateLimited: { ...prev.isRateLimited, addFriend: false },
            }));
          }, 60000);

          const timeout = setTimeout(() => {
            get().getSuggestedProfiles(sortState, searchQuery, page, true);
          }, 60000);

          set({ retryTimeout: timeout });
        }
      } else {
        set({
          error: err instanceof Error ? err.message : 'An error occurred',
        });
      }
    } finally {
      set({
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
