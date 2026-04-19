import { create } from 'zustand';

import { ConversationSnippet, Message } from '@/types/chat';

import { getUserConversationsList } from '@/lib/api/messages';

interface SidebarState {
  conversationSnippets: ConversationSnippet[];
  isLoading: boolean;
  isRateLimited: boolean;
  error: string | null;

  // Actions
  setSnippets: (snippets: ConversationSnippet[]) => void;
  upsertSnippet: (message: Message) => void;

  updateHasSeenLatestMessage: (
    conversationId: string,
    newHasSeenLatestMessage: boolean,
    latestMessageSenderId: string
  ) => void;
  setLoading: (value: boolean) => void;

  getConversations: (isRetry?: boolean) => Promise<void>;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  conversationSnippets: [],
  isLoading: true,
  isRateLimited: false,
  error: null,

  setSnippets: (snippets: ConversationSnippet[]) => set({ conversationSnippets: snippets }),

  // This moves the chat to the top and updates the preview text
  upsertSnippet: (message) =>
    set((state) => {
      const index = state.conversationSnippets.findIndex(
        (s) => s.conversationId === message.conversationId
      );
      const updatedSnippets = [...state.conversationSnippets];

      if (index !== -1) {
        const [movedItem] = updatedSnippets.splice(index, 1);
        movedItem.latestMessage = message.content;
        movedItem.latestMessageTime = message.createdAt;
        updatedSnippets.unshift(movedItem);
      }

      return { conversationSnippets: updatedSnippets };
    }),

  updateHasSeenLatestMessage: (
    conversationId: string,
    newHasSeenLatestMessage: boolean,
    latestMessageSenderId: string
  ) =>
    set((state) => {
      const index = state.conversationSnippets.findIndex(
        (s) => s.conversationId === conversationId
      );
      const updatedSnippets = [...state.conversationSnippets];

      const conversationSnippet = updatedSnippets[index];
      conversationSnippet['hasSeenLatestMessage'] = newHasSeenLatestMessage;
      conversationSnippet['latestMessageSenderId'] = latestMessageSenderId;

      updatedSnippets[index] = conversationSnippet;

      return { conversationSnippets: updatedSnippets };
    }),

  setLoading: (value: boolean) => set({ isLoading: value }),

  getConversations: async (isRetry: boolean = false) => {
    set({ isLoading: true, error: null });

    try {
      const data = await getUserConversationsList();

      set({ conversationSnippets: data.conversations });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      set({ error: errorMessage });

      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        set({ isRateLimited: true });

        if (!isRetry) {
          setTimeout(() => {
            set({ isRateLimited: false });
          }, 60000);

          setTimeout(() => {
            get().getConversations(true);
          }, 60000);
        }
      } else {
        set({
          error: err instanceof Error ? err.message : 'An error occurred',
        });
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));
