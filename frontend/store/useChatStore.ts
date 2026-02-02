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

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),

  setMessages: (msgs) => set({ messages: msgs }),

  setSocket: (socket, id) => set({ socket, activeId: id }),

  clearChat: () => set({ messages: [], socket: null, activeId: null }),
}));
