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

import { useChatStore } from '@/store/useChatStore';

import { useFriendsStore } from '@/store/useFriendsStore';
import { useState } from 'react';
import { Icon } from '@iconify/react';

interface UnfriendDialogProps {
  username: string;
  otherUserId: string;
  isRateLimitedFromAction: boolean;
}

export default function UnfriendDialog({
  username,
  otherUserId,
  isRateLimitedFromAction,
}: UnfriendDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { unfriendSelectedUser, loading } = useUnfriendUser();

  const loadUsersData = useFriendsStore((state) => state.loadUsersData);

  const unfriendUser = async () => {
    const { error, rateLimited } = await unfriendSelectedUser(otherUserId);

    if (error != null) {
      toast.error(`Something went wrong when unfriending a user.`);
      setIsOpen(false);
      return;
    } else if (rateLimited) {
      toast.error('You have unfriended too many users. Try again in 1 minute.');
      setIsOpen(false);
      return;
    }

    loadUsersData();

    const isViewingConversations = useChatStore.getState().activeConversationId != null;

    toast.info(
      `You have unfriended ${username}. ${isViewingConversations ? 'Your conversation with them is set to read-only.' : ''}`
    );
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
              disabled={loading || isRateLimitedFromAction}
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
