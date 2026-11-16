'use client';

import { CheckCheck } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuthStore } from '@/store/useAuthStore';

import { ConversationSnippet } from '@/types/chat';

import { cn } from '@/lib/utils';

interface ConversationTabProps {
  conversationSnippet: ConversationSnippet;
}

export default function ConversationTab({ conversationSnippet }: ConversationTabProps) {
  const params = useParams();
  const isActive = params.conversationId === conversationSnippet.conversationId;

  const router = useRouter();

  const currentUserId = useAuthStore((state) => state.currentUserId);

  const [formattedTime, setFormattedTime] = useState('');
  const timestamp = conversationSnippet.latestMessageTime;

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

  const avatarSrc = conversationSnippet.otherUserAvatar
    ? conversationSnippet.otherUserAvatar
    : '/blank_picture.png';

  return (
    <div
      className={cn(
        'relative flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-xl p-2.5 transition-colors',
        isActive
          ? 'pointer-events-none bg-amber-50 before:absolute before:inset-y-3 before:left-0 before:w-1 before:rounded-full before:bg-amber-500 dark:bg-amber-400/10 dark:before:bg-amber-400'
          : 'hover:bg-stone-100 dark:hover:bg-stone-800/70'
      )}
      onClick={() => {
        router.push(`/messages/${conversationSnippet.conversationId}`);
      }}
    >
      <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
        <Image
          src={avatarSrc}
          alt={`${conversationSnippet.otherUserName}'s avatar`}
          fill
          sizes="48px" // Helps Next.js optimize the download size
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="truncate text-sm font-semibold text-stone-900 dark:text-stone-100">
            {conversationSnippet.otherUserName}
          </h3>
          <span
            className={cn(
              'shrink-0 text-xs',
              isActive ? 'text-amber-700 dark:text-amber-300' : 'text-stone-400 dark:text-stone-500'
            )}
          >
            {conversationSnippet.latestMessageTime != null ? formattedTime : '-'}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm text-stone-500 dark:text-stone-400">
            {conversationSnippet.latestMessage != null
              ? conversationSnippet.latestMessage
              : conversationSnippet.otherUserName != null
                ? `Start chatting with ${conversationSnippet.otherUserName.trim().split(/\s+/)[0]}!`
                : '-'}
          </p>

          {conversationSnippet.hasSeenLatestMessage &&
          currentUserId === conversationSnippet.latestMessageSenderId ? (
            <div
              className="relative size-4 shrink-0 overflow-hidden rounded-full ring-1 ring-white dark:ring-stone-900"
              title="Seen"
            >
              <Image
                src={avatarSrc}
                alt="Seen"
                fill
                sizes="16px" // Helps Next.js optimize the download size
                className="object-cover"
              />
            </div>
          ) : (
            <CheckCheck
              className="size-4 shrink-0 text-stone-400 dark:text-stone-500"
              aria-label="Delivered"
            />
          )}
        </div>
      </div>
    </div>
  );
}
