'use client';

import { Icon } from '@iconify/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { useFriendsActionsStore } from '@/store/friends/useFriendsActionsStore';
import { useFriendsStore } from '@/store/friends/useFriendsStore';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface RejectFriendshipDialogProps {
  username: string;
  senderId: string;
  isRateLimitedFromAction: boolean;
}

export default function RejectFriendshipDialog({
  username,
  senderId,
  isRateLimitedFromAction,
}: RejectFriendshipDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const doFriendsAction = useFriendsActionsStore((state) => state.doFriendsAction);

  const loading = useFriendsActionsStore((state) => state.loading);
  const error = useFriendsActionsStore((state) => state.error);
  const isRateLimitedFromActions = useFriendsActionsStore(
    (state) => state.isRateLimitedFromActions
  );

  const loadUsersData = useFriendsStore((state) => state.loadUsersData);

  const rejectFriendRequest = async () => {
    await doFriendsAction(senderId, 'rejectAction');

    if (error != null) {
      toast.error(`Something went wrong when rejecting a friend request.`);
      setIsOpen(false);
      return;
    } else if (isRateLimitedFromActions.rejectAction) {
      toast.error('You have rejected too many friend requests. Try again in 1 minute.');
      setIsOpen(false);
      return;
    }

    setIsOpen(false);

    loadUsersData();

    toast.success(`Successfully rejected the friend request of ${username}.`);
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
              <Icon icon="material-symbols:do-not-disturb-on" className="size-6" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium font-sans">Reject request?</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject friend request from {username}?</DialogTitle>
          <DialogDescription>This request will be removed from your list.</DialogDescription>
          <div className="flex w-full gap-2 pt-2">
            <Button
              className="flex-1 cursor-pointer text-md"
              onClick={rejectFriendRequest}
              disabled={loading || isRateLimitedFromAction}
            >
              {loading && <Spinner data-icon="inline-start" />}
              Reject friend request
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
