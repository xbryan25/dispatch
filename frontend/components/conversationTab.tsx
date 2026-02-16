'use client';

import { Icon } from '@iconify/react';
import Image from 'next/image';

import { ConversationSnippet } from '@/types/chat';

import { useChatStore } from '@/store/useChatStore';

import { useChat } from '@/hooks/useChat';

import { useEffect, useState } from 'react';

interface ConversationTabProps {
  conversationSnippet: ConversationSnippet;
}

export default function ConversationTab({ conversationSnippet }: ConversationTabProps) {
  const {
    activeConversationId: currentSelectedConversationId,
    setActiveConversationId: setSelectedConversationId,
  } = useChatStore();

  const { getPastMessagesFromConversation, getOtherParticipantFromConversation } = useChat();

  const [formattedTime, setFormattedTime] = useState('');
  const timestamp = conversationSnippet.latestMessageTime;

  const isActive = currentSelectedConversationId === conversationSnippet.conversationId;

  const formatRelativeTime = (dateString: string) => {
    const start = new Date(dateString).getTime();
    const now = Date.now();
    const diffInSeconds = Math.floor((now - start) / 1000);

    if (diffInSeconds < 60) return 'just now';

    const units = [
      { label: 'm', seconds: 60 },
      { label: 'h', seconds: 3600 },
      { label: 'd', seconds: 86400 },
      { label: 'w', seconds: 604800 },
      { label: 'mo', seconds: 2592000 },
      { label: 'y', seconds: 31536000 },
    ];

    for (let i = units.length - 1; i >= 0; i--) {
      if (diffInSeconds >= units[i].seconds) {
        return `${Math.floor(diffInSeconds / units[i].seconds)}${units[i].label}`;
      }
    }
    return 'just now';
  };

  useEffect(() => {
    const update = () => {
      const timeStr = formatRelativeTime(timestamp);
      setFormattedTime(timeStr || '');
    };

    update();

    const interval = setInterval(update, 60000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return (
    <div
      className={`flex items-center justify-center gap-2 rounded-md p-2 w-full cursor-pointer min-w-0 ${isActive ? 'bg-stone-200 dark:bg-stone-700' : 'bg-white dark:bg-stone-900'}`}
      onClick={() => {
        setSelectedConversationId(conversationSnippet.conversationId);
        getPastMessagesFromConversation();
        getOtherParticipantFromConversation();
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
          <p className="shrink-0">{formatRelativeTime(conversationSnippet.latestMessageTime)}</p>
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
