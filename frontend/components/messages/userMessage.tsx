'use client';

import { AlertCircle, RotateCw } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { DateFormatters } from '@/types/chat';

import { cn } from '@/lib/utils';

interface UserMessageProps {
  messageId: string;
  messageType: string;
  messageState: 'sent' | 'sending' | 'failed';
  senderId: string;
  breakMessage?: boolean;
  content: string;
  createdAt: string;
  username: string;
  dateFormatters: Record<DateFormatters, Intl.DateTimeFormat>;
  activeConversationTheme: Record<string, string>;
}

export default function UserMessage({
  messageId,
  messageType,
  messageState,
  senderId,
  breakMessage = false,
  content,
  createdAt,
  username,
  dateFormatters,
  activeConversationTheme,
}: UserMessageProps) {
  const [formattedTime, setFormattedTime] = useState('');
  const [formattedSeenTime, setFormattedSeenTime] = useState('');

  const currentUserId = useAuthStore((state) => state.currentUserId);

  const [dots, setDots] = useState('.');

  const { send, addSendingMessage, removeSendingMessage, addFailedMessage, removeFailedMessage } =
    useChatStore();

  const otherParticipantLastReadMessageId = useChatStore(
    (state) => state.otherParticipantLastReadMessageId
  );

  const otherParticipantLastReadMessageAt = useChatStore(
    (state) => state.otherParticipantLastReadMessageAt
  );

  const otherParticipantDetails = useChatStore((state) => state.otherParticipantDetails);

  const resendFailedMessage = async () => {
    removeFailedMessage(messageId);

    const tempMessageId: string = crypto.randomUUID();

    addSendingMessage({
      tempMessageId,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      status: 'sending',
    });

    await send(content.trim(), tempMessageId);

    // Read the store's current values; the ones captured at render time are stale after the await.
    const { sendError, sendRateLimited } = useChatStore.getState();

    // A 429 sets both flags, so check rate limiting first.
    if (sendRateLimited) {
      toast.error('You have tried to send too many messages. Try again in 1 minute.');
      removeSendingMessage(tempMessageId);
    } else if (sendError !== null) {
      toast.error(`Something went wrong when sending a message.`);
      addFailedMessage({
        tempMessageId,
        content: content.trim(),
        createdAt: new Date().toISOString(),
        status: 'failed',
      });

      removeSendingMessage(tempMessageId);
    }
  };

  useEffect(() => {
    const formatMessageTime = (dateString: string) => {
      const start = new Date(dateString).getTime();
      const now = Date.now();

      const diffInSeconds = Math.floor((now - start) / 1000);

      if (diffInSeconds >= 604800)
        return `${dateFormatters.later.format(start)}, ${dateFormatters.hour.format(start)}`;
      else if (diffInSeconds >= 86400)
        return `${dateFormatters.currentWeek.format(start)}, ${dateFormatters.hour.format(start)}`;

      return `${dateFormatters.hour.format(start)}`;
    };

    const formatSeenTime = (date: Date | null) => {
      if (date == null) return '';

      const start = date.getTime();
      const now = Date.now();

      const diffInSeconds = Math.floor((now - start) / 1000);

      if (diffInSeconds >= 604800)
        return `${dateFormatters.later.format(start)}, ${dateFormatters.hour.format(start)}`;
      else if (diffInSeconds >= 86400)
        return `${dateFormatters.currentWeek.format(start)}, ${dateFormatters.hour.format(start)}`;

      return `${dateFormatters.hour.format(start)}`;
    };

    const update = () => {
      const timeStr = formatMessageTime(createdAt);
      setFormattedTime(timeStr || '');

      const timeSeenStr = formatSeenTime(otherParticipantLastReadMessageAt);
      setFormattedSeenTime(timeSeenStr || '');
    };

    update();

    const interval = setInterval(update, 60000);

    return () => clearInterval(interval);
  }, [createdAt, otherParticipantLastReadMessageAt, dateFormatters]);

  // For "animating" ellipsis when sending messages
  useEffect(() => {
    if (messageState !== 'sending') return;
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '.' : d + '.'));
    }, 300);
    return () => clearInterval(interval);
  }, [messageState]);

  const isSender = messageType === 'sender';

  return (
    <div
      className={cn(
        'flex w-full items-end gap-2',
        isSender ? 'justify-end' : '',
        !isSender && !breakMessage ? 'pl-10' : '',
        breakMessage ? 'mb-2' : ''
      )}
    >
      {!isSender && breakMessage && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative size-8 shrink-0 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
              <Image
                src={
                  otherParticipantDetails?.profileImageUrl
                    ? otherParticipantDetails.profileImageUrl
                    : '/blank_picture.png'
                }
                alt={`${username}'s avatar`}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side={'left'}>
            <p className="font-medium font-sans">{username}</p>
          </TooltipContent>
        </Tooltip>
      )}

      <div
        className={cn('flex max-w-[75%] min-w-0 flex-col', isSender ? 'items-end' : 'items-start')}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap wrap-break-word',
                isSender
                  ? `${activeConversationTheme.sender} ${breakMessage ? '' : 'rounded-br-md'}`
                  : `${activeConversationTheme.receiver} ${breakMessage ? '' : 'rounded-bl-md'}`,
                messageState === 'sending' && 'opacity-70',
                messageState === 'failed' &&
                  'opacity-60 ring-1 ring-red-400 ring-offset-1 ring-offset-white dark:ring-offset-stone-900'
              )}
            >
              <p>{content}</p>
            </div>
          </TooltipTrigger>
          <TooltipContent side={isSender ? 'left' : 'right'}>
            <p className="font-medium font-sans">{createdAt != null ? formattedTime : '-'}</p>
          </TooltipContent>
        </Tooltip>

        {messageId === otherParticipantLastReadMessageId && currentUserId === senderId && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative mt-1 size-4 shrink-0 overflow-hidden rounded-full ring-1 ring-white dark:ring-stone-900">
                <Image
                  src={
                    otherParticipantDetails?.profileImageUrl
                      ? otherParticipantDetails.profileImageUrl
                      : '/blank_picture.png'
                  }
                  alt="Seen"
                  fill
                  sizes="16px" // Helps Next.js optimize the download size
                  className="object-cover"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side={'left'}>
              <p className="font-medium font-sans">
                {createdAt != null ? `Seen by ${username} at ${formattedSeenTime}` : '-'}
              </p>
            </TooltipContent>
          </Tooltip>
        )}

        {messageState === 'sending' && (
          <p className="mt-1 text-[11px] text-stone-400 dark:text-stone-500">Sending{dots}</p>
        )}

        {messageState === 'failed' && (
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-red-600 dark:text-red-400">
            <AlertCircle className="size-3.5" aria-hidden="true" />
            <span>Failed to send.</span>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-0.5 font-semibold hover:bg-red-50 dark:hover:bg-red-400/10"
              onClick={resendFailedMessage}
            >
              <RotateCw className="size-3" aria-hidden="true" />
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
