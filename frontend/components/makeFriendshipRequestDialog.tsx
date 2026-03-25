'use client';

import { Button } from './ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { useCreateNewFriendRequest, useReconnectToUser } from '@/hooks/useFriendship';

import { Icon } from '@iconify/react';

import { toast } from 'sonner';

import { useFriendsStore } from '@/store/useFriendsStore';
import { useState } from 'react';

interface MakeFriendshipRequestDialogProps {
  username: string;
  receiverId: string;
  requestType: 'new' | 'reconnect';
  isRateLimitedFromAction: boolean;
}

export default function MakeFriendshipRequestDialog({
  username,
  receiverId,
  requestType,
  isRateLimitedFromAction,
}: MakeFriendshipRequestDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { createFriendRequest, loading: createFriendRequestLoading } = useCreateNewFriendRequest();

  const { reconnectToFormerFriend, loading: reconnectToUserLoading } = useReconnectToUser();

  const loadUsersData = useFriendsStore((state) => state.loadUsersData);

  const requestHandler = async () => {
    const { error, rateLimited } =
      requestType === 'new'
        ? await createFriendRequest(receiverId)
        : await reconnectToFormerFriend(receiverId);

    if (error != null) {
      toast.error(`Something went wrong when making a friend request.`);
      setIsOpen(false);
      return;
    } else if (rateLimited) {
      toast.error('You have made too many friend requests. Try again in 1 minute.');
      setIsOpen(false);
      return;
    }

    setIsOpen(false);

    loadUsersData();

    toast.success(`Successfully sent a friend request to ${username}.`);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        setIsOpen(value);
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              size="icon"
              className="h-9 w-9 shrink-0 cursor-pointer"
              disabled={isRateLimitedFromAction}
              onClick={() => setIsOpen(true)}
            >
              <Icon icon="material-symbols:person-add" className="size-6" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium font-sans">
            {requestType === 'new' ? 'Add as a friend?' : `Reconnect with ${username}?`}
          </p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {requestType === 'new'
              ? `Are you sure you want to add ${username} as a friend?`
              : `Send a new request to ${username} to reconnect?`}
          </DialogTitle>
          <DialogDescription>
            {requestType === 'new'
              ? 'You will be able to start a conversation once they accept your request.'
              : 'You will be able to resume chatting and send messages again.'}
          </DialogDescription>
          <div className="flex w-full gap-2 pt-2">
            <Button
              className="flex-1 cursor-pointer text-md"
              onClick={requestHandler}
              disabled={
                createFriendRequestLoading || reconnectToUserLoading || isRateLimitedFromAction
              }
            >
              Make friend request
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
