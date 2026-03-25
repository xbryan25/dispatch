'use client';

import { Button } from './ui/button';

import { Spinner } from './ui/spinner';

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

import { useCancelFriendRequest } from '@/hooks/useFriendship';

import { toast } from 'sonner';

import { useFriendsStore } from '@/store/useFriendsStore';
import { useState } from 'react';

interface CancelFriendshipRequestDialogProps {
  username: string;
  receiverId: string;
  isRateLimitedFromAction: boolean;
}

export default function CancelFriendshipRequestDialog({
  username,
  receiverId,
  isRateLimitedFromAction,
}: CancelFriendshipRequestDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { cancelSentFriendRequest, loading } = useCancelFriendRequest();

  const loadUsersData = useFriendsStore((state) => state.loadUsersData);

  const cancelFriendRequest = async () => {
    const { error, rateLimited } = await cancelSentFriendRequest(receiverId);

    if (error != null) {
      toast.error(`Something went wrong when cancelling the friend request.`);
      setIsOpen(false);
      return;
    } else if (rateLimited) {
      toast.error('You have cancelled too many friend requests. Try again in 1 minute.');
      setIsOpen(false);
      return;
    }

    setIsOpen(false);

    loadUsersData();

    toast.success(`Cancelled the sent friend request to ${username}.`);
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
              <Icon icon="material-symbols:cancel" className="size-6" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium font-sans">Cancel request?</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to cancel friendship request?</DialogTitle>
          <DialogDescription>
            You can send another request later if you change your mind.
          </DialogDescription>

          <div className="flex w-full gap-2 pt-2">
            <Button
              className="flex-1 cursor-pointer text-md"
              onClick={cancelFriendRequest}
              disabled={loading || isRateLimitedFromAction}
            >
              {loading && <Spinner data-icon="inline-start" />}
              Cancel friend request
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
