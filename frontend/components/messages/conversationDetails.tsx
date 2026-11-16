'use client';

import { BellOff, PenLine, UserMinus } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { useFriendsStore } from '@/store/friends/useFriendsStore';
import { useChatStore } from '@/store/useChatStore';

import { useLastActiveLabel } from '@/hooks/useLastActiveLabel';

import {
  settingsRowClass,
  settingsRowIconTileClass,
} from '@/components/messages/settingsRowStyles';
import ChangeThemeDialog from '@/components/shared/changeThemeDialog';
import UnfriendDialog from '@/components/shared/unfriendDialog';

import { cn } from '@/lib/utils';

interface ConversationDetailsProps {
  onToggle: (newVal?: boolean) => void; // This is a function prop
  className?: string;
}

export default function ConversationDetails({ onToggle, className }: ConversationDetailsProps) {
  const otherParticipantDetails = useChatStore((state) => state.otherParticipantDetails);

  const { setOtherParticipantFriendshipStatus } = useChatStore();

  const { isOnline, label: lastActiveLabel } = useLastActiveLabel();

  const [openUnfriendDialog, setOpenUnfriendDialog] = useState(false);

  const isRateLimitedFromActions = useFriendsStore((state) => state.isRateLimitedFromActions);

  const unfriendDisabled = isRateLimitedFromActions['unfriendAction'];

  return (
    <aside
      className={cn(
        'flex h-full min-w-0 max-w-80 flex-1 flex-col gap-6 overflow-y-auto rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900',
        className
      )}
    >
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-stone-50 px-4 py-6 text-center dark:bg-stone-950/60">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-full bg-stone-100 ring-4 ring-white dark:bg-stone-800 dark:ring-stone-900">
          <Image
            src={
              otherParticipantDetails?.profileImageUrl
                ? otherParticipantDetails.profileImageUrl
                : '/blank_picture.png'
            }
            alt={`${otherParticipantDetails?.username ?? 'User'}'s avatar`}
            fill
            sizes="80px" // Helps Next.js optimize the download size
            className="object-cover"
          />
        </div>
        <div className="flex min-w-0 max-w-full flex-col items-center">
          <h2 className="max-w-full truncate text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100">
            {otherParticipantDetails?.username}
          </h2>
          <p
            className={
              isOnline
                ? 'text-xs font-medium text-emerald-600 dark:text-emerald-400'
                : 'text-xs text-stone-500 dark:text-stone-400'
            }
          >
            {lastActiveLabel}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="px-2 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
          Conversation settings
        </span>

        <ChangeThemeDialog />

        <button className={settingsRowClass()}>
          <span className={settingsRowIconTileClass()}>
            <BellOff className="size-4" />
          </span>
          Mute notifications
        </button>

        <button className={settingsRowClass()}>
          <span className={settingsRowIconTileClass()}>
            <PenLine className="size-4" />
          </span>
          Set nicknames
        </button>
      </div>

      <div className="flex flex-col gap-1.5 border-t border-stone-100 pt-4 dark:border-stone-800">
        <button
          className={settingsRowClass('danger', unfriendDisabled)}
          disabled={unfriendDisabled}
          onClick={() => setOpenUnfriendDialog(true)}
        >
          <span className={settingsRowIconTileClass('danger')}>
            <UserMinus className="size-4" />
          </span>
          <span className="truncate">Unfriend {otherParticipantDetails?.username}</span>
        </button>

        <UnfriendDialog
          username={otherParticipantDetails?.username ?? ''}
          otherUserId={otherParticipantDetails?.userId ?? ''}
          open={openUnfriendDialog}
          onClose={() => {
            setOpenUnfriendDialog(false);
          }}
          onSuccess={() => {
            onToggle(false);
            setOtherParticipantFriendshipStatus('unfriended');
          }}
          isRateLimitedFromAction={unfriendDisabled}
        />
      </div>
    </aside>
  );
}
