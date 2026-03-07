'use client';

import { Spinner } from './ui/spinner';

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

import { Icon } from '@iconify/react';

import { useRejectFriendRequest } from '@/hooks/useFriendship';

import { toast } from 'sonner';

import { useFriendsStore } from '@/store/useFriendsStore';

interface RejectFriendshipDialogProps {
  username: string;
  senderId: string;
}

export default function RejectFriendshipDialog({
  username,
  senderId,
}: RejectFriendshipDialogProps) {
  const { rejectReceivedFriendRequest, loading } = useRejectFriendRequest();

  const loadUsersData = useFriendsStore((state) => state.loadUsersData);

  const rejectFriendRequest = async () => {
    try {
      await rejectReceivedFriendRequest(senderId);

      loadUsersData();

      toast.success(`You have rejected the friend request of ${username}.`);
    } catch {
      toast.success(`Something went wrong when making a friend request.`);
    }
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button size="icon" className="h-9 w-9 shrink-0 cursor-pointer">
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
              disabled={loading}
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
