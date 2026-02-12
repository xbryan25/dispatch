import { create } from 'zustand';
import { Message } from '@/types/chat';

interface ChatState {
  messages: Message[];
  socket: WebSocket | null;
  activeConversationId: string | null;
  hasMorePastMessages: boolean;
  isInitialLoad: boolean;
  isGetting: boolean;
  isSending: boolean;

  // Actions
  addMessage: (msg: Message) => void;
  prependPastMessages: (pastMessages: Message[]) => void;
  setMessages: (msgs: Message[]) => void;
  setActiveConversationId: (conversationId: string | null) => void;
  setIsInitialLoad: (newVal: boolean) => void;
  setIsGetting: (newVal: boolean) => void;
  setIsSending: (newVal: boolean) => void;
  setSocket: (socket: WebSocket | null) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  socket: null,
  activeConversationId: null,
  hasMorePastMessages: true,
  isInitialLoad: false,
  isGetting: false,
  isSending: false,

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

  setActiveConversationId: (conversationId) =>
    set({
      activeConversationId: conversationId,
      messages: [],
      hasMorePastMessages: true,
      isInitialLoad: true,
    }),

  setIsInitialLoad: (newVal: boolean) => set({ isInitialLoad: newVal }),

  setIsGetting: (newVal: boolean) => set({ isGetting: newVal }),

  setIsSending: (newVal: boolean) => set({ isSending: newVal }),

  setSocket: (socket) => set({ socket }),

  clearChat: () => set({ messages: [], socket: null, activeConversationId: null }),
}));
