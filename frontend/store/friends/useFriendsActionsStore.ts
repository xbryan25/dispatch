import { create } from 'zustand';

import {
  createNewFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriendUser,
  reconnectToUser,
} from '@/lib/api/friendship';

import { ActionCategory } from '@/types/friends';

interface FriendsActionsState {
  loading: boolean;
  error: string | null;
  isRateLimitedFromActions: Record<ActionCategory, boolean>;

  // Actions
  setLoading: (state: boolean) => void;
  setError: (state: string | null) => void;
  setIsRateLimitedFromActions: (actionCategory: ActionCategory, state: boolean) => void;

  createFriendRequest: (targetUserId: string, isRetry?: boolean) => Promise<void>;
  cancelSentFriendRequest: (targetUserId: string, isRetry?: boolean) => Promise<void>;
  acceptReceivedFriendRequest: (targetUserId: string, isRetry?: boolean) => Promise<void>;
  rejectReceivedFriendRequest: (targetUserId: string, isRetry?: boolean) => Promise<void>;
  unfriendSelectedUser: (targetUserId: string, isRetry?: boolean) => Promise<void>;
  reconnectToFormerFriend: (targetUserId: string, isRetry?: boolean) => Promise<void>;

  doFriendsAction: (targetUserId: string, friendAction: ActionCategory) => Promise<void>;
}

export const useFriendsActionsStore = create<FriendsActionsState>()((set, get) => ({
  loading: false,
  error: '',

  isRateLimitedFromActions: {
    createNewRequestAction: false,
    cancelRequestAction: false,
    acceptAction: false,
    rejectAction: false,
    unfriendAction: false,
    reconnectRequestAction: false,
  },

  setLoading: (state) => set({ loading: state }),
  setError: (state) => set({ error: state }),

  setIsRateLimitedFromActions: (actionCategory, state) => {
    set((prev) => ({
      isRateLimitedFromActions: {
        ...prev.isRateLimitedFromActions,
        [actionCategory]: state,
      },
    }));
  },

  createFriendRequest: async (targetUserId: string, isRetry: boolean = false) => {
    set((prev) => ({
      loading: true,
      error: null,
      isRateLimitedFromActions: {
        ...prev.isRateLimitedFromActions,
        createNewRequestAction: false,
      },
    }));

    try {
      await createNewFriendRequest(targetUserId);
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        set((prev) => ({
          isRateLimitedFromActions: {
            ...prev.isRateLimitedFromActions,
            createNewRequestAction: true,
          },
        }));

        if (!isRetry) {
          setTimeout(() => {
            set((prev) => ({
              isRateLimitedFromActions: {
                ...prev.isRateLimitedFromActions,
                createNewRequestAction: false,
              },
            }));
          }, 60000);

          setTimeout(() => {
            get().createFriendRequest(targetUserId, true);
          }, 60000);
        }
      } else {
        set({
          error: err instanceof Error ? err.message : 'An error occurred',
        });
      }
    } finally {
      set({ loading: false });
    }
  },

  cancelSentFriendRequest: async (targetUserId: string, isRetry: boolean = false) => {
    set((prev) => ({
      loading: true,
      error: null,
      isRateLimitedFromActions: {
        ...prev.isRateLimitedFromActions,
        cancelRequestAction: false,
      },
    }));

    try {
      await cancelFriendRequest(targetUserId);
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        set((prev) => ({
          isRateLimitedFromActions: {
            ...prev.isRateLimitedFromActions,
            cancelRequestAction: true,
          },
        }));

        if (!isRetry) {
          setTimeout(() => {
            set((prev) => ({
              isRateLimitedFromActions: {
                ...prev.isRateLimitedFromActions,
                cancelRequestAction: false,
              },
            }));
          }, 60000);

          setTimeout(() => {
            get().cancelSentFriendRequest(targetUserId, true);
          }, 60000);
        }
      } else {
        set({
          error: err instanceof Error ? err.message : 'An error occurred',
        });
      }
    } finally {
      set({ loading: false });
    }
  },

  acceptReceivedFriendRequest: async (targetUserId: string, isRetry: boolean = false) => {
    set((prev) => ({
      loading: true,
      error: null,
      isRateLimitedFromActions: {
        ...prev.isRateLimitedFromActions,
        acceptAction: false,
      },
    }));

    try {
      await acceptFriendRequest(targetUserId);
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        set((prev) => ({
          isRateLimitedFromActions: {
            ...prev.isRateLimitedFromActions,
            acceptAction: true,
          },
        }));

        if (!isRetry) {
          setTimeout(() => {
            set((prev) => ({
              isRateLimitedFromActions: {
                ...prev.isRateLimitedFromActions,
                acceptAction: false,
              },
            }));
          }, 60000);

          setTimeout(() => {
            get().acceptReceivedFriendRequest(targetUserId, true);
          }, 60000);
        }
      } else {
        set({
          error: err instanceof Error ? err.message : 'An error occurred',
        });
      }
    } finally {
      set({ loading: false });
    }
  },

  rejectReceivedFriendRequest: async (targetUserId: string, isRetry: boolean = false) => {
    set((prev) => ({
      loading: true,
      error: null,
      isRateLimitedFromActions: {
        ...prev.isRateLimitedFromActions,
        rejectAction: false,
      },
    }));

    try {
      await rejectFriendRequest(targetUserId);
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        set((prev) => ({
          isRateLimitedFromActions: {
            ...prev.isRateLimitedFromActions,
            rejectAction: true,
          },
        }));

        if (!isRetry) {
          setTimeout(() => {
            set((prev) => ({
              isRateLimitedFromActions: {
                ...prev.isRateLimitedFromActions,
                rejectAction: false,
              },
            }));
          }, 60000);

          setTimeout(() => {
            get().rejectReceivedFriendRequest(targetUserId, true);
          }, 60000);
        }
      } else {
        set({
          error: err instanceof Error ? err.message : 'An error occurred',
        });
      }
    } finally {
      set({ loading: false });
    }
  },

  unfriendSelectedUser: async (targetUserId: string, isRetry: boolean = false) => {
    set((prev) => ({
      loading: true,
      error: null,
      isRateLimitedFromActions: {
        ...prev.isRateLimitedFromActions,
        unfriendAction: false,
      },
    }));

    try {
      await unfriendUser(targetUserId);
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        set((prev) => ({
          isRateLimitedFromActions: {
            ...prev.isRateLimitedFromActions,
            unfriendAction: true,
          },
        }));

        if (!isRetry) {
          setTimeout(() => {
            set((prev) => ({
              isRateLimitedFromActions: {
                ...prev.isRateLimitedFromActions,
                unfriendAction: false,
              },
            }));
          }, 60000);

          setTimeout(() => {
            get().unfriendSelectedUser(targetUserId, true);
          }, 60000);
        }
      } else {
        set({
          error: err instanceof Error ? err.message : 'An error occurred',
        });
      }
    } finally {
      set({ loading: false });
    }
  },

  reconnectToFormerFriend: async (targetUserId: string, isRetry: boolean = false) => {
    set((prev) => ({
      loading: true,
      error: null,
      isRateLimitedFromActions: {
        ...prev.isRateLimitedFromActions,
        reconnectRequestAction: false,
      },
    }));

    try {
      await reconnectToUser(targetUserId);
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        set((prev) => ({
          isRateLimitedFromActions: {
            ...prev.isRateLimitedFromActions,
            reconnectRequestAction: true,
          },
        }));

        if (!isRetry) {
          setTimeout(() => {
            set((prev) => ({
              isRateLimitedFromActions: {
                ...prev.isRateLimitedFromActions,
                reconnectRequestAction: false,
              },
            }));
          }, 60000);

          setTimeout(() => {
            get().reconnectToFormerFriend(targetUserId, true);
          }, 60000);
        }
      } else {
        set({
          error: err instanceof Error ? err.message : 'An error occurred',
        });
      }
    } finally {
      set({ loading: false });
    }
  },

  doFriendsAction: async (targetUserId: string, friendAction: ActionCategory) => {
    const {
      createFriendRequest,
      cancelSentFriendRequest,
      acceptReceivedFriendRequest,
      rejectReceivedFriendRequest,
      unfriendSelectedUser,
      reconnectToFormerFriend,
    } = get();

    try {
      const apiMap: Record<string, () => Promise<void>> = {
        createNewRequestAction: () => createFriendRequest(targetUserId),
        cancelRequestAction: () => cancelSentFriendRequest(targetUserId),
        acceptAction: () => acceptReceivedFriendRequest(targetUserId),
        rejectAction: () => rejectReceivedFriendRequest(targetUserId),
        unfriendAction: () => unfriendSelectedUser(targetUserId),
        reconnectRequestAction: () => reconnectToFormerFriend(targetUserId),
      };

      await apiMap[friendAction]();
    } catch {
      set({ error: 'Failed to load do friend action.' });
    } finally {
      set({ loading: false });
    }
  },
}));
