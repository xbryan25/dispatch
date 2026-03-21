import { create } from 'zustand';
import { Message, OtherParticipantDetails } from '@/types/chat';

interface ChatState {
  messages: Message[];
  otherParticipantDetails: OtherParticipantDetails | null;
  socket: WebSocket | null;
  activeConversationId: string | null;
  hasMorePastMessages: boolean;

  isInitialLoad: boolean;
  isGetting: boolean;
  isSending: boolean;

  isGettingOtherParticipant: boolean;
  otherParticipantFriendshipStatus: string | null;
  otherParticipantIsOnline: boolean;
  otherParticipantLastOnline: Date | null;
  otherParticipantLastReadMessageId: string | null;
  otherParticipantLastReadMessageAt: Date | null;

  conversationTheme: string;
  conversationThemeChangedAt: Date | null;
  conversationThemeChangedBy: string | null;

  // Actions
  addMessage: (msg: Message) => void;
  prependPastMessages: (pastMessages: Message[]) => void;
  setMessages: (msgs: Message[]) => void;
  setActiveConversationId: (conversationId: string | null) => void;
  setOtherParticipantDetails: (newParticipantDetails: OtherParticipantDetails | null) => void;
  setIsInitialLoad: (newVal: boolean) => void;
  setIsGetting: (newVal: boolean) => void;
  setIsSending: (newVal: boolean) => void;
  setIsGettingOtherParticipant: (newVal: boolean) => void;
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
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
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

  addMessage: (newMessage) =>
    set((state) => {
      // Checks if messageId already exists in list
      const exists = state.messages.some((m) => m.messageId === newMessage.messageId);

      if (exists) return state;

      return { messages: [...state.messages, newMessage] };
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

  setMessages: (msgs) => set({ messages: msgs }),

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

  setIsGetting: (newVal: boolean) => set({ isGetting: newVal }),

  setIsSending: (newVal: boolean) => set({ isSending: newVal }),

  setIsGettingOtherParticipant: (newVal: boolean) => set({ isSending: newVal }),

  setOtherParticipantFriendshipStatus: (newVal: string) =>
    set({ otherParticipantFriendshipStatus: newVal }),

  setConversationTheme: (newVal: string) => set({ conversationTheme: newVal }),

  setConversationThemeChangedAt: (newVal: Date | null) =>
    set({ conversationThemeChangedAt: newVal }),

  setConversationThemeChangedBy: (newVal: string | null) =>
    set({ conversationThemeChangedBy: newVal }),

  setSocket: (socket) => set({ socket }),

  clearChat: () => set({ messages: [], socket: null, activeConversationId: null }),

  resetConversation: (conversationId?: string) =>
    set({
      activeConversationId: conversationId ?? null,
      messages: [],
      hasMorePastMessages: true,
      isInitialLoad: true,
      isGettingOtherParticipant: true,
      otherParticipantFriendshipStatus: null,
    }),

  setOtherParticipantIsOnline: (newVal: boolean) => set({ otherParticipantIsOnline: newVal }),

  setOtherParticipantLastOnline: (newVal: Date | null) =>
    set({ otherParticipantLastOnline: newVal }),

  setOtherParticipantLastReadMessageId: (newVal: string | null) =>
    set({ otherParticipantLastReadMessageId: newVal }),

  setOtherParticipantLastReadMessageAt: (newVal: Date | null) =>
    set({ otherParticipantLastReadMessageAt: newVal }),
}));
