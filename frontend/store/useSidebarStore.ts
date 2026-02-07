import { create } from 'zustand';
import { ConversationSnippet, Message } from '@/types/chat';

interface SidebarState {
  conversationSnippets: ConversationSnippet[];

  // Actions
  setSnippets: (snippets: ConversationSnippet[]) => void;
  upsertSnippet: (message: Message) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  conversationSnippets: [],

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
}));
