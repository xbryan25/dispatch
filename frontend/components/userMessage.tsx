'use client';

import Image from 'next/image';

import { cn } from '@/lib/utils';

interface UserMessageProps {
  messageType: string;
  breakMessage?: boolean;
  content: string;
}

export default function UserMessage({
  messageType,
  breakMessage = false,
  content,
}: UserMessageProps) {
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
          <Image src="/testdp.jpg" alt="User avatar" fill sizes="96px" className="object-cover" />
        </div>
      )}
      <div
        className={cn(
          'flex rounded-full  items-center py-2 px-3',
          messageType === 'sender'
            ? 'bg-orange-300 dark:bg-orange-500'
            : 'bg-amber-300 dark:bg-amber-500'
        )}
      >
        <p>{content}</p>
      </div>
    </div>
  );
}
