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
} from '@/components/ui/dialog';

import { useUnfriendUser } from '@/hooks/useFriendship';

import { useChatStore } from '@/store/useChatStore';

import { useFriendsStore } from '@/store/useFriendsStore';

interface UnfriendDialogProps {
  username: string;
  otherUserId: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function UnfriendDialog({
  username,
  otherUserId,
  open,
  onClose,
  onSuccess,
}: UnfriendDialogProps) {
  const { unfriendSelectedUser, loading } = useUnfriendUser();

  const loadUsersData = useFriendsStore((state) => state.loadUsersData);

  const unfriendUser = async () => {
    try {
      await unfriendSelectedUser(otherUserId);

      loadUsersData();

      const isViewingConversations = useChatStore.getState().activeConversationId != null;

      toast.info(
        `You have unfriended ${username}. ${isViewingConversations ? 'Your conversation with them is set to read-only.' : ''}`
      );

      onClose();

      if (onSuccess) {
        onSuccess();
      }
    } catch {
      toast.success(`Something went wrong when making a friend request.`);
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
