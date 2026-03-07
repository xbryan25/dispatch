'use client';

import { Button } from './ui/button';
import { toast } from 'sonner';
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

import { useUnfriendUser } from '@/hooks/useFriendship';

import { Icon } from '@iconify/react';

import { useFriendsStore } from '@/store/useFriendsStore';

interface UnfriendDialogProps {
  username: string;
  otherUserId: string;
}

export default function UnfriendDialog({ username, otherUserId }: UnfriendDialogProps) {
  const { unfriendSelectedUser, loading } = useUnfriendUser();

  const loadUsersData = useFriendsStore((state) => state.loadUsersData);

  const unfriendUser = async () => {
    try {
      await unfriendSelectedUser(otherUserId);

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
              <Icon icon="material-symbols:person-remove" className="size-6" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium font-sans">Unfriend {username}?</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to unfriend {username}?</DialogTitle>
          <DialogDescription>
            Your conversation with {username} will change to view-only.
          </DialogDescription>
          <div className="flex w-full gap-2 pt-2">
            <Button
              className="flex-1 cursor-pointer text-md"
              onClick={unfriendUser}
              disabled={loading}
            >
              {loading && <Spinner data-icon="inline-start" />}
              Confirm unfriend
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
