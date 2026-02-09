'use client';

import ConversationTab from './conversationTab';

import { useConversationTabs } from '@/hooks/useConversationTabs';

import { useChat } from '@/hooks/useChat';

export default function ChatList() {
  const { conversationSnippets } = useConversationTabs();

  useChat();

  return (
    <div className="flex-1 flex flex-col w-full gap-1 overflow-y-auto h-0 pr-3 min-w-0">
      {conversationSnippets.map((conversationSnippet) => {
        return (
          <ConversationTab
            key={conversationSnippet.conversationId}
            conversationSnippet={conversationSnippet}
          />
        );
      })}
    </div>
  );
}
