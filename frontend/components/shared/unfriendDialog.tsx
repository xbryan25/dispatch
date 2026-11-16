'use client';

import { UserMinus } from 'lucide-react';
import { toast } from 'sonner';

import { useFriendsActionsStore } from '@/store/friends/useFriendsActionsStore';
import { useFriendsStore } from '@/store/friends/useFriendsStore';
import { useChatStore } from '@/store/useChatStore';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';

interface UnfriendDialogProps {
  username: string;
  otherUserId: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  isRateLimitedFromAction: boolean;
}

export default function UnfriendDialog({
  username,
  otherUserId,
  open,
  onClose,
  onSuccess,
  isRateLimitedFromAction,
}: UnfriendDialogProps) {
  const { doFriendsAction } = useFriendsActionsStore();
  const { loadUsersData } = useFriendsStore();

  const loading = useFriendsActionsStore((state) => state.loading);
  const error = useFriendsActionsStore((state) => state.error);
  const isRateLimitedFromActions = useFriendsActionsStore(
    (state) => state.isRateLimitedFromActions
  );

  const unfriendUser = async () => {
    await doFriendsAction(otherUserId, 'unfriendAction');

    if (error != null) {
      toast.error(`Something went wrong when unfriending a user.`);
      onClose();
      return;
    } else if (isRateLimitedFromActions.unfriendAction) {
      toast.error('You have unfriended too many users. Try again in 1 minute.');
      onClose();
      return;
    }

    loadUsersData();

    const isViewingConversations = useChatStore.getState().activeConversationId != null;

    toast.info(
      `You have unfriended ${username}. ${isViewingConversations ? 'Your conversation with them is set to read-only.' : ''}`
    );

    onClose();

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md gap-0 overflow-hidden rounded-2xl border-stone-200 p-0 dark:border-stone-800">
        <DialogHeader className="px-6 pb-5 pt-6 text-left">
          <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-400/10 dark:text-red-400">
            <UserMinus className="size-5" aria-hidden="true" />
          </div>
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Are you sure you want to unfriend {username}?
          </DialogTitle>
          <DialogDescription className="pt-1 leading-6">
            Your conversation with {username} will change to view-only.
          </DialogDescription>
          <div className="flex w-full gap-2 pt-4">
            <Button
              variant="destructive"
              className="h-10 flex-1 cursor-pointer rounded-xl text-sm"
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
