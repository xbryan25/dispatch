import { create } from 'zustand';

import { getUserNotifications } from '@/lib/api/notifications';

import { Notification, NotificationsToShow, ReadState } from '@/types/notifications';
import { SortState } from '@/types/global';

interface NotificationsState {
  notifications: Notification[];
  isInitialLoad: boolean;
  loading: boolean;
  error: string | null;
  isRateLimited: boolean;

  notificationsToShow: number;
  sortState: SortState;
  readState: ReadState;
  searchQuery: string;

  totalNotifications: number;
  totalPages: number;
  currentPage: number;

  retryTimeout: ReturnType<typeof setTimeout> | null;

  // Actions
  setNotifications: (newNotifications: Notification[]) => void;
  clearNotifications: () => void;

  setLoading: (state: boolean) => void;
  setError: (state: string | null) => void;

  setIsRateLimited: (state: boolean) => void;

  setNotificationsToShow: (newNotificationsToShow: NotificationsToShow) => void;
  setSortState: (newSortState: SortState) => void;
  setReadState: (setReadState: ReadState) => void;
  setSearchQuery: (newSearchQuery: string) => void;

  setTotalNotifications: (newTotalUsers: number) => void;
  setTotalPages: (newTotalPages: number) => void;
  setCurrentPage: (newCurrentPage: number) => void;

  getNotifications: (isRetry?: boolean) => Promise<void>;
}

export const useNotificationsStore = create<NotificationsState>()((set, get) => ({
  notifications: [],
  isInitialLoad: true,
  loading: true,
  error: '',

  isRateLimited: false,

  notificationsToShow: 10,
  sortState: 'ascending' as SortState,
  readState: 'all' as ReadState,
  searchQuery: '',

  totalNotifications: 0,
  totalPages: 0,
  currentPage: 1,

  retryTimeout: null,

  setNotifications: (newNotifications: Notification[]) => set({ notifications: newNotifications }),
  clearNotifications: () => set({ notifications: [] }),

  setLoading: (state: boolean) => set({ loading: state }),
  setError: (state: string | null) => set({ error: state }),

  setIsRateLimited: (state: boolean) => set({ isRateLimited: state }),

  setNotificationsToShow: async (newNotificationsToShow: NotificationsToShow) => {
    set({ notificationsToShow: newNotificationsToShow });

    await get().getNotifications();
  },

  setSortState: async (newSortState: SortState) => {
    set({ sortState: newSortState });

    await get().getNotifications();
  },

  setReadState: async (newReadState: ReadState) => {
    set({ readState: newReadState });

    await get().getNotifications();
  },

  setSearchQuery: async (newSearchQuery) => {
    set({ searchQuery: newSearchQuery });

    await get().getNotifications();
  },

  setTotalNotifications: (newTotalNotifications: number) =>
    set({ totalNotifications: newTotalNotifications }),

  setTotalPages: (newTotalPages: number) => set({ totalPages: newTotalPages }),
  setCurrentPage: async (newCurrentPage: number) => {
    set({ currentPage: newCurrentPage });

    await get().getNotifications();
  },

  getNotifications: async (isRetry: boolean = false) => {
    set({ loading: true, error: null });

    try {
      const { currentPage, readState, sortState, notificationsToShow, isInitialLoad } = get();

      const data = await getUserNotifications(
        readState,
        sortState,
        currentPage,
        notificationsToShow
      );

      set({
        notifications: data.notifications,
        totalNotifications: data.pagination.totalUsers,
        totalPages: data.pagination.totalPages,
        currentPage: data.pagination.currentPage,
        loading: false,
      });

      if (isInitialLoad) {
        set({ isInitialLoad: false });
      }
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        set({ isRateLimited: false, notifications: [] });

        if (!isRetry) {
          setTimeout(() => {
            set({ isRateLimited: false });
          }, 60000);

          const timeout = setTimeout(() => {
            get().getNotifications(true);
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
}));
