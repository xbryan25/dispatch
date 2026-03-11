'use client';

import Image from 'next/image';

import { cn } from '@/lib/utils';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { useEffect, useState } from 'react';

import { DateFormatters } from '@/types/chat';

interface UserMessageProps {
  messageType: string;
  breakMessage?: boolean;
  content: string;
  createdAt: string;
  dateFormatters: Record<DateFormatters, Intl.DateTimeFormat>;
}

export default function UserMessage({
  messageType,
  breakMessage = false,
  content,
  createdAt,
  dateFormatters,
}: UserMessageProps) {
  const [formattedTime, setFormattedTime] = useState('');

  const formatMessageTime = (dateString: string) => {
    const start = new Date(dateString).getTime();
    const now = Date.now();

    const diffInSeconds = Math.floor((now - start) / 1000);

    if (diffInSeconds >= 604800) return dateFormatters.later.format(start);
    else if (diffInSeconds >= 86400) return dateFormatters.currentWeek.format(start);

    return dateFormatters.currentDay.format(start);
  };

  useEffect(() => {
    const update = () => {
      const timeStr = formatMessageTime(createdAt);
      setFormattedTime(timeStr || '');
    };

    update();

    const interval = setInterval(update, 60000);

    return () => clearInterval(interval);
  }, [createdAt]);

  return (
    <div
      className={cn(
        'flex w-full items-center gap-2',
        breakMessage ? '' : 'pl-11',
        messageType === 'sender' ? 'justify-end' : ''
      )}
    >
      {messageType === 'others' && breakMessage && (
        <div className="relative w-9 h-9 shrink-0 overflow-hidden rounded-full ">
          <Image
            src="/blank_picture.png"
            alt="User avatar"
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'flex rounded-2xl items-center py-2 px-3 whitespace-pre-wrap wrap-break-word',
              messageType === 'sender'
                ? 'bg-orange-300 dark:bg-orange-500'
                : 'bg-amber-300 dark:bg-amber-500'
            )}
          >
            <p>{content}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium font-sans">{createdAt != null ? formattedTime : '-'}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
