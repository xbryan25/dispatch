'use client';

import { MessageCircle, UserMinus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { useFriendsStore } from '@/store/friends/useFriendsStore';

import CreateNewConversationDialog from '@/components/friends/createNewConversationDialog';
import FriendsActionsDialog from '@/components/friends/friendsActionsDialog';
import {
  userCardDangerIconButtonClass,
  userCardIconButtonClass,
} from '@/components/friends/userCardStyles';
import UnfriendDialog from '@/components/shared/unfriendDialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { UserInfo } from '@/types/auth';

interface UserCardProps {
  userInfo: UserInfo;
}

export default function UserCard({ userInfo }: UserCardProps) {
  const userType = useFriendsStore((state) => state.userType);
  const isRateLimitedFromActions = useFriendsStore((state) => state.isRateLimitedFromActions);

  const [openUnfriendDialog, setOpenUnfriendDialog] = useState(false);

  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700">
      <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-stone-100 ring-2 ring-stone-100 dark:bg-stone-800 dark:ring-stone-800">
        <Image
          src={userInfo?.profileImageUrl ? userInfo.profileImageUrl : '/blank_picture.png'}
          alt={`${userInfo.username}'s avatar`}
          fill
          sizes="56px" // Helps Next.js optimize the download size
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <h2 className="truncate text-sm font-semibold text-stone-900 dark:text-stone-100">
          {userInfo.username}
        </h2>
        <p className="truncate text-sm text-stone-500 dark:text-stone-400">
          {userInfo.fullName ?? '-'}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-1.5 text-xs text-stone-400 dark:text-stone-500">
          <span>
            {userInfo.totalFriendCount} {userInfo.totalFriendCount == 1 ? 'friend' : 'friends'}
          </span>
          <span aria-hidden="true">·</span>
          <span>5 mutual</span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-1.5">
        {userType === 'friends' && (
          <>
            {userInfo.conversationId ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className={userCardIconButtonClass} asChild>
                    <Link
                      href={`/messages/${userInfo.conversationId}`}
                      aria-label={`Chat with ${userInfo.username}`}
                    >
                      <MessageCircle className="size-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium font-sans">Chat with {userInfo.username}?</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <CreateNewConversationDialog
                username={userInfo.username}
                otherUserId={userInfo.userId}
              />
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={userCardDangerIconButtonClass}
                  disabled={isRateLimitedFromActions['unfriendAction']}
                  onClick={() => setOpenUnfriendDialog(true)}
                  aria-label={`Unfriend ${userInfo.username}`}
                >
                  <UserMinus className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium font-sans">Unfriend {userInfo.username}?</p>
              </TooltipContent>
            </Tooltip>

            <UnfriendDialog
              username={userInfo.username}
              otherUserId={userInfo.userId}
              open={openUnfriendDialog}
              onClose={() => setOpenUnfriendDialog(false)}
              isRateLimitedFromAction={isRateLimitedFromActions['unfriendAction']}
            />
          </>
        )}

        {userType === 'pending' && (
          <FriendsActionsDialog
            username={userInfo.username}
            otherUserId={userInfo.userId}
            actionType="cancelRequestAction"
          />
        )}

        {userType === 'requests' && (
          <>
            <FriendsActionsDialog
              username={userInfo.username}
              otherUserId={userInfo.userId}
              actionType="acceptAction"
            />

            <FriendsActionsDialog
              username={userInfo.username}
              otherUserId={userInfo.userId}
              actionType="rejectAction"
            />
          </>
        )}

        {userType === 'formerFriends' && (
          <>
            {userInfo.conversationId != null && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className={userCardIconButtonClass} asChild>
                    <Link
                      href={`/messages/${userInfo.conversationId}`}
                      aria-label={`View conversation with ${userInfo.username}`}
                    >
                      <MessageCircle className="size-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium font-sans">
                    View conversation with {userInfo.username}?
                  </p>
                </TooltipContent>
              </Tooltip>
            )}

            <FriendsActionsDialog
              username={userInfo.username}
              otherUserId={userInfo.userId}
              actionType="reconnectRequestAction"
            />
          </>
        )}

        {userType === 'addFriend' && (
          <FriendsActionsDialog
            username={userInfo.username}
            otherUserId={userInfo.userId}
            actionType="createNewRequestAction"
          />
        )}
      </div>
    </div>
  );
}
