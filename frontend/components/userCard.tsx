import { Icon } from '@iconify/react';
import { Button } from './ui/button';
import Link from 'next/link';
import UnfriendDialog from './unfriendDialog';
import AcceptFriendshipDialog from './acceptFriendshipDialog';
import CancelFriendshipRequestDialog from './cancelFriendshipRequestDialog';
import MakeFriendshipRequestDialog from './makeFriendshipRequestDialog';
import Image from 'next/image';
import { UserInfo } from '@/types/auth';

interface UserCardProps {
  userInfo: UserInfo;
  userType: 'friends' | 'pending' | 'requests' | 'formerFriends' | 'addFriend';
  refreshList: () => void;
}

export default function UserCard({ userInfo, userType, refreshList }: UserCardProps) {
  return (
    <div className="w-full flex items-center bg-stone-200 dark:bg-stone-700 rounded-lg transition-transform duration-500 hover:scale-102 px-2 gap-2">
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
        <h3 className="text-xs">{userInfo.fullName}</h3>
        <h3 className="text-xs">
          {userInfo.totalFriendCount} {userInfo.totalFriendCount == 1 ? 'friend' : 'friends'}
        </h3>
        <h3 className="text-xs">5 mutual friends</h3>
      </div>

      {userType === 'friends' && (
        <div className="flex flex-col items-start justify-start gap-4">
          <Link href="/messages">
            <Button size="icon" className="h-9 w-9 shrink-0 cursor-pointer">
              <Icon icon="material-symbols:chat" className="size-5" />
            </Button>
          </Link>

          <UnfriendDialog username={userInfo.username} />
        </div>
      )}

      {userType === 'pending' && (
        <div className="flex flex-col items-start justify-start gap-4">
          <CancelFriendshipRequestDialog username={userInfo.username} />
        </div>
      )}

      {userType === 'requests' && (
        <div className="flex flex-col items-start justify-start gap-4">
          <AcceptFriendshipDialog />
        </div>
      )}

      {userType === 'formerFriends' && (
        <div className="flex flex-col items-start justify-start gap-4">
          <MakeFriendshipRequestDialog
            username={userInfo.username}
            receiverId={userInfo.userId}
            requestType="reconnect"
            onSuccess={refreshList}
          />
        </div>
      )}

      {userType === 'addFriend' && (
        <div className="flex flex-col items-start justify-start gap-4">
          <MakeFriendshipRequestDialog
            username={userInfo.username}
            receiverId={userInfo.userId}
            requestType="new"
            onSuccess={refreshList}
          />
        </div>
      )}
    </div>
  );
}
