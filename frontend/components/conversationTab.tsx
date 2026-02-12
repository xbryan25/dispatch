'use client';

import { Icon } from '@iconify/react';
import Image from 'next/image';

import { ConversationSnippet } from '@/types/chat';

import { useChatStore } from '@/store/useChatStore';

import { useChat } from '@/hooks/useChat';

interface ConversationTabProps {
  conversationSnippet: ConversationSnippet;
}

export default function ConversationTab({ conversationSnippet }: ConversationTabProps) {
  const {
    activeConversationId: currentSelectedConversationId,
    setActiveConversationId: setSelectedConversationId,
  } = useChatStore();

  const { getPastMessagesFromConversation } = useChat();

  const isActive = currentSelectedConversationId === conversationSnippet.conversationId;

  const formatTime = (dateString: string) => {
    if (!dateString) return '';

    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div
      className={`flex items-center justify-center gap-2 rounded-md p-2 w-full cursor-pointer min-w-0 ${isActive ? 'bg-stone-200 dark:bg-stone-700' : 'bg-white dark:bg-stone-900'}`}
      onClick={() => {
        setSelectedConversationId(conversationSnippet.conversationId);
        getPastMessagesFromConversation();
      }}
    >
      <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-full">
        <Image
          src={
            conversationSnippet.otherUserAvatar
              ? conversationSnippet.otherUserAvatar
              : '/blank_picture.png'
          }
          alt="User avatar"
          fill
          sizes="96px" // Helps Next.js optimize the download size
          className="object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex justify-between">
          <h3 className="font-semibold">{conversationSnippet.otherUserName}</h3>
          <p className="shrink-0">{formatTime(conversationSnippet.latestMessageTime)}</p>
        </div>
        <div className="flex justify-between items-center gap-4">
          <p className="truncate ">
            {conversationSnippet.latestMessage != null
              ? conversationSnippet.latestMessage
              : `Start chatting with ${conversationSnippet.otherUserName.trim().split(/\s+/)[0]}!`}
          </p>

          {conversationSnippet.latestMessage && (
            <Icon icon="ri:check-double-fill" className="size-5 shrink-0" />
          )}
        </div>
      </div>
    </div>
  );
}
