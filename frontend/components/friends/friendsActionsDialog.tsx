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

import { ActionCategory } from '@/types/friends';

interface FriendsActionsDialogProps {
  username: string;
  otherUserId: string;
  actionType: ActionCategory;
}

export default function FriendsActionsDialog({
  username,
  otherUserId,
  actionType,
}: FriendsActionsDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const loading = useFriendsActionsStore((state) => state.loading);
  const error = useFriendsActionsStore((state) => state.error);
  const isRateLimitedFromActions = useFriendsActionsStore(
    (state) => state.isRateLimitedFromActions
  );

  const { loadUsersData } = useFriendsStore();
  const { doFriendsAction } = useFriendsActionsStore();

  const messages: Record<ActionCategory, Record<string, string>> = {
    createNewRequestAction: {
      error: 'Something went wrong when making a friend request.',
      rateLimited: 'You have made too many friend requests. Try again in 1 minute.',
      success: `Successfully sent a friend request to ${username}.`,
      tooltip: 'Add as a friend?',
      dialogTitle: `Are you sure you want to add ${username} as a friend?`,
      dialogDescription: 'You will be able to start a conversation once they accept your request.',
      button: 'Make friend request',
    },
    cancelRequestAction: {
      error: 'Something went wrong when cancelling the friend request.',
      rateLimited: 'You have cancelled too many friend requests. Try again in 1 minute.',
      success: `Cancelled the sent friend request to ${username}.`,
      tooltip: 'Cancel request?',
      dialogTitle: 'Are you sure you want to cancel friendship request?',
      dialogDescription: 'You can send another request later if you change your mind.',
      button: 'Cancel friend request',
    },
    acceptAction: {
      error: 'Something went wrong when accepting the friend request.',
      rateLimited: 'You have accepted too many friend requests. Try again in 1 minute.',
      success: `${username} is officially your friend. Start chatting!`,
      tooltip: 'Accept request?',
      dialogTitle: `Are you sure you want to accept ${username} as a friend?`,
      dialogDescription: `You will be able to converse with ${username}.`,
      button: 'Accept friend request',
    },
    rejectAction: {
      error: 'Something went wrong when rejecting a friend request.',
      rateLimited: 'You have rejected too many friend requests. Try again in 1 minute.',
      success: `Successfully rejected the friend request of ${username}.`,
      tooltip: 'Reject request?',
      dialogTitle: `Reject friend request from ${username}?`,
      dialogDescription: 'This request will be removed from your list.',
      button: 'Reject friend request',
    },
    unfriendAction: {
      error: '',
      rateLimited: '',
      success: '',
      tooltip: '',
      dialogTitle: '',
      dialogDescription: '',
      button: '',
    },
    reconnectRequestAction: {
      error: 'Something went wrong when making a friend request.',
      rateLimited: 'You have made too many friend requests. Try again in 1 minute.',
      success: `Successfully sent a friend request to ${username}.`,
      tooltip: `Reconnect with ${username}?`,
      dialogTitle: `Send a new request to ${username} to reconnect?`,
      dialogDescription: `You will be able to resume chatting and send messages again.`,
      button: `Make friend request`,
    },
  };

  const friendsAction = async () => {
    await doFriendsAction(otherUserId, actionType);

    if (error != null) {
      toast.error(messages[actionType].error);
      setIsOpen(false);
      return;
    } else if (isRateLimitedFromActions[actionType]) {
      toast.error(messages[actionType].rateLimited);
      setIsOpen(false);
      return;
    }

    setIsOpen(false);

    loadUsersData();

    toast.success(messages[actionType].success);
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
              disabled={isRateLimitedFromActions[actionType]}
              onClick={() => setIsOpen(true)}
            >
              <Icon icon="material-symbols:check-circle" className="size-6" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium font-sans">{messages[actionType].tooltip}</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{messages[actionType].dialogTitle}</DialogTitle>
          <DialogDescription>{messages[actionType].dialogDescription}</DialogDescription>
          <div className="flex w-full gap-2 pt-2">
            <Button
              className="flex-1 cursor-pointer text-md"
              onClick={friendsAction}
              disabled={loading || isRateLimitedFromActions[actionType]}
            >
              {loading && <Spinner data-icon="inline-start" />}
              {messages[actionType].button}
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
