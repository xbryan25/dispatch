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

import { Icon } from '@iconify/react';

import { useAcceptFriendRequest } from '@/hooks/useFriendship';

import { toast } from 'sonner';

interface AcceptFriendshipRequestDialogProps {
  username: string;
  receiverId: string;
  onSuccess: () => void;
}

export default function AcceptFriendshipDialog({
  username,
  receiverId,
  onSuccess,
}: AcceptFriendshipRequestDialogProps) {
  const { acceptReceivedFriendRequest, loading } = useAcceptFriendRequest();

  const acceptFriendRequest = async () => {
    try {
      await acceptReceivedFriendRequest(receiverId);

      onSuccess();

      toast.success(`Cancelled the sent friend request to ${username}.`);
    } catch {
      toast.success(`Something went wrong when making a friend request.`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" className="h-9 w-9 shrink-0 cursor-pointer">
          <Icon icon="material-symbols:check" className="size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to accept {username} as a friend?</DialogTitle>
          <DialogDescription>You will be able to converse with {username}.</DialogDescription>
          <div className="flex w-full gap-2 pt-2">
            <Button
              className="flex-1 cursor-pointer text-md"
              onClick={acceptFriendRequest}
              disabled={loading}
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
