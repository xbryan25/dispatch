'use client';

import { useRouter } from 'next/navigation';

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

interface CancelFriendshipRequestDialogProps {
  username: string;
  receiverId: string;
  onSuccess: () => void;
}

export default function CancelFriendshipRequestDialog({
  username,
  receiverId,
  onSuccess,
}: CancelFriendshipRequestDialogProps) {
  const { cancelSentFriendRequest, loading } = useCancelFriendRequest();

  const cancelFriendRequest = async () => {
    try {
      await cancelSentFriendRequest(receiverId);

      onSuccess();

      toast.success(`Cancelled the sent friend request to ${username}.`);
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
              disabled={loading}
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
