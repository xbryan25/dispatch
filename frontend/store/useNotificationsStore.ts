import { create } from 'zustand';

import {
  bulkDeleteNotifications,
  getUserNotifications,
  updateNotificationReadStatus,
} from '@/lib/api/notifications';

import {
  Notification,
  NotificationsToShow,
  ReadState,
  ReadStateForSelect,
} from '@/types/notifications';

import { toast } from 'sonner';

import { SortState } from '@/types/global';

interface NotificationsState {
  notifications: Notification[];
  isInitialLoad: boolean;
  loading: boolean;
  error: string | null;
  isRateLimited: boolean;

  markLoading: boolean;
  markIsRateLimited: boolean;

  deleteLoading: boolean;
  deleteIsRateLimited: boolean;

  notificationsToShow: number;
  sortState: SortState;
  readState: ReadStateForSelect;
  searchQuery: string;

  unreadNotifications: number;

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

  setMarkLoading: (state: boolean) => void;
  setMarkIsRateLimited: (state: boolean) => void;

  setDeleteLoading: (state: boolean) => void;
  setDeleteIsRateLimited: (state: boolean) => void;

  setNotificationsToShow: (newNotificationsToShow: NotificationsToShow) => void;
  setSortState: (newSortState: SortState) => void;
  setReadState: (setReadState: ReadStateForSelect) => void;
  setSearchQuery: (newSearchQuery: string) => void;

  setUnreadNotifications: (newUnreadNotifications: number) => void;

  setTotalNotifications: (newTotalUsers: number) => void;
  setTotalPages: (newTotalPages: number) => void;
  setCurrentPage: (newCurrentPage: number) => void;

  getNotifications: (isRetry?: boolean, isSilentFetch?: boolean) => Promise<void>;

  updateNotificationsReadStatus: (
    notificationIds: string[],
    readState: ReadState,
    isRetry?: boolean
  ) => Promise<void>;

  bulkDeleteNotifications: (notificationId: string[], isRetry?: boolean) => Promise<void>;
}

export const useNotificationsStore = create<NotificationsState>()((set, get) => ({
  notifications: [],
  isInitialLoad: true,

  loading: true,
  error: '',
  isRateLimited: false,

  markLoading: false,
  markIsRateLimited: false,

  deleteLoading: false,
  deleteIsRateLimited: false,

  notificationsToShow: 10,
  sortState: 'ascending' as SortState,
  readState: 'all' as ReadState,
  searchQuery: '',

  unreadNotifications: 0,

  totalNotifications: 0,
  totalPages: 0,
  currentPage: 1,

  retryTimeout: null,

  setNotifications: (newNotifications: Notification[]) => set({ notifications: newNotifications }),
  clearNotifications: () => set({ notifications: [] }),

  setLoading: (state: boolean) => set({ loading: state }),
  setError: (state: string | null) => set({ error: state }),
  setIsRateLimited: (state: boolean) => set({ isRateLimited: state }),

  setMarkLoading: (state: boolean) => set({ markLoading: state }),
  setMarkIsRateLimited: (state: boolean) => set({ markIsRateLimited: state }),

  setDeleteLoading: (state: boolean) => set({ deleteLoading: state }),
  setDeleteIsRateLimited: (state: boolean) => set({ deleteIsRateLimited: state }),

  setNotificationsToShow: async (newNotificationsToShow: NotificationsToShow) => {
    set({ notificationsToShow: newNotificationsToShow });

    await get().getNotifications();
  },

  setSortState: async (newSortState: SortState) => {
    set({ sortState: newSortState });

    await get().getNotifications();
  },

  setReadState: async (newReadState: ReadStateForSelect) => {
    set({ readState: newReadState });

    await get().getNotifications();
  },

  setSearchQuery: async (newSearchQuery) => {
    set({ searchQuery: newSearchQuery });

    await get().getNotifications();
  },

  setUnreadNotifications: async (newUnreadNotifications) =>
    set({ unreadNotifications: newUnreadNotifications }),

  setTotalNotifications: (newTotalNotifications: number) =>
    set({ totalNotifications: newTotalNotifications }),

  setTotalPages: (newTotalPages: number) => set({ totalPages: newTotalPages }),
  setCurrentPage: async (newCurrentPage: number) => {
    set({ currentPage: newCurrentPage });

    await get().getNotifications();
  },

  getNotifications: async (isRetry: boolean = false, isSilentFetch: boolean = false) => {
    if (!isSilentFetch) {
      set({ loading: true });
    }

    set({ error: null });

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
        unreadNotifications: data.unreadNotificationsCount,
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
        set({ isRateLimited: true, notifications: [] });

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

  updateNotificationsReadStatus: async (
    notificationIds: string[],
    readState: ReadState,
    isRetry: boolean = false
  ) => {
    set({ deleteLoading: true });

    try {
      await updateNotificationReadStatus(notificationIds, readState);

      set((state) => ({
        notifications: state.notifications.map((notif) =>
          notificationIds.includes(notif.notificationId)
            ? { ...notif, isReadByReceiver: readState === 'read' }
            : notif
        ),
      }));

      if (readState === 'unread') {
        set({
          unreadNotifications: get().unreadNotifications + 1,
        });
      } else if (readState === 'read') {
        set({
          unreadNotifications: get().unreadNotifications - 1,
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        set({ markIsRateLimited: true });

        if (!isRetry) {
          setTimeout(() => {
            set({ markIsRateLimited: false });
          }, 60000);

          const timeout = setTimeout(() => {
            get().updateNotificationsReadStatus(notificationIds, readState, true);
          }, 60000);

          set({ retryTimeout: timeout });
        }
      } else {
        toast.error(`Failed to mark as ${readState === 'read' ? 'read' : 'unread'}.`);
      }
    } finally {
      set({
        markLoading: false,
      });
    }
  },

  bulkDeleteNotifications: async (notificationIds: string[], isRetry: boolean = false) => {
    set({ deleteLoading: true });

    try {
      await bulkDeleteNotifications(notificationIds);

      await get().getNotifications();
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        set({ deleteIsRateLimited: true });

        if (!isRetry) {
          setTimeout(() => {
            set({ deleteIsRateLimited: false });
          }, 60000);

          const timeout = setTimeout(() => {
            get().bulkDeleteNotifications(notificationIds, true);
          }, 60000);

          set({ retryTimeout: timeout });
        }
      } else {
        toast.error(`Failed to delete notification.`);
      }
    } finally {
      set({
        deleteLoading: false,
      });
    }
  },
}));
