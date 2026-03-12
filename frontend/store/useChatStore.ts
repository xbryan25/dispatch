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
    set({
      otherParticipantDetails: newParticipantDetails,
    });
    set({
      otherParticipantFriendshipStatus: newParticipantDetails?.friendshipStatus,
    });
  },

  setIsInitialLoad: (newVal: boolean) => set({ isInitialLoad: newVal }),

  setIsGetting: (newVal: boolean) => set({ isGetting: newVal }),

  setIsSending: (newVal: boolean) => set({ isSending: newVal }),

  setIsGettingOtherParticipant: (newVal: boolean) => set({ isSending: newVal }),

  setOtherParticipantFriendshipStatus: (newVal: string) =>
    set({ otherParticipantFriendshipStatus: newVal }),

  setSocket: (socket) => set({ socket }),

  clearChat: () => set({ messages: [], socket: null, activeConversationId: null }),

  resetConversation: (conversationId?: string) =>
    set({
      activeConversationId: conversationId ?? null,
      messages: [],
      hasMorePastMessages: true,
      isInitialLoad: true,
      isGettingOtherParticipant: true,
    }),
}));
