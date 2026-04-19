'use client';

import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Spinner } from '../ui/spinner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useChatStore } from '@/store/useChatStore';

import { useFriendsStore } from '@/store/friends/useFriendsStore';
import { useFriendsActionsStore } from '@/store/friends/useFriendsActionsStore';

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
  const doFriendsAction = useFriendsActionsStore((state) => state.doFriendsAction);

  const loading = useFriendsActionsStore((state) => state.loading);
  const error = useFriendsActionsStore((state) => state.error);
  const isRateLimitedFromActions = useFriendsActionsStore(
    (state) => state.isRateLimitedFromActions
  );

  const loadUsersData = useFriendsStore((state) => state.loadUsersData);

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
