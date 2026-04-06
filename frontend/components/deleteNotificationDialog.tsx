'use client';

import { Button } from './ui/button';

import { Spinner } from './ui/spinner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useNotificationsStore } from '@/store/useNotificationsStore';

interface DeleteNotificationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  notificationIds: string[];
}

export default function DeleteNotificationDialog({
  isOpen,
  onOpenChange,
  onSuccess,
  notificationIds,
}: DeleteNotificationDialogProps) {
  const bulkDeleteNotifications = useNotificationsStore((state) => state.bulkDeleteNotifications);

  const deleteLoading = useNotificationsStore((state) => state.deleteLoading);
  const deleteIsRateLimited = useNotificationsStore((state) => state.deleteIsRateLimited);

  const setDeleteLoading = useNotificationsStore((state) => state.setDeleteLoading);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete notification{notificationIds.length > 1 ? 's' : ''}</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove{' '}
            {notificationIds.length > 1
              ? `${notificationIds.length} notifications`
              : 'this notification'}
            ?
          </DialogDescription>

          <div className="flex w-full gap-2 pt-2">
            <Button
              className="flex-1 cursor-pointer text-md"
              onClick={async () => {
                await bulkDeleteNotifications(notificationIds);
                setDeleteLoading(false);
                onOpenChange(false);
                onSuccess?.();
              }}
              disabled={deleteLoading || deleteIsRateLimited}
            >
              {deleteLoading && <Spinner data-icon="inline-start" />}
              Confirm deletion
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
