'use client';

import { Spinner } from '../ui/spinner';

import { Button } from '../ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { Icon } from '@iconify/react';

import { toast } from 'sonner';

import { useFriendsStore } from '@/store/friends/useFriendsStore';
import { useFriendsActionsStore } from '@/store/friends/useFriendsActionsStore';

import { useState } from 'react';

interface AcceptFriendshipRequestDialogProps {
  username: string;
  receiverId: string;
  isRateLimitedFromAction: boolean;
}

export default function AcceptFriendshipDialog({
  username,
  receiverId,
  isRateLimitedFromAction,
}: AcceptFriendshipRequestDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const doFriendsAction = useFriendsActionsStore((state) => state.doFriendsAction);

  const loading = useFriendsActionsStore((state) => state.loading);
  const error = useFriendsActionsStore((state) => state.error);
  const isRateLimitedFromActions = useFriendsActionsStore(
    (state) => state.isRateLimitedFromActions
  );

  const loadUsersData = useFriendsStore((state) => state.loadUsersData);

  const acceptFriendRequest = async () => {
    await doFriendsAction(receiverId, 'acceptAction');

    if (error != null) {
      toast.error(`Something went wrong when accepting the friend request.`);
      setIsOpen(false);
      return;
    } else if (isRateLimitedFromActions.acceptAction) {
      toast.error('You have accepted too many friend requests. Try again in 1 minute.');
      setIsOpen(false);
      return;
    }

    setIsOpen(false);

    loadUsersData();

    toast.success(`${username} is officially your friend. Start chatting!`);
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
              <Icon icon="material-symbols:check-circle" className="size-6" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium font-sans">Accept request?</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to accept {username} as a friend?</DialogTitle>
          <DialogDescription>You will be able to converse with {username}.</DialogDescription>
          <div className="flex w-full gap-2 pt-2">
            <Button
              className="flex-1 cursor-pointer text-md"
              onClick={acceptFriendRequest}
              disabled={loading || isRateLimitedFromAction}
            >
              {loading && <Spinner data-icon="inline-start" />}
              Accept friend request
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
