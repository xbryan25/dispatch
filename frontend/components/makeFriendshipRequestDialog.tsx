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

import { useCreateNewFriendRequest } from '@/hooks/useFriendship';

import { Icon } from '@iconify/react';

import { toast } from 'sonner';

interface MakeFriendshipRequestDialogProps {
  username: string;
  receiverId: string;
  requestType: 'new' | 'reconnect';
  onSuccess: () => void;
}

export default function MakeFriendshipRequestDialog({
  username,
  receiverId,
  requestType,
  onSuccess,
}: MakeFriendshipRequestDialogProps) {
  const { createFriendRequest, loading } = useCreateNewFriendRequest();

  const createNewFriendRequest = async () => {
    try {
      await createFriendRequest(receiverId);

      onSuccess();

      toast.success(`Successfully sent a friend request to ${username}.`);
    } catch {
      toast.success(`Something went wrong when making a friend request.`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" className="h-9 w-9 shrink-0 cursor-pointer">
          <Icon icon="material-symbols:person-add" className="size-5" />
        </Button>
      </DialogTrigger>
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
              onClick={createNewFriendRequest}
              disabled={loading}
            >
              Make friend request
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
