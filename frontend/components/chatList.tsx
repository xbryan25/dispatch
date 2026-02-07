'use client';

import ConversationTab from './conversationTab';

import { useConversationTabs } from '@/hooks/useConversationTabs';

import { useChat } from '@/hooks/useChat';
import { useChatStore } from '@/store/useChatStore';

export default function ChatList() {
  const { conversations } = useConversationTabs();

  const selectedConversationId = useChatStore((state) => state.activeConversationId);

  useChat(selectedConversationId);

  return (
    <div className="flex-1 flex flex-col w-full gap-1 overflow-y-auto h-0 pr-3 min-w-0">
      {conversations.map((conversation) => {
        return (
          <ConversationTab key={conversation.conversationId} conversationSnippet={conversation} />
        );
      })}
    </div>
  );
}
