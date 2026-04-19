'use client';

import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useState } from 'react';

import { useFriendsStore } from '@/store/friends/useFriendsStore';
import { useChatStore } from '@/store/useChatStore';

import ChangeThemeDialog from '@/components/shared/changeThemeDialog';
import UnfriendDialog from '@/components/shared/unfriendDialog';

import { cn } from '@/lib/utils';

interface ConversationDetailsProps {
  onToggle: (newVal?: boolean) => void; // This is a function prop
}

export default function ConversationDetails({ onToggle }: ConversationDetailsProps) {
  const otherParticipantDetails = useChatStore((state) => state.otherParticipantDetails);
  const setOtherParticipantFriendshipStatus = useChatStore(
    (state) => state.setOtherParticipantFriendshipStatus
  );

  const [openUnfriendDialog, setOpenUnfriendDialog] = useState(false);

  const isRateLimitedFromActions = useFriendsStore((state) => state.isRateLimitedFromActions);

  return (
    <div className="flex-1 flex flex-col items-teo justify-start gap-10 bg-white dark:bg-stone-900  rounded-xl p-5">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="relative w-20 h-20 shrink-0 overflow-hidden border-2 ring-3 ring-green-300 ring-offset-2 ring-offset-white dark:ring-offset-stone-900 rounded-full ">
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
        <div className="flex flex-col items-center">
          <h2 className="font-bold">{otherParticipantDetails?.username}</h2>
          <p>Active now</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-xl">Conversation Settings</h2>

        <ChangeThemeDialog />

        <button className="flex items-center gap-1 bg-white dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer rounded-md p-2 font-medium">
          <Icon icon="ic:baseline-notifications-off" className="size-7" />
          Mute notifications
        </button>

        <button className="flex items-center gap-1 bg-white dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer rounded-md p-2 font-medium">
          <Icon icon="mdi:rename" className="size-7" />
          Set nicknames
        </button>

        <button
          className={cn(
            'flex items-center gap-1 bg-white dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer rounded-md p-2 font-medium',
            isRateLimitedFromActions['unfriendAction']
              ? 'cursor-not-allowed text-stone-400'
              : ' hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer'
          )}
          disabled={isRateLimitedFromActions['unfriendAction']}
          onClick={() => setOpenUnfriendDialog(true)}
        >
          <Icon icon="material-symbols:person-remove" className="size-7" />
          Unfriend {otherParticipantDetails?.username}
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
          isRateLimitedFromAction={isRateLimitedFromActions['unfriendAction']}
        />
      </div>
    </div>
  );
}
