'use client';

import { ArrowLeft, PanelRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

import { useChatStore } from '@/store/useChatStore';

import { useLastActiveLabel } from '@/hooks/useLastActiveLabel';

import {
  userCardIconButtonClass,
  userCardPrimaryIconButtonClass,
} from '@/components/friends/userCardStyles';
import MessageInput from '@/components/messages/messageInput';
import MessageThread from '@/components/messages/messageThread';
import { Button } from '@/components/ui/button';

interface ConversationAreaProps {
  onToggle: (newVal?: boolean) => void; // This is a function prop
  isDetailsOpen?: boolean;
}

export default function ConversationArea({
  onToggle,
  isDetailsOpen = false,
}: ConversationAreaProps) {
  const otherParticipantDetails = useChatStore((state) => state.otherParticipantDetails);

  const otherParticipantFriendshipStatus = useChatStore(
    (state) => state.otherParticipantFriendshipStatus
  );

  const { isOnline: otherParticipantIsOnline, label: lastActiveLabel } = useLastActiveLabel();

  useEffect(() => {
    if (otherParticipantFriendshipStatus !== 'accepted') {
      onToggle(false);
    }
  }, [otherParticipantFriendshipStatus, onToggle]);

  return (
    <section className="flex h-full min-w-0 flex-3 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-stone-100 px-4 py-3 dark:border-stone-800">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className={`${userCardIconButtonClass} md:hidden`}
            asChild
          >
            <Link href="/messages" aria-label="Back to conversations">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>

          <div className="relative size-12 shrink-0">
            <div className="relative size-full overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
              <Image
                src={
                  otherParticipantDetails?.profileImageUrl
                    ? otherParticipantDetails.profileImageUrl
                    : '/blank_picture.png'
                }
                alt={`${otherParticipantDetails?.username ?? 'User'}'s avatar`}
                fill
                sizes="48px" // Helps Next.js optimize the download size
                className="object-cover"
              />
            </div>
            {otherParticipantIsOnline && (
              <span
                className="absolute bottom-0 right-0 size-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-stone-900"
                aria-hidden="true"
              />
            )}
          </div>

          <div className="flex min-w-0 flex-col">
            <h2 className="truncate font-semibold text-stone-900 dark:text-stone-100">
              {otherParticipantDetails?.username}
            </h2>
            <p
              className={
                otherParticipantIsOnline
                  ? 'text-xs font-medium text-emerald-700 dark:text-emerald-400'
                  : 'text-xs text-stone-500 dark:text-stone-400'
              }
            >
              {lastActiveLabel}
            </p>
          </div>
        </div>

        {otherParticipantFriendshipStatus === 'accepted' && (
          <Button
            variant="outline"
            size="icon"
            className={isDetailsOpen ? userCardPrimaryIconButtonClass : userCardIconButtonClass}
            onClick={() => onToggle()}
            aria-label={isDetailsOpen ? 'Hide conversation details' : 'Show conversation details'}
            aria-pressed={isDetailsOpen}
          >
            <PanelRight className="size-4" />
          </Button>
        )}
      </header>

      <MessageThread />

      <MessageInput
        otherParticipantFriendshipStatus={otherParticipantFriendshipStatus}
        otherParticipantDetails={otherParticipantDetails}
      />
    </section>
  );
}
