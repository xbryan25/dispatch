import { create } from 'zustand';
import { Message } from '@/types/chat';

interface ChatState {
  messages: Message[];
  socket: WebSocket | null;
  activeId: string | null;

  // Actions
  addMessage: (msg: Message) => void;
  setMessages: (msgs: Message[]) => void;
  setSocket: (socket: WebSocket | null, id: string | null) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  socket: null,
  activeId: null,

  addMessage: (newMessage) =>
    set((state) => {
      // Check if we already have this message ID in our list
      const exists = state.messages.some((m) => m.messageId === newMessage.messageId);

      if (exists) return state; // Don't add it again!

      return { messages: [...state.messages, newMessage] };
    }),

  setMessages: (msgs) => set({ messages: msgs }),

  setSocket: (socket, id) => set({ socket, activeId: id }),

  clearChat: () => set({ messages: [], socket: null, activeId: null }),
}));
