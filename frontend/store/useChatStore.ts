import { create } from 'zustand';
import { Message } from '@/types/chat';

interface ChatState {
  messages: Message[];
  socket: WebSocket | null;
  activeConversationId: string | null;

  // Actions
  addMessage: (msg: Message) => void;
  prependPastMessages: (pastMessages: Message[]) => void;
  setMessages: (msgs: Message[]) => void;
  setActiveConversationId: (conversationId: string | null) => void;
  setSocket: (socket: WebSocket | null, conversationId: string | null) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  socket: null,
  activeConversationId: null,

  addMessage: (newMessage) =>
    set((state) => {
      // Checks if messageId already exists in list
      const exists = state.messages.some((m) => m.messageId === newMessage.messageId);

      if (exists) return state;

      return { messages: [...state.messages, newMessage] };
    }),

  prependPastMessages: (pastMessages: Message[]) =>
    set((state) => {
      // Checks if messageId already exists in list
      // const exists = state.messages.some((m) => m.messageId === newMessage.messageId);

      // if (exists) return state;

      return { messages: [...pastMessages, ...state.messages] };
    }),

  setMessages: (msgs) => set({ messages: msgs }),

  setActiveConversationId: (conversationId) =>
    set({ activeConversationId: conversationId, messages: [] }),

  setSocket: (socket, conversationId) => set({ socket, activeConversationId: conversationId }),

  clearChat: () => set({ messages: [], socket: null, activeConversationId: null }),
}));
