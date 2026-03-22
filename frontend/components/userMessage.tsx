'use client';

import Image from 'next/image';

import { cn } from '@/lib/utils';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { useEffect, useState } from 'react';

import { DateFormatters } from '@/types/chat';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';

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

  const otherParticipantLastReadMessageId = useChatStore(
    (state) => state.otherParticipantLastReadMessageId
  );

  const otherParticipantLastReadMessageAt = useChatStore(
    (state) => state.otherParticipantLastReadMessageAt
  );

  const otherParticipantDetails = useChatStore((state) => state.otherParticipantDetails);

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
  }, [createdAt]);

  // For "animating" ellipsis when sending messages
  useEffect(() => {
    if (messageState !== 'sending') return;
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '.' : d + '.'));
    }, 300);
    return () => clearInterval(interval);
  }, [messageState]);

  return (
    <div
      className={cn(
        'flex w-full items-center gap-2',
        breakMessage ? '' : 'pl-11',
        messageType === 'sender' ? 'justify-end' : ''
      )}
    >
      {messageType === 'others' && breakMessage && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative w-9 h-9 shrink-0 overflow-hidden rounded-full ">
              <Image
                src="/blank_picture.png"
                alt="User avatar"
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side={'left'}>
            <p className="font-medium font-sans">{username}</p>
          </TooltipContent>
        </Tooltip>
      )}

      <div className="flex flex-col">
        <div className="flex flex-col">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col gap-1">
                <div
                  className={cn(
                    'flex rounded-2xl items-center py-2 px-3 whitespace-pre-wrap wrap-break-word',
                    messageType === 'sender'
                      ? `${activeConversationTheme.sender}`
                      : `${activeConversationTheme.receiver}`
                  )}
                >
                  <p>{content}</p>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side={'left'}>
              <p className="font-medium font-sans">{createdAt != null ? formattedTime : '-'}</p>
            </TooltipContent>
          </Tooltip>

          {messageId === otherParticipantLastReadMessageId && currentUserId === senderId && (
            <div className="flex justify-end pt-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative w-4 h-4 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={
                        otherParticipantDetails?.profileImageUrl
                          ? otherParticipantDetails.profileImageUrl
                          : '/blank_picture.png'
                      }
                      alt="User avatar"
                      fill
                      sizes="96px" // Helps Next.js optimize the download size
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
            </div>
          )}
        </div>

        <div>
          {messageState === 'sending' && (
            <div className="flex justify-end pt-1">
              <p className="text-xs">Sending{dots}</p>
            </div>
          )}

          {messageState === 'failed' && (
            <div className="flex justify-end pt-1">
              <p className="text-xs text-red-500">Failed to send message.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
