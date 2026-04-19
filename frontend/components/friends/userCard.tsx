import { Icon } from '@iconify/react';
import { Button } from '../ui/button';

import Link from 'next/link';

import UnfriendDialog from '../shared/unfriendDialog';
import AcceptFriendshipDialog from './acceptFriendshipDialog';
import CancelFriendshipRequestDialog from './cancelFriendshipRequestDialog';
import MakeFriendshipRequestDialog from './makeFriendshipRequestDialog';
import RejectFriendshipDialog from './rejectFriendshipDialog';
import CreateNewConversationDialog from './createNewConversationDialog';

import Image from 'next/image';
import { UserInfo } from '@/types/auth';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { useFriendsStore } from '@/store/friends/useFriendsStore';

import { useState } from 'react';

interface UserCardProps {
  userInfo: UserInfo;
}

export default function UserCard({ userInfo }: UserCardProps) {
  const userType = useFriendsStore((state) => state.userType);
  const isRateLimitedFromActions = useFriendsStore((state) => state.isRateLimitedFromActions);

  const [openUnfriendDialog, setOpenUnfriendDialog] = useState(false);

  return (
    <div className="md:w-full w-80 flex items-center bg-stone-200 dark:bg-stone-700 rounded-lg transition-transform duration-500 hover:scale-102 px-2 gap-2 h-27">
      <div className="relative w-22 h-22 shrink-0 overflow-hidden rounded-full ">
        <Image
          src={userInfo?.profileImageUrl ? userInfo.profileImageUrl : '/blank_picture.png'}
          alt="User avatar"
          fill
          sizes="96px" // Helps Next.js optimize the download size
          className="object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-1">
        <h2 className="font-semibold">{userInfo.username}</h2>
        <h3 className="text-xs">{userInfo.fullName ?? '-'}</h3>
        <h3 className="text-xs">
          {userInfo.totalFriendCount} {userInfo.totalFriendCount == 1 ? 'friend' : 'friends'}
        </h3>
        <h3 className="text-xs">5 mutual friends</h3>
      </div>

      {userType === 'friends' && (
        <div className="flex flex-col items-start justify-start gap-4">
          {userInfo.conversationId ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/messages/${userInfo.conversationId}`}>
                  <Button size="icon" className="h-9 w-9 shrink-0 cursor-pointer">
                    <Icon icon="material-symbols:chat" className="size-5" />
                  </Button>
                </Link>
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
                size="icon"
                className="h-9 w-9 shrink-0 cursor-pointer"
                disabled={isRateLimitedFromActions['unfriendAction']}
                onClick={() => setOpenUnfriendDialog(true)}
              >
                <Icon icon="material-symbols:person-remove" className="size-6" />
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
        </div>
      )}

      {userType === 'pending' && (
        <div className="flex flex-col items-start justify-start gap-4">
          <CancelFriendshipRequestDialog
            username={userInfo.username}
            receiverId={userInfo.userId}
            isRateLimitedFromAction={isRateLimitedFromActions['cancelRequestAction']}
          />
        </div>
      )}

      {userType === 'requests' && (
        <div className="flex flex-col items-start justify-start gap-4">
          <AcceptFriendshipDialog
            username={userInfo.username}
            receiverId={userInfo.userId}
            isRateLimitedFromAction={isRateLimitedFromActions['acceptAction']}
          />
          <RejectFriendshipDialog
            username={userInfo.username}
            senderId={userInfo.userId}
            isRateLimitedFromAction={isRateLimitedFromActions['rejectAction']}
          />
        </div>
      )}

      {userType === 'formerFriends' && (
        <div className="flex flex-col items-start justify-start gap-4">
          {userInfo.conversationId != null && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/messages/${userInfo.conversationId}`}>
                  <Button size="icon" className="h-9 w-9 shrink-0 cursor-pointer">
                    <Icon icon="material-symbols:chat" className="size-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium font-sans">View conversation with {userInfo.username}?</p>
              </TooltipContent>
            </Tooltip>
          )}

          <MakeFriendshipRequestDialog
            username={userInfo.username}
            receiverId={userInfo.userId}
            requestType="reconnect"
            isRateLimitedFromAction={isRateLimitedFromActions['reconnectRequestAction']}
          />
        </div>
      )}

      {userType === 'addFriend' && (
        <div className="flex flex-col items-start justify-start gap-4">
          <MakeFriendshipRequestDialog
            username={userInfo.username}
            receiverId={userInfo.userId}
            requestType="new"
            isRateLimitedFromAction={isRateLimitedFromActions['createNewRequestAction']}
          />
        </div>
      )}
    </div>
  );
}
