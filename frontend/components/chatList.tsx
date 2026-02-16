'use client';

import ConversationTab from './conversationTab';

import { useConversationTabs } from '@/hooks/useConversationTabs';

import { useChat } from '@/hooks/useChat';
import LoadingSpinner from './loadingSpinner';

export default function ChatList() {
  const { conversationSnippets, loading } = useConversationTabs();

  useChat();

  if (conversationSnippets.length == 0 && !loading) {
    return (
      <div className="flex-1 flex w-full gap-1 items-center justify-center">
        <p className="font-medium text-center text-xl">
          Start messaging people so that they show up here!
        </p>
      </div>
    );
  } else if (loading) {
    return (
      <div className="flex-1 flex w-full gap-1 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  } else {
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
}
