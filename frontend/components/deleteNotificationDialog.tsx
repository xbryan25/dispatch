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
  notificationId: string;
}

export default function DeleteNotificationDialog({
  isOpen,
  onOpenChange,
  notificationId,
}: DeleteNotificationDialogProps) {
  const deleteNotification = useNotificationsStore((state) => state.deleteNotification);

  const deleteLoading = useNotificationsStore((state) => state.deleteLoading);
  const deleteIsRateLimited = useNotificationsStore((state) => state.deleteIsRateLimited);

  const setDeleteLoading = useNotificationsStore((state) => state.setDeleteLoading);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Notification</DialogTitle>
          <DialogDescription>Are you sure you want to remove this notification?</DialogDescription>

          <div className="flex w-full gap-2 pt-2">
            <Button
              className="flex-1 cursor-pointer text-md"
              onClick={async () => {
                await deleteNotification(notificationId);
                setDeleteLoading(false);
                onOpenChange(false);
              }}
              disabled={deleteLoading || deleteIsRateLimited}
            >
              {deleteLoading && <Spinner data-icon="inline-start" />}
              Delete notification
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
