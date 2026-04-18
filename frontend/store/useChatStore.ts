import { create } from 'zustand';
import { Message, OtherParticipantDetails, TempMessage } from '@/types/chat';
import {
  createDirectMessage,
  getConversationTheme,
  getOtherParticipantFromConversation,
  getPastMessagesFromConversation,
  markConversationAsRead,
  sendMessage,
  updateConversationTheme,
} from '@/lib/api/messages';

interface ChatState {
  messages: Message[];
  sendingMessages: TempMessage[];
  failedMessages: TempMessage[];

  otherParticipantDetails: OtherParticipantDetails | null;
  socket: WebSocket | null;
  activeConversationId: string | null;
  hasMorePastMessages: boolean;

  isInitialLoad: boolean;

  otherParticipantFriendshipStatus: string | null;
  otherParticipantIsOnline: boolean;
  otherParticipantLastOnline: Date | null;
  otherParticipantLastReadMessageId: string | null;
  otherParticipantLastReadMessageAt: Date | null;

  conversationTheme: string;
  conversationThemeChangedAt: Date | null;
  conversationThemeChangedBy: string | null;

  sendLoading: boolean;
  sendError: string | null;
  sendRateLimited: boolean;

  getPastMessagesLoading: boolean;
  getPastMessagesError: string | null;
  getPastMessagesRateLimited: boolean;

  getOtherParticipantLoading: boolean;
  getOtherParticipantError: string | null;
  getOtherParticipantRateLimited: boolean;

  createNewDirectMessageLoading: boolean;
  createNewDirectMessageError: string | null;
  createNewDirectMessageRateLimited: boolean;

  getActiveConversationThemeLoading: boolean;
  getActiveConversationThemeError: string | null;
  getActiveConversationThemeRateLimited: boolean;

  changeConversationThemeLoading: boolean;
  changeConversationThemeError: string | null;
  changeConversationThemeRateLimited: boolean;

  markAsReadLoading: boolean;
  markAsReadError: string | null;
  markAsReadRateLimited: boolean;

  // Actions
  addMessage: (newMessage: Message) => void;
  addSendingMessage: (newMessage: TempMessage) => void;
  addFailedMessage: (newMessage: TempMessage) => void;

  removeSendingMessage: (tempMessageId: string) => void;
  removeFailedMessage: (tempMessageId: string) => void;

  prependPastMessages: (pastMessages: Message[]) => void;
  setMessages: (newMessages: Message[]) => void;
  setActiveConversationId: (conversationId: string | null) => void;
  setOtherParticipantDetails: (newParticipantDetails: OtherParticipantDetails | null) => void;
  setIsInitialLoad: (newVal: boolean) => void;

  setOtherParticipantFriendshipStatus: (newVal: string) => void;
  setConversationTheme: (newVal: string) => void;
  setConversationThemeChangedAt: (newVal: Date | null) => void;
  setConversationThemeChangedBy: (newVal: string | null) => void;

  setOtherParticipantIsOnline: (newVal: boolean) => void;
  setOtherParticipantLastOnline: (newVal: Date | null) => void;

  setOtherParticipantLastReadMessageId: (newVal: string | null) => void;
  setOtherParticipantLastReadMessageAt: (newVal: Date | null) => void;

  setSocket: (socket: WebSocket | null) => void;
  clearChat: () => void;

  resetConversation: (conversationId?: string) => void;

  // API-related actions

  send: (content: string, tempMessageId: string) => Promise<void>;
  getPastMessages: (conversationId: string) => Promise<void>;
  getOtherParticipant: (conversationId: string) => Promise<void>;
  createNewDirectMessage: (
    targetUserId: string
  ) => Promise<{ conversationId: string; conversationIdType: 'existing' | 'new' } | null>;
  getActiveConversationTheme: (conversationId: string) => Promise<void>;
  changeConversationTheme: (conversationId: string, theme: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  sendingMessages: [],
  failedMessages: [],

  otherParticipantDetails: null,
  socket: null,
  activeConversationId: null,
  hasMorePastMessages: true,
  isInitialLoad: false,
  isGetting: false,
  isSending: false,
  isGettingOtherParticipant: false,
  otherParticipantFriendshipStatus: null,

  conversationTheme: 'default',
  conversationThemeChangedAt: null,
  conversationThemeChangedBy: null,

  otherParticipantIsOnline: false,
  otherParticipantLastOnline: null,
  otherParticipantLastReadMessageId: null,
  otherParticipantLastReadMessageAt: null,

  sendLoading: false,
  sendError: null,
  sendRateLimited: false,

  getPastMessagesLoading: false,
  getPastMessagesError: null,
  getPastMessagesRateLimited: false,

  getOtherParticipantLoading: false,
  getOtherParticipantError: null,
  getOtherParticipantRateLimited: false,

  createNewDirectMessageLoading: false,
  createNewDirectMessageError: null,
  createNewDirectMessageRateLimited: false,

  getActiveConversationThemeLoading: false,
  getActiveConversationThemeError: null,
  getActiveConversationThemeRateLimited: false,

  changeConversationThemeLoading: false,
  changeConversationThemeError: null,
  changeConversationThemeRateLimited: false,

  markAsReadLoading: false,
  markAsReadError: null,
  markAsReadRateLimited: false,

  addMessage: (newMessage) =>
    set((state) => {
      // Checks if messageId already exists in list
      const exists = state.messages.some((m) => m.messageId === newMessage.messageId);

      if (exists) return state;

      return { messages: [...state.messages, newMessage] };
    }),

  addSendingMessage: (newMessage) =>
    set((state) => {
      return { sendingMessages: [...state.sendingMessages, newMessage] };
    }),

  addFailedMessage: (newMessage) =>
    set((state) => {
      console.log(state.failedMessages);

      return { failedMessages: [...state.failedMessages, newMessage] };
    }),

  removeSendingMessage: (tempMessageId: string) =>
    set((state) => {
      return {
        sendingMessages: state.sendingMessages.filter((msg) => msg.tempMessageId !== tempMessageId),
      };
    }),

  removeFailedMessage: (tempMessageId: string) =>
    set((state) => {
      return {
        failedMessages: state.failedMessages.filter((msg) => msg.tempMessageId !== tempMessageId),
      };
    }),

  prependPastMessages: (pastMessages: Message[]) =>
    set((state) => {
      // Checks if messageIds already exists in messages array
      const filteredPast = pastMessages.filter(
        (pastMessage) => !state.messages.some((m) => m.messageId === pastMessage.messageId)
      );

      if (filteredPast.length === 0) return state;

      return {
        messages: [...filteredPast, ...state.messages],
        hasMorePastMessages: pastMessages.length === 20,
      };
    }),

  setMessages: (newMessages: Message[]) => set({ messages: newMessages }),

  setActiveConversationId: (conversationId) => {
    if (get().activeConversationId === conversationId) return;
    set({
      activeConversationId: conversationId,
    });
  },

  setOtherParticipantDetails: (newParticipantDetails) => {
    console.log(newParticipantDetails);

    set({
      otherParticipantDetails: newParticipantDetails,
    });

    set({
      otherParticipantFriendshipStatus: newParticipantDetails?.friendshipStatus,
    });

    set({
      otherParticipantIsOnline: newParticipantDetails?.isOnline,
    });

    if (newParticipantDetails?.lastOnline) {
      const date = new Date(newParticipantDetails.lastOnline);

      set({
        otherParticipantLastOnline: date,
      });
    } else {
      set({
        otherParticipantLastOnline: null,
      });
    }

    set({
      otherParticipantLastReadMessageId: newParticipantDetails?.lastReadMessageId,
    });

    if (newParticipantDetails?.lastReadMessageAt) {
      const date = new Date(newParticipantDetails.lastReadMessageAt);

      set({
        otherParticipantLastReadMessageAt: date,
      });
    } else {
      set({
        otherParticipantLastReadMessageAt: null,
      });
    }
  },

  setIsInitialLoad: (newVal: boolean) => set({ isInitialLoad: newVal }),

  setOtherParticipantFriendshipStatus: (newVal: string) =>
    set({ otherParticipantFriendshipStatus: newVal }),

  setConversationTheme: (newVal: string) => set({ conversationTheme: newVal }),

  setConversationThemeChangedAt: (newVal: Date | null) =>
    set({ conversationThemeChangedAt: newVal }),

  setConversationThemeChangedBy: (newVal: string | null) =>
    set({ conversationThemeChangedBy: newVal }),

  setSocket: (socket) => set({ socket }),

  clearChat: () => set({ messages: [], socket: null }),

  resetConversation: (conversationId?: string) => {
    set({
      activeConversationId: conversationId ?? null,
      messages: [],
      hasMorePastMessages: true,
      isInitialLoad: true,
      getOtherParticipantLoading: true,
      otherParticipantFriendshipStatus: null,
    });
  },

  setOtherParticipantIsOnline: (newVal: boolean) => set({ otherParticipantIsOnline: newVal }),

  setOtherParticipantLastOnline: (newVal: Date | null) =>
    set({ otherParticipantLastOnline: newVal }),

  setOtherParticipantLastReadMessageId: (newVal: string | null) =>
    set({ otherParticipantLastReadMessageId: newVal }),

  setOtherParticipantLastReadMessageAt: (newVal: Date | null) =>
    set({ otherParticipantLastReadMessageAt: newVal }),

  send: async (content: string, tempMessageId: string) => {
    set({ sendLoading: true, sendError: null, sendRateLimited: false });
    try {
      const { activeConversationId } = get();

      await sendMessage(content, tempMessageId, activeConversationId);
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        set({ sendRateLimited: true });

        setTimeout(() => set({ sendRateLimited: false }), 60000);
      }

      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      set({ sendError: errorMessage });
    } finally {
      set({ sendLoading: false });
    }
  },

  getPastMessages: async (conversationId: string) => {
    const { prependPastMessages, messages, isInitialLoad } = get();

    set({
      getPastMessagesLoading: true,
      getPastMessagesError: null,
      getPastMessagesRateLimited: false,
    });

    try {
      const query = `${conversationId}${messages[0]?.createdAt ? `?beforeDatetime=${messages[0].createdAt}` : ''}`;

      const data = await getPastMessagesFromConversation(query);

      if (isInitialLoad) {
        set({
          isInitialLoad: false,
        });
      }

      prependPastMessages(data.pastMessages);
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ getPastMessagesError: err.message });
      } else {
        set({ getPastMessagesError: 'An unexpected error occurred' });
      }
    } finally {
      set({ getPastMessagesLoading: false });
    }
  },

  getOtherParticipant: async (conversationId: string) => {
    const { setOtherParticipantDetails } = get();

    set({
      getOtherParticipantLoading: true,
      getOtherParticipantError: null,
      getOtherParticipantRateLimited: false,
    });

    try {
      if (conversationId) {
        const data = await getOtherParticipantFromConversation(conversationId);

        setOtherParticipantDetails(data);
      } else {
        throw Error('No conversation ID');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({
          getOtherParticipantError: err.message,
        });
      } else {
        set({
          getOtherParticipantError: 'An unexpected error occurred',
        });
      }
    } finally {
      set({
        getOtherParticipantLoading: false,
      });
    }
  },

  createNewDirectMessage: async (targetUserId: string) => {
    set({
      createNewDirectMessageLoading: true,
      createNewDirectMessageError: null,
      createNewDirectMessageRateLimited: false,
    });

    try {
      const data: { conversationId: string; conversationIdType: 'existing' | 'new' } =
        await createDirectMessage(targetUserId);

      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({
          createNewDirectMessageError: err.message,
        });
      } else {
        set({
          createNewDirectMessageError: 'An unexpected error occurred',
        });
      }

      return null;
    } finally {
      set({
        createNewDirectMessageLoading: false,
      });
    }
  },

  getActiveConversationTheme: async (conversationId: string) => {
    set({
      getActiveConversationThemeLoading: true,
      getActiveConversationThemeError: null,
      getActiveConversationThemeRateLimited: false,
    });

    try {
      const data: { theme: string; changedBy: string; changedAt: Date } =
        await getConversationTheme(conversationId);

      set({
        conversationTheme: data.theme,
        conversationThemeChangedAt: new Date(data.changedAt),
        conversationThemeChangedBy: data.changedBy,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({
          getActiveConversationThemeError: err.message,
        });
      } else {
        set({
          getActiveConversationThemeError: 'An unexpected error occurred',
        });
      }
    } finally {
      set({
        getActiveConversationThemeLoading: false,
      });
    }
  },

  changeConversationTheme: async (conversationId: string, theme: string) => {
    set({
      changeConversationThemeLoading: true,
      changeConversationThemeError: null,
      changeConversationThemeRateLimited: false,
    });

    try {
      const data: { theme: string; changedBy: string; changedAt: Date } =
        await updateConversationTheme(conversationId, theme);

      set({
        conversationTheme: data.theme,
        conversationThemeChangedAt: new Date(data.changedAt),
        conversationThemeChangedBy: data.changedBy,
      });
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        set({
          changeConversationThemeRateLimited: true,
        });

        setTimeout(
          () =>
            set({
              changeConversationThemeRateLimited: false,
            }),
          60000
        );
      }

      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      set({
        changeConversationThemeError: errorMessage,
      });
    } finally {
      set({
        changeConversationThemeLoading: false,
      });
    }
  },

  markAsRead: async (conversationId: string) => {
    set({
      markAsReadLoading: true,
      markAsReadError: null,
      markAsReadRateLimited: false,
    });

    try {
      await markConversationAsRead(conversationId);
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status: number }).status === 429) {
        set({
          markAsReadRateLimited: true,
        });

        setTimeout(
          () =>
            set({
              markAsReadRateLimited: false,
            }),
          60000
        );
      }

      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      set({
        markAsReadError: errorMessage,
      });
    } finally {
      set({
        markAsReadLoading: false,
      });
    }
  },
}));
