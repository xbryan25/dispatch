import {
  getCurrentUserDetails,
  getCurrentUserId,
  getPresignedUrl,
  updateProfileImage,
  updateUserDetails,
} from '@/lib/api/auth';
import { login, logout, register } from '@/lib/auth';
import { uploadImageToSupabaseStorage } from '@/lib/supabase/client';
import { UserProfile, UserProfileUpdate } from '@/types/auth';
import { create } from 'zustand';

interface AuthState {
  currentUserId: string | null;
  currentUserDetails: UserProfile | null;

  registerLoading: boolean;
  registerError: string | null;

  loginLoading: boolean;
  loginError: string | null;

  logoutLoading: boolean;
  logoutError: string | null;

  getCurrentIdLoading: boolean;
  getCurrentIdError: string | null;

  getCurrentUserDetailsLoading: boolean;
  getCurrentUserDetailsError: string | null;
  getCurrentUserDetailsIsRateLimited: boolean;

  patchUserDetailsLoading: boolean;
  patchUserDetailsError: string | null;
  patchUserDetailsIsRateLimited: boolean;

  patchUserProfileImageLoading: boolean;
  patchUserProfileImageError: string | null;
  presignedURLIsRateLimited: boolean;
  patchUserProfileImageIsRateLimited: boolean;

  // Actions
  setCurrentUserId: (userId: string) => void;
  clearCurrentUserId: () => void;

  registerUser: (email: string, password: string, displayName: string) => Promise<void>;

  loginUser: (email: string, password: string) => Promise<void>;

  logoutUser: () => Promise<void>;

  getCurrentId: () => Promise<void>;

  getCurrentUserDetails: (isRetry?: boolean) => Promise<void>;

  patchUserDetails: (payload: UserProfileUpdate, isRetry?: boolean) => Promise<void>;

  patchUserProfileImage: (image: File, isRetry?: boolean) => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  currentUserId: null,
  currentUserDetails: null,

  registerLoading: false,
  registerError: null,

  loginLoading: false,
  loginError: null,

  logoutLoading: false,
  logoutError: null,

  getCurrentIdLoading: false,
  getCurrentIdError: null,

  getCurrentUserDetailsLoading: false,
  getCurrentUserDetailsError: null,
  getCurrentUserDetailsIsRateLimited: false,

  patchUserDetailsLoading: false,
  patchUserDetailsError: null,
  patchUserDetailsIsRateLimited: false,

  patchUserProfileImageLoading: false,
  patchUserProfileImageError: null,
  presignedURLIsRateLimited: false,
  patchUserProfileImageIsRateLimited: false,

  setCurrentUserId: (id) => set({ currentUserId: id }),
  clearCurrentUserId: () => set({ currentUserId: null }),

  registerUser: async (email: string, password: string, displayName: string) => {
    set({
      registerLoading: true,
      registerError: null,
    });

    try {
      await register(email, password, displayName);
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({
          registerError: err.message,
        });
      } else {
        set({
          registerError: 'An unexpected error occurred',
        });
      }
    } finally {
      set({
        registerLoading: false,
      });
    }
  },

  loginUser: async (email: string, password: string) => {
    set({
      loginLoading: true,
      loginError: null,
    });

    try {
      // const data = await login(email, password);
      await login(email, password);
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({
          loginError: err.message,
        });
      } else {
        set({
          loginError: 'An unexpected error occurred',
        });
      }
    } finally {
      set({
        loginLoading: false,
      });
    }
  },

  logoutUser: async () => {
    set({
      logoutLoading: true,
      logoutError: null,
    });

    try {
      await logout();
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({
          logoutError: err.message,
        });
      } else {
        set({
          logoutError: 'An unexpected error occurred',
        });
      }
    } finally {
      set({
        logoutLoading: false,
      });
    }
  },

  getCurrentId: async () => {
    set({
      getCurrentIdLoading: true,
      getCurrentIdError: null,
    });

    try {
      const data: { currentUserId: string } = await getCurrentUserId();

      set({
        currentUserId: data.currentUserId,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({
          getCurrentIdError: err.message,
        });
      } else {
        set({
          getCurrentIdError: 'An unexpected error occurred',
        });
      }
    } finally {
      set({
        getCurrentIdLoading: false,
      });
    }
  },

  getCurrentUserDetails: async (isRetry: boolean = false) => {
    set({
      getCurrentUserDetailsLoading: true,
      getCurrentUserDetailsError: null,
      getCurrentUserDetailsIsRateLimited: false,
    });

    try {
      const data: UserProfile = await getCurrentUserDetails();

      set({
        currentUserDetails: data,
      });
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        set({ getCurrentUserDetailsIsRateLimited: true });

        if (!isRetry) {
          setTimeout(() => {
            set({ getCurrentUserDetailsIsRateLimited: false });
          }, 60000);

          setTimeout(() => {
            get().getCurrentUserDetails(true);
          }, 60000);
        }
      } else {
        set({
          getCurrentUserDetailsError:
            err instanceof Error ? err.message : 'An unexpected error occurred',
        });
      }
    } finally {
      set({
        getCurrentUserDetailsLoading: false,
      });
    }
  },

  patchUserDetails: async (payload: UserProfileUpdate, isRetry: boolean = false) => {
    set({
      patchUserDetailsLoading: true,
      patchUserDetailsError: null,
      patchUserDetailsIsRateLimited: false,
    });

    try {
      await updateUserDetails(payload);
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        set({ patchUserDetailsIsRateLimited: true });

        if (!isRetry) {
          setTimeout(() => {
            set({ patchUserDetailsIsRateLimited: false });
          }, 60000);

          setTimeout(() => {
            get().patchUserDetails(payload, true);
          }, 60000);
        }
      } else {
        set({
          patchUserDetailsError:
            err instanceof Error ? err.message : 'An unexpected error occurred',
        });
      }
    } finally {
      set({
        patchUserDetailsLoading: false,
      });
    }
  },

  patchUserProfileImage: async (image: File, isRetry: boolean = false) => {
    set({
      patchUserProfileImageLoading: true,
      patchUserProfileImageError: null,
      presignedURLIsRateLimited: false,
      patchUserDetailsIsRateLimited: false,
    });

    try {
      const data = await getPresignedUrl(image);

      await uploadImageToSupabaseStorage(data.upload_url, image);

      await updateProfileImage(data.final_image_url);
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        set({ presignedURLIsRateLimited: true, patchUserDetailsIsRateLimited: true });

        if (!isRetry) {
          setTimeout(() => {
            set({ presignedURLIsRateLimited: false, patchUserDetailsIsRateLimited: false });
          }, 60000);

          setTimeout(() => {
            get().patchUserProfileImage(image, true);
          }, 60000);
        }
      } else {
        set({
          patchUserProfileImageError:
            err instanceof Error ? err.message : 'An unexpected error occurred',
        });
      }
    } finally {
      set({
        patchUserProfileImageLoading: false,
      });
    }
  },
}));
